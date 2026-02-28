import { token } from "@lib/di";
import type { TodoCommandBus, TodoQueryBus } from "@contracts/todo/server";
import type { AppDatabase } from "@platform/db-d1";

export const Tokens = {
  database: token<AppDatabase>("AppDatabase"),
  todoCommandBus: token<TodoCommandBus>("TodoCommandBus"),
  todoQueryBus: token<TodoQueryBus>("TodoQueryBus"),
} as const;
