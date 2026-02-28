import type { Command } from "@contracts/shared-kernel/public";
import { defineError } from "@contracts/shared-kernel/public";
import type { CommandBus, Middleware } from "@contracts/shared-kernel/server";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { describe, expect, test, vi } from "vitest";

import { withCommandMiddleware } from "./with-command-middleware";

const TestError = defineError("TestError", "application");

interface TestCommand extends Command<"Test"> {
  readonly commandType: "Test";
  readonly payload: string;
}

function createMockBus(
  result = okAsync<void, InstanceType<typeof TestError>>(undefined),
): CommandBus<TestCommand, InstanceType<typeof TestError>> {
  return { execute: vi.fn().mockReturnValue(result) };
}

describe("withCommandMiddleware", () => {
  test("delegates to the underlying bus when no middlewares are provided", async () => {
    const bus = createMockBus();
    const wrapped = withCommandMiddleware(bus, []);
    const command: TestCommand = { commandType: "Test", payload: "hello" };

    const result = await wrapped.execute(command);

    expect(result.isOk()).toBe(true);
    expect(bus.execute).toHaveBeenCalledWith(command);
  });

  test("executes middlewares in order (first middleware is outermost)", async () => {
    const order: string[] = [];
    const bus = createMockBus();

    const mw1: Middleware<TestCommand, void, InstanceType<typeof TestError>> = (cmd, next) => {
      order.push("mw1-before");
      return new ResultAsync(
        next(cmd).then((result) => {
          order.push("mw1-after");
          return result;
        }),
      );
    };

    const mw2: Middleware<TestCommand, void, InstanceType<typeof TestError>> = (cmd, next) => {
      order.push("mw2-before");
      return new ResultAsync(
        next(cmd).then((result) => {
          order.push("mw2-after");
          return result;
        }),
      );
    };

    const wrapped = withCommandMiddleware(bus, [mw1, mw2]);
    await wrapped.execute({ commandType: "Test", payload: "hello" });

    expect(order).toEqual(["mw1-before", "mw2-before", "mw2-after", "mw1-after"]);
  });

  test("short-circuits when a middleware does not call next", async () => {
    const bus = createMockBus();

    const shortCircuit: Middleware<TestCommand, void, InstanceType<typeof TestError>> = (
      _cmd,
      _next,
    ) => {
      return errAsync(new TestError("blocked"));
    };

    const wrapped = withCommandMiddleware(bus, [shortCircuit]);
    const result = await wrapped.execute({ commandType: "Test", payload: "hello" });

    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(TestError);
    expect(result._unsafeUnwrapErr().message).toBe("blocked");
    expect(bus.execute).not.toHaveBeenCalled();
  });

  test("propagates errors from the bus through middlewares", async () => {
    const bus = createMockBus(errAsync(new TestError("bus error")));

    const mw: Middleware<TestCommand, void, InstanceType<typeof TestError>> = (cmd, next) => {
      return next(cmd);
    };

    const wrapped = withCommandMiddleware(bus, [mw]);
    const result = await wrapped.execute({ commandType: "Test", payload: "hello" });

    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(TestError);
    expect(result._unsafeUnwrapErr().message).toBe("bus error");
  });

  test("allows middleware to modify the command before passing to next", async () => {
    const bus = createMockBus();

    const modifying: Middleware<TestCommand, void, InstanceType<typeof TestError>> = (
      cmd,
      next,
    ) => {
      return next({ ...cmd, payload: "modified" });
    };

    const wrapped = withCommandMiddleware(bus, [modifying]);
    await wrapped.execute({ commandType: "Test", payload: "original" });

    expect(bus.execute).toHaveBeenCalledWith({
      commandType: "Test",
      payload: "modified",
    });
  });
});
