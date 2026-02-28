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
      GET: ({ request }) => GET({ request, response: new Response() }),
      POST: ({ request }) => POST({ request, response: new Response() }),
    },
  },
});
