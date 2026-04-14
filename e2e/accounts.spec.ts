import { test, expect } from './fixtures';
import { waitForAppReady, runTest } from './helpers';

test.describe('Accounts', () => {
  test('get non-product accounts', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'Non-Product Accounts');
    expect(result).toBe('success');
  });

  test('get product account', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'Get Product Account');
    expect(result).toBe('success');
  });

  test('connection status', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'Account Connection Status');
    expect(result).toBe('success');
  });
});
