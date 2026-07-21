import { test as base, expect } from '@playwright/test';
import {
  createTestHostFixture,
  PASEO_ASSET_HUB,
  type TestHost,
} from '@parity/host-api-test-sdk/playwright';

const PRODUCT_URL = 'http://localhost:5199';

/**
 * host-api-test-sdk 0.11 exposes both its legacy window transport and its
 * modern MessagePort transport. TrUAPI 0.5.1 intentionally accepts the first
 * valid transport it sees, so the host's eager legacy handshake probe can win
 * the race with `truapi-init`: requests then leave over window.postMessage,
 * while the dual-stack host replies over the newly-created MessagePort.
 *
 * This fixture is explicitly testing the modern mock-host path. Ignore legacy
 * wire frames until the capability port has been transferred so both peers
 * select the same transport. The bootstrap messages themselves are objects and
 * continue through unchanged.
 */
const modernTransportTest = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      window.addEventListener(
        'message',
        (event) => {
          const hostWindow = window.parent;
          const injectedPort = (
            window as Window & { __HOST_API_PORT__?: MessagePort }
          ).__HOST_API_PORT__;

          if (
            window !== hostWindow &&
            event.source === hostWindow &&
            event.data instanceof Uint8Array &&
            !injectedPort
          ) {
            event.stopImmediatePropagation();
          }
        },
        true,
      );
    });

    await use(page);
  },
});

const bobFixture = createTestHostFixture({
  productUrl: PRODUCT_URL,
  accounts: ['bob'],
  networks: [PASEO_ASSET_HUB],
  // App derives its DotNS identifier from window.location.host, so under
  // Playwright that's 'localhost:5199'. Map both to bob so the same Bob
  // signer is used whether the app is opened under the local host or a
  // canonical .dot identifier.
  productAccounts: {
    'host-playground.dot/0': 'bob',
    'localhost:5199/0': 'bob',
  },
});

export const test = modernTransportTest.extend<{ testHost: TestHost }>(bobFixture);
export { expect };
