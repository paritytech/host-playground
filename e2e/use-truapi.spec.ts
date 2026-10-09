import { test, expect } from "./fixtures";
import { waitForAppReady, runTest } from "./helpers";

const HOOK_TESTS = [
  ["host mode", "truapi-host-mode"],
  ["host info", "truapi-host-info"],
  ["theme", "truapi-theme"],
  ["locale", "truapi-locale"],
  ["connect accounts", "truapi-accounts"],
  ["chain spec", "truapi-chain-spec"],
  ["block number", "truapi-block-number"],
  ["balance", "truapi-balance"],
  ["sign raw", "truapi-sign-raw"],
  ["host storage", "truapi-host-storage"],
  ["derive entropy", "truapi-entropy"],
] as const;

test.describe("use-truapi hook works", () => {
  for (const [name, testId] of HOOK_TESTS) {
    test(name, async ({ testHost }) => {
      // Given
      const frame = await waitForAppReady(testHost);

      // When
      const result = await runTest(frame, testId);

      // Then
      expect(result).toBe("success");
    });
  }
});
