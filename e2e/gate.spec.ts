import {
  test,
  expect,
  BOUND_PRODUCT_ID,
  FOREIGN_PRODUCT_ID,
} from "./gate-fixtures";
import { waitForAppReady, runTestWithArgs } from "./helpers";

// A product may only sign for the identifier it is bound under. Getting this
// wrong is silent: every signing card fails with PermissionDenied and the
// signing log stays empty, which reads like broken signing rather than a
// mismatched identifier.
test.describe("Product account gate works", () => {
  test("signs for the bound identifier", async ({ testHost }) => {
    // Given
    const frame = await waitForAppReady(testHost);

    // When
    const result = await runTestWithArgs(frame, "create-transaction", {
      dotNsIdentifier: BOUND_PRODUCT_ID,
    });

    // Then
    expect(result).toBe("success");
    expect((await testHost.getSigningLog()).map((e) => e.type)).toContain(
      "createTransaction",
    );
  });
});

test.describe("Product account gate fails", () => {
  test("refuses another product identifier", async ({ testHost }) => {
    // Given
    const frame = await waitForAppReady(testHost);

    // When
    const result = await runTestWithArgs(frame, "create-transaction", {
      dotNsIdentifier: FOREIGN_PRODUCT_ID,
    });

    // Then
    expect(result).toBe("error");
    expect(await testHost.getSigningLog()).toHaveLength(0);
  });
});
