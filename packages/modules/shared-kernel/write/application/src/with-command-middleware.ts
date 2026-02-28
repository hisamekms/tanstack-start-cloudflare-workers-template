import type { AppError, Command } from "@contracts/shared-kernel/public";
import type { CommandBus, Context, Middleware } from "@contracts/shared-kernel/server";
import type { ResultAsync } from "neverthrow";

export function withCommandMiddleware<TCommand extends Command, TError extends AppError = AppError>(
  bus: CommandBus<TCommand, TError>,
  middlewares: Middleware<TCommand, void, TError>[],
): CommandBus<TCommand, TError> {
  const pipeline = middlewares.reduceRight<
    (cmd: TCommand, ctx: Context) => ResultAsync<void, TError>
  >(
    (next, mw) => (cmd: TCommand, ctx: Context) => mw(cmd, ctx, next),
    (cmd: TCommand, ctx: Context) => bus.execute(cmd, ctx),
  );
  return { execute: pipeline };
}
