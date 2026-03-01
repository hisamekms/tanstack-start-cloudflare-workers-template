import { Container } from "@lib/server-di";
import {
  withQueryMiddleware,
  loggingQueryMiddleware,
} from "@modules/shared-kernel-read-application";
import {
  withCommandMiddleware,
  loggingCommandMiddleware,
} from "@modules/shared-kernel-write-application";
import { D1TodoRepository, D1TodoReadModelStore } from "@modules/todo-infra-d1";
import { ListTodosHandler, TodoQueryBusImpl } from "@modules/todo-read-application";
import {
  CreateTodoHandler,
  CompleteTodoHandler,
  TodoCommandBusImpl,
} from "@modules/todo-write-application";
import { D1UserRepository } from "@modules/user-infra-d1";
import { EnsureUserHandler, UserCommandBusImpl } from "@modules/user-write-application";
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

root.registerFactory(
  Tokens.userCommandBus,
  (r) => {
    const db = r.resolve(Tokens.database);
    const repo = new D1UserRepository(db);
    const rawBus = new UserCommandBusImpl(new EnsureUserHandler(repo));
    return withCommandMiddleware(rawBus, [loggingCommandMiddleware()]);
  },
  "scoped",
);

export function createRequestScope(env: AppEnv): Container {
  const scope = root.createScope();
  scope.registerValue(Tokens.database, createD1Database(env.DB));
  return scope;
}
