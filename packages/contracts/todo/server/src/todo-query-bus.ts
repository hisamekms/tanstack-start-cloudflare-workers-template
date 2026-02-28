import type { QueryBus } from "@contracts/shared-kernel/server";
import type { TodoDto, TodoQuery } from "@contracts/todo/public";
import type { TodoError } from "@contracts/todo/public";
import type { Result } from "neverthrow";

export interface TodoQueryBus extends QueryBus<TodoQuery, TodoDto[], TodoError> {
  execute(query: TodoQuery): Promise<Result<TodoDto[], TodoError>>;
}
