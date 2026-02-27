import type { TodoCommandBus } from "@contracts/todo-server";
import type { TodoCommand } from "@contracts/todo-public";
import type { Result } from "@lib/public";
import { err } from "@lib/public";
import type { CreateTodoHandler } from "./handlers/create-todo-handler";
import type { CompleteTodoHandler } from "./handlers/complete-todo-handler";

export class TodoCommandBusImpl implements TodoCommandBus {
  constructor(
    private readonly createTodoHandler: CreateTodoHandler,
    private readonly completeTodoHandler: CompleteTodoHandler,
  ) {}

  async execute(command: TodoCommand): Promise<Result<void, string>> {
    switch (command.commandType) {
      case "CreateTodo":
        return this.createTodoHandler.execute(command);
      case "CompleteTodo":
        return this.completeTodoHandler.execute(command);
      default:
        return err(`Unknown command: ${(command as TodoCommand).commandType}`);
    }
  }
}
