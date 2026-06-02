import { test, expect } from './fixtures';
import { waitForAppReady, runTest, runTestWithArgs } from './helpers';

test.describe('Notifications', () => {
  test('immediate push', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);

    const result = await runTest(frame, 'push-notification');
    expect(result).toBe('success');

    const log = await testHost.getNotificationLog();
    expect(log.length).toBeGreaterThan(0);
    const entry = log[log.length - 1];
    expect(entry.text).toBe('Hello from demo product!');
    // Empty "Schedule in" → immediate delivery, no scheduledAt.
    expect(entry.scheduledAt).toBeUndefined();
  });

  test('scheduled push', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);

    const result = await runTestWithArgs(frame, 'push-notification', {
      scheduleInSeconds: '3600',
    });
    expect(result).toBe('success');

    const log = await testHost.getNotificationLog();
    const entry = log[log.length - 1];
    // A future schedule arrives as an epoch-ms bigint.
    expect(typeof entry.scheduledAt).toBe('bigint');
    expect(entry.scheduledAt).toBeGreaterThan(BigInt(Date.now()));
  });

  test('cancel', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);

    // 1. Schedule a notification far in the future
    const scheduled = await runTestWithArgs(frame, 'push-notification', {
      scheduleInSeconds: '3600',
    });
    expect(scheduled).toBe('success');

    // 2. Read the host-assigned id from the log
    const afterSchedule = await testHost.getNotificationLog();
    const entry = afterSchedule[afterSchedule.length - 1];
    expect(entry.cancelled).toBe(false);

    // 3. Cancel it by id
    const result = await runTestWithArgs(frame, 'cancel-notification', {
      id: String(entry.id),
    });
    expect(result).toBe('success');

    // 4. Verify the host marked the entry cancelled
    const afterCancel = await testHost.getNotificationLog();
    expect(afterCancel.find((e) => e.id === entry.id)?.cancelled).toBe(true);
  });
});
