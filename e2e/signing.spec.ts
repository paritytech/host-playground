import { test, expect } from './fixtures';
import { waitForAppReady, runTest } from './helpers';

test.describe('Signing', () => {
  test('sign raw message', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'Sign Raw Message');
    expect(result).toBe('success');

    const log = await testHost.getSigningLog();
    expect(log.some(e => e.type === 'raw')).toBe(true);
  });
});
