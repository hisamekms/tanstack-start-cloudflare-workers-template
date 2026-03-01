import type { D1Database } from "@cloudflare/workers-types";
import { drizzle } from "drizzle-orm/d1";

import { todosTable, usersTable } from "./schema";

export { todosTable, usersTable } from "./schema";
export type { TodoRow, NewTodoRow, UserRow, NewUserRow } from "./schema";

export function createD1Database(binding: D1Database) {
  return drizzle(binding, {
    schema: {
      todos: todosTable,
      users: usersTable,
    },
  });
}

export type AppDatabase = ReturnType<typeof createD1Database>;
