import type { CommandBus, Context } from "@contracts/shared-kernel/server";
import type { TodoCommand } from "@contracts/todo/public";
import type { TodoError } from "@contracts/todo/public";
import type { ResultAsync } from "neverthrow";

export interface TodoCommandBus extends CommandBus<TodoCommand, TodoError> {
  execute(command: TodoCommand, context: Context): ResultAsync<void, TodoError>;
}
