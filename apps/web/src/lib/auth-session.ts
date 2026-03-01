import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { getSession } from "start-authjs";
import type { AuthSession } from "start-authjs";

import { config } from "~/config";

import { authConfig } from "./auth";

const LOCAL_MOCK_SESSION: AuthSession = {
  user: {
    id: "01954a8f-0000-7000-8000-000000000001",
    name: "Local User",
    email: "local@example.com",
    image: null,
  },
  expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
};

export const fetchSession = createServerFn({ method: "GET" }).handler(async () => {
  if (config.isLocalDev) {
    console.debug("[AUTH:fetchSession] local dev mode, returning mock session");
    return LOCAL_MOCK_SESSION;
  }
  const request = getRequest();
  console.debug("[AUTH:fetchSession] fetching session for", request.url);
  try {
    const session = await getSession(request, authConfig);
    console.debug("[AUTH:fetchSession] result:", {
      hasUser: !!session?.user,
      userId: session?.user?.id,
      email: session?.user?.email,
    });
    return session;
  } catch (e) {
    console.error("[AUTH:fetchSession] getSession threw:", e);
    return null;
  }
});
