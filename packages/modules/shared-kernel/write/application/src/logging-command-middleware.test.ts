import type { Command } from "@contracts/shared-kernel-public";
import type { CommandBus } from "@contracts/shared-kernel-server";
import { err, ok } from "neverthrow";
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

interface TestCommand extends Command<"Test"> {
  readonly commandType: "Test";
}

function createMockBus(result = ok<void, string>(undefined)): CommandBus<TestCommand> {
  return { execute: vi.fn().mockResolvedValue(result) };
}

describe("loggingCommandMiddleware", () => {
  test("logs command execution on success", async () => {
    const bus = createMockBus();
    const mw = loggingCommandMiddleware<TestCommand>();
    const command: TestCommand = { commandType: "Test" };

    const result = await mw(command, bus.execute);

    expect(result.isOk()).toBe(true);
    expect(logger.info).toHaveBeenCalledWith("Executing command: Test");
    expect(logger.error).not.toHaveBeenCalled();
  });

  test("logs error when command fails", async () => {
    const bus = createMockBus(err("something went wrong"));
    const mw = loggingCommandMiddleware<TestCommand>();
    const command: TestCommand = { commandType: "Test" };

    const result = await mw(command, bus.execute);

    expect(result.isErr()).toBe(true);
    expect(logger.info).toHaveBeenCalledWith("Executing command: Test");
    expect(logger.error).toHaveBeenCalledWith("Command Test failed: something went wrong");
  });
});
