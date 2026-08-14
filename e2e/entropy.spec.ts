import { test, expect } from "./fixtures";
import { waitForAppReady, runTest } from "./helpers";

test.describe("Entropy", () => {
  test("derive entropy", async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, "derive-entropy");
    expect(result).toBe("success");
  });
});
