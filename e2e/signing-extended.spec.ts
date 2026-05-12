import { test, expect } from './fixtures';
import { waitForAppReady, runTest } from './helpers';

test.describe('Signing (extended)', () => {
  test('sign raw with legacy account', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'sign-raw-legacy');
    expect(result).toBe('success');
  });

  test('create transaction for product account', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'create-transaction');
    expect(result).toBe('success');
  });

  test('create transaction for legacy account', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'create-transaction-legacy');
    expect(result).toBe('success');
  });
});
