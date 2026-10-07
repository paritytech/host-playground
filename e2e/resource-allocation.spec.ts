import { test, expect, SKIP_REASON } from "./person-fixtures";
import { waitForAppReady, runTest } from "./helpers";

// Matches the allocation cards' own 120s timeout, with room to report.
const ALLOCATION_WAIT_MS = 150_000;

test.describe("Resource Allocation", () => {
  test.skip(!!SKIP_REASON, SKIP_REASON);
  // Under E2E_ALLOCATIONS=chain each allocation is a real claim on People.
  test.slow();

  test("allocate statement store allowance", async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(
      frame,
      "allowances-statement-store",
      ALLOCATION_WAIT_MS,
    );
    expect(result).toBe("success");
  });

  test("allocate bulletin allowance", async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(
      frame,
      "allowances-bulletin",
      ALLOCATION_WAIT_MS,
    );
    expect(result).toBe("success");
  });

  test("allocate smart-contract allowance", async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(
      frame,
      "allowances-smart-contract",
      ALLOCATION_WAIT_MS,
    );
    expect(result).toBe("success");
  });

  test("allocate all resources in one request", async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, "allowances-all", ALLOCATION_WAIT_MS);
    expect(result).toBe("success");
  });
});
