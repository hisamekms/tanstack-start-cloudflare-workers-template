import type { Query } from "@contracts/shared-kernel/public";
import { defineError } from "@contracts/shared-kernel/public";
import type { QueryBus } from "@contracts/shared-kernel/server";
import { err, ok } from "neverthrow";
import { describe, expect, test, vi } from "vitest";

import { loggingQueryMiddleware } from "./logging-query-middleware";

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

interface TestQuery extends Query<"TestQuery"> {
  readonly queryType: "TestQuery";
}

type TestResult = string[];

function createMockBus(
  result = ok<TestResult, InstanceType<typeof TestError>>(["item1", "item2"]),
): QueryBus<TestQuery, TestResult, InstanceType<typeof TestError>> {
  return { execute: vi.fn().mockResolvedValue(result) };
}

describe("loggingQueryMiddleware", () => {
  test("logs query execution on success", async () => {
    const bus = createMockBus();
    const mw = loggingQueryMiddleware<TestQuery, TestResult>();
    const query: TestQuery = { queryType: "TestQuery" };

    const result = await mw(query, bus.execute);

    expect(result.isOk()).toBe(true);
    expect(logger.info).toHaveBeenCalledWith("Executing query: TestQuery");
    expect(logger.error).not.toHaveBeenCalled();
  });

  test("logs error when query fails", async () => {
    const bus = createMockBus(err(new TestError("query failed")));
    const mw = loggingQueryMiddleware<TestQuery, TestResult>();
    const query: TestQuery = { queryType: "TestQuery" };

    const result = await mw(query, bus.execute);

    expect(result.isErr()).toBe(true);
    expect(logger.info).toHaveBeenCalledWith("Executing query: TestQuery");
    expect(logger.error).toHaveBeenCalledWith("Query TestQuery failed: [TestError] query failed");
  });
});
