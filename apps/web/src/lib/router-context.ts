import type { QueryClient } from "@tanstack/react-query";
import type { AuthSession } from "start-authjs";

export interface RouterContext {
  queryClient: QueryClient;
  session: AuthSession | null;
}
