import type { Todo, TodoRepository } from "@modules/todo-write-model";
import { InMemoryStore } from "@platform/db";

interface TodoRecord {
  id: string;
  title: string;
  completed: boolean;
  version: number;
}

export class InMemoryTodoRepository implements TodoRepository {
  constructor(private readonly store: InMemoryStore<TodoRecord>) {}

  findById(id: string): Todo | undefined {
    const record = this.store.getById(id);
    if (!record) return undefined;
    return {
      id: record.id,
      title: record.title,
      completed: record.completed,
      version: record.version,
    };
  }

  save(todo: Todo): void {
    this.store.save({
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      version: todo.version,
    });
  }
}
