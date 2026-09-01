import {
  getHostProvider,
  getAccountsProvider,
  getHostLocalStorage,
  getStatementStore,
  getPreimageManager,
  getThemeProvider,
  requestPermission,
  requestDevicePermission,
  requestResourceAllocation,
  isChainSupported,
  formatHostError,
  findRingVrfKeyHandle,
  type AccountsProvider,
  type AllocatableResource,
  type DerivationIndex,
  type HostLocalStorage,
  type HostStatementStore,
  type PreimageManager,
  type RingLocation,
  type RingVrfKeyHandle,
  type ThemeProvider,
} from "@parity/product-sdk/host";
import { paseo_individuality } from "@parity/product-sdk-descriptors/paseo-individuality";
import { AccountId, createClient, type PolkadotClient } from "polkadot-api";
import { toHex } from "polkadot-api/utils";
import { createInkSdk } from "@polkadot-api/sdk-ink";
import { contracts } from "@polkadot-api/descriptors";
import deploymentJson from "@root/evm/deployment.json";
import {
  ACTIVE_CHAIN_ID,
  NETWORKS,
  type ChainConfig,
  type ChainId,
  type TestLogger,
  type TestOutcome,
  type TestResult,
} from "@/lib/types";
import { getSelfDotNs } from "@/lib/dotns";

export function success(message: string, details?: unknown): TestResult {
  return { success: true, message, details, outcome: "supported" };
}

export function error(
  message: string,
  details?: unknown,
  outcome: TestOutcome = "failed",
): TestResult {
  return { success: false, message, details, outcome };
}

// formatHostError with versioned-envelope unwrapping: neverthrow accounts APIs
// surface errors as `{ tag: "V1", value: ... }`, which formatHostError would
// render as just "V1".
export function sdkErrorMessage(value: unknown): string {
  if (typeof value === "object" && value !== null && "tag" in value) {
    const tagged = value as { tag: unknown; value?: unknown };
    if (/^V\d+$/.test(String(tagged.tag)) && tagged.value !== undefined) {
      return sdkErrorMessage(tagged.value);
    }
  }
  return formatHostError(value);
}

// Cache papi clients per genesis — avoids in-flight chainHead events from a
// destroyed client corrupting a new client's block tree (undefined.children).
const clientCache = new Map<string, PolkadotClient>();

export async function getClient(
  genesis: `0x${string}`,
): Promise<PolkadotClient> {
  let client = clientCache.get(genesis);
  if (!client) {
    // Probe host support first so a host that doesn't serve this chain fails
    // fast with a clear message instead of papi's cryptic "undefined.children".
    const supportResult = await isChainSupported(genesis);
    const supported = supportResult.ok && supportResult.value;
    if (!supported) {
      const probeDetail = supportResult.ok
        ? ""
        : ` (probe failed: ${sdkErrorMessage(supportResult.error)})`;
      throw new Error(
        `Host does not serve chain ${genesis}${probeDetail}. The desktop/mobile host is ` +
          `provisioned for a different network than this app requests — point ` +
          `the host at the matching network (or change the app's target chain).`,
      );
    }
    const provider = await getHostProvider(genesis);
    if (!provider) {
      throw new Error(
        "getHostProvider returned null - not inside a host container",
      );
    }
    client = createClient(provider);
    clientCache.set(genesis, client);
  }
  return client;
}

/**
 * Cached non-null accessor for a host wrapper. Throws a descriptive error
 * outside a host container, so call sites stay straight-line code instead of
 * repeating the null check.
 */
function hostRef<T>(
  name: string,
  get: () => Promise<T | null>,
): () => Promise<T> {
  let cached: T | null = null;
  return async () => {
    if (cached) return cached;
    const value = await get();
    if (!value) {
      throw new Error(`${name} returned null - not inside a host container`);
    }
    cached = value;
    return cached;
  };
}

