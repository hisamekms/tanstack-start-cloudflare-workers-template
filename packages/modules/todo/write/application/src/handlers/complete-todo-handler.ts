import type { CompleteTodoCommand } from "@contracts/todo-public";
import type { Result } from "@lib/public";
import { ok, err } from "@lib/public";
import type { TodoRepository } from "@modules/todo-write-model";

export class CompleteTodoHandler {
  constructor(private readonly repository: TodoRepository) {}

  async execute(command: CompleteTodoCommand): Promise<Result<void, string>> {
    const todo = this.repository.findById(command.todoId);
    if (!todo) {
      return err(`Todo not found: ${command.todoId}`);
    }
    todo.complete();
    this.repository.save(todo);
    return ok(undefined);
  }
}
