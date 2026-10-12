import { test, expect } from "./fixtures";
import { waitForAppReady, runTest } from "./helpers";

// Matches the allocation cards' own 120s timeout, with room to report.
const ALLOCATION_WAIT_MS = 150_000;

test.describe("Allowance then usage flows", () => {
  // The allocation cards wait on the host either way, and the usage half
  // reads from live Paseo, so give these room.
  test.slow();

  test("statement store: allocate allowance, submit statement", async ({
    testHost,
  }) => {
    const frame = await waitForAppReady(testHost);

    const alloc = await runTest(
      frame,
      "allowances-statement-store",
      ALLOCATION_WAIT_MS,
    );
    expect(alloc).toBe("success");

    // The container gates submit behind this permission.
    const perm = await runTest(frame, "remote-permission-statement-submit");
    expect(perm).toBe("success");

    const proof = await runTest(frame, "statement-store-create-proof");
    expect(proof).toBe("success");

    const submit = await runTest(frame, "statement-store-submit");
    expect(submit).toBe("success");
  });

  test("preimage: allocate allowance, submit preimage", async ({
    testHost,
  }) => {
    const frame = await waitForAppReady(testHost);

    // The bulletin allowance is the one that covers preimage storage.
    const alloc = await runTest(
      frame,
      "allowances-bulletin",
      ALLOCATION_WAIT_MS,
    );
    expect(alloc).toBe("success");

    // The container gates submit behind this permission.
    const perm = await runTest(frame, "remote-permission-preimage-submit");
    expect(perm).toBe("success");

    const submit = await runTest(frame, "preimage-submit");
    expect(submit).toBe("success");

    const lookup = await runTest(frame, "preimage-lookup");
    expect(lookup).toBe("success");
  });

  test("smart contract: allocate allowance, query contract", async ({
    testHost,
  }) => {
    const frame = await waitForAppReady(testHost);

    const alloc = await runTest(
      frame,
      "allowances-smart-contract",
      ALLOCATION_WAIT_MS,
    );
    expect(alloc).toBe("success");

    // A read needs no ChainSubmit permission, so the allowance is enough.
    const query = await runTest(frame, "contract-query-stored-value");
    expect(query).toBe("success");
  });

  test("full flow: allocate all resources in one request", async ({
    testHost,
  }) => {
    const frame = await waitForAppReady(testHost);

    const alloc = await runTest(frame, "allowances-all", ALLOCATION_WAIT_MS);
    expect(alloc).toBe("success");

    const statementProof = await runTest(frame, "statement-store-create-proof");
    expect(statementProof).toBe("success");

    const preimageSubmit = await runTest(frame, "preimage-submit");
    expect(preimageSubmit).toBe("success");
  });
});
