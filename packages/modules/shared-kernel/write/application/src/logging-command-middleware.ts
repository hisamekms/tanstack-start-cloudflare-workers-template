import type { AppError, Command } from "@contracts/shared-kernel/public";
import type { Middleware } from "@contracts/shared-kernel/server";
import { logger } from "@lib/server";

export function loggingCommandMiddleware<
  TCommand extends Command,
  TError extends AppError = AppError,
>(): Middleware<TCommand, void, TError> {
  return async (command, next) => {
    logger.info(`Executing command: ${command.commandType}`);
    const result = await next(command);
    if (result.isErr()) {
      logger.error(`Command ${command.commandType} failed: ${result.error}`);
    }
    return result;
  };
}
