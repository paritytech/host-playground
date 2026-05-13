import { test, expect } from './fixtures';
import { waitForAppReady, runTest } from './helpers';

test.describe('SS58 derivation', () => {
  test('derive root account SS58 address', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'accounts-derive-ss58-root');
    expect(result).toBe('success');
  });

  test('derive product account SS58 address', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'accounts-derive-ss58-product');
    expect(result).toBe('success');
  });
});
