import Google from "@auth/core/providers/google";
import { D1Adapter, up } from "@auth/d1-adapter";
import { UserCommandType } from "@contracts/user-public";
import { env } from "cloudflare:workers";
import type { StartAuthJSConfig } from "start-authjs";

import { config } from "~/config";

import { createRequestScope } from "./di/index.server";
import { Tokens } from "./di/tokens.server";

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
  providers: [Google({})],
  callbacks: {
    async signIn({ account, profile }) {
      if (!account || !profile?.email) return true;
      const sub = account.providerAccountId;
      const email = profile.email;
      const scope = createRequestScope(env as Parameters<typeof createRequestScope>[0]);
      const userCommandBus = scope.resolve(Tokens.userCommandBus);
      const result = await userCommandBus.execute(
        { commandType: UserCommandType.EnsureUser, sub, email },
        { kind: "public" },
      );
      if (result.isErr()) {
        console.error("Failed to ensure user:", result.error);
      }
      return true;
    },
  },
};
