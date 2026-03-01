import Google from "@auth/core/providers/google";
import { D1Adapter, up } from "@auth/d1-adapter";
import { logger } from "@lib/server";
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
      logger.debug("[AUTH:signIn] called", { provider: account?.provider, email: profile?.email });
      if (!account || !profile?.email) {
        logger.debug("[AUTH:signIn] skipping EnsureUser (no account or email)");
        return true;
      }
      const sub = account.providerAccountId;
      const email = profile.email;
      try {
        const scope = createRequestScope(env as Parameters<typeof createRequestScope>[0]);
        const userCommandBus = scope.resolve(Tokens.userCommandBus);
        const result = await userCommandBus.execute(
          { commandType: UserCommandType.EnsureUser, sub, email },
          { kind: "public" },
        );
        if (result.isErr()) {
          logger.error("[AUTH:signIn] EnsureUser failed:", result.error);
        } else {
          logger.debug("[AUTH:signIn] EnsureUser succeeded for", email);
        }
      } catch (e) {
        logger.error("[AUTH:signIn] EnsureUser threw:", e);
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      logger.debug("[AUTH:redirect]", { url, baseUrl });
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async session({ session }) {
      logger.debug("[AUTH:session]", { userId: session?.user?.id, email: session?.user?.email, expires: session?.expires });
      return session;
    },
  },
};
