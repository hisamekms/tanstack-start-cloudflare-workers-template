import type { AppError, Command } from "@contracts/shared-kernel/public";
import type { Middleware } from "@contracts/shared-kernel/server";

export function loggingCommandMiddleware<
  TCommand extends Command,
  TError extends AppError = AppError,
>(): Middleware<TCommand, void, TError> {
  return (command, context, next) => {
    console.log(`Executing command: ${command.commandType}`);
    return next(command, context).mapErr((e) => {
      console.error(`Command ${command.commandType} failed: ${e}`);
      return e;
    });
  };
}
