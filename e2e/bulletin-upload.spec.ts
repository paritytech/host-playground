import { test, expect } from "./fixtures";
import { waitForAppReady, runTest } from "./helpers";

test.describe("Bulletin upload + fetch by CID", () => {
  // The test uploads via the host's preimage submit, derives the canonical
  // CID, and fetches it back BY CID through the host's preimage lookup — no
  // public IPFS gateway. Under the e2e mock host this passes because the mock
  // keys preimages by blake2b-256, which is exactly what calculateCid +
  // cidToPreimageKey derive, so the lookup key matches the submit key. The
  // deeper proof against a real bulletin chain lives in
  // triangle-e2e/packages/app-tests/.../web.test.ts.
  test("submit and fetch-by-CID return byte-equal content", async ({
    testHost,
  }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, "bulletin-upload-and-verify", 120_000);
    expect(result).toBe("success");
  });
});
