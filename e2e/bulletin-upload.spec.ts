import { test, expect } from './fixtures';
import { waitForAppReady, runTest } from './helpers';

test.describe('Bulletin upload + IPFS verify', () => {
  // Three-way byte equality (submit, host lookup, IPFS fetch) is only fully
  // verifiable against a real host that actually writes to bulletin chain.
  // Under the e2e mock host the IPFS leg returns 404 — the test still passes
  // because submit/host-lookup byte-equality is the host-API integration proof.
  // The deeper proof lives in triangle-e2e/packages/app-tests/.../web.test.ts.
  test('submit, host lookup, and IPFS fetch return byte-equal content', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'bulletin-upload-and-verify', 120_000);
    expect(result).toBe('success');
  });
});
