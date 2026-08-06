import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "worker",
  mode: "production",
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  resolve: {
    // Resolve linked renderer dependencies from this app's node_modules.
    preserveSymlinks: true,
  },
  esbuild: {
    jsx: "automatic",
  },
  build: {
    outDir: resolve("out/worker"),
    lib: {
      name: "host-playground-worker",
      entry: "index.tsx",
      formats: ["es"],
      fileName: "index",
    },
  },
});
