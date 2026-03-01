import type { AppError } from "@contracts/shared-kernel/public";
import { createProtectedContext } from "@contracts/shared-kernel/server";
import type { Context } from "@contracts/shared-kernel/server";
import type { Container } from "@lib/server-di";
import type { Result, ResultAsync } from "neverthrow";

import { getContainer, Tokens } from "../di/index.server";

export function unwrap<T>(result: Result<T, AppError>): T {
  if (result.isErr()) {
    throw new Error(result.error.message);
  }
  return result.value;
}

function updateContainer(userId: string, _container: Container): Context {
  return createProtectedContext(userId);
}

type HandlerArgs<TData> = {
  data: TData;
  ctx: Context;
  context: unknown;
  container: Container;
};

function createHandler<TData, TResult>(
  fn: (args: HandlerArgs<TData>) => ResultAsync<TResult, AppError>,
): (args: { data: TData; context: unknown }) => Promise<TResult> {
  return async ({ data, context }) => {
    const container = await getContainer(context);
    const contextProvider = container.resolve(Tokens.contextProvider);
    return contextProvider().match(
      (userId) => {
        const ctx = updateContainer(userId, container);
        return fn({ data, ctx, context, container }).match(
          (result) => result,
          (error) => {
            throw new Error(error.message);
          },
        );
      },
      (error) => {
        throw error;
      },
    );
  };
}

export function commandHandler<TData, TResult>(
  fn: (args: HandlerArgs<TData>) => ResultAsync<TResult, AppError>,
): (args: { data: TData; context: unknown }) => Promise<TResult> {
  return createHandler(fn);
}

export function queryHandler<TData, TResult>(
  fn: (args: HandlerArgs<TData>) => ResultAsync<TResult, AppError>,
): (args: { data: TData; context: unknown }) => Promise<TResult> {
  return createHandler(fn);
}
