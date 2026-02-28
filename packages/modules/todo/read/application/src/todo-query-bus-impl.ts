import { TodoQueryType } from "@contracts/todo/public";
import type { TodoDto, TodoQuery } from "@contracts/todo/public";
import { UnknownTodoQueryError, type TodoError } from "@contracts/todo/public";
import type { TodoQueryBus } from "@contracts/todo/server";
import { errAsync, type ResultAsync } from "neverthrow";

import type { ListTodosHandler } from "./handlers/list-todos-handler";

export class TodoQueryBusImpl implements TodoQueryBus {
  constructor(private readonly listTodosHandler: ListTodosHandler) {}

  execute(query: TodoQuery): ResultAsync<TodoDto[], TodoError> {
    switch (query.queryType) {
      case TodoQueryType.ListTodos:
        return this.listTodosHandler.execute();
      default:
        return errAsync(new UnknownTodoQueryError((query as TodoQuery).queryType));
    }
  }
}
