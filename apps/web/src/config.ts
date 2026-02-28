import { env } from "cloudflare:workers";

export const config = {
  get appEnv() {
    return env.APP_ENV;
  },
  get isLocalDev() {
    return env.APP_ENV === "local";
  },
  get authSecret() {
    return env.AUTH_SECRET;
  },
};
