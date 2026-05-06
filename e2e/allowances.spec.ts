import { test, expect } from './fixtures';
import { waitForAppReady, runTest } from './helpers';

// `@parity/host-api-test-sdk` 0.7.2 (currently installed) does not implement
// `host_request_resource_allocation` from RFC-0010. Calls to
// `hostApi.requestResourceAllocation` therefore hang. Re-enable these tests
// once the test host SDK ships an RFC-0010 handler.
const RFC_0010_TEST_HOST_READY = false;

test.describe('Allowances', () => {
  test.skip(
    !RFC_0010_TEST_HOST_READY,
    'host-api-test-sdk does not yet implement host_request_resource_allocation',
  );

  test('allocate statement store allowance', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'resource-allocation-statement-store');
    expect(result).toBe('success');
  });

  test('allocate bulletin allowance', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'resource-allocation-bulletin');
    expect(result).toBe('success');
  });

  test('allocate smart-contract allowance', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'resource-allocation-smart-contract');
    expect(result).toBe('success');
  });

  test('allocate auto-signing', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'resource-allocation-auto-signing');
    expect(result).toBe('success');
  });

  test('allocate all resources in one request', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, 'resource-allocation-all');
    expect(result).toBe('success');
  });
});
