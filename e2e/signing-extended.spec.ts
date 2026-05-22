import { test, expect } from './fixtures';
import { waitForAppReady, runTest } from './helpers';

test.describe('Signing (extended)', () => {
  test('create transaction for product account', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'create-transaction');
    expect(result).toBe('success');
  });
});
