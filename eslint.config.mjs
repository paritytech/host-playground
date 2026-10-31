import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // The Next project lives in apps/app, not the repo root. Without this the
  // next plugin looks for a router next to this config and warns it found none.
  { settings: { next: { rootDir: "apps/app" } } },
  globalIgnores([
    "apps/app/.next/**",
    "apps/app/out/**",
    "apps/app/next-env.d.ts",
  ]),
]);
