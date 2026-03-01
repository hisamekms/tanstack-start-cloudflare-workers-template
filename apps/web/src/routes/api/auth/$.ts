import { logger } from "@lib/server";
import { createFileRoute } from "@tanstack/react-router";
import { StartAuthJS } from "start-authjs";

import { authConfig, ensureAuthTables } from "~/lib/auth";

const { GET, POST } = StartAuthJS(async () => {
  await ensureAuthTables();
  return authConfig;
});

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        logger.debug("[AUTH:route] GET", url.pathname + url.search);
        try {
          const res = await GET({ request, response: new Response() });
          logger.debug("[AUTH:route] GET response", { status: res.status, location: res.headers.get("location") });
          return res;
        } catch (e) {
          logger.error("[AUTH:route] GET threw:", e);
          throw e;
        }
      },
      POST: async ({ request }) => {
        const url = new URL(request.url);
        logger.debug("[AUTH:route] POST", url.pathname + url.search);
        try {
          const res = await POST({ request, response: new Response() });
          logger.debug("[AUTH:route] POST response", { status: res.status, location: res.headers.get("location") });
          return res;
        } catch (e) {
          logger.error("[AUTH:route] POST threw:", e);
          throw e;
        }
      },
    },
  },
});
