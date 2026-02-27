import type { CreateTodoCommand } from "@contracts/todo-public";
import type { Result } from "@lib/public";
import { ok } from "@lib/public";
import { createTodo, type TodoRepository } from "@modules/todo-write-model";

export class CreateTodoHandler {
  constructor(private readonly repository: TodoRepository) {}

  async execute(command: CreateTodoCommand): Promise<Result<void, string>> {
    const id = crypto.randomUUID();
    const { state } = createTodo(id, command.title);
    this.repository.save(state);
    return ok(undefined);
  }
}
