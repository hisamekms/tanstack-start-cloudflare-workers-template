import { querySchema } from "@contracts/shared-kernel/public";
import { z } from "zod";

export enum TodoQueryType {
  ListTodos = "ListTodos",
}

export const ListTodosQuerySchema = querySchema(TodoQueryType.ListTodos);

export type ListTodosQuery = z.infer<typeof ListTodosQuerySchema>;

export const TodoQuerySchema = ListTodosQuerySchema;

export type TodoQuery = z.infer<typeof TodoQuerySchema>;
