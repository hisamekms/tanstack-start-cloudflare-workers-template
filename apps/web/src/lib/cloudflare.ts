import type { D1Database, ExecutionContext } from "@cloudflare/workers-types";

export interface AppEnv {
  DB: D1Database;
}

export interface AppServerContext {
  cloudflare: {
    env: AppEnv;
    ctx: ExecutionContext;
  };
}

export function getCloudflareEnv(context: unknown): AppEnv {
  const db = (context as AppServerContext | undefined)?.cloudflare?.env?.DB;
  if (!db) {
    throw new Error("Cloudflare D1 binding is not available in the server context.");
  }
  return { DB: db };
}
