import type { AppError, Command } from "@contracts/shared-kernel/public";
import type { Result } from "neverthrow";

export interface CommandBus<
  TCommand extends Command = Command,
  TError extends AppError = AppError,
> {
  execute(command: TCommand): Promise<Result<void, TError>>;
}
