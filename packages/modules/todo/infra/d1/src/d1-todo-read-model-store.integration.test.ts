import { D1TodoReadModelStore, D1TodoRepository } from "@modules/todo-infra-d1";
import { createTodo, type Todo } from "@modules/todo-write-model";
import { createD1Database } from "@platform/db-d1";
import { describe, expect, it } from "vitest";

import { setupTestContext } from "./test-helpers";

const { getContext } = setupTestContext();

describe("D1TodoReadModelStore", () => {
  it("lists todos in insertion order", async () => {
    const database = createD1Database(getContext().env.DB);
    const repository = new D1TodoRepository(database);
    const readModelStore = new D1TodoReadModelStore(database);

    const todos: Todo[] = [
      createTodo(
        "01954a8f-65e3-7b14-9e0c-8d4f6f15f301",
        "Update customer success handoff notes",
        "user-001",
      ).state,
      createTodo(
        "01954a8f-65e3-7b14-9e0c-8d4f6f15f302",
        "Book user interviews for billing redesign",
        "user-001",
      ).state,
    ];

    for (const todo of todos) {
      await repository.save(todo);
    }

    const allTodos = await readModelStore.getAll();
    expect(allTodos.map((todo) => todo.id)).toEqual(todos.map((todo) => todo.id));
    expect(allTodos.map((todo) => todo.title)).toEqual(todos.map((todo) => todo.title));
  });

  it("filters todos by userId", async () => {
    const database = createD1Database(getContext().env.DB);
    const repository = new D1TodoRepository(database);
    const readModelStore = new D1TodoReadModelStore(database);

    const todoA = createTodo(
      "01954a8f-65e3-7b14-9e0c-8d4f6f15f601",
      "Draft API changelog for v2 release",
      "user-001",
    ).state;
    const todoB = createTodo(
      "01954a8f-65e3-7b14-9e0c-8d4f6f15f602",
      "Set up monitoring alerts for new service",
      "user-002",
    ).state;

    await repository.save(todoA);
    await repository.save(todoB);

    const user1Todos = await readModelStore.getByUserId("user-001");
    expect(user1Todos).toHaveLength(1);
    expect(user1Todos[0]?.id).toBe(todoA.id);

    const user2Todos = await readModelStore.getByUserId("user-002");
    expect(user2Todos).toHaveLength(1);
    expect(user2Todos[0]?.id).toBe(todoB.id);
  });
});
