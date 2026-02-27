import type { QueryBus } from "@contracts/shared-kernel-server";
import type { TodoDto, TodoQuery } from "@contracts/todo-public";

export interface TodoQueryBus extends QueryBus<TodoQuery, TodoDto[]> {
  execute(query: TodoQuery): Promise<TodoDto[]>;
}
