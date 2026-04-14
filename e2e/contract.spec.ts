import { test, expect } from './fixtures';
import { waitForAppReady, runTest } from './helpers';

test.describe('Contract', () => {
  test('query stored value', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'contract-query-stored-value');
    expect(result).toBe('success');
  });

  test('query data length', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'contract-query-data-length');
    expect(result).toBe('success');
  });

  test('query contract balance', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'contract-query-balance');
    expect(result).toBe('success');
  });

  test('query total deposits', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'contract-query-total-deposits');
    expect(result).toBe('success');
  });
});
