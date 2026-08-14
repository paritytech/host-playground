import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Vitest takes its root from the cwd, and the script that runs it lives at the
// repo root, so point it back at this directory to keep the suite app-scoped.
export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  test: {
    include: ["**/*.test.ts"],
  },
});
