import { test, expect } from "./fixtures";
import { waitForAppReady, runTest } from "./helpers";

test.describe("Auth", () => {
  test("request login", async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, "request-login");
    expect(result).toBe("success");
  });

  test("get user identity", async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    // The test host activates the session at boot, so it is already
    // authenticated and getUserId needs no prior step.
    const result = await runTest(frame, "get-user-id");
    expect(result).toBe("success");
  });
});
