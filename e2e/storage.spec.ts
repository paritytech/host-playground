import { test, expect } from './fixtures';
import { waitForAppReady, runTest } from './helpers';

test.describe('Storage', () => {
  test('write and read string', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'String Write & Read');
    expect(result).toBe('success');
  });

  test('clear storage', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'Storage Clear');
    expect(result).toBe('success');
  });
});
