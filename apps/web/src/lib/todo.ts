import { createProtectedContext } from "@contracts/shared-kernel/server";
import { TodoCommandType, TodoQueryType } from "@contracts/todo-public";
import type { TodoDto } from "@contracts/todo-public";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { getSession } from "start-authjs";

import { config } from "~/config";

import { authConfig } from "./auth";
import { getCloudflareEnv } from "./cloudflare";
import { handlerOf, unwrap } from "./handler";
import { createTodoServices } from "./todo-composition-root.server";

const LOCAL_MOCK_USER_ID = "01954a8f-0000-7000-8000-000000000001";

async function getSessionUserId(): Promise<string> {
  if (config.isLocalDev) {
    return LOCAL_MOCK_USER_ID;
  }
  const request = getRequest();
  const session = await getSession(request, authConfig);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

export const listTodos = createServerFn({ method: "GET" }).handler(
  handlerOf(async ({ context: reqContext }): Promise<TodoDto[]> => {
    const env = getCloudflareEnv(reqContext);
    const { todoQueryBus } = createTodoServices(env);
    const userId = await getSessionUserId();
    const context = createProtectedContext(userId);
    return unwrap(await todoQueryBus.execute({ queryType: TodoQueryType.ListTodos }, context));
  }),
);

export const createTodo = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as { title: string })
  .handler(
    handlerOf(async ({ data, context: reqContext }): Promise<TodoDto[]> => {
      const env = getCloudflareEnv(reqContext);
      const { todoCommandBus, todoQueryBus } = createTodoServices(env);
      const userId = await getSessionUserId();
      const context = createProtectedContext(userId);
      unwrap(
        await todoCommandBus.execute(
          {
            commandType: TodoCommandType.CreateTodo,
            title: data.title,
          },
          context,
        ),
      );
      return unwrap(await todoQueryBus.execute({ queryType: TodoQueryType.ListTodos }, context));
    }),
  );

export const completeTodo = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as { todoId: string })
  .handler(
    handlerOf(async ({ data, context: reqContext }): Promise<TodoDto[]> => {
      const env = getCloudflareEnv(reqContext);
      const { todoCommandBus, todoQueryBus } = createTodoServices(env);
      const userId = await getSessionUserId();
      const context = createProtectedContext(userId);
      unwrap(
        await todoCommandBus.execute(
          {
            commandType: TodoCommandType.CompleteTodo,
            todoId: data.todoId,
          },
          context,
        ),
      );
      return unwrap(await todoQueryBus.execute({ queryType: TodoQueryType.ListTodos }, context));
    }),
  );
