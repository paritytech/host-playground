import { test, expect } from './fixtures';
import { waitForAppReady, runTest } from './helpers';

test.describe('Accounts', () => {
  test('get product account', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'accounts-provider-product');
    expect(result).toBe('success');
  });

  test('connection status', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'accounts-provider-connection-status');
    expect(result).toBe('success');
  });
});
