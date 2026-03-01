import type { QueryBus, Context } from "@contracts/shared-kernel/server";
import type { TodoDto, TodoQuery } from "@contracts/todo-public";
import type { TodoError } from "@contracts/todo-public";
import type { ResultAsync } from "neverthrow";

export interface TodoQueryBus extends QueryBus<TodoQuery, TodoDto[], TodoError> {
  execute(query: TodoQuery, context: Context): ResultAsync<TodoDto[], TodoError>;
}
