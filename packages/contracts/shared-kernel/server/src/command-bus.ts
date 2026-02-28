import type { AppError, Command } from "@contracts/shared-kernel/public";
import type { ResultAsync } from "neverthrow";

import type { Context } from "./context";

export interface CommandBus<
  TCommand extends Command = Command,
  TError extends AppError = AppError,
> {
  execute(command: TCommand, context: Context): ResultAsync<void, TError>;
}
