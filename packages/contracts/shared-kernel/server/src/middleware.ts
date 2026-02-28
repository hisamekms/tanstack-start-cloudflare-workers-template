import type { AppError } from "@contracts/shared-kernel/public";
import type { Result } from "neverthrow";

export type Middleware<TInput, TOutput, TError extends AppError = AppError> = (
  input: TInput,
  next: (input: TInput) => Promise<Result<TOutput, TError>>,
) => Promise<Result<TOutput, TError>>;
