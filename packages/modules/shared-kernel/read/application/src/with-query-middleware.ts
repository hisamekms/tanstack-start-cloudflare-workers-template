import type { AppError, Query } from "@contracts/shared-kernel/public";
import type { Middleware, QueryBus } from "@contracts/shared-kernel/server";
import type { ResultAsync } from "neverthrow";

export function withQueryMiddleware<
  TQuery extends Query,
  TResult,
  TError extends AppError = AppError,
>(
  bus: QueryBus<TQuery, TResult, TError>,
  middlewares: Middleware<TQuery, TResult, TError>[],
): QueryBus<TQuery, TResult, TError> {
  const pipeline = middlewares.reduceRight<(query: TQuery) => ResultAsync<TResult, TError>>(
    (next, mw) => (query: TQuery) => mw(query, next),
    (query: TQuery) => bus.execute(query),
  );
  return { execute: pipeline };
}
