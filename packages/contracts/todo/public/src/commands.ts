import type { Command } from "@contracts/shared-kernel/public";

export enum TodoCommandType {
  CreateTodo = "CreateTodo",
  CompleteTodo = "CompleteTodo",
}

export interface CreateTodoCommand extends Command<TodoCommandType.CreateTodo> {
  readonly title: string;
}

export interface CompleteTodoCommand extends Command<TodoCommandType.CompleteTodo> {
  readonly todoId: string;
}

export type TodoCommand = CreateTodoCommand | CompleteTodoCommand;
