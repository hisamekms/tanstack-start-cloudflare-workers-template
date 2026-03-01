import type { Query } from "@contracts/shared-kernel/public";
import { defineError } from "@contracts/shared-kernel/public";
import type { Context, Middleware, QueryBus } from "@contracts/shared-kernel/server";
import { errAsync, okAsync } from "neverthrow";
import { describe, expect, test, vi } from "vitest";

import { withQueryMiddleware } from "./with-query-middleware";

const TestError = defineError("TestError", "application");

interface TestQuery extends Query<"TestQuery"> {
  readonly queryType: "TestQuery";
  readonly filter: string;
}

type TestResult = { items: string[] };

const testContext: Context = { kind: "public" };

function createMockBus(
  result = okAsync<TestResult, InstanceType<typeof TestError>>({ items: ["a", "b"] }),
): QueryBus<TestQuery, TestResult, InstanceType<typeof TestError>> {
  return { execute: vi.fn().mockReturnValue(result) };
}

const mw: Middleware<TestQuery, TestResult, InstanceType<typeof TestError>> = (
  query,
  ctx,
  next,
) => {
  return next(query, ctx);
};

describe("withQueryMiddleware", () => {
  test("passes results through when no middlewares are provided", async () => {
    const bus = createMockBus();
    const wrapped = withQueryMiddleware(bus, []);
    const query: TestQuery = { queryType: "TestQuery", filter: "all" };

    const result = await wrapped.execute(query, testContext);

    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toEqual({ items: ["a", "b"] });
    expect(bus.execute).toHaveBeenCalledWith(query, testContext);
  });

  test("executes middlewares in order (first middleware is outermost)", async () => {
    const order: string[] = [];
    const bus = createMockBus();

    const mw1: Middleware<TestQuery, TestResult, InstanceType<typeof TestError>> = (
      query,
      ctx,
      next,
    ) => {
      order.push("mw1-before");
      return next(query, ctx).map((value) => {
        order.push("mw1-after");
        return value;
      });
    };

    const mw2: Middleware<TestQuery, TestResult, InstanceType<typeof TestError>> = (
      query,
      ctx,
      next,
    ) => {
      order.push("mw2-before");
      return next(query, ctx).map((value) => {
        order.push("mw2-after");
        return value;
      });
    };

    const wrapped = withQueryMiddleware(bus, [mw1, mw2]);
    await wrapped.execute({ queryType: "TestQuery", filter: "all" }, testContext);

    expect(order).toEqual(["mw1-before", "mw2-before", "mw2-after", "mw1-after"]);
  });

  test("short-circuits when a middleware does not call next", async () => {
    const bus = createMockBus();

    const shortCircuit: Middleware<TestQuery, TestResult, InstanceType<typeof TestError>> = (
      _query,
      _ctx,
      _next,
    ) => {
      return okAsync({ items: ["cached"] });
    };

    const wrapped = withQueryMiddleware(bus, [shortCircuit]);
    const result = await wrapped.execute(
      {
        queryType: "TestQuery",
        filter: "all",
      },
      testContext,
    );

    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toEqual({ items: ["cached"] });
    expect(bus.execute).not.toHaveBeenCalled();
  });

  test("propagates errors from the bus through middlewares", async () => {
    const bus = createMockBus(errAsync(new TestError("query error")));

    const wrapped = withQueryMiddleware(bus, [mw]);
    const result = await wrapped.execute(
      {
        queryType: "TestQuery",
        filter: "all",
      },
      testContext,
    );

    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(TestError);
    expect(result._unsafeUnwrapErr().message).toBe("query error");
  });
});
