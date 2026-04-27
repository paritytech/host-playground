import { test, expect } from './fixtures';
import { waitForAppReady, runTest } from './helpers';

test.describe('Permissions', () => {
  test('feature check', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'feature-check');
    expect(result).toBe('success');
  });

  test('request chain submit permission', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'remote-permission-chain-submit');
    expect(result).toBe('success');

    const log = await testHost.getPermissionLog();
    expect(log.some(e => e.tag === 'ChainSubmit')).toBe(true);
  });
});
