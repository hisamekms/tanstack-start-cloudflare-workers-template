import type { TodoCommandBus, TodoQueryBus } from "@contracts/todo-server";
import type { UserCommandBus } from "@contracts/user-server";
import { token } from "@lib/server-di";
import type { AppDatabase } from "@platform/db-d1";
import type { ResultAsync } from "neverthrow";

export const Tokens = {
  database: token<AppDatabase>("AppDatabase"),
  contextProvider: token<() => ResultAsync<string, Error>>("ContextProvider"),
  todoCommandBus: token<TodoCommandBus>("TodoCommandBus"),
  todoQueryBus: token<TodoQueryBus>("TodoQueryBus"),
  userCommandBus: token<UserCommandBus>("UserCommandBus"),
} as const;
