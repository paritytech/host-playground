import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TestContext } from "../types";
import { accountTests } from "./accounts";
import {
  accounts,
  ensureRingVrfKeyHandle,
  PRODUCT_ALIAS_CONTEXT_SUFFIX,
  PRODUCT_ALIAS_RING_LOCATION,
  SELF_DOTNS,
} from "./shared";

vi.mock("./shared", () => ({
  accounts: vi.fn(),
  ensureRingVrfKeyHandle: vi.fn(),
  error: (message: string, details?: unknown) => ({
    success: false,
    message,
    details,
  }),
  PRODUCT_ALIAS_CONTEXT_SUFFIX: { tag: "Index", value: 0 },
  PRODUCT_ALIAS_RING_LOCATION: {
    chainId: "0x01",
    junctions: [{ tag: "PalletInstance", value: 67 }],
  },
  sdkErrorMessage: (value: unknown) => String(value),
  SELF_DOTNS: "host-playground.dot",
  success: (message: string, details?: unknown) => ({
    success: true,
    message,
    details,
  }),
}));

const aliasTest = accountTests.find(
  (test) => test.id === "accounts-provider-alias",
);

if (!aliasTest) {
  throw new Error("accounts-provider-alias flow is missing");
}

const context: TestContext = {
  args: {},
  chain: {} as TestContext["chain"],
  log: vi.fn(),
  navigate: vi.fn(),
};

describe("accounts-provider-alias", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("passes the host-issued ring key handle in the alias request", async () => {
    const handle = { opaque: true };
    const getProductAccountAlias = vi.fn().mockReturnValue({
      match: vi.fn().mockResolvedValue({
        success: true,
        message: "Account alias retrieved",
      }),
    });
    vi.mocked(accounts).mockResolvedValue({
      getProductAccountAlias,
    } as never);
    vi.mocked(ensureRingVrfKeyHandle).mockResolvedValue({
      ok: true,
      handle,
    } as never);

    const result = await aliasTest.run(context);

    expect(result.success).toBe(true);
    expect(ensureRingVrfKeyHandle).toHaveBeenCalledWith(
      expect.anything(),
      PRODUCT_ALIAS_RING_LOCATION,
    );
    expect(getProductAccountAlias).toHaveBeenCalledWith(
      handle,
      {
        productId: SELF_DOTNS,
        suffix: PRODUCT_ALIAS_CONTEXT_SUFFIX,
      },
      PRODUCT_ALIAS_RING_LOCATION,
    );
  });
});
