import { test, expect } from './fixtures';
import { waitForAppReady, runTest } from './helpers';

test.describe('Allowance → Usage flows', () => {
  test('statement store: allocate allowance → submit statement', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);

    // 1. Request statement store allowance
    const alloc = await runTest(frame, 'allowances-statement-store');
    expect(alloc).toBe('success');

    // 2. Request StatementSubmit permission (container gates submit behind this)
    const perm = await runTest(frame, 'remote-permission-statement-submit');
    expect(perm).toBe('success');

    // 3. Create proof and submit a statement
    const proof = await runTest(frame, 'statement-store-create-proof');
    expect(proof).toBe('success');

    const submit = await runTest(frame, 'statement-store-submit');
    expect(submit).toBe('success');
  });

  test('preimage: allocate allowance → submit preimage', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);

    // 1. Request bulletin allowance (covers preimage storage)
    const alloc = await runTest(frame, 'allowances-bulletin');
    expect(alloc).toBe('success');

    // 2. Request PreimageSubmit permission (container gates submit behind this)
    const perm = await runTest(frame, 'remote-permission-preimage-submit');
    expect(perm).toBe('success');

    // 3. Submit a preimage
    const submit = await runTest(frame, 'preimage-submit');
    expect(submit).toBe('success');

    // 4. Look it up
    const lookup = await runTest(frame, 'preimage-lookup');
    expect(lookup).toBe('success');
  });

  test('smart contract: allocate allowance → query contract', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);

    // 1. Request smart contract allowance
    const alloc = await runTest(frame, 'allowances-smart-contract');
    expect(alloc).toBe('success');

    // 2. Query a contract (read-only, doesn't need ChainSubmit)
    const query = await runTest(frame, 'contract-query-stored-value');
    expect(query).toBe('success');
  });

  test('full flow: allocate all resources in one request', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);

    // 1. Request all allowances at once
    const alloc = await runTest(frame, 'allowances-all');
    expect(alloc).toBe('success');

    // 2. Verify we can use each capability
    const statementProof = await runTest(frame, 'statement-store-create-proof');
    expect(statementProof).toBe('success');

    const preimageSubmit = await runTest(frame, 'preimage-submit');
    expect(preimageSubmit).toBe('success');
  });
});
