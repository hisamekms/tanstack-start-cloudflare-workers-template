import { skipCSRFCheck } from "@auth/core";
import { createFileRoute } from "@tanstack/react-router";
import { StartAuthJS } from "start-authjs";

import { authConfig } from "~/lib/auth";

const { GET, POST } = StartAuthJS(async (context) => {
  const url = new URL(context.request.url);
  if (url.pathname.endsWith("/signout")) {
    return { ...authConfig, skipCSRFCheck };
  }
  return authConfig;
});

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        console.debug("[AUTH:route] GET", url.pathname + url.search);
        try {
          const res = await GET({ request, response: new Response() });
          console.debug("[AUTH:route] GET response", {
            status: res.status,
            location: res.headers.get("location"),
          });
          return res;
        } catch (e) {
          console.error("[AUTH:route] GET threw:", e);
          throw e;
        }
      },
      POST: async ({ request }) => {
        const url = new URL(request.url);
        console.debug("[AUTH:route] POST", url.pathname + url.search);
        try {
          const res = await POST({ request, response: new Response() });
          console.debug("[AUTH:route] POST response", {
            status: res.status,
            location: res.headers.get("location"),
          });
          return res;
        } catch (e) {
          console.error("[AUTH:route] POST threw:", e);
          throw e;
        }
      },
    },
  },
});
