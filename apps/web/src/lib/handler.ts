import type { Result } from "neverthrow";

export function unwrap<T>(result: Result<T, string>): T {
  if (result.isErr()) {
    throw new Error(result.error);
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
