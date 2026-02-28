import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "drizzle-kit";

const currentDirPath = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  dialect: "sqlite",
  schema: path.join(currentDirPath, "src/d1/schema.ts"),
  out: path.join(currentDirPath, "src/d1/migrations"),
  strict: true,
  verbose: true,
});
