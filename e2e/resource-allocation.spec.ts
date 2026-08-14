import { test, expect } from "./fixtures";
import { waitForAppReady, runTest } from "./helpers";

test.describe("Resource Allocation", () => {
  test("allocate statement store allowance", async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, "allowances-statement-store");
    expect(result).toBe("success");
  });

  test("allocate bulletin allowance", async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, "allowances-bulletin");
    expect(result).toBe("success");
  });

  test("allocate smart-contract allowance", async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, "allowances-smart-contract");
    expect(result).toBe("success");
  });

  test("allocate all resources in one request", async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, "allowances-all");
    expect(result).toBe("success");
  });
});
