import { test, expect } from './fixtures';
import { waitForAppReady, runTest } from './helpers';

test.describe('Device Permissions', () => {
  test('camera', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'device-permission-camera');
    expect(result).toBe('success');
  });

  test('microphone', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'device-permission-microphone');
    expect(result).toBe('success');
  });

  test('location', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'device-permission-location');
    expect(result).toBe('success');
  });

  test('bluetooth', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'device-permission-bluetooth');
    expect(result).toBe('success');
  });

  test('notifications', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'device-permission-notifications');
    expect(result).toBe('success');
  });
});
