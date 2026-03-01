import { getRequest } from "@tanstack/react-start/server";
import { getSession } from "start-authjs";

import { config } from "~/config";

import { authConfig } from "./config.server";

const LOCAL_MOCK_USER_ID = "01954a8f-0000-7000-8000-000000000001";

export async function getSessionUserId(): Promise<string> {
  if (config.isLocalDev) {
    return LOCAL_MOCK_USER_ID;
  }
  const request = getRequest();
  const session = await getSession(request, authConfig);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}
