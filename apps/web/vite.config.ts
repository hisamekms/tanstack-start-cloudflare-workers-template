import { existsSync } from "node:fs";
import path from "node:path";

import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

const localWranglerConfigPath = path.resolve(__dirname, "wrangler.local.toml");

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    cloudflare({
      configPath: existsSync(localWranglerConfigPath) ? "./wrangler.local.toml" : "./wrangler.toml",
      viteEnvironment: { name: "ssr" },
    }),
    tanstackStart(),
    react(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
  ],
});
