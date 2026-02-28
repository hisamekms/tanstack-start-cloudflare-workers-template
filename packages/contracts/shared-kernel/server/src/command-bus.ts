import type { AppError, Command } from "@contracts/shared-kernel/public";
import type { ResultAsync } from "neverthrow";

export interface CommandBus<
  TCommand extends Command = Command,
  TError extends AppError = AppError,
> {
  execute(command: TCommand): ResultAsync<void, TError>;
}
