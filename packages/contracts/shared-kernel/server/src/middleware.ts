import type { AppError } from "@contracts/shared-kernel/public";
import type { ResultAsync } from "neverthrow";

import type { Context } from "./context";

export type Middleware<TInput, TOutput, TError extends AppError = AppError> = (
  input: TInput,
  context: Context,
  next: (input: TInput, context: Context) => ResultAsync<TOutput, TError>,
) => ResultAsync<TOutput, TError>;
