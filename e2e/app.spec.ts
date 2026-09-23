import { test, expect } from "./fixtures";
import { waitForAppReady } from "./helpers";

test.describe("App loads", () => {
  test("shows playground heading", async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    await expect(
      frame.locator('h1:has-text("Host Playground")').first(),
    ).toBeVisible();
  });

  test("shows sidebar categories", async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    await expect(
      frame.getByRole("heading", { name: /Accounts/ }),
    ).toBeVisible();
    await expect(frame.getByRole("heading", { name: /Signing/ })).toBeVisible();
    await expect(
      frame.getByRole("heading", { name: /Chain Interaction/ }),
    ).toBeVisible();
  });

  // With a local `truapi-host` running, its bridge would take the SDK away
  // from the mock host and every other spec would time out.
  test("skips the truapi-host bridge", async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    await expect(frame.locator('script[src*="127.0.0.1:9955"]')).toHaveCount(0);
  });
});
