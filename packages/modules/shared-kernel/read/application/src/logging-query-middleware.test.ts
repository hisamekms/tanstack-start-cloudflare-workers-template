import type { Query } from "@contracts/shared-kernel/public";
import { defineError } from "@contracts/shared-kernel/public";
import type { Context, QueryBus } from "@contracts/shared-kernel/server";
import { errAsync, okAsync } from "neverthrow";
import { describe, expect, test, vi } from "vitest";

import { loggingQueryMiddleware } from "./logging-query-middleware";

vi.mock("@lib/public-logger", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

import { logger } from "@lib/public-logger";

const TestError = defineError("TestError", "application");

interface TestQuery extends Query<"TestQuery"> {
  readonly queryType: "TestQuery";
}

type TestResult = string[];

const testContext: Context = { kind: "public" };

function createMockBus(
  result = okAsync<TestResult, InstanceType<typeof TestError>>(["item1", "item2"]),
): QueryBus<TestQuery, TestResult, InstanceType<typeof TestError>> {
  return { execute: vi.fn().mockReturnValue(result) };
}

describe("loggingQueryMiddleware", () => {
  test("logs query execution on success", async () => {
    const bus = createMockBus();
    const mw = loggingQueryMiddleware<TestQuery, TestResult>();
    const query: TestQuery = { queryType: "TestQuery" };

    const result = await mw(query, testContext, bus.execute);

    expect(result.isOk()).toBe(true);
    expect(logger.info).toHaveBeenCalledWith("Executing query: TestQuery");
    expect(logger.error).not.toHaveBeenCalled();
  });

  test("logs error when query fails", async () => {
    const bus = createMockBus(errAsync(new TestError("query failed")));
    const mw = loggingQueryMiddleware<TestQuery, TestResult>();
    const query: TestQuery = { queryType: "TestQuery" };

    const result = await mw(query, testContext, bus.execute);

    expect(result.isErr()).toBe(true);
    expect(logger.info).toHaveBeenCalledWith("Executing query: TestQuery");
    expect(logger.error).toHaveBeenCalledWith("Query TestQuery failed: [TestError] query failed");
  });
});
