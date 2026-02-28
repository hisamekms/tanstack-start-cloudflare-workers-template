import type { AppError, Query } from "@contracts/shared-kernel/public";
import type { ResultAsync } from "neverthrow";

export interface QueryBus<
  TQuery extends Query = Query,
  TResult = unknown,
  TError extends AppError = AppError,
> {
  execute(query: TQuery): ResultAsync<TResult, TError>;
}
