import type { AppError, Query } from "@contracts/shared-kernel/public";
import type { Middleware } from "@contracts/shared-kernel/server";
import { logger } from "@lib/public-logger";

export function loggingQueryMiddleware<
  TQuery extends Query,
  TResult,
  TError extends AppError = AppError,
>(): Middleware<TQuery, TResult, TError> {
  return (query, context, next) => {
    logger.info(`Executing query: ${query.queryType}`);
    return next(query, context).mapErr((e) => {
      logger.error(`Query ${query.queryType} failed: ${e}`);
      return e;
    });
  };
}
