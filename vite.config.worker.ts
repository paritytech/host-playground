import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "apps/worker",
  build: {
    outDir: resolve("apps/app/out/worker"),
    lib: {
      name: "host-playground-worker",
      entry: "index.ts",
      formats: ["es"],
      fileName: "index",
    },
  },
});
