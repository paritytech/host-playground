import { test, expect } from './fixtures';
import { waitForAppReady, runTest } from './helpers';

test.describe('Chain Interaction', () => {
  test('query account balance', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'Query Balance');
    expect(result).toBe('success');
  });

  test('query stored value', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'Query Stored Value');
    expect(result).toBe('success');
  });

  test('query stored data length', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'Query Stored Data Length');
    expect(result).toBe('success');
  });

  test('query contract balance', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'Query Contract Balance');
    expect(result).toBe('success');
  });

  test('query total deposits', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'Query Total Deposits');
    expect(result).toBe('success');
  });
});
