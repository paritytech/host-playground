import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "worker",
  build: {
    outDir: resolve("out/worker"),
    lib: {
      name: "host-playground-worker",
      entry: "index.ts",
      formats: ["es"],
      fileName: "index",
    },
  },
});
