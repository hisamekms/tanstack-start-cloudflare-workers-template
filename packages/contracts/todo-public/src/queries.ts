import type { Query } from "@contracts/shared-kernel-public";

export interface ListTodosQuery extends Query {
  readonly queryType: "ListTodos";
}

export type TodoQuery = ListTodosQuery;
