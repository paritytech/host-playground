import { test, expect } from './fixtures';
import { waitForAppReady, runTest } from './helpers';

test.describe('Preimage', () => {
  test('submit preimage', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'preimage-submit');
    expect(result).toBe('success');
  });

  test('lookup preimage', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    // Submit first so there's something to look up
    await runTest(frame, 'preimage-submit');
    const result = await runTest(frame, 'preimage-lookup');
    expect(result).toBe('success');
  });
});
