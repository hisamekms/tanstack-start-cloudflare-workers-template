import type { CompleteTodoCommand } from "@contracts/todo/public";
import { completeTodo, type TodoRepository } from "@modules/todo-write-model";
import { ok, err, type Result } from "neverthrow";

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
