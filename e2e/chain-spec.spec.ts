import { test, expect } from './fixtures';
import { waitForAppReady, runTest } from './helpers';

test.describe('Chain Spec', () => {
  test('genesis hash', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'chain-spec-genesis-hash');
    expect(result).toBe('success');
  });

  test('chain name', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'chain-spec-chain-name');
    expect(result).toBe('success');
  });

  test('chain properties', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'chain-spec-properties');
    expect(result).toBe('success');
  });
});
