import { test, expect } from "./fixtures";
import { waitForAppReady, runTest } from "./helpers";

test.describe("Chain Interaction", () => {
  test("query account balance", async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, "chain-query-balance");
    expect(result).toBe("success");
  });
});
