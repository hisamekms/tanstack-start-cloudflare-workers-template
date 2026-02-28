import type { TodoDto } from "@contracts/todo/public";
import type { TodoError } from "@contracts/todo/public";
import type { TodoReadModelStore } from "@modules/todo-read-model";
import { ok, type Result } from "neverthrow";

export class ListTodosHandler {
  constructor(private readonly store: TodoReadModelStore) {}

  async execute(): Promise<Result<TodoDto[], TodoError>> {
    return ok(await this.store.getAll());
  }
}
