import { test, expect } from './fixtures';
import { waitForAppReady, runTest } from './helpers';

test.describe('Permissions', () => {
  test('feature check', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'Feature Check');
    expect(result).toBe('success');
  });

  test('request transaction submit permission', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'Remote Permission: Transaction Submit');
    expect(result).toBe('success');

    const log = await testHost.getPermissionLog();
    expect(log.some(e => e.tag === 'TransactionSubmit')).toBe(true);
  });
});
