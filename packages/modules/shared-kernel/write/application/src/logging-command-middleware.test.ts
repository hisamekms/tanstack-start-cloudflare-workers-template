import type { Command } from "@contracts/shared-kernel/public";
import { defineError } from "@contracts/shared-kernel/public";
import type { CommandBus, Context } from "@contracts/shared-kernel/server";
import { errAsync, okAsync } from "neverthrow";
import { afterEach, describe, expect, test, vi } from "vitest";

import { loggingCommandMiddleware } from "./logging-command-middleware";

const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

afterEach(() => {
  vi.clearAllMocks();
});

const TestError = defineError("TestError", "application");

interface TestCommand extends Command<"Test"> {
  readonly commandType: "Test";
}

const testContext: Context = { kind: "public" };

function createMockBus(
  result = okAsync<void, InstanceType<typeof TestError>>(undefined),
): CommandBus<TestCommand, InstanceType<typeof TestError>> {
  return { execute: vi.fn().mockReturnValue(result) };
}

describe("loggingCommandMiddleware", () => {
  test("logs command execution on success", async () => {
    const bus = createMockBus();
    const mw = loggingCommandMiddleware<TestCommand>();
    const command: TestCommand = { commandType: "Test" };

    const result = await mw(command, testContext, bus.execute);

    expect(result.isOk()).toBe(true);
    expect(logSpy).toHaveBeenCalledWith("Executing command: Test");
    expect(errorSpy).not.toHaveBeenCalled();
  });

  test("logs error when command fails", async () => {
    const bus = createMockBus(errAsync(new TestError("something went wrong")));
    const mw = loggingCommandMiddleware<TestCommand>();
    const command: TestCommand = { commandType: "Test" };

    const result = await mw(command, testContext, bus.execute);

    expect(result.isErr()).toBe(true);
    expect(logSpy).toHaveBeenCalledWith("Executing command: Test");
    expect(errorSpy).toHaveBeenCalledWith(
      "Command Test failed: [TestError] something went wrong",
    );
  });
});
