import type { TodoDto } from "@contracts/todo-public";
import type { TodoReadModelStore } from "@modules/todo-read-model";

export class ListTodosHandler {
  constructor(private readonly store: TodoReadModelStore) {}

  async execute(): Promise<TodoDto[]> {
    return this.store.getAll();
  }
}
