import type { AggregateRoot } from "@contracts/shared-kernel/public";
import type { TodoCreatedEvent, TodoCompletedEvent } from "@contracts/todo/public";
import type { CommandResult } from "@modules/shared-kernel-write-model";

export interface Todo extends AggregateRoot<string> {
  readonly title: string;
  readonly completed: boolean;
}

export function createTodo(id: string, title: string): CommandResult<Todo, TodoCreatedEvent> {
  const state: Todo = { id, title, completed: false, version: 1 };
  const events: TodoCreatedEvent[] = [
    {
      eventType: "TodoCreated",
      occurredAt: new Date().toISOString(),
      schemaVersion: 1,
      aggregateVersion: 1,
      todoId: id,
      title,
    },
  ];
  return { state, events };
}

export function completeTodo(todo: Todo): CommandResult<Todo, TodoCompletedEvent> {
  const newVersion = todo.version + 1;
  const state: Todo = { ...todo, completed: true, version: newVersion };
  const events: TodoCompletedEvent[] = [
    {
      eventType: "TodoCompleted",
      occurredAt: new Date().toISOString(),
      schemaVersion: 1,
      aggregateVersion: newVersion,
      todoId: todo.id,
    },
  ];
  return { state, events };
}
