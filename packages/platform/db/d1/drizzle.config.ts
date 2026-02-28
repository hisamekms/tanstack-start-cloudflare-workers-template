import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "drizzle-kit";

const currentDirPath = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  dialect: "sqlite",
  schema: path.join(currentDirPath, "src/schema.ts"),
  out: path.join(currentDirPath, "src/migrations"),
  strict: true,
  verbose: true,
});
