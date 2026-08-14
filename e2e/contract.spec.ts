import { test, expect } from "./fixtures";
import { waitForAppReady, runTest } from "./helpers";

test.describe("Contract reads", () => {
  test("query stored value", async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, "contract-query-stored-value");
    expect(result).toBe("success");
  });

  test("query data length", async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, "contract-query-data-length");
    expect(result).toBe("success");
  });

  test("query contract balance", async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, "contract-query-balance");
    expect(result).toBe("success");
  });

  test("query total deposits", async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, "contract-query-total-deposits");
    expect(result).toBe("success");
  });
});

test.describe("Contract writes", () => {
  test("deposit then withdraw", async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);

    const depositResult = await runTest(frame, "contract-deposit");
    expect(depositResult).toBe("success");

    const withdrawResult = await runTest(frame, "contract-withdraw");
    expect(withdrawResult).toBe("success");
  });

  test("store value", async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    const result = await runTest(frame, "contract-store-value");
    expect(result).toBe("success");
  });
});
