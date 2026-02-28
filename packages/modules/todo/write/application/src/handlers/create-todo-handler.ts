import type { Context } from "@contracts/shared-kernel/server";
import type { CreateTodoCommand } from "@contracts/todo/public";
import type { TodoError } from "@contracts/todo/public";
import { createTodo, type TodoRepository } from "@modules/todo-write-model";
import { ResultAsync } from "neverthrow";
import { v7 as uuidv7 } from "uuid";

export class CreateTodoHandler {
  constructor(private readonly repository: TodoRepository) {}

  execute(command: CreateTodoCommand, _context: Context): ResultAsync<void, TodoError> {
    const id = uuidv7();
    const { state } = createTodo(id, command.title);
    return ResultAsync.fromSafePromise(this.repository.save(state));
  }
}
