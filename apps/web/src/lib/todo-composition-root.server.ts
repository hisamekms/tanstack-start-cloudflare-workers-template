import type { TodoDto } from "@contracts/todo/public";
import type { TodoCommandBus } from "@contracts/todo/server";
import type { TodoQueryBus } from "@contracts/todo/server";
import {
  loggingQueryMiddleware,
  withQueryMiddleware,
} from "@modules/shared-kernel-read-application";
import {
  loggingCommandMiddleware,
  withCommandMiddleware,
} from "@modules/shared-kernel-write-application";
import { ListTodosHandler, TodoQueryBusImpl } from "@modules/todo-read-application";
import { InMemoryTodoReadModelStore } from "@modules/todo-read-infra";
import {
  CreateTodoHandler,
  CompleteTodoHandler,
  TodoCommandBusImpl,
} from "@modules/todo-write-application";
import { InMemoryTodoRepository } from "@modules/todo-write-infra";
import { InMemoryStore } from "@platform/db";

interface TodoRecord {
  id: string;
  title: string;
  completed: boolean;
}

// In-memory stores (request-scoped on Cloudflare Workers)
const writeStore = new InMemoryStore<TodoRecord>();
const readStore = new InMemoryStore<TodoDto>();

// Write side
const todoRepository = new InMemoryTodoRepository(writeStore);
const createTodoHandler = new CreateTodoHandler(todoRepository);
const completeTodoHandler = new CompleteTodoHandler(todoRepository);

// Read side
const todoReadModelStore = new InMemoryTodoReadModelStore(readStore);
const listTodosHandler = new ListTodosHandler(todoReadModelStore);

const rawCommandBus = new TodoCommandBusImpl(createTodoHandler, completeTodoHandler);
export const todoCommandBus: TodoCommandBus = withCommandMiddleware(rawCommandBus, [
  loggingCommandMiddleware(),
]);

const rawQueryBus = new TodoQueryBusImpl(listTodosHandler);
export const todoQueryBus: TodoQueryBus = withQueryMiddleware(rawQueryBus, [
  loggingQueryMiddleware(),
]);

// Sync write model to read model (simplified event projection)
export function syncWriteToRead(): void {
  for (const record of writeStore.getAll()) {
    readStore.save({
      id: record.id,
      title: record.title,
      completed: record.completed,
    });
  }
}
