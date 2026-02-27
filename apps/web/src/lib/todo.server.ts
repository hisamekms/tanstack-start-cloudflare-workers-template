import type { TodoDto } from "@contracts/todo-public";
import { createServerFn } from "@tanstack/react-start";

import { todoCommandBus, todoQueryBus, syncWriteToRead } from "./todo-composition-root.server";

export const listTodos = createServerFn({ method: "GET" }).handler(async (): Promise<TodoDto[]> => {
  const result = await todoQueryBus.execute({ queryType: "ListTodos" });
  if (result.isErr()) {
    throw new Error(result.error);
  }
  return result.value;
});

export const createTodo = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as { title: string })
  .handler(async ({ data }) => {
    const result = await todoCommandBus.execute({
      commandType: "CreateTodo",
      title: data.title,
    });
    if (result.isErr()) {
      throw new Error(result.error);
    }
    syncWriteToRead();
    const todosResult = await todoQueryBus.execute({ queryType: "ListTodos" });
    if (todosResult.isErr()) {
      throw new Error(todosResult.error);
    }
    return todosResult.value;
  });

export const completeTodo = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as { todoId: string })
  .handler(async ({ data }) => {
    const result = await todoCommandBus.execute({
      commandType: "CompleteTodo",
      todoId: data.todoId,
    });
    if (result.isErr()) {
      throw new Error(result.error);
    }
    syncWriteToRead();
    const todosResult = await todoQueryBus.execute({ queryType: "ListTodos" });
    if (todosResult.isErr()) {
      throw new Error(todosResult.error);
    }
    return todosResult.value;
  });
