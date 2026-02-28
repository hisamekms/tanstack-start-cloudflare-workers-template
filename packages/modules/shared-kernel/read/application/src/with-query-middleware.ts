import type { Query } from "@contracts/shared-kernel/public";
import type { Middleware, QueryBus } from "@contracts/shared-kernel/server";
import type { Result } from "neverthrow";

export function withQueryMiddleware<TQuery extends Query, TResult>(
  bus: QueryBus<TQuery, TResult>,
  middlewares: Middleware<TQuery, TResult>[],
): QueryBus<TQuery, TResult> {
  const pipeline = middlewares.reduceRight<(query: TQuery) => Promise<Result<TResult, string>>>(
    (next, mw) => (query: TQuery) => mw(query, next),
    (query: TQuery) => bus.execute(query),
  );
  return { execute: pipeline };
}
