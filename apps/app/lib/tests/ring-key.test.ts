import { beforeEach, describe, expect, it, vi } from "vitest";
import { findRingVrfKeyHandle } from "@parity/product-sdk/host";
import {
  findRegisteredRingVrfKeyHandle,
  PRODUCT_ALIAS_RING_LOCATION,
  PRODUCT_ALIAS_RING_OWNER,
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

describe("findRegisteredRingVrfKeyHandle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the host-issued handle registered by the owner", async () => {
    const handle = { opaque: true };
    vi.mocked(findRingVrfKeyHandle).mockReturnValue(handle as never);
    const provider = {
      listRingVrfKeys: vi.fn(() => ok([])),
      registerRingVrfKey: vi.fn(),
    };

    const result = await findRegisteredRingVrfKeyHandle(
      provider as never,
      PRODUCT_ALIAS_RING_OWNER,
      PRODUCT_ALIAS_RING_LOCATION,
    );

    expect(result).toEqual({ ok: true, handle });
    expect(provider.listRingVrfKeys).toHaveBeenCalledOnce();
    expect(provider.listRingVrfKeys).toHaveBeenCalledWith(
      PRODUCT_ALIAS_RING_OWNER,
    );
    expect(provider.registerRingVrfKey).not.toHaveBeenCalled();
  });

  it("does not register a product-owned replacement when the key is missing", async () => {
    vi.mocked(findRingVrfKeyHandle).mockReturnValue(undefined);
    const provider = {
      listRingVrfKeys: vi.fn(() => ok([])),
      registerRingVrfKey: vi.fn(),
    };

    const result = await findRegisteredRingVrfKeyHandle(
      provider as never,
      PRODUCT_ALIAS_RING_OWNER,
      PRODUCT_ALIAS_RING_LOCATION,
    );

    expect(result).toMatchObject({
      ok: false,
      result: {
        message: `No ${PRODUCT_ALIAS_RING_OWNER} key is registered for the People Lite ring`,
        outcome: "precondition-missing",
      },
    });
    expect(provider.listRingVrfKeys).toHaveBeenCalledWith(
      PRODUCT_ALIAS_RING_OWNER,
    );
    expect(provider.registerRingVrfKey).not.toHaveBeenCalled();
  });
});
