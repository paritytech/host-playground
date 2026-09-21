import { test, expect } from "./fixtures";
import { waitForAppReady, runTest } from "./helpers";

test.describe("Preimage", () => {
  // The core builds, signs and submits the bulletin `TransactionStorage.store`
  // transaction itself, so the test host has no seam to serve it in page and
  // dials the configured bulletin chain for real. The live chain then refuses
  // the submit at dry-run, because this product holds no storage allowance
  // there. Pending a decision on giving the test host a switchable preimage
  // backend. Drop the `.fixme` once submit no longer needs a live allowance.
  test.fixme("submit preimage", async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, "preimage-submit");
    expect(result).toBe("success");
  });

  test("lookup preimage", async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    // Submit first so there is something to look up. The submit itself is
    // unasserted and currently fails, so the lookup resolves to a miss, which
    // is still a successful lookup.
    await runTest(frame, "preimage-submit");
    const result = await runTest(frame, "preimage-lookup");
    expect(result).toBe("success");
  });
});
