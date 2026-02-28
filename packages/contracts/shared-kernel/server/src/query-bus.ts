import type { AppError, Query } from "@contracts/shared-kernel/public";
import type { Result } from "neverthrow";

export interface QueryBus<
  TQuery extends Query = Query,
  TResult = unknown,
  TError extends AppError = AppError,
> {
  execute(query: TQuery): Promise<Result<TResult, TError>>;
}
