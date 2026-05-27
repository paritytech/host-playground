import { test, expect } from './fixtures';
import { waitForAppReady, runTest } from './helpers';

test.describe('Payments', () => {
  test('subscribe to balance', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'payment-balance-subscribe');
    expect(result).toBe('success');
  });
});
