import { TodoCommandType, TodoQueryType } from "@contracts/todo/public";
import type { TodoDto } from "@contracts/todo/public";
import { createServerFn } from "@tanstack/react-start";

import { getCloudflareEnv } from "./cloudflare";
import { handlerOf, unwrap } from "./handler";
import { createTodoServices } from "./todo-composition-root.server";

export const listTodos = createServerFn({ method: "GET" }).handler(
  handlerOf(async ({ context }): Promise<TodoDto[]> => {
    const env = getCloudflareEnv(context);
    const { todoQueryBus } = createTodoServices(env);
    return unwrap(await todoQueryBus.execute({ queryType: TodoQueryType.ListTodos }));
  }),
);

export const createTodo = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as { title: string })
  .handler(
    handlerOf(async ({ data, context }): Promise<TodoDto[]> => {
      const env = getCloudflareEnv(context);
      const { todoCommandBus, todoQueryBus } = createTodoServices(env);
      unwrap(
        await todoCommandBus.execute({
          commandType: TodoCommandType.CreateTodo,
          title: data.title,
        }),
      );
      return unwrap(await todoQueryBus.execute({ queryType: TodoQueryType.ListTodos }));
    }),
  );

export const completeTodo = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as { todoId: string })
  .handler(
    handlerOf(async ({ data, context }): Promise<TodoDto[]> => {
      const env = getCloudflareEnv(context);
      const { todoCommandBus, todoQueryBus } = createTodoServices(env);
      unwrap(
        await todoCommandBus.execute({
          commandType: TodoCommandType.CompleteTodo,
          todoId: data.todoId,
        }),
      );
      return unwrap(await todoQueryBus.execute({ queryType: TodoQueryType.ListTodos }));
    }),
  );
