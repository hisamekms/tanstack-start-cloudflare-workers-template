import { createPublicContext } from "@contracts/shared-kernel/server";
import { TodoCommandType, TodoQueryType } from "@contracts/todo/public";
import type { TodoDto } from "@contracts/todo/public";
import { createServerFn } from "@tanstack/react-start";

import { getCloudflareEnv } from "./cloudflare";
import { handlerOf, unwrap } from "./handler";
import { createTodoServices } from "./todo-composition-root.server";

export const listTodos = createServerFn({ method: "GET" }).handler(
  handlerOf(async ({ context: reqContext }): Promise<TodoDto[]> => {
    const env = getCloudflareEnv(reqContext);
    const { todoQueryBus } = createTodoServices(env);
    const context = createPublicContext();
    return unwrap(await todoQueryBus.execute({ queryType: TodoQueryType.ListTodos }, context));
  }),
);

export const createTodo = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as { title: string })
  .handler(
    handlerOf(async ({ data, context: reqContext }): Promise<TodoDto[]> => {
      const env = getCloudflareEnv(reqContext);
      const { todoCommandBus, todoQueryBus } = createTodoServices(env);
      const context = createPublicContext();
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
      const context = createPublicContext();
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
