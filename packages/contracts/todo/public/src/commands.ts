import { commandSchema } from "@contracts/shared-kernel/public";
import { z } from "zod";

export enum TodoCommandType {
  CreateTodo = "CreateTodo",
  CompleteTodo = "CompleteTodo",
}

export const CreateTodoInputSchema = z.object({
  title: z.string().trim().min(1).max(200),
});

export type CreateTodoInput = z.infer<typeof CreateTodoInputSchema>;

export const CompleteTodoInputSchema = z.object({
  todoId: z.string().uuid(),
});

export type CompleteTodoInput = z.infer<typeof CompleteTodoInputSchema>;

export const CreateTodoCommandSchema = commandSchema(TodoCommandType.CreateTodo).extend({
  title: CreateTodoInputSchema.shape.title,
});

export type CreateTodoCommand = z.infer<typeof CreateTodoCommandSchema>;

export const CompleteTodoCommandSchema = commandSchema(TodoCommandType.CompleteTodo).extend({
  todoId: CompleteTodoInputSchema.shape.todoId,
});

export type CompleteTodoCommand = z.infer<typeof CompleteTodoCommandSchema>;

export const TodoCommandSchema = z.discriminatedUnion("commandType", [
  CreateTodoCommandSchema,
  CompleteTodoCommandSchema,
]);

export type TodoCommand = z.infer<typeof TodoCommandSchema>;
