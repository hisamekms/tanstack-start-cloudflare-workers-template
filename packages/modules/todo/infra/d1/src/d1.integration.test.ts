import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { D1Database } from "@cloudflare/workers-types";
import { D1TodoReadModelStore, D1TodoRepository } from "@modules/todo-infra-d1";
import { createTodo, type Todo } from "@modules/todo-write-model";
import { createD1Database } from "@platform/db-d1";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getPlatformProxy } from "wrangler";

type TestEnv = { DB: D1Database };

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = path.dirname(currentFilePath);
const baseWranglerConfigPath = path.resolve(
  currentDirPath,
  "../../../../../../apps/web/wrangler.toml",
);
const migrationsDirPath = path.resolve(
  currentDirPath,
  "../../../../../platform/db/d1/src/migrations",
);

interface TestContext {
  dispose: () => Promise<void>;
  env: TestEnv;
  tempDirPath: string;
}

let testContext: TestContext | undefined;

async function applyMigrations(env: TestEnv): Promise<void> {
  const migrationFileNames = (await readdir(migrationsDirPath))
    .filter((fileName) => fileName.endsWith(".sql"))
    .toSorted();

  for (const migrationFileName of migrationFileNames) {
    const sql = await readFile(path.join(migrationsDirPath, migrationFileName), "utf8");
    const statements = sql
      .split(";")
      .map((statement) => statement.trim())
      .filter((statement) => statement.length > 0);

    for (const statement of statements) {
      await env.DB.prepare(statement).run();
    }
  }
}

async function createTestContext(): Promise<TestContext> {
  const tempDirPath = await mkdtemp(path.join(os.tmpdir(), "todo-d1-test-"));
  const wranglerConfigTemplate = await readFile(baseWranglerConfigPath, "utf8");
  const databaseName = `app-test-${path.basename(tempDirPath)}`;
  const wranglerConfigPath = path.join(tempDirPath, "wrangler.toml");

  await writeFile(
    wranglerConfigPath,
    wranglerConfigTemplate.replace(
      'database_name = "app-local"',
      `database_name = "${databaseName}"`,
    ),
  );

  const proxy = await getPlatformProxy<TestEnv>({
    configPath: wranglerConfigPath,
    persist: {
      path: tempDirPath,
    },
    remoteBindings: false,
  });

  await applyMigrations(proxy.env);

  return {
    dispose: proxy.dispose,
    env: proxy.env,
    tempDirPath,
  };
}

beforeEach(async () => {
  testContext = await createTestContext();
});

afterEach(async () => {
  if (!testContext) return;
  await testContext.dispose();
  await rm(testContext.tempDirPath, { force: true, recursive: true });
  testContext = undefined;
});

describe("todo D1 integration", () => {
  it("persists and reloads todos through the repository", async () => {
    const context = testContext;
    if (!context) throw new Error("Missing test context");

    const database = createD1Database(context.env.DB);
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

  it("lists todos from the read model store in insertion order", async () => {
    const context = testContext;
    if (!context) throw new Error("Missing test context");

    const database = createD1Database(context.env.DB);
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
});
