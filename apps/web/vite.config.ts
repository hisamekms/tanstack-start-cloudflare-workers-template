import { existsSync } from "node:fs";
import path from "node:path";

import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

function resolveWranglerConfigPath(): string {
  if (process.env.WRANGLER_CONFIG) {
    return process.env.WRANGLER_CONFIG;
  }
  const localPath = path.resolve(__dirname, "wrangler.local.toml");
  return existsSync(localPath) ? "./wrangler.local.toml" : "./wrangler.toml";
}

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    cloudflare({
      configPath: resolveWranglerConfigPath(),
      viteEnvironment: { name: "ssr" },
    }),
    tanstackStart(),
    react(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
  ],
});
