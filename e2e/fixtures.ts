/**
 * Playwright fixture that embeds the app in the test host from
 * `@parity/truapi-host/testing`.
 *
 * The host runs the TrUAPI core itself, so the product reaches it over the
 * MessagePort that `@parity/truapi/sandbox` handshakes for. The app gets that
 * transport from `@parity/product-sdk-host`, which pins the same truapi 0.20
 * minor as `@parity/truapi-host`. The two must agree: a mismatch fails every
 * call with `MalformedFrame`.
 */
import { test as base, expect } from "@playwright/test";
import {
  createTestHostFixture,
  PASEO_ASSET_HUB,
  type TestHost,
} from "@parity/truapi-host/testing/playwright";
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
};

// The statement store lives on the People chain, and the host serves it in-page
// (`loopbackStatements`) only for a network whose id ends in `-people`. Without
// this entry a statement submit is never answered and the card times out.
const PASEO_PEOPLE = {
  id: "paseo-people",
  name: "Paseo People",
  genesisHash: NETWORKS.PASEO_ASSETHUBNEXTV2.peopleGenesis,
  rpcUrl: NETWORKS.PASEO_ASSETHUBNEXTV2.peopleWsUrl,
  tokenSymbol: PASEO_ASSET_HUB.tokenSymbol,
  tokenDecimals: PASEO_ASSET_HUB.tokenDecimals,
};

const bobFixture = createTestHostFixture({
  productUrl: PRODUCT_URL,
  accounts: ["bob"],
  networks: [PASEO, PASEO_BULLETIN, PASEO_PEOPLE],
  // Must match what the app derives, or the core refuses every product-account
  // call with PermissionDenied. `getSelfDotNs` maps a local URL to its
  // host:port, which is what the desktop binds a local product under, so under
  // Playwright the app calls itself 'localhost:5199'.
  //
  // The core treats a 'localhost:' id as a dev caller and stops checking the
  // identifier a call names. See gate.spec.ts, which pins the strict path this
  // therefore cannot cover.
  //
  // The product account is derived from (bob's session root, this id), so it
  // is not the well-known //Bob and starts empty on both chains.
  productId: PRODUCT_ID,
});

export const test = base.extend<{ testHost: TestHost }>(bobFixture);
export { expect };
