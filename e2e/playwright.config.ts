import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";

// The specs sit next to this config, but everything else Playwright touches —
// the dev server it starts, the report and traces it writes — belongs to the
// repo root one level up, so anchor those paths there.
const repoRoot = fileURLToPath(new URL("..", import.meta.url));

export default defineConfig({
  testDir: ".",
  outputDir: resolve(repoRoot, "test-results"),
  fullyParallel: false,
  workers: 1,
  timeout: 120_000,
  expect: { timeout: 30_000 },
  retries: 1,
  reporter: [
    [
      "html",
      { open: "never", outputFolder: resolve(repoRoot, "playwright-report") },
    ],
    ["list"],
  ],

  use: {
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "yarn dev:paseo --port 5199",
    cwd: repoRoot,
    port: 5199,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