export const accounts: () => Promise<AccountsProvider> = hostRef(
  "getAccountsProvider",
  getAccountsProvider,
);
export const hostStorage: () => Promise<HostLocalStorage> = hostRef(
  "getHostLocalStorage",
  getHostLocalStorage,
);
export const pm: () => Promise<PreimageManager> = hostRef(
  "getPreimageManager",
  getPreimageManager,
);
export const statements: () => Promise<HostStatementStore> = hostRef(
  "getStatementStore",
  getStatementStore,
);
export const theme: () => Promise<ThemeProvider> = hostRef(
  "getThemeProvider",
  getThemeProvider,
);

export const SELF_DOTNS = getSelfDotNs();

// One entry per network: the same contract lives at a different address on each,
// and a build targets exactly one of them.
const deployment = deploymentJson as Partial<
  Record<ChainId, { simpleStore: string }>
>;
export const SIMPLE_STORE_ADDRESS =
  deployment[ACTIVE_CHAIN_ID]?.simpleStore ?? "";

// `origin` for pallet-revive view dry-runs: needs an existing H160 mapping or
// the chain returns AccountUnmapped. The CI deployer's H160 padded with 12×0xEE
// and SS58-encoded (prefix 0); auto-mapped on every bulletin-deploy. Public.
export const READ_ORIGIN = "12dCP8UFhSktvmSgJcP93tNPdgVQMdBQqJNcFrZTnDoiBE9Y";

/**
 * Plain account selector inside the product subtree.
 *
 * Hosts expand it to `index_bytes(n)` per RFC-0022. The raw 32-byte form is the
 * escape hatch and no card needs it.
 */
export function accountIndex(index: number): DerivationIndex {
  return { tag: "Index", value: index };
}

// Collection ids are fixed 32-byte ASCII tags from the individuality reality
// traits, space padded when shorter.
const PEOPLE_LITE_COLLECTION = "pop:polkadot.network/people-lite";
const MEMBERS_PALLET_INSTANCE = 67;

export function personhoodRing(peopleGenesis: `0x${string}`): RingLocation {
  return {
    chainId: peopleGenesis,
    junctions: [
      { tag: "PalletInstance", value: MEMBERS_PALLET_INSTANCE },
      {
        tag: "CollectionId",
        value: toHexString(new TextEncoder().encode(PEOPLE_LITE_COLLECTION)),
      },
    ],
  };
}

/** Network-qualified product that owns the well-known personhood ring keys. */
export const PRODUCT_ALIAS_RING_OWNER =
  NETWORKS[ACTIVE_CHAIN_ID].personhoodRingOwner;

/** Context shared by the alias card and the ring-VRF proof card. Index 0 is the product default account. */
export const PRODUCT_ALIAS_CONTEXT_SUFFIX = accountIndex(0);

export const PRODUCT_ALIAS_RING_LOCATION = personhoodRing(
  NETWORKS[ACTIVE_CHAIN_ID].peopleGenesis,
);

type RingVrfKeyResolution =
  { ok: true; handle: RingVrfKeyHandle } | { ok: false; result: TestResult };

/** Resolve a host-issued handle for an owner's already-registered ring key. */
export async function findRegisteredRingVrfKeyHandle(
  provider: AccountsProvider,
  owner: string,
  ring: RingLocation,
): Promise<RingVrfKeyResolution> {
  const listed = await provider.listRingVrfKeys(owner).match(
    (keys) => ({ ok: true as const, keys }),
    (cause) => ({ ok: false as const, cause }),
  );
  if (!listed.ok) {
    return {
      ok: false,
      result: error(sdkErrorMessage(listed.cause), listed.cause),
    };
  }

  const handle = findRingVrfKeyHandle(listed.keys, ring);
  return handle
    ? { ok: true, handle }
    : {
        ok: false,
        result: error(
          `No ${owner} key is registered for the People Lite ring`,
          undefined,
          "precondition-missing",
        ),
      };
}

// People/Individuality chain descriptor per Asset Hub, for DotNS-identity
// signing (app.wallet.signMessageWithDotNsIdentity). Paseo pairs with
// paseo_individuality; Previewnet has no published individuality descriptor, so
// it's intentionally absent — the card reports that rather than signing on the
// wrong chain.
export const PASEO_NEXT_INDIVIDUALITY = {
  ...paseo_individuality,
  // The published descriptor predates the latest Paseo People chain reset.
  // Metadata remains compatible, but host routing must use the live genesis.
  genesis: NETWORKS.PASEO_ASSETHUBNEXTV2.peopleGenesis,
} satisfies typeof paseo_individuality;
export const PEOPLE_CHAIN_BY_HUB: Record<string, typeof paseo_individuality> = {
  [NETWORKS.PASEO_ASSETHUBNEXTV2.genesis]: PASEO_NEXT_INDIVIDUALITY,
};

