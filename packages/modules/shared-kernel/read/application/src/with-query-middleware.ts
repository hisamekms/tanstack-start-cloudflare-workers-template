import type { AppError, Query } from "@contracts/shared-kernel/public";
import type { Context, Middleware, QueryBus } from "@contracts/shared-kernel/server";
import type { ResultAsync } from "neverthrow";

export function withQueryMiddleware<
  TQuery extends Query,
  TResult,
  TError extends AppError = AppError,
>(
  bus: QueryBus<TQuery, TResult, TError>,
  middlewares: Middleware<TQuery, TResult, TError>[],
): QueryBus<TQuery, TResult, TError> {
  const pipeline = middlewares.reduceRight<
    (query: TQuery, ctx: Context) => ResultAsync<TResult, TError>
  >(
    (next, mw) => (query: TQuery, ctx: Context) => mw(query, ctx, next),
    (query: TQuery, ctx: Context) => bus.execute(query, ctx),
  );
  return { execute: pipeline };
}
