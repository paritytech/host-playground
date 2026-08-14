import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

// Vite resolves `root` against the cwd, not this file, and the build runs from
// the repo root. Anchor both paths to this directory so either cwd works.
const here = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  root: here,
  build: {
    outDir: resolve(here, "../app/out/worker"),
    lib: {
      name: "host-playground-worker",
      entry: "index.ts",
      formats: ["es"],
      fileName: "index",
    },
  },
});
