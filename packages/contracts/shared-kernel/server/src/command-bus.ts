import type { Command } from "@contracts/shared-kernel/public";
import type { Result } from "neverthrow";

export interface CommandBus<TCommand extends Command = Command> {
  execute(command: TCommand): Promise<Result<void, string>>;
}
