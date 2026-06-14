import { test, expect } from './fixtures';
import { waitForAppReady, runTest } from './helpers';

test.describe('Signing (extended)', () => {
  test('create transaction for product account', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'create-transaction');
    expect(result).toBe('success');
  });

  test('create transaction with legacy account', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    await testHost.clearSigningLog();

    const result = await runTest(frame, 'create-transaction-legacy');
    expect(result).toBe('success');

    // Signing through the legacy signer routes via signPayloadWithLegacyAccount,
    // which the host records as a 'payload' entry carrying an address-based
    // `signer` field — unlike a product-account payload (an `account` tuple).
    const log = await testHost.getSigningLog();
    const legacy = log.find(e => {
      if (e.type !== 'payload') return false;
      const payload = e.payload as { signer?: unknown } | null;
      return typeof payload?.signer === 'string';
    });
    expect(legacy).toBeTruthy();
  });
});
