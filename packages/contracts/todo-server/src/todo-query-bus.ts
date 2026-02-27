import type { QueryBus } from "@contracts/shared-kernel-server";
import type { TodoDto, TodoQuery } from "@contracts/todo-public";
import type { Result } from "neverthrow";

export interface TodoQueryBus extends QueryBus<TodoQuery, TodoDto[]> {
  execute(query: TodoQuery): Promise<Result<TodoDto[], string>>;
}
