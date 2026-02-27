import type { TodoQueryBus } from "@contracts/todo-server";
import type { TodoDto, TodoQuery } from "@contracts/todo-public";
import type { ListTodosHandler } from "./handlers/list-todos-handler";

export class TodoQueryBusImpl implements TodoQueryBus {
  constructor(private readonly listTodosHandler: ListTodosHandler) {}

  async execute(query: TodoQuery): Promise<TodoDto[]> {
    switch (query.queryType) {
      case "ListTodos":
        return this.listTodosHandler.execute();
      default:
        throw new Error(`Unknown query: ${(query as TodoQuery).queryType}`);
    }
  }
}
