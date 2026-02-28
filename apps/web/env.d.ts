declare module "cloudflare:workers" {
  const env: {
    APP_ENV?: string;
    AUTH_SECRET?: string;
    DB: import("@cloudflare/workers-types").D1Database;
  };
}
