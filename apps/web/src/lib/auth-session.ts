import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { getSession } from "start-authjs";
import type { AuthSession } from "start-authjs";
import { config } from "~/config";

import { authConfig } from "./auth";

const LOCAL_MOCK_SESSION: AuthSession = {
  user: {
    name: "Local User",
    email: "local@example.com",
    image: null,
  },
  expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
};

export const fetchSession = createServerFn({ method: "GET" }).handler(async () => {
  if (config.isLocalDev) {
    return LOCAL_MOCK_SESSION;
  }
  const request = getRequest();
  const session = await getSession(request, authConfig);
  return session;
});
