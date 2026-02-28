import type { TodoCommandBus, TodoQueryBus } from "@contracts/todo/server";
import type { AppEnv } from "./cloudflare";
import { createRequestScope } from "./di/index.server";
import { Tokens } from "./di/tokens.server";

export function createTodoServices(env: AppEnv): {
  todoCommandBus: TodoCommandBus;
  todoQueryBus: TodoQueryBus;
} {
  const scope = createRequestScope(env);
  return {
    todoCommandBus: scope.resolve(Tokens.todoCommandBus),
    todoQueryBus: scope.resolve(Tokens.todoQueryBus),
  };
}
