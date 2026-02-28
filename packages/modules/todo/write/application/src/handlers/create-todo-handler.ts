import type { CreateTodoCommand } from "@contracts/todo-public";
import { createTodo, type TodoRepository } from "@modules/todo-write-model";
import { ok, type Result } from "neverthrow";
import { v7 as uuidv7 } from "uuid";

export class CreateTodoHandler {
  constructor(private readonly repository: TodoRepository) {}

  async execute(command: CreateTodoCommand): Promise<Result<void, string>> {
    const id = uuidv7();
    const { state } = createTodo(id, command.title);
    await this.repository.save(state);
    return ok(undefined);
  }
}
