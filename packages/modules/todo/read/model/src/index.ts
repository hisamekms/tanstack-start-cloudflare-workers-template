import type { TodoDto } from "@contracts/todo/public";
import type { ReadModelStore } from "@modules/shared-kernel-read-model";

export interface TodoReadModelStore extends ReadModelStore<TodoDto> {
  getAll(): TodoDto[];
  save(item: TodoDto): void;
}
