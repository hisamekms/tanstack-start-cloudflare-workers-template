import type { TodoDto } from "@contracts/todo-public";
import type { TodoReadModelStore } from "@modules/todo-read-model";
import { InMemoryStore } from "@platform/db";

export class InMemoryTodoReadModelStore implements TodoReadModelStore {
  constructor(private readonly store: InMemoryStore<TodoDto>) {}

  getAll(): TodoDto[] {
    return this.store.getAll();
  }

  save(item: TodoDto): void {
    this.store.save(item);
  }
}