// The personhood rings live on the People chain, not the hub, so the ring
// location passed to createRingVRFProof names the People chain genesis plus the
// Members pallet and collection junctions.
export const ASSETHUB_GENESIS_TO_PEOPLE_GENESIS: Record<string, `0x${string}`> =
  {
    [NETWORKS.PASEO_ASSETHUBNEXTV2.genesis]:
      NETWORKS.PASEO_ASSETHUBNEXTV2.peopleGenesis,
    [NETWORKS.PREVIEWNET_ASSETHUB.genesis]:
      NETWORKS.PREVIEWNET_ASSETHUB.peopleGenesis,
  };

export function toHexString(value: Uint8Array): `0x${string}` {
  return toHex(value) as `0x${string}`;
}

export function bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

/**
 * Prefixes bytes with a SCALE compact length, as `BoundedVec<u8>` encodes.
 *
 * pallet-revive decodes `request.proof` that way. Without the prefix the
 * verifier reads the first byte as a length and returns a bare `false`.
 */
export function scaleBytes(bytes: Uint8Array): Uint8Array {
  const length = bytes.length;
  let prefix: number[];
  if (length < 1 << 6) prefix = [length << 2];
  else if (length < 1 << 14) {
    const value = (length << 2) | 0b01;
    prefix = [value & 0xff, (value >> 8) & 0xff];
  } else {
    const value = ((length << 2) | 0b10) >>> 0;
    prefix = [
      value & 0xff,
      (value >> 8) & 0xff,
      (value >> 16) & 0xff,
      (value >> 24) & 0xff,
    ];
  }
  const out = new Uint8Array(prefix.length + length);
  out.set(prefix);
  out.set(bytes, prefix.length);
  return out;
}

/**
 * Statement Store topics are a chain primitive Hash and must be exactly 32
 * bytes, which the raw UTF-8 encoding of a label is not. SHA-256 gives a
 * deterministic digest of the right width that can be matched on subscribe and
 * re-derived elsewhere.
 */
export async function hashTopic(s: string): Promise<`0x${string}`> {
  const bytes = new TextEncoder().encode(s);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return toHexString(new Uint8Array(digest));
}

/**
 * Statement-Store expiry: high 32 bits = unix expiry (s), low 32 = sequence
 * number. A missing/zero expiry is encoded as epoch and rejected as already
 * expired, so it must be set. Matches `createExpiry` in
 * `@parity/product-sdk-statement-store`, inlined because the umbrella does not
 * re-export it and the host-side statement store does not pull that package in.
 */
export function createExpiryFromDuration(
  durationSecs: number,
  sequenceNumber = 0,
): bigint {
  // tsconfig targets ES2017, so use BigInt() instead of `32n` literals.
  const timestamp = Math.floor(Date.now() / 1000) + durationSecs;
  return (BigInt(timestamp) << BigInt(32)) | BigInt(sequenceNumber);
}

/** Default statement TTL — long enough for a slow proof-then-submit round-trip. */
export const STATEMENT_TTL_SECS = 300;

type HostResult<T> = { ok: true; value: T } | { ok: false; error: unknown };

/** Runs a permission request and reports granted/denied under `label`. */
export async function reportPermission(
  label: string,
  request: () => Promise<HostResult<boolean>>,
): Promise<TestResult> {
  try {
    const result = await request();
    if (!result.ok) return error(sdkErrorMessage(result.error), result.error);
    return result.value
      ? success(`${label}: granted`)
      : error(`${label}: denied`, result.value, "permission-denied");
  } catch (err) {
    return error(sdkErrorMessage(err), err);
  }
}

export function requestDevice(
  permission: Parameters<typeof requestDevicePermission>[0],
): () => Promise<HostResult<boolean>> {
  return () => requestDevicePermission(permission);
}

