import type { ExecutionContext, ExportedHandler } from "@cloudflare/workers-types";
import { logger } from "@lib/public-logger";
import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";

import { config } from "~/config";

import type { AppServerContext } from "./lib/infra/cloudflare.server";
import type { AppEnv } from "./lib/infra/cloudflare.server";

const requestHandler = createStartHandler<AppServerContext>(defaultStreamHandler);
const requestHandlerWithCloudflareContext = requestHandler as unknown as (
  request: Request,
  options: { context: AppServerContext },
) => Promise<Response>;

let startupLogged = false;

export default {
  async fetch(request: Request, env: AppEnv, ctx: ExecutionContext): Promise<Response> {
    if (!startupLogged) {
      startupLogged = true;
      logger.info(`Auth bypass mode: ${config.isLocalDev ? "enabled" : "disabled"}`);
    }
    return requestHandlerWithCloudflareContext(request, {
      context: {
        cloudflare: {
          env,
          ctx,
        },
      },
    });
  },
} as unknown as ExportedHandler<AppEnv>;
