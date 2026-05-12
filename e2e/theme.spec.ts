import { test, expect } from './fixtures';
import { waitForAppReady, runTest } from './helpers';

test.describe('Theme', () => {
  test('subscribe to theme changes', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'theme-subscribe');
    expect(result).toBe('success');
  });
});
