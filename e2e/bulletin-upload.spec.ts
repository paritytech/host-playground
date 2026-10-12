import { test, expect } from "./fixtures";
import { waitForAppReady, runTest } from "./helpers";

test.describe("Bulletin upload and fetch by CID", () => {
  // The test uploads through the host preimage submit, derives the canonical
  // CID, and fetches the content back by that CID through the host preimage
  // lookup. No public IPFS gateway is involved. Under the e2e mock host this
  // passes because the mock keys preimages by blake2b-256, which is what
  // calculateCid and cidToPreimageKey derive between them, so the lookup key
  // matches the submit key. The deeper proof against a real bulletin chain
  // lives in triangle-e2e/packages/app-tests/.../web.test.ts.
  test("submit and fetch-by-CID return byte-equal content", async ({
    testHost,
  }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, "bulletin-upload-and-verify", 120_000);
    expect(result).toBe("success");
  });
});
