import { OptimisticLockError } from "@contracts/shared-kernel/public";
import { D1TodoRepository } from "@modules/todo-infra-d1";
import { completeTodo, createTodo } from "@modules/todo-write-model";
import { createD1Database } from "@platform/db-d1";
import { describe, expect, it } from "vitest";

import { setupTestContext } from "./test-helpers";

const { getContext } = setupTestContext();

describe("D1TodoRepository", () => {
  it("persists and reloads todos through the repository", async () => {
    const database = createD1Database(getContext().env.DB);
    const repository = new D1TodoRepository(database);
    const created = createTodo(
      "01954a8f-65e3-7b14-9e0c-8d4f6f15f201",
      "Call carrier about invoice mismatch",
      "user-001",
    );

    await repository.save(created.state);

    const savedTodo = await repository.findById(created.state.id);
    expect(savedTodo).toEqual(created.state);
  });

  it("saves an updated todo with incremented version", async () => {
    const database = createD1Database(getContext().env.DB);
    const repository = new D1TodoRepository(database);
    const created = createTodo(
      "01954a8f-65e3-7b14-9e0c-8d4f6f15f401",
      "Review quarterly OKR progress",
      "user-001",
    );

    await repository.save(created.state);

    const completed = completeTodo(created.state);
    await repository.save(completed.state);

    const reloaded = await repository.findById(created.state.id);
    expect(reloaded).toEqual(completed.state);
    expect(reloaded?.version).toBe(2);
    expect(reloaded?.completed).toBe(true);
  });

  it("throws OptimisticLockError when saving with a stale version", async () => {
    const database = createD1Database(getContext().env.DB);
    const repository = new D1TodoRepository(database);
    const created = createTodo(
      "01954a8f-65e3-7b14-9e0c-8d4f6f15f501",
      "Prepare demo environment for stakeholder review",
      "user-001",
    );

    await repository.save(created.state);

    const firstUpdate = completeTodo(created.state);
    await repository.save(firstUpdate.state);

    const staleUpdate = completeTodo(created.state);
    await expect(repository.save(staleUpdate.state)).rejects.toThrow(OptimisticLockError);
  });
});
