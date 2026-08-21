import { beforeEach, describe, expect, it, vi } from "vitest";
import type * as HostSdk from "@parity/product-sdk/host";

const requestResourceAllocation = vi.hoisted(() => vi.fn());

vi.mock("@parity/product-sdk/host", async (importOriginal) => ({
  ...(await importOriginal<typeof HostSdk>()),
  requestResourceAllocation,
}));

import { PASEO_NEXT_INDIVIDUALITY, runResourceAllocation } from "./shared";

const smartContract = {
  tag: "SmartContractAllowance" as const,
  value: { tag: "Index" as const, value: 0 },
};

describe("People chain descriptor", () => {
  it("binds Paseo Next to the current People chain genesis", () => {
    expect(PASEO_NEXT_INDIVIDUALITY.genesis).toBe(
      "0x89a63b11fef2c0273fc72c0d864da0793a665dade5db153e0cab995348c5440f",
    );
  });
});

describe("resource allocation outcomes", () => {
  beforeEach(() => {
    requestResourceAllocation.mockReset();
  });

  it("reports Allocated as supported", async () => {
    requestResourceAllocation.mockResolvedValue({
      ok: true,
      value: ["Allocated"],
    });

    await expect(runResourceAllocation([smartContract])).resolves.toMatchObject(
      {
        success: true,
        outcome: "supported",
      },
    );
  });

  it("does not report NotAvailable as success", async () => {
    requestResourceAllocation.mockResolvedValue({
      ok: true,
      value: ["NotAvailable"],
    });

    await expect(runResourceAllocation([smartContract])).resolves.toMatchObject(
      {
        success: false,
        outcome: "unavailable",
      },
    );
  });

  it("classifies explicit rejection separately", async () => {
    requestResourceAllocation.mockResolvedValue({
      ok: true,
      value: ["Rejected"],
    });

    await expect(runResourceAllocation([smartContract])).resolves.toMatchObject(
      {
        success: false,
        outcome: "permission-denied",
      },
    );
  });
});
