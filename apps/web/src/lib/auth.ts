import Cognito from "@auth/core/providers/cognito";
import { D1Adapter, up } from "@auth/d1-adapter";
import type { StartAuthJSConfig } from "start-authjs";

import { env } from "cloudflare:workers";

import { config } from "~/config";

let migrated = false;

export async function ensureAuthTables(): Promise<void> {
  if (migrated) return;
  try {
    await up(env.DB);
    migrated = true;
  } catch (e) {
    console.error("Auth D1 migration failed:", e);
  }
}

export const authConfig: StartAuthJSConfig = {
  secret: config.isLocalDev ? "local-dev-dummy-secret" : config.authSecret,
  adapter: D1Adapter(env.DB),
  providers: [
    Cognito({}),
  ],
};
