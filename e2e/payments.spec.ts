import { test, expect } from "./fixtures";
import { waitForAppReady, runTest } from "./helpers";

test.describe("Payments", () => {
  // No host implements RFC-0006 yet, so the core's payment capability errors
  // on every method and this card cannot succeed under any test host.
  test.skip("subscribe to balance", async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, "payment-balance-subscribe");
    expect(result).toBe("success");
  });
});
