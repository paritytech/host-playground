import { test, expect } from "./fixtures";
import { waitForAppReady, runTest } from "./helpers";

test.describe("Storage", () => {
  test("write and read string", async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, "storage-string-write-read");
    expect(result).toBe("success");
  });

  test("clear storage", async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, "storage-clear");
    expect(result).toBe("success");
  });
});
