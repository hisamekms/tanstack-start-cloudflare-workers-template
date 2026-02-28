import { TodoCommandType, TodoQueryType } from "@contracts/todo-public";
import type { TodoDto } from "@contracts/todo-public";
import { createServerFn } from "@tanstack/react-start";

import { getCloudflareEnv } from "./cloudflare";
import { createTodoServices } from "./todo-composition-root.server";

export const listTodos = createServerFn({ method: "GET" }).handler(
  async ({ context }): Promise<TodoDto[]> => {
    const env = getCloudflareEnv(context);
    const { todoQueryBus } = createTodoServices(env);
    const result = await todoQueryBus.execute({ queryType: TodoQueryType.ListTodos });
    if (result.isErr()) {
      throw new Error(result.error);
    }
    return result.value;
  },
);

export const createTodo = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as { title: string })
  .handler(async ({ data, context }) => {
    const env = getCloudflareEnv(context);
    const { todoCommandBus, todoQueryBus } = createTodoServices(env);
    const result = await todoCommandBus.execute({
      commandType: TodoCommandType.CreateTodo,
      title: data.title,
    });
    if (result.isErr()) {
      throw new Error(result.error);
    }
    const todosResult = await todoQueryBus.execute({ queryType: TodoQueryType.ListTodos });
    if (todosResult.isErr()) {
      throw new Error(todosResult.error);
    }
    return todosResult.value;
  });

export const completeTodo = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as { todoId: string })
  .handler(async ({ data, context }) => {
    const env = getCloudflareEnv(context);
    const { todoCommandBus, todoQueryBus } = createTodoServices(env);
    const result = await todoCommandBus.execute({
      commandType: TodoCommandType.CompleteTodo,
      todoId: data.todoId,
    });
    if (result.isErr()) {
      throw new Error(result.error);
    }
    const todosResult = await todoQueryBus.execute({ queryType: TodoQueryType.ListTodos });
    if (todosResult.isErr()) {
      throw new Error(todosResult.error);
    }
    return todosResult.value;
  });
