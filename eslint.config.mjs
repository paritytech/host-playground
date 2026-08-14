import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // The Next project lives in apps/app, not the repo root. Without this the
  // next plugin looks for a router next to this config and warns it found none.
  { settings: { next: { rootDir: "apps/app" } } },
];

export default eslintConfig;
