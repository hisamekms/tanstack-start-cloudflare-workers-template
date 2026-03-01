import { env } from "cloudflare:workers";

export const config = {
  get appEnv() {
    return env.APP_ENV;
  },
  get hasAuthConfig() {
    return !!env.AUTH_GOOGLE_ID && !!env.AUTH_GOOGLE_SECRET;
  },
  get isLocalDev() {
    return env.APP_ENV === "local" && !this.hasAuthConfig;
  },
  get authSecret() {
    return env.AUTH_SECRET;
  },
};
