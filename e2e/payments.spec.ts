import { test, expect } from './fixtures';
import { waitForAppReady, runTest } from './helpers';

test.describe('Payments', () => {
  test('subscribe to balance', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'payment-balance-subscribe');
    expect(result).toBe('success');
  });

  test('top up balance', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'payment-top-up');
    expect(result).toBe('success');
  });

  test('request payment', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    // Top up first so there's balance to pay from
    await runTest(frame, 'payment-top-up');
    const result = await runTest(frame, 'payment-request');
    expect(result).toBe('success');
  });
});
