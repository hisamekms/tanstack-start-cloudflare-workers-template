import type { Command } from "@contracts/shared-kernel-public";

export interface CreateTodoCommand extends Command {
  readonly commandType: "CreateTodo";
  readonly title: string;
}

export interface CompleteTodoCommand extends Command {
  readonly commandType: "CompleteTodo";
  readonly todoId: string;
}

export type TodoCommand = CreateTodoCommand | CompleteTodoCommand;
