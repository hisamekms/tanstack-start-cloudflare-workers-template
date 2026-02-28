import type { AppError } from "@contracts/shared-kernel/public";
import type { ResultAsync } from "neverthrow";

export type Middleware<TInput, TOutput, TError extends AppError = AppError> = (
  input: TInput,
  next: (input: TInput) => ResultAsync<TOutput, TError>,
) => ResultAsync<TOutput, TError>;
