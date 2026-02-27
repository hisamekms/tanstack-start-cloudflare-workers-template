import type { Query } from "@contracts/shared-kernel-public";

export enum TodoQueryType {
  ListTodos = "ListTodos",
}

export interface ListTodosQuery extends Query<TodoQueryType.ListTodos> {}

export type TodoQuery = ListTodosQuery;
