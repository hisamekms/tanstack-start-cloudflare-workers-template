import { InMemoryStore } from "@platform/db";
import { Todo, type TodoRepository } from "@modules/todo-write-model";

interface TodoRecord {
  id: string;
  title: string;
  completed: boolean;
}

export class InMemoryTodoRepository implements TodoRepository {
  constructor(private readonly store: InMemoryStore<TodoRecord>) {}

  findById(id: string): Todo | undefined {
    const record = this.store.getById(id);
    if (!record) return undefined;
    return Todo.reconstruct(record.id, record.title, record.completed);
  }

  save(todo: Todo): void {
    this.store.save({
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
    });
  }
}
