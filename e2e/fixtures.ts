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
  productAccounts: { 'host-playground.dot/0': 'bob' },
});

export const test = base.extend<{ testHost: TestHost }>(bobFixture);
export { expect };
