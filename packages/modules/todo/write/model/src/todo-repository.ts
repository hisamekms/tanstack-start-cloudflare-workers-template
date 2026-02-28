import type { Todo } from "./todo";

export interface TodoRepository {
  findById(id: string): Promise<Todo | undefined>;
  save(todo: Todo): Promise<void>;
}
