import { test as base, expect } from '@playwright/test';
import {
  createTestHostFixture,
  PASEO_ASSET_HUB,
  type TestHost,
} from '@parity/host-api-test-sdk/playwright';

const PRODUCT_URL = 'http://localhost:5199';

const bobFixture = createTestHostFixture({
  productUrl: PRODUCT_URL,
  accounts: ['bob'],
  chain: PASEO_ASSET_HUB,
  // App derives its DotNS identifier from window.location.host, so under
  // Playwright that's 'localhost:5199'. Map both to bob so the same Bob
  // signer is used whether the app is opened under the local host or a
  // canonical .dot identifier.
  productAccounts: {
    'host-playground.dot/0': 'bob',
    'localhost:5199/0': 'bob',
  },
});

export const test = base.extend<{ testHost: TestHost }>(bobFixture);
export { expect };
