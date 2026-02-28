import type { CommandBus } from "@contracts/shared-kernel/server";
import type { TodoCommand } from "@contracts/todo/public";
import type { Result } from "neverthrow";

export interface TodoCommandBus extends CommandBus<TodoCommand> {
  execute(command: TodoCommand): Promise<Result<void, string>>;
}
