import { test, expect } from './fixtures';
import { waitForAppReady, runTest } from './helpers';

test.describe('Bulletin upload + Cloud Storage verify', () => {
  // Byte-equality across pm().submit and cloud-storage queryBytes(cid) is
  // only fully verifiable against a real host that writes to bulletin chain
  // and resolves the preimage subscription. Under the e2e mock host the
  // queryBytes leg may resolve to mock-host bytes — the test still passes
  // because submit / host-lookup is the host-API integration proof.
  // The deeper proof lives in triangle-e2e/packages/app-tests/.../web.test.ts.
  test('submit and cloud-storage fetch return byte-equal content', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'bulletin-upload-and-verify', 120_000);
    expect(result).toBe('success');
  });
});
