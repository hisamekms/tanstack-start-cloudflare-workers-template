import type { CompleteTodoCommand } from "@contracts/todo/public";
import { TodoNotFoundError, type TodoError } from "@contracts/todo/public";
import { completeTodo, type TodoRepository } from "@modules/todo-write-model";
import { ok, err, type Result } from "neverthrow";

export class CompleteTodoHandler {
  constructor(private readonly repository: TodoRepository) {}

  async execute(command: CompleteTodoCommand): Promise<Result<void, TodoError>> {
    const todo = await this.repository.findById(command.todoId);
    if (!todo) {
      return err(new TodoNotFoundError(command.todoId));
    }
    const { state } = completeTodo(todo);
    await this.repository.save(state);
    return ok(undefined);
  }
}
