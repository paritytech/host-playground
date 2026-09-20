/**
 * Playwright fixture that embeds the app in the test host from
 * `@parity/host-api-test-sdk`.
 *
 * The host runs the TrUAPI core itself since 0.13, so the product reaches it
 * over the MessagePort that `@parity/truapi/sandbox` handshakes for. The app
 * gets that transport from `@parity/product-sdk-host`, which pins the same
 * truapi 0.17 minor, so nothing here has to arrange the connection.
 */
import { test as base, expect } from "@playwright/test";
import {
  createTestHostFixture,
  PASEO_ASSET_HUB,
  type TestHost,
} from "@parity/host-api-test-sdk/playwright";
import { NETWORKS } from "../apps/app/lib/types";

const PRODUCT_URL = "http://localhost:5199";
const PRODUCT_ID = "localhost:5199";

const PASEO = {
  ...PASEO_ASSET_HUB,
  genesisHash: NETWORKS.PASEO_ASSETHUBNEXTV2.genesis,
  rpcUrl: NETWORKS.PASEO_ASSETHUBNEXTV2.wsUrl,
};

// The host routes a chain call by genesis hash and answers `supportedChains()`
// from this list, so a role the product reaches for has to be registered here.
// Preimage submit and lookup travel over the bulletin chain. Without this entry
// the host refuses them with "no chain configured for genesis 0x00..00".
const PASEO_BULLETIN = {
  id: "paseo-bulletin",
  name: "Paseo Bulletin",
  genesisHash: NETWORKS.PASEO_ASSETHUBNEXTV2.bulletinGenesis,
  rpcUrl: NETWORKS.PASEO_ASSETHUBNEXTV2.bulletinWsUrl,
  tokenSymbol: PASEO_ASSET_HUB.tokenSymbol,
  tokenDecimals: PASEO_ASSET_HUB.tokenDecimals,
  chain: "Bulletin" as const,
};

const bobFixture = createTestHostFixture({
  productUrl: PRODUCT_URL,
  accounts: ["bob"],
  networks: [PASEO, PASEO_BULLETIN],
  // Must match what the app derives, or the core refuses every product-account
  // call with PermissionDenied. `getSelfDotNs` maps a local URL to its
  // host:port, which is what the desktop binds a local product under, so under
  // Playwright the app calls itself 'localhost:5199'.
  //
  // The core treats a 'localhost:' id as a dev caller and stops checking the
  // identifier a call names. See gate.spec.ts, which pins the strict path this
  // therefore cannot cover.
  productId: PRODUCT_ID,
  // Keyed by the identifier a call names, which is the one above. The entry
  // replaces the whole product subtree, so it moves every indexed account.
  productAccounts: {
    [PRODUCT_ID]: "bob",
  },
});

export const test = base.extend<{ testHost: TestHost }>(bobFixture);
export { expect };
