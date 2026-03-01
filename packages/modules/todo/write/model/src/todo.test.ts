import { describe, expect, test } from "vitest";

import { completeTodo, createTodo, type Todo } from "./todo";

describe("createTodo", () => {
  test("returns state with correct properties", () => {
    const { state } = createTodo("t-1", "Buy milk", "u-1");

    expect(state).toEqual({
      id: "t-1",
      title: "Buy milk",
      completed: false,
      userId: "u-1",
      version: 1,
    });
  });

  test("returns a TodoCreatedEvent", () => {
    const { events } = createTodo("t-1", "Buy milk", "u-1");

    expect(events).toHaveLength(1);
    expect(events[0]).toEqual(
      expect.objectContaining({
        eventType: "TodoCreated",
        schemaVersion: 1,
        aggregateVersion: 1,
        todoId: "t-1",
        title: "Buy milk",
      }),
    );
    expect(typeof events[0]!.occurredAt).toBe("string");
  });
});

describe("completeTodo", () => {
  const todo: Todo = { id: "t-1", title: "Buy milk", completed: false, userId: "u-1", version: 1 };

  test("returns state with completed true and incremented version", () => {
    const { state } = completeTodo(todo);

    expect(state.completed).toBe(true);
    expect(state.version).toBe(2);
  });

  test("does not mutate the original todo", () => {
    completeTodo(todo);

    expect(todo.completed).toBe(false);
    expect(todo.version).toBe(1);
  });

  test("returns a TodoCompletedEvent", () => {
    const { events } = completeTodo(todo);

    expect(events).toHaveLength(1);
    expect(events[0]).toEqual(
      expect.objectContaining({
        eventType: "TodoCompleted",
        schemaVersion: 1,
        aggregateVersion: 2,
        todoId: "t-1",
      }),
    );
    expect(typeof events[0]!.occurredAt).toBe("string");
  });
});