export function requestRemote(
  permission: Parameters<typeof requestPermission>[0],
): () => Promise<HostResult<boolean>> {
  return () => requestPermission(permission);
}

export async function runResourceAllocation(
  resources: AllocatableResource[],
): Promise<TestResult> {
  try {
    const result = await requestResourceAllocation(resources);
    if (!result.ok) return error(sdkErrorMessage(result.error), result.error);
    const outcomes = result.value.map((outcome, i) => ({
      resource: resources[i].tag,
      outcome,
    }));
    if (outcomes.every(({ outcome }) => outcome === "Allocated")) {
      return success(`Allocated ${outcomes.length} resource(s)`, outcomes);
    }
    if (outcomes.some(({ outcome }) => outcome === "Rejected")) {
      return error(
        "Resource allocation rejected",
        outcomes,
        "permission-denied",
      );
    }
    return error("Requested resource is unavailable", outcomes, "unavailable");
  } catch (err) {
    const e = err as { name?: string };
    return error(e.name ?? String(err), err);
  }
}

/** The product account plus everything needed to sign and dry-run with it. */
export async function productSigner(log: TestLogger = () => {}) {
  const provider = await accounts();
  const result = await provider.getProductAccount(SELF_DOTNS, 0);
  const account = result.match(
    (a) => a,
    (err) => {
      log(`getProductAccount failed: ${sdkErrorMessage(err)}`);
      return null;
    },
  );
  if (!account) return null;
  return {
    provider,
    account,
    signer: provider.getProductAccountSigner(account),
    origin: AccountId().dec(account.publicKey),
  };
}

/**
 * Ensure the product account has a SmartContractAllowance slot before a
 * contract write (RFC-0010). A non-zero PGAS asset balance means already
 * provisioned, so we skip the host round-trip (avoids the mobile re-prompt);
 * otherwise request the allocation. Asset id read from Pgas.PgasAssetId.
 */
export async function ensureSmartContractAllowance(
  log: TestLogger,
  chain: ChainConfig,
  productAccount: { publicKey: Uint8Array; derivationIndex: number },
): Promise<TestResult | null> {
  const { publicKey, derivationIndex } = productAccount;
  try {
    const address = AccountId(chain.ss58Prefix).dec(publicKey);
    const api = (await getClient(chain.genesis)).getUnsafeApi();
    const pgasAssetId = (await api.constants.Pgas.PgasAssetId()) as number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const acct: any = await api.query.Assets.Account.getValue(
      pgasAssetId,
      address,
    );
    const balance = BigInt(acct?.balance ?? 0);
    log(`Address ${address} holds ${balance} of PGAS asset ${pgasAssetId}`);
    if (balance > BigInt(0)) {
      log(`SmartContractAllowance(${derivationIndex}) already provisioned`);
      return null;
    }
  } catch (e) {
    log(`PGAS balance probe failed (${e}); falling through to request`);
  }

  log(`Requesting SmartContractAllowance(${derivationIndex})...`);
  try {
    const result = await requestResourceAllocation([
      { tag: "SmartContractAllowance", value: accountIndex(derivationIndex) },
    ]);
    if (!result.ok) return error(sdkErrorMessage(result.error), result.error);
    const outcome = result.value[0];
    if (outcome === "Allocated") {
      log(`SmartContractAllowance(${derivationIndex}) allocated`);
      return null;
    }
    if (outcome === "Rejected") {
      return error(
        "User rejected SmartContractAllowance",
        outcome,
        "permission-denied",
      );
    }
    return error(
      `SmartContractAllowance unavailable: ${outcome}`,
      outcome,
      "unavailable",
    );
  } catch (err) {
    const e = err as { name?: string };
    return error(e.name ?? String(err), err);
  }
}

/** The deployed SimpleStore, bound to a papi client for `chain`. */
export async function simpleStore(chain: ChainConfig) {
  if (!SIMPLE_STORE_ADDRESS) {
    throw new Error(
      `No SimpleStore address recorded for ${ACTIVE_CHAIN_ID} in evm/deployment.json. ` +
        `Run \`NETWORK=… bun evm/scripts/ensure.ts\` to deploy it.`,
    );
  }
  const client = await getClient(chain.genesis);
  return createInkSdk(client).getContract(
    contracts.simpleStore,
    SIMPLE_STORE_ADDRESS,
  );
}

