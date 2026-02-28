import type { Query } from "@contracts/shared-kernel/public";
import type { Middleware, QueryBus } from "@contracts/shared-kernel/server";
import { err, ok } from "neverthrow";
import { describe, expect, test, vi } from "vitest";

import { withQueryMiddleware } from "./with-query-middleware";

interface TestQuery extends Query<"TestQuery"> {
  readonly queryType: "TestQuery";
  readonly filter: string;
}

type TestResult = { items: string[] };

function createMockBus(
  result = ok<TestResult, string>({ items: ["a", "b"] }),
): QueryBus<TestQuery, TestResult> {
  return { execute: vi.fn().mockResolvedValue(result) };
}

describe("withQueryMiddleware", () => {
  test("passes results through when no middlewares are provided", async () => {
    const bus = createMockBus();
    const wrapped = withQueryMiddleware(bus, []);
    const query: TestQuery = { queryType: "TestQuery", filter: "all" };

    const result = await wrapped.execute(query);

    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toEqual({ items: ["a", "b"] });
    expect(bus.execute).toHaveBeenCalledWith(query);
  });

  test("executes middlewares in order (first middleware is outermost)", async () => {
    const order: string[] = [];
    const bus = createMockBus();

    const mw1: Middleware<TestQuery, TestResult> = async (query, next) => {
      order.push("mw1-before");
      const result = await next(query);
      order.push("mw1-after");
      return result;
    };

    const mw2: Middleware<TestQuery, TestResult> = async (query, next) => {
      order.push("mw2-before");
      const result = await next(query);
      order.push("mw2-after");
      return result;
    };

    const wrapped = withQueryMiddleware(bus, [mw1, mw2]);
    await wrapped.execute({ queryType: "TestQuery", filter: "all" });

    expect(order).toEqual(["mw1-before", "mw2-before", "mw2-after", "mw1-after"]);
  });

  test("short-circuits when a middleware does not call next", async () => {
    const bus = createMockBus();

    const shortCircuit: Middleware<TestQuery, TestResult> = async (_query, _next) => {
      return ok({ items: ["cached"] });
    };

    const wrapped = withQueryMiddleware(bus, [shortCircuit]);
    const result = await wrapped.execute({
      queryType: "TestQuery",
      filter: "all",
    });

    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toEqual({ items: ["cached"] });
    expect(bus.execute).not.toHaveBeenCalled();
  });

  test("propagates errors from the bus through middlewares", async () => {
    const bus = createMockBus(err("query error"));

    const mw: Middleware<TestQuery, TestResult> = async (query, next) => {
      return next(query);
    };

    const wrapped = withQueryMiddleware(bus, [mw]);
    const result = await wrapped.execute({
      queryType: "TestQuery",
      filter: "all",
    });

    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toBe("query error");
  });
});
