import { test, expect } from './fixtures';
import { waitForAppReady, runTest } from './helpers';

test.describe('Statement Store', () => {
  test('create proof', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'statement-store-create-proof');
    expect(result).toBe('success');
  });

  test('submit statement', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'statement-store-submit');
    expect(result).toBe('success');
  });

  test('subscribe with matchAll filter', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'statement-store-subscribe-match-all');
    expect(result).toBe('success');
  });

  test('subscribe with matchAny filter', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'statement-store-subscribe-match-any');
    expect(result).toBe('success');
  });
});
