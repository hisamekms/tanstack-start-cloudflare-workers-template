import type { AppError } from "@contracts/shared-kernel/public";
import type { Result } from "neverthrow";

export function unwrap<T>(result: Result<T, AppError>): T {
  if (result.isErr()) {
    throw new Error(result.error.message);
  }
  return result.value;
}

export function handlerOf<TArgs, TResult>(
  fn: (args: TArgs) => Promise<TResult>,
): (args: TArgs) => Promise<TResult> {
  return async (args) => {
    return fn(args);
  };
}
