import { test, expect } from './fixtures';
import { waitForAppReady, runTest } from './helpers';

test.describe('Remote Permissions', () => {
  test('remote (HTTP/WS)', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'remote-permission-remote');
    expect(result).toBe('success');
  });

  test('preimage submit', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'remote-permission-preimage-submit');
    expect(result).toBe('success');
  });

  test('statement submit', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'remote-permission-statement-submit');
    expect(result).toBe('success');
  });
});
