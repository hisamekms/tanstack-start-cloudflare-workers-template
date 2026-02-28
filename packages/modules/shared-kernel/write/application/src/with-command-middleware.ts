import type { AppError, Command } from "@contracts/shared-kernel/public";
import type { CommandBus, Middleware } from "@contracts/shared-kernel/server";
import type { ResultAsync } from "neverthrow";

export function withCommandMiddleware<TCommand extends Command, TError extends AppError = AppError>(
  bus: CommandBus<TCommand, TError>,
  middlewares: Middleware<TCommand, void, TError>[],
): CommandBus<TCommand, TError> {
  const pipeline = middlewares.reduceRight<(cmd: TCommand) => ResultAsync<void, TError>>(
    (next, mw) => (cmd: TCommand) => mw(cmd, next),
    (cmd: TCommand) => bus.execute(cmd),
  );
  return { execute: pipeline };
}
