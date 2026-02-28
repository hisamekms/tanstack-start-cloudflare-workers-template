import type { D1Database } from "@cloudflare/workers-types";
import { drizzle } from "drizzle-orm/d1";

import { todosTable } from "./schema";

export { todosTable } from "./schema";
export type { TodoRow, NewTodoRow } from "./schema";

export function createD1Database(binding: D1Database) {
  return drizzle(binding, {
    schema: {
      todos: todosTable,
    },
  });
}

export type AppDatabase = ReturnType<typeof createD1Database>;
