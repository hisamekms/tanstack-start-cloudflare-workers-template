import type { Context } from "@contracts/shared-kernel/server";
import type { CompleteTodoCommand } from "@contracts/todo/public";
import { TodoNotFoundError, type TodoError } from "@contracts/todo/public";
import { completeTodo, type TodoRepository } from "@modules/todo-write-model";
import { ResultAsync, errAsync } from "neverthrow";

export class CompleteTodoHandler {
  constructor(private readonly repository: TodoRepository) {}

  execute(command: CompleteTodoCommand, _context: Context): ResultAsync<void, TodoError> {
    return ResultAsync.fromSafePromise(this.repository.findById(command.todoId)).andThen((todo) => {
      if (!todo) {
        return errAsync<void, TodoError>(new TodoNotFoundError(command.todoId));
      }
      const { state } = completeTodo(todo);
      return ResultAsync.fromSafePromise<void, TodoError>(this.repository.save(state));
    });
  }
}
