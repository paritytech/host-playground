/**
 * Fixture for the product-account gate, bound under a deployed-style DotNS
 * identifier rather than the local host:port the rest of the suite uses.
 *
 * The core stops checking which identifier a call names as soon as the product
 * is a 'localhost:' one, so [fixtures.ts](./fixtures.ts) cannot reach the
 * refusal path at all. Binding the product under a `.dot` identifier is what
 * turns the check back on.
 */
import { test as base, expect } from "@playwright/test";
import {
  createTestHostFixture,
  PASEO_ASSET_HUB,
  type TestHost,
} from "@parity/host-api-test-sdk/playwright";
import { NETWORKS } from "../apps/app/lib/types";

export const BOUND_PRODUCT_ID = "host-playground.dot";
export const FOREIGN_PRODUCT_ID = "someone-else.dot";

const PASEO = {
  ...PASEO_ASSET_HUB,
  genesisHash: NETWORKS.PASEO_ASSETHUBNEXTV2.genesis,
  rpcUrl: NETWORKS.PASEO_ASSETHUBNEXTV2.wsUrl,
};

export const test = base.extend<{ testHost: TestHost }>(
  createTestHostFixture({
    productUrl: "http://localhost:5199",
    accounts: ["bob"],
    networks: [PASEO],
    productId: BOUND_PRODUCT_ID,
    productAccounts: { [BOUND_PRODUCT_ID]: "bob" },
  }),
);
export { expect };
