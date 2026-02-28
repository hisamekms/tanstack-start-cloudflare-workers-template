import { TodoQueryType } from "@contracts/todo/public";
import type { TodoDto, TodoQuery } from "@contracts/todo/public";
import { UnknownTodoQueryError, type TodoError } from "@contracts/todo/public";
import type { TodoQueryBus } from "@contracts/todo/server";
import { err, type Result } from "neverthrow";

import type { ListTodosHandler } from "./handlers/list-todos-handler";

export class TodoQueryBusImpl implements TodoQueryBus {
  constructor(private readonly listTodosHandler: ListTodosHandler) {}

  async execute(query: TodoQuery): Promise<Result<TodoDto[], TodoError>> {
    switch (query.queryType) {
      case TodoQueryType.ListTodos:
        return this.listTodosHandler.execute();
      default:
        return err(new UnknownTodoQueryError((query as TodoQuery).queryType));
    }
  }
}
