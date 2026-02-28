import { commandSchema } from "@contracts/shared-kernel/public";
import { z } from "zod";

export enum TodoCommandType {
  CreateTodo = "CreateTodo",
  CompleteTodo = "CompleteTodo",
}

export const CreateTodoCommandSchema = commandSchema(TodoCommandType.CreateTodo).extend({
  title: z.string(),
});

export type CreateTodoCommand = z.infer<typeof CreateTodoCommandSchema>;

export const CompleteTodoCommandSchema = commandSchema(TodoCommandType.CompleteTodo).extend({
  todoId: z.string(),
});

export type CompleteTodoCommand = z.infer<typeof CompleteTodoCommandSchema>;

export const TodoCommandSchema = z.discriminatedUnion("commandType", [
  CreateTodoCommandSchema,
  CompleteTodoCommandSchema,
]);

export type TodoCommand = z.infer<typeof TodoCommandSchema>;
