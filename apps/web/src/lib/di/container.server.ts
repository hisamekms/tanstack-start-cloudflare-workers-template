import { Container } from "@lib/di";
import { D1TodoRepository, D1TodoReadModelStore } from "@modules/todo-infra-d1";
import {
  CreateTodoHandler,
  CompleteTodoHandler,
  TodoCommandBusImpl,
} from "@modules/todo-write-application";
import { ListTodosHandler, TodoQueryBusImpl } from "@modules/todo-read-application";
import {
  withCommandMiddleware,
  loggingCommandMiddleware,
} from "@modules/shared-kernel-write-application";
import {
  withQueryMiddleware,
  loggingQueryMiddleware,
} from "@modules/shared-kernel-read-application";
import { createD1Database } from "@platform/db-d1";
import type { AppEnv } from "../cloudflare";
import { Tokens } from "./tokens.server";

const root = new Container();

root.registerFactory(
  Tokens.todoCommandBus,
  (r) => {
    const db = r.resolve(Tokens.database);
    const repo = new D1TodoRepository(db);
    const rawBus = new TodoCommandBusImpl(
      new CreateTodoHandler(repo),
      new CompleteTodoHandler(repo),
    );
    return withCommandMiddleware(rawBus, [loggingCommandMiddleware()]);
  },
  "scoped",
);

root.registerFactory(
  Tokens.todoQueryBus,
  (r) => {
    const db = r.resolve(Tokens.database);
    const store = new D1TodoReadModelStore(db);
    const rawBus = new TodoQueryBusImpl(new ListTodosHandler(store));
    return withQueryMiddleware(rawBus, [loggingQueryMiddleware()]);
  },
  "scoped",
);

export function createRequestScope(env: AppEnv): Container {
  const scope = root.createScope();
  scope.registerValue(Tokens.database, createD1Database(env.DB));
  return scope;
}
