import type { TodoCommandBus } from "@contracts/todo/server";
import type { TodoQueryBus } from "@contracts/todo/server";
import {
  loggingQueryMiddleware,
  withQueryMiddleware,
} from "@modules/shared-kernel-read-application";
import {
  loggingCommandMiddleware,
  withCommandMiddleware,
} from "@modules/shared-kernel-write-application";
import { D1TodoReadModelStore, D1TodoRepository } from "@modules/todo-infra-d1";
import { ListTodosHandler, TodoQueryBusImpl } from "@modules/todo-read-application";
import {
  CompleteTodoHandler,
  CreateTodoHandler,
  TodoCommandBusImpl,
} from "@modules/todo-write-application";
import { createD1Database } from "@platform/db-d1";

import type { AppEnv } from "./cloudflare";

export function createTodoServices(env: AppEnv): {
  todoCommandBus: TodoCommandBus;
  todoQueryBus: TodoQueryBus;
} {
  const db = createD1Database(env.DB);

  const todoRepository = new D1TodoRepository(db);
  const createTodoHandler = new CreateTodoHandler(todoRepository);
  const completeTodoHandler = new CompleteTodoHandler(todoRepository);

  const todoReadModelStore = new D1TodoReadModelStore(db);
  const listTodosHandler = new ListTodosHandler(todoReadModelStore);

  const rawCommandBus = new TodoCommandBusImpl(createTodoHandler, completeTodoHandler);
  const todoCommandBus: TodoCommandBus = withCommandMiddleware(rawCommandBus, [
    loggingCommandMiddleware(),
  ]);

  const rawQueryBus = new TodoQueryBusImpl(listTodosHandler);
  const todoQueryBus: TodoQueryBus = withQueryMiddleware(rawQueryBus, [loggingQueryMiddleware()]);

  return {
    todoCommandBus,
    todoQueryBus,
  };
}
