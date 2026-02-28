import type { AppError, Command } from "@contracts/shared-kernel/public";
import type { Middleware } from "@contracts/shared-kernel/server";
import { logger } from "@lib/server";

export function loggingCommandMiddleware<
  TCommand extends Command,
  TError extends AppError = AppError,
>(): Middleware<TCommand, void, TError> {
  return (command, context, next) => {
    logger.info(`Executing command: ${command.commandType}`);
    return next(command, context).mapErr((e) => {
      logger.error(`Command ${command.commandType} failed: ${e}`);
      return e;
    });
  };
}
