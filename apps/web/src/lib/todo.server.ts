import { TodoCommandType, TodoQueryType } from "@contracts/todo-public";
import type { TodoDto } from "@contracts/todo-public";
import { createServerFn } from "@tanstack/react-start";

import { todoCommandBus, todoQueryBus, syncWriteToRead } from "./todo-composition-root.server";

export const listTodos = createServerFn({ method: "GET" }).handler(async (): Promise<TodoDto[]> => {
  return todoQueryBus.execute({ queryType: TodoQueryType.ListTodos });
});

export const createTodo = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as { title: string })
  .handler(async ({ data }) => {
    const result = await todoCommandBus.execute({
      commandType: TodoCommandType.CreateTodo,
      title: data.title,
    });
    if (!result.ok) {
      throw new Error(result.error);
    }
    syncWriteToRead();
    return todoQueryBus.execute({ queryType: TodoQueryType.ListTodos });
  });

export const completeTodo = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as { todoId: string })
  .handler(async ({ data }) => {
    const result = await todoCommandBus.execute({
      commandType: TodoCommandType.CompleteTodo,
      todoId: data.todoId,
    });
    if (!result.ok) {
      throw new Error(result.error);
    }
    syncWriteToRead();
    return todoQueryBus.execute({ queryType: TodoQueryType.ListTodos });
  });
