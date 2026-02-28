import type { Command } from "@contracts/shared-kernel/public";
import { defineError } from "@contracts/shared-kernel/public";
import type { CommandBus, Context } from "@contracts/shared-kernel/server";
import { errAsync, okAsync } from "neverthrow";
import { describe, expect, test, vi } from "vitest";

import { loggingCommandMiddleware } from "./logging-command-middleware";

vi.mock("@lib/server", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

import { logger } from "@lib/server";

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
    expect(logger.info).toHaveBeenCalledWith("Executing command: Test");
    expect(logger.error).not.toHaveBeenCalled();
  });

  test("logs error when command fails", async () => {
    const bus = createMockBus(errAsync(new TestError("something went wrong")));
    const mw = loggingCommandMiddleware<TestCommand>();
    const command: TestCommand = { commandType: "Test" };

    const result = await mw(command, testContext, bus.execute);

    expect(result.isErr()).toBe(true);
    expect(logger.info).toHaveBeenCalledWith("Executing command: Test");
    expect(logger.error).toHaveBeenCalledWith(
      "Command Test failed: [TestError] something went wrong",
    );
  });
});
