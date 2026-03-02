import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { D1Database } from "@cloudflare/workers-types";
import { afterEach, beforeEach } from "vitest";
import { getPlatformProxy } from "wrangler";

export type TestEnv = { DB: D1Database };

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

export interface TestContext {
  dispose: () => Promise<void>;
  env: TestEnv;
  tempDirPath: string;
}

async function applyMigrations(env: TestEnv): Promise<void> {
  const migrationFileNames = (await readdir(migrationsDirPath))
    .filter((fileName) => fileName.endsWith(".sql"))
    .sort();

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

export function setupTestContext(): { getContext: () => TestContext } {
  let testContext: TestContext | undefined;

  beforeEach(async () => {
    testContext = await createTestContext();
  });

  afterEach(async () => {
    if (!testContext) return;
    await testContext.dispose();
    await rm(testContext.tempDirPath, { force: true, recursive: true });
    testContext = undefined;
  });

  return {
    getContext: () => {
      if (!testContext) throw new Error("Missing test context");
      return testContext;
    },
  };
}