/** SimpleStore view methods: dry-run only, no arguments beyond the origin. */
type SimpleStoreView =
  "getStoredValue" | "getStoredDataLength" | "getBalance" | "totalDeposits";

/** Dry-runs a SimpleStore view method as READ_ORIGIN. */
export async function readSimpleStore(
  chain: ChainConfig,
  method: SimpleStoreView,
): Promise<
  { ok: true; response: unknown } | { ok: false; result: TestResult }
> {
  try {
    const contract = await simpleStore(chain);
    const result = await contract.query(method, { origin: READ_ORIGIN });
    if (!result.success) {
      return { ok: false, result: error("Query failed", result.value) };
    }
    return { ok: true, response: result.value.response };
  } catch (e) {
    return { ok: false, result: error(`Failed to query: ${e}`) };
  }
}

/**
 * Everything a SimpleStore write needs: a signer, a provisioned allowance, and
 * a contract handle. Each write then dry-runs and submits its own method.
 */
export async function prepareSimpleStoreWrite(
  chain: ChainConfig,
  log: TestLogger,
) {
  log("Fetching account...");
  const product = await productSigner(log);
  if (!product) {
    return {
      ok: false as const,
      result: error("No product account available"),
    };
  }

  const allowanceError = await ensureSmartContractAllowance(
    log,
    chain,
    product.account,
  );
  if (allowanceError) return { ok: false as const, result: allowanceError };

  return {
    ok: true as const,
    ...product,
    contract: await simpleStore(chain),
  };
}

interface TxEvent {
  type: string;
  found?: boolean;
  ok?: boolean;
  txHash?: string;
}

/**
 * Awaits a signed transaction, logging each event as it arrives.
 *
 * Resolves at best-block inclusion by default, which is where a contract write
 * becomes observable; pass `"finalized"` to wait for finality instead. A failed
 * `finalized` event rejects either way, as does a stream that ends without
 * settling (papi completes silently when the host drops the subscription).
 */
export function watchTx(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tx: { subscribe(observer: any): unknown },
  log: TestLogger,
  until: "best" | "finalized" = "best",
): Promise<TxEvent> {
  return new Promise((resolve, reject) => {
    let settled = false;
    tx.subscribe({
      next: (event: TxEvent) => {
        log(`Event: ${event.type}`);
        if (event.type === "finalized" && !event.ok) {
          settled = true;
          reject(new Error("Tx failed"));
          return;
        }
        const done =
          until === "best"
            ? event.type === "txBestBlocksState" && event.found
            : event.type === "finalized";
        if (done) {
          settled = true;
          resolve(event);
        }
      },
      error: (err: unknown) => {
        settled = true;
        reject(err);
      },
      complete: () => {
        if (!settled) reject(new Error("tx stream completed before settling"));
      },
    });
  });
}

// Two unit spaces meet at this contract. pallet-revive exposes EVM balances
// (`address(this).balance`, `withdraw`) in 18-decimal wei, while a native
// transfer value on Asset Hub is 10-decimal planck.
export const EVM_DECIMALS = 18;
export const NATIVE_DECIMALS = 10;

/** Renders a fixed-point integer as a decimal string, trailing zeros trimmed. */
export function formatUnits(value: bigint, decimals: number): string {
  const divisor = BigInt(10) ** BigInt(decimals);
  const whole = value / divisor;
  const frac =
    (value % divisor).toString().padStart(decimals, "0").replace(/0+$/, "") ||
    "0";
  return `${whole}.${frac}`;
}

/** Parses a decimal string into a fixed-point integer, extra digits dropped. */
export function parseUnits(input: string, decimals: number): bigint {
  const [whole = "0", frac = ""] = input.split(".");
  return (
    BigInt(whole) * BigInt(10) ** BigInt(decimals) +
    BigInt(frac.padEnd(decimals, "0").slice(0, decimals))
  );
}
