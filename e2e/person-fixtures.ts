/**
 * Fixture for the specs that need a real resource allowance, signed in as a
 * lite person rather than the `bob` dev account.
 *
 * The core signs Bulletin uploads with an allowance key it derives from the
 * session root and product id, and the chain only accepts them once a person
 * has claimed a Bulletin allowance for that key. Claims are rationed per person
 * per period (statement-store slots: 10 a day for a lite person), so a run
 * cannot afford to claim for itself:
 *
 * - By default (`E2E_ALLOCATIONS` unset or `granted`) the host answers each
 *   allocation request as granted without claiming. Uploads still go to the
 *   live chain and are paid by the person's existing claim.
 * - With `E2E_ALLOCATIONS=chain` the core claims every allowance for real. The
 *   scheduled allocations workflow runs that, which also renews the claims.
 *
 * `E2E_PERSON_MNEMONICS` holds one 24-word mnemonic per line, each for a person
 * onboarded on paseo-next-v2; `E2E_PERSON_INDEX` picks one, so runs can spread
 * across people. The test host activates a session from 32 bytes of entropy,
 * which is why 12-word mnemonics are refused.
 *
 * Without the secret (forks, local runs) the specs using this fixture skip.
 */
import { test as base, expect } from "@playwright/test";
import {
  createTestHostFixture,
  type TestHost,
} from "@parity/truapi-host/testing/playwright";
import { mnemonicToEntropy } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";
import {
  PASEO,
  PASEO_BULLETIN,
  PASEO_PEOPLE,
  PRODUCT_ID,
  PRODUCT_URL,
} from "./fixtures";

const MNEMONICS = (process.env.E2E_PERSON_MNEMONICS ?? "")
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);

const INDEX = Number(process.env.E2E_PERSON_INDEX ?? 0);
const MNEMONIC = MNEMONICS.length
  ? MNEMONICS[Math.abs(INDEX) % MNEMONICS.length]
  : undefined;

const ALLOCATIONS = process.env.E2E_ALLOCATIONS ?? "granted";
if (ALLOCATIONS !== "granted" && ALLOCATIONS !== "chain") {
  throw new Error(`E2E_ALLOCATIONS must be "granted" or "chain"`);
}

export const SKIP_REASON = MNEMONIC
  ? undefined
  : "E2E_PERSON_MNEMONICS is not set; Bulletin uploads need a person's claim";

export const test = base.extend<{ testHost: TestHost }>(
  createTestHostFixture({
    productUrl: PRODUCT_URL,
    // Never used without the secret: every spec on this fixture skips first.
    accounts: MNEMONIC
      ? [{ name: "person", entropy: mnemonicToEntropy(MNEMONIC, wordlist) }]
      : ["bob"],
    networks: [PASEO, PASEO_BULLETIN, PASEO_PEOPLE],
    productId: PRODUCT_ID,
    allowances: ALLOCATIONS,
    // Statements stay in-page as in the main fixture.
    loopbackStatements: true,
  }),
);
export { expect };
