import type { Todo } from "./todo";

export interface TodoRepository {
  findById(id: string): Todo | undefined;
  save(todo: Todo): void;
}
