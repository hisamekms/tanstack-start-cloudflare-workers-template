import { TodoCommandType } from "@contracts/todo/public";
import type { TodoCommand } from "@contracts/todo/public";
import { UnknownTodoCommandError, type TodoError } from "@contracts/todo/public";
import type { TodoCommandBus } from "@contracts/todo/server";
import { errAsync, type ResultAsync } from "neverthrow";

import type { CompleteTodoHandler } from "./handlers/complete-todo-handler";
import type { CreateTodoHandler } from "./handlers/create-todo-handler";

export class TodoCommandBusImpl implements TodoCommandBus {
  constructor(
    private readonly createTodoHandler: CreateTodoHandler,
    private readonly completeTodoHandler: CompleteTodoHandler,
  ) {}

  execute(command: TodoCommand): ResultAsync<void, TodoError> {
    switch (command.commandType) {
      case TodoCommandType.CreateTodo:
        return this.createTodoHandler.execute(command);
      case TodoCommandType.CompleteTodo:
        return this.completeTodoHandler.execute(command);
      default:
        return errAsync(new UnknownTodoCommandError((command as TodoCommand).commandType));
    }
  }
}
