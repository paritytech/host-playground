import { test, expect } from './fixtures';
import { waitForAppReady, runTest } from './helpers';

test.describe('Navigation', () => {
  test('navigate to HTTP URL', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'Navigate to HTTP URL');
    expect(result).toBe('success');

    const log = await testHost.getNavigationLog();
    expect(log.length).toBeGreaterThan(0);
  });
});
