import { InMemoryStore } from "@platform/db";
import type { TodoDto } from "@contracts/todo-public";
import { InMemoryTodoRepository } from "@modules/todo-write-infra";
import {
  CreateTodoHandler,
  CompleteTodoHandler,
  TodoCommandBusImpl,
} from "@modules/todo-write-application";
import { InMemoryTodoReadModelStore } from "@modules/todo-read-infra";
import {
  ListTodosHandler,
  TodoQueryBusImpl,
} from "@modules/todo-read-application";
import type { TodoCommandBus } from "@contracts/todo-server";
import type { TodoQueryBus } from "@contracts/todo-server";

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

export const todoCommandBus: TodoCommandBus = new TodoCommandBusImpl(
  createTodoHandler,
  completeTodoHandler,
);

export const todoQueryBus: TodoQueryBus = new TodoQueryBusImpl(
  listTodosHandler,
);

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
