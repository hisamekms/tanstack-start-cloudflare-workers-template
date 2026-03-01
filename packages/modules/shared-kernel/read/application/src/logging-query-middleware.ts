import type { AppError, Query } from "@contracts/shared-kernel/public";
import type { Middleware } from "@contracts/shared-kernel/server";

export function loggingQueryMiddleware<
  TQuery extends Query,
  TResult,
  TError extends AppError = AppError,
>(): Middleware<TQuery, TResult, TError> {
  return (query, context, next) => {
    console.log(`Executing query: ${query.queryType}`);
    return next(query, context).mapErr((e) => {
      console.error(`Query ${query.queryType} failed: ${e}`);
      return e;
    });
  };
}
