import type { Result } from "neverthrow";

export type Middleware<TInput, TOutput> = (
  input: TInput,
  next: (input: TInput) => Promise<Result<TOutput, string>>,
) => Promise<Result<TOutput, string>>;
