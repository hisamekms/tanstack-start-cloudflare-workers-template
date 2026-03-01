import { TodoCommandType, TodoQueryType } from "@contracts/todo-public";
import { createServerFn } from "@tanstack/react-start";

import { Tokens } from "../../di/index.server";
import { commandHandler, queryHandler } from "../../lib/handler.server";

export const listTodos = createServerFn({ method: "GET" }).handler(
  queryHandler(({ ctx, container }) => {
    const todoQueryBus = container.resolve(Tokens.todoQueryBus);
    return todoQueryBus.execute({ queryType: TodoQueryType.ListTodos }, ctx);
  }),
);

export const createTodo = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as { title: string })
  .handler(
    commandHandler(({ data, ctx, container }) => {
      const todoCommandBus = container.resolve(Tokens.todoCommandBus);
      const todoQueryBus = container.resolve(Tokens.todoQueryBus);
      return todoCommandBus
        .execute(
          {
            commandType: TodoCommandType.CreateTodo,
            title: data.title,
          },
          ctx,
        )
        .andThen(() => todoQueryBus.execute({ queryType: TodoQueryType.ListTodos }, ctx));
    }),
  );

export const completeTodo = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as { todoId: string })
  .handler(
    commandHandler(({ data, ctx, container }) => {
      const todoCommandBus = container.resolve(Tokens.todoCommandBus);
      const todoQueryBus = container.resolve(Tokens.todoQueryBus);
      return todoCommandBus
        .execute(
          {
            commandType: TodoCommandType.CompleteTodo,
            todoId: data.todoId,
          },
          ctx,
        )
        .andThen(() => todoQueryBus.execute({ queryType: TodoQueryType.ListTodos }, ctx));
    }),
  );
