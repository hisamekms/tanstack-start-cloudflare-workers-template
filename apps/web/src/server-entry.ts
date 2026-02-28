import type { ExecutionContext, ExportedHandler } from "@cloudflare/workers-types";
import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";

import type { AppServerContext } from "./lib/cloudflare";
import type { AppEnv } from "./lib/cloudflare";

const requestHandler = createStartHandler<AppServerContext>(defaultStreamHandler);
const requestHandlerWithCloudflareContext = requestHandler as unknown as (
  request: Request,
  options: { context: AppServerContext },
) => Promise<Response>;

export default {
  async fetch(request: Request, env: AppEnv, ctx: ExecutionContext): Promise<Response> {
    return requestHandlerWithCloudflareContext(request, {
      context: {
        cloudflare: {
          env,
          ctx,
        },
      },
    });
  },
} as ExportedHandler<AppEnv>;
