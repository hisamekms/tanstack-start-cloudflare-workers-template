import type { CompleteTodoCommand } from "@contracts/todo-public";
import type { Result } from "@lib/public";
import { ok, err } from "@lib/public";
import { completeTodo, type TodoRepository } from "@modules/todo-write-model";

export class CompleteTodoHandler {
  constructor(private readonly repository: TodoRepository) {}

  async execute(command: CompleteTodoCommand): Promise<Result<void, string>> {
    const todo = this.repository.findById(command.todoId);
    if (!todo) {
      return err(`Todo not found: ${command.todoId}`);
    }
    const { state } = completeTodo(todo);
    this.repository.save(state);
    return ok(undefined);
  }
}
