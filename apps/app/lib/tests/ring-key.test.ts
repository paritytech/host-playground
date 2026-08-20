import { beforeEach, describe, expect, it, vi } from "vitest";
import { findRingVrfKeyHandle } from "@parity/product-sdk/host";
import {
  ensureRingVrfKeyHandle,
  PRODUCT_ALIAS_RING_LOCATION,
  SELF_DOTNS,
} from "./shared";

vi.mock("@parity/product-sdk/host", () => ({
  findRingVrfKeyHandle: vi.fn(),
  formatHostError: vi.fn(String),
  getAccountsProvider: vi.fn(),
  getHostLocalStorage: vi.fn(),
  getHostProvider: vi.fn(),
  getPreimageManager: vi.fn(),
  getStatementStore: vi.fn(),
  getThemeProvider: vi.fn(),
  isChainSupported: vi.fn(),
  requestDevicePermission: vi.fn(),
  requestPermission: vi.fn(),
  requestResourceAllocation: vi.fn(),
}));

function ok<T>(value: T) {
  return {
    match: vi.fn((success: (result: T) => unknown) => success(value)),
  };
}

describe("ensureRingVrfKeyHandle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registers index zero and returns the host-issued handle", async () => {
    const handle = { opaque: true };
    vi.mocked(findRingVrfKeyHandle)
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce(handle as never);
    const provider = {
      listRingVrfKeys: vi.fn(() => ok([])),
      registerRingVrfKey: vi.fn(() => ok(undefined)),
    };

    const result = await ensureRingVrfKeyHandle(
      provider as never,
      PRODUCT_ALIAS_RING_LOCATION,
    );

    expect(result).toEqual({ ok: true, handle });
    expect(provider.listRingVrfKeys).toHaveBeenCalledTimes(2);
    expect(provider.listRingVrfKeys).toHaveBeenCalledWith(SELF_DOTNS);
    expect(provider.registerRingVrfKey).toHaveBeenCalledWith(
      0,
      PRODUCT_ALIAS_RING_LOCATION,
    );
  });

  it("does not register when the host already exposes a matching handle", async () => {
    const handle = { opaque: true };
    vi.mocked(findRingVrfKeyHandle).mockReturnValue(handle as never);
    const provider = {
      listRingVrfKeys: vi.fn(() => ok([])),
      registerRingVrfKey: vi.fn(),
    };

    const result = await ensureRingVrfKeyHandle(
      provider as never,
      PRODUCT_ALIAS_RING_LOCATION,
    );

    expect(result).toEqual({ ok: true, handle });
    expect(provider.registerRingVrfKey).not.toHaveBeenCalled();
  });
});
