import {
  getHostProvider,
  getAccountsProvider,
  getHostLocalStorage,
  createHostLocalStorage,
  getStatementStore,
  getPreimageManager,
  createHostPreimageManager,
  getThemeProvider,
  getPaymentManager,
  getNotificationManager,
  deriveEntropy,
  requestPermission,
  requestDevicePermission,
  requestResourceAllocation,
  createProofAuthorized,
  navigateTo,
  isChainSupported,
  getChainSpec,
  broadcastTransaction,
  stopTransaction,
  formatHostError,
  type AccountsProvider,
  type AllocatableResource,
  type DerivationIndex,
  type HostLocalStorage,
  type HostStatementStore,
  type PreimageManager,
  type RingLocation,
  type ThemeProvider,
} from "@parity/product-sdk/host";
import { WellKnownChain } from "@parity/product-sdk/chain";
import {
  calculateCid,
  cidToPreimageKey,
  queryBytes,
} from "@parity/product-sdk/cloud-storage";
import { paseo_individuality } from "@parity/product-sdk-descriptors/paseo-individuality";
import {
  AccountId,
  Binary,
  createClient,
  type PolkadotClient,
} from "polkadot-api";
import { toHex, fromHex } from "polkadot-api/utils";
import { createInkSdk } from "@polkadot-api/sdk-ink";
import { contracts } from "@polkadot-api/descriptors";
import { deriveH160 } from "@parity/product-sdk/address";
import { NETWORKS } from "./types";
import deployment from "../../evm/deployment.json";
import {
  type ChainConfig,
  type TestDefinition,
  type TestLogger,
  type TestResult,
} from "./types";
import { getSelfDotNs } from "./dotns";
import { getApp } from "./app";
import { withTrace } from "@/src/utils/with-trace";

// Cache papi clients per genesis — avoids in-flight chainHead events from a
// destroyed client corrupting a new client's block tree (undefined.children).
const clientCache = new Map<string, PolkadotClient>();
async function getClient(genesis: `0x${string}`): Promise<PolkadotClient> {
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

// Lazy non-null accessors for each Parity host wrapper. Each throws a
// descriptive error when called outside a host container so call sites can
// remain straight-line code instead of repeating the null check.
let cachedAccounts: AccountsProvider | null = null;
async function accounts(): Promise<AccountsProvider> {
  if (cachedAccounts) return cachedAccounts;
  const p = await getAccountsProvider();
  if (!p)
    throw new Error(
      "getAccountsProvider returned null - not inside a host container",
    );
  cachedAccounts = p;
  return cachedAccounts;
}

let cachedHostStorage: HostLocalStorage | null = null;
async function hostStorage(): Promise<HostLocalStorage> {
  if (cachedHostStorage) return cachedHostStorage;
  const s = await getHostLocalStorage();
  if (!s)
    throw new Error(
      "getHostLocalStorage returned null - not inside a host container",
    );
  cachedHostStorage = s;
  return cachedHostStorage;
}

let cachedPreimage: PreimageManager | null = null;
async function pm(): Promise<PreimageManager> {
  if (cachedPreimage) return cachedPreimage;
  const p = await getPreimageManager();
  if (!p)
    throw new Error(
      "getPreimageManager returned null - not inside a host container",
    );
  cachedPreimage = p;
  return cachedPreimage;
}

let cachedStatementStore: HostStatementStore | null = null;
async function statements(): Promise<HostStatementStore> {
  if (cachedStatementStore) return cachedStatementStore;
  const s = await getStatementStore();
  if (!s)
    throw new Error(
      "getStatementStore returned null - not inside a host container",
    );
  cachedStatementStore = s;
  return cachedStatementStore;
}

let cachedTheme: ThemeProvider | null = null;
async function theme(): Promise<ThemeProvider> {
  if (cachedTheme) return cachedTheme;
  const t = await getThemeProvider();
  if (!t)
    throw new Error(
      "getThemeProvider returned null - not inside a host container",
    );
  cachedTheme = t;
  return cachedTheme;
}

const SIMPLE_STORE_ADDRESS = deployment.simpleStore;
// `origin` for pallet-revive view dry-runs: needs an existing H160 mapping or
// the chain returns AccountUnmapped. The CI deployer's H160 padded with 12×0xEE
// and SS58-encoded (prefix 0); auto-mapped on every bulletin-deploy. Public.
const READ_ORIGIN = "12dCP8UFhSktvmSgJcP93tNPdgVQMdBQqJNcFrZTnDoiBE9Y";

const SELF_DOTNS = getSelfDotNs();

/**
 * Plain account selector inside the product subtree.
 *
 * Hosts expand it to `index_bytes(n)` per RFC-0022. The raw 32-byte form is the
 * escape hatch and no card needs it.
 */
function accountIndex(index: number): DerivationIndex {
  return { tag: "Left", value: index };
}

/** Context shared by the alias card and the ring-VRF proof card. Index 0 is the product default account. */
const PRODUCT_ALIAS_CONTEXT_SUFFIX = accountIndex(0);
const PRODUCT_ALIAS_RING_LOCATION: RingLocation = {
  chainId: "0x89a63b11fef2c0273fc72c0d864da0793a665dade5db153e0cab995348c5440f",
  junctions: [
    { tag: "PalletInstance", value: 67 },
    {
      tag: "CollectionId",
      value:
        "0x706f703a706f6c6b61646f742e6e6574776f726b2f70656f706c652d6c697465",
    },
  ],
};

// People/Individuality chain descriptor per Asset Hub, for DotNS-identity
// signing (app.wallet.signMessageWithDotNsIdentity). Paseo pairs with
// paseo_individuality; Previewnet has no published individuality descriptor, so
// it's intentionally absent — the card reports that rather than signing on the
// wrong chain.
const PEOPLE_CHAIN_BY_HUB: Record<string, typeof paseo_individuality> = {
  [NETWORKS.PASEO_ASSETHUBNEXTV2.genesis]: paseo_individuality,
};

// The personhood rings live on the People chain, not the hub. The ring
// location passed to createRingVRFProof therefore names the People chain
// genesis plus the Members pallet and collection junctions. Collection ids
// are fixed 32-byte ASCII tags from the individuality reality traits, space
// padded when shorter.
const ASSETHUB_GENESIS_TO_PEOPLE_GENESIS: Record<string, `0x${string}`> = {
  [NETWORKS.PASEO_ASSETHUBNEXTV2.genesis]:
    "0x89a63b11fef2c0273fc72c0d864da0793a665dade5db153e0cab995348c5440f",
  [NETWORKS.PREVIEWNET_ASSETHUB.genesis]:
    "0x3138c6d4ce58c760047a413c2a930e919b4673a841ab4890de59aac3bd037f3d",
};

const PEOPLE_LITE_COLLECTION = "pop:polkadot.network/people-lite";
const MEMBERS_PALLET_INSTANCE = 67;

function personhoodRing(peopleGenesis: `0x${string}`): RingLocation {
  return {
    chainId: peopleGenesis,
    junctions: [
      { tag: "PalletInstance", value: MEMBERS_PALLET_INSTANCE },
      {
        tag: "CollectionId",
        value: toHex(
          new TextEncoder().encode(PEOPLE_LITE_COLLECTION),
        ) as `0x${string}`,
      },
    ],
  };
}

/**
 * Prefixes bytes with a SCALE compact length, as `BoundedVec<u8>` encodes.
 *
 * pallet-revive decodes `request.proof` that way. Without the prefix the
 * verifier reads the first byte as a length and returns a bare `false`.
 */
function scaleBytes(bytes: Uint8Array): Uint8Array {
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

function success(message: string, details?: unknown): TestResult {
  return { success: true, message, details };
}

function error(message: string, details?: unknown): TestResult {
  return { success: false, message, details };
}

// formatHostError with versioned-envelope unwrapping: neverthrow accounts APIs
// surface errors as `{ tag: "V1", value: ... }`, which formatHostError would
// render as just "V1".
function sdkErrorMessage(value: unknown): string {
  if (typeof value === "object" && value !== null && "tag" in value) {
    const tagged = value as { tag: unknown; value?: unknown };
    if (/^V\d+$/.test(String(tagged.tag)) && tagged.value !== undefined) {
      return sdkErrorMessage(tagged.value);
    }
  }
  return formatHostError(value);
}

async function runDevicePermissionTest(
  permission: Parameters<typeof requestDevicePermission>[0],
  label: string,
): Promise<TestResult> {
  try {
    const result = await requestDevicePermission(permission);
    return result.ok
      ? success(`${label} permission: ${result.value ? "granted" : "denied"}`)
      : error(sdkErrorMessage(result.error), result.error);
  } catch (err) {
    return error(sdkErrorMessage(err), err);
  }
}

async function runRemotePermissionTest(
  permission: Parameters<typeof requestPermission>[0],
  label: string,
): Promise<TestResult> {
  try {
    const result = await requestPermission(permission);
    return result.ok
      ? success(`${label}: ${result.value ? "granted" : "denied"}`)
      : error(sdkErrorMessage(result.error), result.error);
  } catch (err) {
    return error(sdkErrorMessage(err), err);
  }
}

/**
 * Ensure the product account has a SmartContractAllowance slot before a
 * contract write (RFC-0010). A non-zero PGAS asset balance means already
 * provisioned, so we skip the host round-trip (avoids the mobile re-prompt);
 * otherwise request the allocation. Asset id read from Pgas.PgasAssetId.
 */
async function ensureSmartContractAllowance(
  log: (msg: string) => void,
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
    const bal = BigInt(acct?.balance ?? 0);
    if (bal > BigInt(0)) {
      log(
        `SmartContractAllowance(${derivationIndex}) already provisioned (PGAS asset=${pgasAssetId}, balance=${bal})`,
      );
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
    const outcomes = result.value;
    const outcome = outcomes[0];
    if (outcome === "Allocated") {
      log(`SmartContractAllowance(${derivationIndex}) allocated`);
      return null;
    }
    if (outcome === "Rejected") {
      return error("User rejected SmartContractAllowance");
    }
    return error(`SmartContractAllowance unavailable: ${outcome}`);
  } catch (err) {
    const e = err as { name?: string };
    return error(e.name ?? String(err), err);
  }
}

function bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

function toHexString(value: Uint8Array): `0x${string}` {
  return toHex(value) as `0x${string}`;
}

// Statement Store topics are a chain primitive Hash and must be exactly
// 32 bytes. Earlier code passed `new TextEncoder().encode(s)` directly,
// which produced 23-byte arrays for the default labels and the host
// rejected with `Statement topic must be 32 bytes`. SHA-256 of the
// UTF-8 encoding gives a deterministic 32-byte digest that can be
// matched on subscribe and re-derived elsewhere.
async function hashTopic(s: string): Promise<`0x${string}`> {
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
function createExpiryFromDuration(
  durationSecs: number,
  sequenceNumber = 0,
): bigint {
  // tsconfig targets ES2017, so use BigInt() instead of `32n` literals.
  const timestamp = Math.floor(Date.now() / 1000) + durationSecs;
  return (BigInt(timestamp) << BigInt(32)) | BigInt(sequenceNumber);
}

/** Default statement TTL — long enough for a slow proof-then-submit round-trip. */
const STATEMENT_TTL_SECS = 300;

// Account Tests
export const accountTests: TestDefinition[] = [
  {
    id: "accounts-provider-product",
    name: "Get Product Account",
    description: "Gets a product account via getAccountsProvider",
    api: "accountsProvider.getProductAccount(dotNsIdentifier)",
    args: [
      {
        name: "dotNsIdentifier",
        label: "DotNS ID",
        defaultValue: SELF_DOTNS,
      },
    ],
    category: "accounts",
    async run(_chain, _logger, args) {
      const dotNsIdentifier = args?.dotNsIdentifier ?? SELF_DOTNS;
      const accountsProvider = await accounts();
      const result = await accountsProvider.getProductAccount(dotNsIdentifier);

      return result.match(
        (account) =>
          success("Product account:", {
            publicKey: toHex(account.publicKey),
          }),
        (err) => error(sdkErrorMessage(err), err),
      );
    },
  },
  {
    id: "accounts-provider-legacy",
    name: "Get Legacy Accounts",
    description: "Gets legacy accounts via getAccountsProvider",
    api: "accountsProvider.getLegacyAccounts()",
    args: [],
    category: "accounts",
    async run(_chain, _logger) {
      const accountsProvider = await accounts();
      const result = await accountsProvider.getLegacyAccounts();

      return result.match(
        (accounts) =>
          success(
            "Legacy accounts:",
            accounts.map((account) => ({
              name: account.name,
              publicKey: toHex(account.publicKey),
            })),
          ),
        (err) => error(sdkErrorMessage(err), err),
      );
    },
  },
  {
    id: "accounts-provider-alias",
    name: "Get Product Account Alias",
    description:
      "Gets this product's contextual account alias from the Paseo Next v2 People Lite ring",
    api: "accountsProvider.getProductAccountAlias(context, ringLocation)",
    args: [],
    category: "accounts",
    async run() {
      const accountsProvider = await accounts();
      const result = await accountsProvider.getProductAccountAlias(
        { productId: SELF_DOTNS, suffix: PRODUCT_ALIAS_CONTEXT_SUFFIX },
        PRODUCT_ALIAS_RING_LOCATION,
      );

      return result.match(
        (alias) =>
          success("Account alias retrieved", {
            context: toHex(alias.context),
            alias: toHex(alias.alias),
          }),
        (err) => error(sdkErrorMessage(err), err),
      );
    },
  },
  {
    id: "accounts-provider-product-signer",
    name: "Product Account Signer",
    description: "Creates a PolkadotSigner for a product account",
    api: "accountsProvider.getProductAccountSigner(account)",
    args: [
      {
        name: "dotNsIdentifier",
        label: "DotNS ID",
        defaultValue: SELF_DOTNS,
      },
    ],
    category: "accounts",
    async run(_chain, _logger, args) {
      const dotNsIdentifier = args?.dotNsIdentifier ?? SELF_DOTNS;
      const accountsProvider = await accounts();
      const accountResult =
        await accountsProvider.getProductAccount(dotNsIdentifier);

      return accountResult.match(
        (account) => {
          const signer = accountsProvider.getProductAccountSigner(account);
          return success("Product account signer created", {
            publicKey: toHex(signer.publicKey),
          });
        },
        (err) => error(sdkErrorMessage(err), err),
      );
    },
  },
  {
    id: "accounts-provider-connection-status",
    name: "Account Connection Status",
    description: "Subscribes to account connection status changes (5s)",
    api: "accountsProvider.subscribeAccountConnectionStatus(callback)",
    category: "accounts",
    async run() {
      const accountsProvider = await accounts();

      return new Promise((resolve) => {
        const statuses: string[] = [];
        const subscription = accountsProvider.subscribeAccountConnectionStatus(
          (status) => {
            statuses.push(status);
          },
        );

        setTimeout(() => {
          subscription.unsubscribe();
          resolve(
            success(`Received ${statuses.length} status updates`, statuses),
          );
        }, 5000);
      });
    },
  },
];

// Signing Tests
export const signingTests: TestDefinition[] = [
  {
    id: "wallet-sign-message",
    name: "Sign Raw Message",
    description:
      "Signs an arbitrary raw message through the product-sdk umbrella's app.wallet — connects on demand if no accounts are present, then app.wallet.signMessage. This is the Tier-1 createApp wallet path: raw-message signing with the connected product account (replaces the old getProductAccountSigner().signBytes card).",
    api: "app.wallet.connect() / app.wallet.signMessage(message)",
    args: [
      {
        name: "message",
        label: "Message",
        defaultValue: "Hello from app.wallet!",
      },
    ],
    category: "signing",
    async run(_chain, logger, args) {
      const log = logger || (() => {});
      const message = args?.message ?? "Hello from app.wallet!";
      const messageBytes = new TextEncoder().encode(message);

      const app = await getApp();
      if (app.wallet.getAccounts().length === 0) {
        log("No wallet accounts yet — connecting...");
        await app.wallet.connect();
      }
      log("Signing message via app.wallet.signMessage...");
      const sig = await app.wallet.signMessage(messageBytes);

      return success("Message signed via app.wallet", {
        signature: toHex(sig),
      });
    },
  },
  {
    id: "sign-raw-legacy",
    name: "Sign Raw with DotNS Identity",
    description:
      "Signs a raw message with the account that owns the logged-in user's DotNS identity, via app.wallet.signMessageWithDotNsIdentity — the SDK resolves the primary username on the paired People/Individuality chain and signs with its owner.",
    api: "app.wallet.signMessageWithDotNsIdentity({ peopleChain, message })",
    args: [
      {
        name: "message",
        label: "Message",
        defaultValue: "Hello from a DotNS identity!",
      },
    ],
    category: "signing",
    async run(chain, logger, args) {
      const log = logger || (() => {});
      const message = args?.message ?? "Hello from a DotNS identity!";

      // Pick the People chain from the selected hub — no hardcoded descriptor.
      const peopleChain = PEOPLE_CHAIN_BY_HUB[chain.genesis];
      if (!peopleChain) {
        return error(
          `No People-chain descriptor for ${chain.name} — DotNS identity signing is available on the Paseo hubs.`,
        );
      }

      const app = await getApp();
      log("Resolving primary DotNS username + signing on the People chain...");
      const signed = await app.wallet.signMessageWithDotNsIdentity({
        peopleChain,
        message,
      });

      return success(`Message signed as ${signed.username}`, {
        username: signed.username,
        accountId: signed.accountId,
        signature: toHex(signed.signature),
        signatureLength: signed.signature.length,
      });
    },
  },
  {
    id: "create-transaction",
    name: "Create Transaction with Product Account",
    description:
      "Signs a transaction offline via the product account signer (mode = createTransaction). Returns the signed bytes without broadcasting.",
    api: "tx.sign(accountsProvider.getProductAccountSigner(account))",
    args: [
      {
        name: "dotNsIdentifier",
        label: "DotNS ID",
        defaultValue: SELF_DOTNS,
      },
      {
        name: "message",
        label: "Remark",
        defaultValue: "Create Transaction from Host Playground",
      },
    ],
    category: "signing",
    async run(chain, logger, args) {
      const log = logger || (() => {});
      const dotNsIdentifier = args?.dotNsIdentifier ?? SELF_DOTNS;

      log(`Fetching product account for ${dotNsIdentifier}...`);
      const accountsProvider = await accounts();
      const accountResult = await accountsProvider.getProductAccount(
        dotNsIdentifier,
        0,
      );
      const account = accountResult.match(
        (a) => a,
        (err) => {
          log(`getProductAccount failed: ${sdkErrorMessage(err)}`);
          return null;
        },
      );
      if (!account) {
        return error(
          `No product account for "${dotNsIdentifier}" — check that the user is signed in and the DotNS ID is valid`,
        );
      }

      // Product account signers route through the host's createTransaction path.
      const signer = accountsProvider.getProductAccountSigner(account);

      const client = await getClient(chain.genesis);
      const api = client.getUnsafeApi();

      const message =
        args?.message ?? "Create Transaction from Host Playground";
      const tx = api.tx.System.remark({ remark: Binary.fromText(message) });

      log("Signing (createTransaction mode)...");
      const signedBytes = await tx.sign(signer);
      const signedHex = toHex(signedBytes);
      return success(`Transaction signed (${signedBytes.length} bytes)`, {
        preview: `${signedHex.slice(0, 80)}...`,
        length: signedBytes.length,
      });
    },
  },
  {
    id: "sign-batch-payload",
    name: "Sign & Submit Batch (2 contract writes)",
    description:
      "Batches two storeValue calls on the SimpleStore contract using Utility.batch_all, signs via the createTransaction product signer, and submits atomically. All calls must be pallet-revive — mixing a System.remark in here makes the batch fail because the AsPgas fee route only applies to revive calls.",
    api: "api.tx.Utility.batch_all([storeValue, storeValue]).signSubmitAndWatch(signer)",
    category: "signing",
    async run(chain: ChainConfig, logger?: TestLogger) {
      const log = logger || (() => {});

      log("Fetching product account...");
      const accountsProvider = await accounts();
      const accountResult = await accountsProvider.getProductAccount(
        SELF_DOTNS,
        0,
      );
      const account = accountResult.match(
        (a) => a,
        () => null,
      );
      if (!account) return error("No product account available");

      const signer = accountsProvider.getProductAccountSigner(account);
      const origin = AccountId().dec(account.publicKey);

      const allowanceError = await ensureSmartContractAllowance(
        log,
        chain,
        account,
      );
      if (allowanceError) return allowanceError;

      const client = await getClient(chain.genesis);
      const api = client.getUnsafeApi();
      const sdk = createInkSdk(client);
      const contract = sdk.getContract(
        contracts.simpleStore,
        SIMPLE_STORE_ADDRESS,
      );

      log("Building 2 contract calls...");

      // Dry-run each call to get weight+storage, then extract the inner
      // pallet-revive call via decodedCall without broadcasting.
      const dryRun1 = await contract.query("storeValue", {
        origin,
        data: { _value: BigInt(42) },
      });
      if (!dryRun1.success) return error("Dry-run #1 failed", dryRun1.value);
      const dryRun2 = await contract.query("storeValue", {
        origin,
        data: { _value: BigInt(43) },
      });
      if (!dryRun2.success) return error("Dry-run #2 failed", dryRun2.value);
      const storeCall1 = await dryRun1.value.send().decodedCall;
      const storeCall2 = await dryRun2.value.send().decodedCall;

      log("Submitting Utility.batch_all of 2 calls...");
      const batchTx = api.tx.Utility.batch_all({
        calls: [storeCall1, storeCall2],
      });

      return new Promise<TestResult>((resolve, reject) => {
        batchTx.signSubmitAndWatch(signer).subscribe({
          next: (event) => {
            log(`Event: ${event.type}`);
            if (event.type === "finalized") {
              resolve(
                success(`Batch finalized on ${chain.name}`, {
                  txHash: event.txHash,
                  contract: SIMPLE_STORE_ADDRESS,
                  calls: [
                    "Revive.call (storeValue=42)",
                    "Revive.call (storeValue=43)",
                  ],
                }),
              );
            }
          },
          error: reject,
        });
      });
    },
  },
];

// Extension & Provider Tests
export const extensionTests: TestDefinition[] = [
  {
    id: "well-known-chains",
    name: "Well-Known Chains",
    description: "Verifies WellKnownChain constant exports",
    api: "WellKnownChain",
    category: "extension",
    async run() {
      const chains = Object.entries(WellKnownChain);
      const chainNames = chains.map(
        ([name, genesis]) => `${name}: ${genesis.slice(0, 10)}...`,
      );
      return success(
        `${chains.length} well-known chains available`,
        chainNames,
      );
    },
  },
];

// Storage Tests
export const storageTests: TestDefinition[] = [
  {
    id: "storage-string-write-read",
    name: "String Write & Read",
    description:
      "Writes and reads a string via app.localStorage (Tier-1 createApp storage)",
    api: "app.localStorage.set(key, value) / app.localStorage.get(key)",
    args: [
      { name: "key", label: "Key", defaultValue: "host_playground_string" },
    ],
    category: "storage",
    async run(_chain, _logger, args) {
      const key = args?.key ?? "host_playground_string";
      const value = `test_value_${Date.now()}`;

      const app = await getApp();
      await app.localStorage.set(key, value);
      const readValue = await app.localStorage.get(key);

      return readValue === value
        ? success(`Write: "${value}"\nRead: "${readValue}"`)
        : error(`Mismatch: wrote "${value}", read "${readValue}"`);
    },
  },
  {
    id: "storage-bytes-write-read",
    name: "Bytes Write & Read",
    description: "Writes and reads raw bytes via hostLocalStorage",
    api: "hostStorage().writeBytes(key, value) / readBytes(key)",
    args: [
      { name: "key", label: "Key", defaultValue: "host_playground_bytes" },
    ],
    category: "storage",
    // Stays on getHostLocalStorage: app.localStorage has no bytes surface.
    async run(_chain, _logger, args) {
      const key = args?.key ?? "host_playground_bytes";
      const value = new TextEncoder().encode(`bytes_${Date.now()}`);

      await (await hostStorage()).writeBytes(key, value);
      const readValue = await (await hostStorage()).readBytes(key);

      if (!readValue) {
        return error("Read returned undefined after write");
      }

      const match = toHex(value) === toHex(readValue);
      return match
        ? success(`Bytes round-trip OK (${value.length} bytes)`, {
            written: toHex(value),
            read: toHex(readValue),
          })
        : error("Bytes mismatch", {
            written: toHex(value),
            read: toHex(readValue),
          });
    },
  },
  {
    id: "storage-json-write-read",
    name: "JSON Write & Read",
    description:
      "Writes and reads JSON via app.localStorage (Tier-1 createApp storage)",
    api: "app.localStorage.setJSON(key, value) / app.localStorage.getJSON(key)",
    args: [{ name: "key", label: "Key", defaultValue: "host_playground_json" }],
    category: "storage",
    async run(_chain, _logger, args) {
      const key = args?.key ?? "host_playground_json";
      const value = {
        timestamp: Date.now(),
        nested: { foo: "bar", nums: [1, 2, 3] },
      };

      const app = await getApp();
      await app.localStorage.setJSON(key, value);
      const readValue = await app.localStorage.getJSON(key);

      const match = JSON.stringify(value) === JSON.stringify(readValue);
      return match
        ? success("JSON round-trip OK", readValue)
        : error("JSON mismatch", { written: value, read: readValue });
    },
  },
  {
    id: "storage-clear",
    name: "Storage Clear",
    description:
      "Removes a single storage key via app.localStorage.remove (Tier-1). Note: app.localStorage.clear() wipes ALL keys, so remove(key) is the per-key equivalent.",
    api: "app.localStorage.remove(key)",
    args: [
      { name: "key", label: "Key", defaultValue: "host_playground_string" },
    ],
    category: "storage",
    async run(_chain, _logger, args) {
      const key = args?.key ?? "host_playground_string";

      // Write then remove just this key — clear() would wipe ALL keys.
      const app = await getApp();
      await app.localStorage.set(key, "to_be_cleared");
      await app.localStorage.remove(key);

      const readValue = await app.localStorage.get(key);
      return !readValue || readValue === ""
        ? success("Storage key cleared successfully")
        : error(`Key still has value after clear: "${readValue}"`);
    },
  },
  {
    id: "storage-factory",
    name: "Storage Factory",
    description:
      "Creates a custom HostLocalStorage instance via createHostLocalStorage (Tier-2; app.localStorage has no factory equivalent)",
    api: "createHostLocalStorage()",
    args: [
      { name: "key", label: "Key", defaultValue: "host_playground_factory" },
    ],
    category: "storage",
    async run(_chain, _logger, args) {
      const key = args?.key ?? "host_playground_factory";
      const storage = await createHostLocalStorage();
      if (!storage)
        return error(
          "createHostLocalStorage returned null - not inside a host container",
        );
      const value = `factory_${Date.now()}`;

      await storage.writeString(key, value);
      const readValue = await storage.readString(key);
      await storage.clear(key);

      return readValue === value
        ? success(`Factory storage round-trip OK: "${value}"`)
        : error(`Mismatch: wrote "${value}", read "${readValue}"`);
    },
  },
];

// Permission Tests
export const permissionTests: TestDefinition[] = [
  {
    id: "feature-check",
    name: "Feature Check",
    description: "Checks if the selected chain is supported",
    api: "isChainSupported(genesisHash)",
    category: "permissions",
    async run(chain: ChainConfig) {
      try {
        const result = await isChainSupported(chain.genesis);
        return result.ok
          ? success(`${chain.name} supported: ${result.value}`)
          : error(sdkErrorMessage(result.error), result.error);
      } catch (err) {
        return error(sdkErrorMessage(err), err);
      }
    },
  },
  {
    id: "device-permission-camera",
    name: "Device Permission: Camera",
    description: "Requests camera access from the host",
    api: "requestDevicePermission('Camera')",
    category: "permissions",
    async run() {
      return runDevicePermissionTest("Camera", "Camera");
    },
  },
  {
    id: "device-permission-microphone",
    name: "Device Permission: Microphone",
    description: "Requests microphone access from the host",
    api: "requestDevicePermission('Microphone')",
    category: "permissions",
    async run() {
      return runDevicePermissionTest("Microphone", "Microphone");
    },
  },
  {
    id: "device-permission-location",
    name: "Device Permission: Location",
    description: "Requests location access from the host",
    api: "requestDevicePermission('Location')",
    category: "permissions",
    async run() {
      return runDevicePermissionTest("Location", "Location");
    },
  },
  {
    id: "device-permission-bluetooth",
    name: "Device Permission: Bluetooth",
    description: "Requests bluetooth access from the host",
    api: "requestDevicePermission('Bluetooth')",
    category: "permissions",
    async run() {
      return runDevicePermissionTest("Bluetooth", "Bluetooth");
    },
  },
  {
    id: "device-permission-notifications",
    name: "Device Permission: Notifications",
    description: "Requests notifications access from the host",
    api: "requestDevicePermission('Notifications')",
    category: "permissions",
    async run() {
      return runDevicePermissionTest("Notifications", "Notifications");
    },
  },
  {
    id: "device-permission-nfc",
    name: "Device Permission: NFC",
    description: "Requests NFC access from the host",
    api: "requestDevicePermission('NFC')",
    category: "permissions",
    async run() {
      return runDevicePermissionTest("NFC", "NFC");
    },
  },
  {
    id: "device-permission-clipboard",
    name: "Device Permission: Clipboard",
    description: "Requests clipboard access from the host",
    api: "requestDevicePermission('Clipboard')",
    category: "permissions",
    async run() {
      return runDevicePermissionTest("Clipboard", "Clipboard");
    },
  },
  {
    id: "device-permission-open-url",
    name: "Device Permission: Open URL",
    description: "Requests permission to open external URLs",
    api: "requestDevicePermission('OpenUrl')",
    category: "permissions",
    async run() {
      return runDevicePermissionTest("OpenUrl", "OpenUrl");
    },
  },
  {
    id: "device-permission-biometrics",
    name: "Device Permission: Biometrics",
    description: "Requests biometrics access from the host",
    api: "requestDevicePermission('Biometrics')",
    category: "permissions",
    async run() {
      return runDevicePermissionTest("Biometrics", "Biometrics");
    },
  },
  {
    id: "remote-permission-remote",
    name: "Remote Permission: Remote (HTTP/WS)",
    description: "Requests permission to connect to remote domains",
    api: "requestPermission({ tag: 'Remote', value: { domains: [url] } })",
    args: [
      {
        name: "url",
        label: "URL pattern",
        defaultValue: "https://example.com",
      },
    ],
    category: "permissions",
    async run(_chain, _logger, args) {
      const url = args?.url ?? "https://example.com";
      return runRemotePermissionTest(
        { tag: "Remote", value: { domains: [url] } },
        "Remote permission",
      );
    },
  },
  {
    id: "remote-permission-webrtc",
    name: "Remote Permission: WebRTC",
    description: "Requests permission to use WebRTC",
    api: "requestPermission({ tag: 'WebRtc', value: undefined })",
    category: "permissions",
    async run() {
      return runRemotePermissionTest(
        { tag: "WebRtc", value: undefined },
        "WebRTC permission",
      );
    },
  },
  {
    id: "remote-permission-chain-submit",
    name: "Remote Permission: Chain Submit",
    description: "Requests permission to submit transactions on a chain",
    api: "requestPermission({ tag: 'ChainSubmit', value: undefined })",
    category: "permissions",
    async run(chain) {
      return runRemotePermissionTest(
        { tag: "ChainSubmit", value: undefined },
        `Chain submit permission for ${chain.name}`,
      );
    },
  },
  {
    id: "remote-permission-preimage-submit",
    name: "Remote Permission: Preimage Submit",
    description: "Requests permission to submit preimages via the host",
    api: "requestPermission({ tag: 'PreimageSubmit', value: undefined })",
    category: "permissions",
    async run(chain) {
      return runRemotePermissionTest(
        { tag: "PreimageSubmit", value: undefined },
        `Preimage submit permission for ${chain.name}`,
      );
    },
  },
  {
    id: "remote-permission-statement-submit",
    name: "Remote Permission: Statement Submit",
    description: "Requests permission to submit statement-store statements",
    api: "requestPermission({ tag: 'StatementSubmit', value: undefined })",
    category: "permissions",
    async run(chain) {
      return runRemotePermissionTest(
        { tag: "StatementSubmit", value: undefined },
        `Statement submit permission for ${chain.name}`,
      );
    },
  },
];

// Statement Store Tests
export const statementTests: TestDefinition[] = [
  {
    id: "statement-store-create-proof",
    name: "Create Proof",
    description: "Creates an authorized statement proof via getStatementStore",
    api: "statementStore.createProofAuthorized(statement)",
    args: [],
    category: "statements",
    async run() {
      const statementStore = await statements();
      const messageBytes = new TextEncoder().encode(`Statement: ${Date.now()}`);

      try {
        const proof = await statementStore.createProofAuthorized({
          proof: undefined,
          decryptionKey: undefined,
          expiry: createExpiryFromDuration(STATEMENT_TTL_SECS),
          channel: undefined,
          topics: [],
          data: toHexString(messageBytes),
        });

        const proofValue = proof.value;
        const sig =
          "signature" in proofValue
            ? proofValue.signature.slice(0, 20)
            : "onchain";
        return success(`Proof type: ${proof.tag}, sig: ${sig}...`);
      } catch (e) {
        const err = e as { name?: string; payload?: { reason?: string } };
        return error(
          err.name
            ? `${err.name}${err.payload?.reason ? ` - ${err.payload.reason}` : ""}`
            : String(e),
        );
      }
    },
  },
  {
    id: "statement-store-create-proof-authorized",
    name: "Create Proof Authorized",
    description: "Creates a statement store proof via authorized account",
    api: "createProofAuthorized(statement)",
    category: "statements",
    async run() {
      const messageBytes = new TextEncoder().encode(`Statement: ${Date.now()}`);
      try {
        const result = await createProofAuthorized({
          proof: undefined,
          decryptionKey: undefined,
          expiry: createExpiryFromDuration(STATEMENT_TTL_SECS),
          channel: undefined,
          topics: [],
          data: toHexString(messageBytes),
        });
        if (!result.ok)
          return error(sdkErrorMessage(result.error), result.error);
        const proof = result.value;

        const proofValue = proof.value;
        const signature =
          "signature" in proofValue
            ? proofValue.signature.slice(0, 20)
            : "onchain";

        return success(`Proof type: ${proof.tag}, sig: ${signature}...`);
      } catch (err) {
        const e = err as { payload?: unknown };
        return error(String(err), e.payload);
      }
    },
  },
  {
    id: "statement-store-submit",
    name: "Submit Statement",
    description: "Creates a proof then submits the signed statement",
    api: "statementStore.submit(signedStatement)",
    args: [],
    category: "statements",
    async run(_chain, logger) {
      const log = logger || (() => {});

      const statementStore = await statements();
      const messageBytes = new TextEncoder().encode(`Statement: ${Date.now()}`);

      const statement = {
        proof: undefined,
        decryptionKey: undefined,
        expiry: createExpiryFromDuration(STATEMENT_TTL_SECS),
        channel: undefined,
        topics: [],
        data: toHexString(messageBytes),
      };

      try {
        log("Creating proof...");
        const proof = await statementStore.createProofAuthorized(statement);
        log(`Proof created: ${proof.tag}`);

        const signedStatement = {
          proof,
          decryptionKey: undefined,
          expiry: createExpiryFromDuration(STATEMENT_TTL_SECS),
          channel: undefined,
          topics: [],
          data: toHexString(messageBytes),
        };
        log("Submitting signed statement...");
        await statementStore.submit(signedStatement);
        return success("Statement submitted successfully");
      } catch (e) {
        const err = e as { name?: string; payload?: { reason?: string } };
        return error(
          err.name
            ? `${err.name}${err.payload?.reason ? ` - ${err.payload.reason}` : ""}`
            : String(e),
        );
      }
    },
  },
  {
    id: "statement-store-subscribe-match-all",
    name: "Subscribe Statements",
    description: "Subscribes to statement store topics (5s)",
    api: "statementStore.subscribe(filter, callback)",
    category: "statements",
    async run() {
      const statementStore = await statements();

      return new Promise((resolve) => {
        const received: unknown[] = [];
        const subscription = statementStore.subscribe(
          { matchAll: [] },
          (page) => {
            received.push(...page.statements);
          },
        );

        setTimeout(() => {
          subscription.unsubscribe();
          resolve(
            success(
              `Received ${received.length} statements in 5s`,
              received.slice(-5),
            ),
          );
        }, 5000);
      });
    },
  },
  {
    id: "statement-store-subscribe-match-any",
    name: "Subscribe Statements (matchAny)",
    description:
      "Subscribes to statement store using a matchAny topic filter (5s)",
    api: "statementStore.subscribe({ matchAny: [topic1, topic2] }, callback)",
    args: [
      {
        name: "topicA",
        label: "Topic A",
        defaultValue: "host-playground:topic-a",
      },
      {
        name: "topicB",
        label: "Topic B",
        defaultValue: "host-playground:topic-b",
      },
    ],
    category: "statements",
    async run(_chain, _logger, args) {
      const statementStore = await statements();
      // Statement Store topics are a chain primitive Hash — they must
      // be exactly 32 bytes. Hash the user-supplied string so any
      // length input maps to a valid topic.
      const topicA = await hashTopic(args?.topicA ?? "host-playground:topic-a");
      const topicB = await hashTopic(args?.topicB ?? "host-playground:topic-b");

      return new Promise((resolve) => {
        const received: unknown[] = [];
        const subscription = statementStore.subscribe(
          { matchAny: [topicA, topicB] },
          (page) => {
            received.push(...page.statements);
          },
        );

        setTimeout(() => {
          subscription.unsubscribe();
          resolve(
            success(
              `Received ${received.length} statements in 5s (matchAny)`,
              received.slice(-5),
            ),
          );
        }, 5000);
      });
    },
  },
];

// Preimage Tests
export const preimageTests: TestDefinition[] = [
  {
    id: "preimage-submit",
    name: "Submit Preimage",
    description: "Submits a preimage and gets its hash back",
    api: "getPreimageManager().submit(data)",
    category: "preimage",
    async run(_chain, logger) {
      const data = new TextEncoder().encode(`preimage_${Date.now()}`);
      const hash = await (await pm()).submit(data);

      return success(`Preimage submitted, hash: ${hash.slice(0, 20)}...`, {
        hash,
        dataLength: data.length,
      });
    },
  },
  {
    id: "preimage-lookup",
    name: "Lookup Preimage",
    description: "Looks up a preimage by hash (5s)",
    api: "getPreimageManager().lookup(hash, callback)",
    args: [
      {
        name: "hash",
        label: "Hash (0x…)",
        defaultValue:
          "0x5e933dd685deedfbf58063678bfa2abead4dc25e6da4ffea190503cfaa940d51",
      },
    ],
    category: "preimage",
    async run(_chain, logger, args) {
      const log = logger || (() => {});
      const hash = (args?.hash ??
        "0x5e933dd685deedfbf58063678bfa2abead4dc25e6da4ffea190503cfaa940d51") as `0x${string}`;

      log(`Looking up hash: ${hash.slice(0, 20)}...`);

      const preimageManager = await pm();
      return new Promise((resolve) => {
        let found = false;
        log("Starting lookup subscription...");
        const subscription = preimageManager.lookup(hash, (preimage) => {
          found = true;
          subscription.unsubscribe();
          if (preimage) {
            resolve(
              success(`Preimage found (${preimage.length} bytes)`, {
                hash,
                preimage: toHex(preimage),
              }),
            );
          } else {
            resolve(
              success(`Lookup returned null for hash ${hash.slice(0, 20)}...`),
            );
          }
        });

        setTimeout(() => {
          if (!found) {
            subscription.unsubscribe();
            resolve(
              success(
                `No lookup callback in 5s for hash ${hash.slice(0, 20)}...`,
              ),
            );
          }
        }, 5000);
      });
    },
  },
  {
    id: "preimage-factory",
    name: "Preimage Factory",
    description: "Creates a preimage manager via createHostPreimageManager",
    api: "createHostPreimageManager()",
    category: "preimage",
    async run(_chain, logger) {
      const manager = await createHostPreimageManager();
      if (!manager)
        return error(
          "createHostPreimageManager returned null - not inside a host container",
        );
      const data = new TextEncoder().encode(`factory_${Date.now()}`);
      const hash = await manager.submit(data);

      return success(
        `Factory preimage submitted, hash: ${hash.slice(0, 20)}...`,
        {
          hash,
        },
      );
    },
  },
  {
    id: "bulletin-upload-and-verify",
    name: "Upload File to Bulletin & Fetch by CID",
    description:
      "Submits a timestamped text file through the host's preimage submit, derives its canonical CID, and fetches it back by CID via the host's preimage lookup (no public IPFS gateway). Asserts byte equality.",
    api: "getPreimageManager().submit + calculateCid + queryBytes(cid)",
    category: "preimage",
    async run(chain, logger) {
      const log = logger || (() => {});

      log("Requesting BulletinAllowance...");
      try {
        const allocation = await requestResourceAllocation([
          { tag: "BulletinAllowance", value: undefined },
        ]);
        if (!allocation.ok) {
          return error(sdkErrorMessage(allocation.error), allocation.error);
        }
      } catch (allocErr) {
        return error("Bulletin allowance request failed", allocErr);
      }

      const ts = new Date().toISOString();
      const filename = `host-playground-upload-${Date.now()}.txt`;
      const content =
        `host-playground bulletin upload\n` +
        `timestamp: ${ts}\n` +
        `chain: ${chain.name} (${chain.network})\n` +
        `genesis: ${chain.genesis}\n`;
      const payload = new TextEncoder().encode(content);
      log(`Generated ${payload.length} bytes (${filename})`);

      // Upload via the host's preimage submit (wrapped) — the host routes it to
      // the bulletin chain; the product never opens an RPC or its own PAPI.
      log("Submitting via (await pm()).submit...");
      const hash = await (await pm()).submit(payload);
      log(`Host returned preimage key: ${hash}`);

      // calculateCid uses the bulletin runtime's codec+hashing (raw 0x55 +
      // blake2b-256), so the CID matches what was stored (tiny payload → no
      // chunking / DAG-PB manifest).
      const cid = (await calculateCid(payload)).toString();
      log(`Canonical CID: ${cid}`);

      // Fast-fail: the CID-derived preimage key must equal the host's submit
      // key, else queryBytes burns the full lookup timeout before failing.
      const derivedKey = cidToPreimageKey(cid);
      if (derivedKey.toLowerCase() !== hash.toLowerCase()) {
        return error("CID-derived preimage key ≠ host submit key", {
          cid,
          derivedKey,
          hash,
        });
      }

      // Fetch back BY CID through the host's preimage lookup.
      log(
        "Fetching by CID via queryBytes (host preimage lookup, up to 60s)...",
      );
      let fetched: Uint8Array;
      try {
        const fetchResult = await queryBytes(cid, { lookupTimeoutMs: 60_000 });
        if (!fetchResult.ok) {
          return error("Fetch by CID via host failed", {
            cid,
            hash,
            submitted: toHex(payload),
            reason: sdkErrorMessage(fetchResult.error),
          });
        }
        fetched = fetchResult.value;
      } catch (e) {
        return error("Fetch by CID via host failed", {
          cid,
          hash,
          submitted: toHex(payload),
          reason: e instanceof Error ? e.message : String(e),
        });
      }

      const equal = bytesEqual(payload, fetched);
      log(`Fetched ${fetched.length} bytes by CID, equal=${equal}`);
      if (!equal) {
        return error("Fetched bytes ≠ submitted payload", {
          cid,
          hash,
          submitted: toHex(payload),
          fetched: toHex(fetched),
        });
      }

      return success(
        `Round-trip verified via host: submit + fetch-by-CID, ${payload.length} bytes`,
        {
          filename,
          content,
          hash,
          cid,
          submittedBytes: payload.length,
          fetchedBytes: fetched.length,
          payloadEqualsFetched: true,
        },
      );
    },
  },
];

// Notification Tests
export const notificationTests: TestDefinition[] = [
  {
    id: "push-notification",
    name: "Push Notification",
    description:
      "Send a push notification to the host. Leave 'Schedule in' empty to fire immediately, or set seconds in the future to schedule it.",
    api: "getNotificationManager().push({ text, deeplink, scheduledAt })",
    args: [
      { name: "text", label: "Text", defaultValue: "Hello from demo product!" },
      { name: "deeplink", label: "Deeplink (optional)", defaultValue: "" },
      {
        name: "scheduleInSeconds",
        label: "Schedule in (seconds, optional)",
        defaultValue: "",
      },
    ],
    category: "notifications",
    async run(_chain, _logger, args) {
      const text = args?.text ?? "Hello from demo product!";
      const deeplink = args?.deeplink?.trim() || undefined;

      // Relative seconds → absolute epoch-ms; empty means immediate.
      const rawSeconds = args?.scheduleInSeconds?.trim() ?? "";
      let scheduledAt: bigint | undefined;
      if (rawSeconds !== "") {
        const seconds = Number(rawSeconds);
        if (!Number.isFinite(seconds) || seconds <= 0) {
          return error(
            "Invalid schedule",
            `"Schedule in" must be a positive number of seconds, got "${rawSeconds}"`,
          );
        }
        scheduledAt = BigInt(Date.now() + Math.round(seconds * 1000));
      }

      // The host's push() prompts for the Notifications permission itself, so
      // no explicit pre-check here. Requesting it first caused a second prompt
      // when the user picked "Allow once" (see issue #33).
      const nm = await getNotificationManager();
      if (!nm)
        return error(
          "getNotificationManager returned null - not inside a host container",
        );

      const when =
        scheduledAt === undefined
          ? "now"
          : `at ${new Date(Number(scheduledAt)).toLocaleTimeString()}`;

      try {
        const id = await nm.push({ text, deeplink, scheduledAt });
        return success(
          `Notification (#${String(id)}) scheduled ${when}: "${text}"${deeplink ? ` → ${deeplink}` : ""}`,
        );
      } catch (err) {
        const e = err as { name?: string };
        return error(e.name ?? String(err), err);
      }
    },
  },
  {
    id: "cancel-notification",
    name: "Cancel Notification",
    description:
      "Cancel a previously scheduled notification by its id (the number returned by Push Notification). Cancelling is idempotent: an unknown or already-fired id is a no-op.",
    api: "getNotificationManager().cancel(id)",
    args: [{ name: "id", label: "Notification id", defaultValue: "" }],
    category: "notifications",
    async run(_chain, _logger, args) {
      const rawId = args?.id?.trim() ?? "";
      const id = Number(rawId);
      if (rawId === "" || !Number.isInteger(id) || id <= 0) {
        return error(
          "Invalid id",
          `"Notification id" must be a positive integer, got "${rawId}"`,
        );
      }

      const nm = await getNotificationManager();
      if (!nm)
        return error(
          "getNotificationManager returned null - not inside a host container",
        );

      try {
        await nm.cancel(id);
        return success(`Cancel requested for notification #${String(id)}`);
      } catch (err) {
        const e = err as { name?: string };
        return error(e.name ?? String(err), err);
      }
    },
  },
];

// Navigation Tests
export const navigationTests: TestDefinition[] = [
  {
    id: "navigate-internal",
    name: "Navigate In-App",
    description:
      "Navigates within the app to /page/ with query params and fragment",
    api: "router.push(path) (Next.js client navigation)",
    category: "navigation",
    async run(_chain, _logger, _args, navigate) {
      const path = "/page/?id=hello#fragment=something";
      navigate?.(path);
      return success(`Navigating to ${path}`);
    },
  },
  {
    id: "navigate-polkadot",
    name: "Navigate to Polkadot URL",
    description: "Navigates to a host-compatible URL via hostApi",
    api: "navigateTo(url)",
    args: [{ name: "url", label: "URL", defaultValue: "https://search.dot" }],
    category: "navigation",
    async run(_chain, logger, args) {
      const url = args?.url ?? "https://search.dot";
      try {
        await navigateTo(url);
        return success(`Navigated to ${url}`);
      } catch (err) {
        const e = err as { name?: string };
        return error(e.name ?? String(err), err);
      }
    },
  },
  {
    id: "navigate-http",
    name: "Navigate to HTTP URL",
    description: "Navigates to an external HTTP/S URL via hostApi",
    api: "navigateTo(url)",
    args: [{ name: "url", label: "URL", defaultValue: "https://polkadot.com" }],
    category: "navigation",
    async run(_chain, logger, args) {
      const url = args?.url ?? "https://polkadot.com";
      try {
        await navigateTo(url);
        return success(`Navigated to ${url}`);
      } catch (err) {
        const e = err as { name?: string };
        return error(e.name ?? String(err), err);
      }
    },
  },
];

// Chain Interaction Tests
export const chainTests: TestDefinition[] = [
  {
    id: "chain-spec-genesis-hash",
    name: "Chain Spec: Genesis Hash",
    description:
      "Gets the genesis hash for a chain via the typed chain interaction protocol",
    api: "getChainSpec(genesisHash).genesisHash",
    category: "chain",
    async run(chain: ChainConfig) {
      try {
        const result = await getChainSpec(chain.genesis);
        if (!result.ok)
          return error(sdkErrorMessage(result.error), result.error);
        return success(`Genesis hash: ${result.value?.genesisHash}`);
      } catch (err) {
        const e = err as { name?: string };
        return error(e.name ?? String(err), err);
      }
    },
  },
  {
    id: "chain-spec-chain-name",
    name: "Chain Spec: Chain Name",
    description: "Gets the chain name via the typed chain interaction protocol",
    api: "getChainSpec(genesisHash).name",
    category: "chain",
    async run(chain: ChainConfig) {
      try {
        const result = await getChainSpec(chain.genesis);
        if (!result.ok)
          return error(sdkErrorMessage(result.error), result.error);
        return success(`Chain name: ${result.value?.name}`);
      } catch (err) {
        const e = err as { name?: string };
        return error(e.name ?? String(err), err);
      }
    },
  },
  {
    id: "chain-spec-properties",
    name: "Chain Spec: Properties",
    description:
      "Gets chain properties (token symbol, decimals, etc.) via the typed protocol",
    api: "getChainSpec(genesisHash).propertiesRaw",
    category: "chain",
    async run(chain: ChainConfig) {
      try {
        const result = await getChainSpec(chain.genesis);
        if (!result.ok)
          return error(sdkErrorMessage(result.error), result.error);
        return success(`Properties: ${result.value?.propertiesRaw}`);
      } catch (err) {
        const e = err as { name?: string };
        return error(e.name ?? String(err), err);
      }
    },
  },
  {
    id: "chain-transaction-broadcast",
    name: "Transaction: Broadcast",
    description: "Broadcasts a dummy transaction (expected to fail validation)",
    api: "broadcastTransaction(genesisHash, transaction)",
    warning: "Will fail with invalid transaction",
    category: "chain",
    async run(chain: ChainConfig) {
      try {
        const result = await broadcastTransaction(
          chain.genesis,
          "0x00" as `0x${string}`,
        );
        if (!result.ok)
          return error(sdkErrorMessage(result.error), result.error);
        const operationId = result.value;
        return operationId
          ? success(`Broadcast started, operationId: ${operationId}`)
          : success("Broadcast accepted (no operationId)");
      } catch (err) {
        const e = err as { name?: string };
        return error(e.name ?? String(err), err);
      }
    },
  },
  {
    id: "chain-transaction-stop",
    name: "Transaction: Stop",
    description: "Broadcasts a transaction then immediately stops it",
    api: "broadcastTransaction(...) then stopTransaction(genesisHash, operationId)",
    category: "chain",
    async run(chain: ChainConfig, logger) {
      const log = logger || (() => {});
      log("Broadcasting dummy transaction...");

      let operationId: string | null;
      try {
        const result = await broadcastTransaction(
          chain.genesis,
          "0x00" as `0x${string}`,
        );
        if (!result.ok)
          return error(sdkErrorMessage(result.error), result.error);
        operationId = result.value;
      } catch (err) {
        const e = err as { name?: string };
        return error(e.name ?? String(err), err);
      }

      if (!operationId)
        return success("Broadcast returned no operationId — nothing to stop");

      log(`Stopping broadcast ${operationId}...`);
      try {
        const result = await stopTransaction(chain.genesis, operationId);
        if (!result.ok)
          return error(sdkErrorMessage(result.error), result.error);
        return success(`Stopped broadcast ${operationId}`);
      } catch (err) {
        const e = err as { name?: string };
        return error(e.name ?? String(err), err);
      }
    },
  },
  {
    id: "chain-query-balance",
    name: "Query Balance",
    description:
      "Queries System.Account balance. Defaults to this product's account; the field can be edited to query anyone.",
    api: "getClient(genesis) → client.getUnsafeApi().query.System.Account.getValue(address)",
    args: [
      {
        name: "address",
        label: "Address (SS58)",
        defaultValue: async () => {
          // Prefill with ss58 prefix 0 (all Paseo hubs); run() re-encodes with
          // the active chain's prefix if it differs.
          const accountsProvider = await accounts();
          const result = await accountsProvider.getProductAccount(
            SELF_DOTNS,
            0,
          );
          return result.match(
            (a) => AccountId(0).dec(a.publicKey),
            () => "",
          );
        },
      },
    ],
    category: "chain",
    async run(chain: ChainConfig, logger, args) {
      const log = logger || (() => {});
      let address = args?.address?.trim();
      if (!address) {
        const accountsProvider = await accounts();
        const accountResult = await accountsProvider.getProductAccount(
          SELF_DOTNS,
          0,
        );
        const account = accountResult.match(
          (a) => a,
          () => null,
        );
        if (!account) {
          return error(`No product account for "${SELF_DOTNS}"`);
        }
        address = AccountId(chain.ss58Prefix).dec(account.publicKey);
        log(`Resolved product account ${SELF_DOTNS}/0 → ${address}`);
      }
      // Stays on getClient (genesis-keyed): app.chain is descriptor-based and
      // ChainConfig carries no PAPI descriptor, so there's no clean mapping.
      const client = await getClient(chain.genesis);
      try {
        const api = client.getUnsafeApi();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const account: any = await api.query.System.Account.getValue(address);
        const free = account?.data?.free ?? 0;
        const reserved = account?.data?.reserved ?? 0;
        return success(
          `Balance for ${address.slice(0, 8)}…: free=${free}, reserved=${reserved}`,
          account,
        );
      } catch (e) {
        return error(`Failed to query balance: ${e}`);
      }
    },
  },
];

export const contractTests: TestDefinition[] = [
  {
    id: "contract-query-stored-value",
    name: "Contract: Query Stored Value",
    description: "Reads getStoredValue() from the SimpleStore contract",
    api: "contract.query('getStoredValue', { origin })",
    category: "contract",
    async run(chain: ChainConfig) {
      const contractAddress = SIMPLE_STORE_ADDRESS;
      const origin = READ_ORIGIN;
      const client = await getClient(chain.genesis);
      try {
        const sdk = createInkSdk(client);
        const contract = sdk.getContract(
          contracts.simpleStore,
          contractAddress,
        );
        const result = await contract.query("getStoredValue", { origin });
        if (!result.success) return error("Query failed", result.value);
        return success(`Stored value: ${result.value.response}`, {
          value: String(result.value.response),
          contract: contractAddress,
        });
      } catch (e) {
        return error(`Failed to query: ${e}`);
      }
    },
  },
  {
    id: "contract-store-value",
    name: "Contract: Store Value",
    description:
      "Calls storeValue() on the SimpleStore contract (write operation)",
    api: "contract.send('storeValue', { origin, data: { _value } }).signSubmitAndWatch(signer)",
    args: [
      {
        name: "value",
        label: "Value (uint256)",
        defaultValue: "42",
      },
    ],
    category: "contract",
    async run(chain: ChainConfig, logger?: TestLogger, args?) {
      const log = logger || (() => {});

      log("Fetching account...");
      const accountsProvider = await accounts();
      const accountResult = await accountsProvider.getProductAccount(
        SELF_DOTNS,
        0,
      );
      const account = accountResult.match(
        (a) => a,
        () => null,
      );
      if (!account) return error("No product account available");

      const signer = accountsProvider.getProductAccountSigner(account);
      const origin = AccountId().dec(account.publicKey);

      const allowanceError = await ensureSmartContractAllowance(
        log,
        chain,
        account,
      );
      if (allowanceError) return allowanceError;

      const client = await getClient(chain.genesis);
      const sdk = createInkSdk(client);
      const contract = sdk.getContract(
        contracts.simpleStore,
        SIMPLE_STORE_ADDRESS,
      );

      const value = BigInt(args?.value ?? "42");
      log(`Storing value ${value}...`);

      const dryRun = await contract.query("storeValue", {
        origin,
        data: { _value: value },
      });
      if (!dryRun.success) return error("Dry-run failed", dryRun.value);

      log("Signing and submitting...");
      let settled = false;
      await new Promise<void>((resolve, reject) => {
        dryRun.value
          .send()
          .signSubmitAndWatch(signer)
          .subscribe({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            next: (ev: any) => {
              log(`Event: ${ev.type}`);
              if (ev.type === "txBestBlocksState" && ev.found) {
                settled = true;
                resolve();
              }
              if (ev.type === "finalized" && !ev.ok) {
                settled = true;
                reject(new Error("Tx failed"));
              }
            },
            error: (err: unknown) => {
              settled = true;
              reject(err);
            },
            complete: () => {
              if (!settled)
                reject(new Error("tx stream completed before settling"));
            },
          });
      });

      return success(`Stored value: ${value}`, {
        value: String(value),
        contract: SIMPLE_STORE_ADDRESS,
      });
    },
  },
  {
    id: "contract-query-data-length",
    name: "Contract: Query Data Length",
    description: "Reads getStoredDataLength() from the SimpleStore contract",
    api: "contract.query('getStoredDataLength', { origin })",
    category: "contract",
    async run(chain: ChainConfig) {
      const contractAddress = SIMPLE_STORE_ADDRESS;
      const origin = READ_ORIGIN;
      const client = await getClient(chain.genesis);
      try {
        const sdk = createInkSdk(client);
        const contract = sdk.getContract(
          contracts.simpleStore,
          contractAddress,
        );
        const result = await contract.query("getStoredDataLength", { origin });
        if (!result.success) return error("Query failed", result.value);
        return success(`Data length: ${result.value.response} bytes`, {
          length: String(result.value.response),
          contract: contractAddress,
        });
      } catch (e) {
        return error(`Failed to query: ${e}`);
      }
    },
  },
  {
    id: "contract-query-balance",
    name: "Contract: Query Balance",
    description:
      "Reads getBalance() (address(this).balance) from the SimpleStore contract",
    api: "contract.query('getBalance', { origin })",
    category: "contract",
    async run(chain: ChainConfig) {
      const contractAddress = SIMPLE_STORE_ADDRESS;
      const origin = READ_ORIGIN;
      const client = await getClient(chain.genesis);
      try {
        const sdk = createInkSdk(client);
        const contract = sdk.getContract(
          contracts.simpleStore,
          contractAddress,
        );
        const result = await contract.query("getBalance", { origin });
        if (!result.success) return error("Query failed", result.value);
        const wei = result.value.response as bigint;
        const divisor = BigInt("1000000000000000000");
        const whole = wei / divisor;
        const frac =
          (wei % divisor).toString().padStart(18, "0").replace(/0+$/, "") ||
          "0";
        const formatted = `${whole}.${frac}`;
        return success(`Contract balance: ${formatted} PAS`, {
          balanceWei: String(wei),
          contract: contractAddress,
        });
      } catch (e) {
        return error(`Failed to query: ${e}`);
      }
    },
  },
  {
    id: "contract-deposit",
    name: "Contract: Deposit",
    description:
      "Calls deposit() on the SimpleStore contract (payable write operation)",
    api: "contract.send('deposit', { origin, value: amount }).signSubmitAndWatch(signer)",
    timeoutMs: 90_000,
    args: [
      {
        name: "amount",
        label: "Amount (PAS)",
        defaultValue: "0.1",
      },
    ],
    category: "contract",
    async run(chain: ChainConfig, logger?: TestLogger, args?) {
      const log = logger || (() => {});

      log("Fetching account...");
      const accountsProvider = await accounts();
      const accountResult = await accountsProvider.getProductAccount(
        SELF_DOTNS,
        0,
      );
      const account = accountResult.match(
        (a) => a,
        () => null,
      );
      if (!account) return error("No product account available");

      const signer = accountsProvider.getProductAccountSigner(account);
      const origin = AccountId().dec(account.publicKey);

      const allowanceError = await ensureSmartContractAllowance(
        log,
        chain,
        account,
      );
      if (allowanceError) return allowanceError;

      const client = await getClient(chain.genesis);
      const sdk = createInkSdk(client);
      const contract = sdk.getContract(
        contracts.simpleStore,
        SIMPLE_STORE_ADDRESS,
      );

      const amountStr = args?.amount ?? "0.1";
      const [whole = "0", frac = ""] = amountStr.split(".");
      const planck =
        BigInt(whole) * BigInt("10000000000") +
        BigInt(frac.padEnd(10, "0").slice(0, 10));
      log(`Depositing ${amountStr} PAS (${planck} planck)...`);

      const dryRun = await contract.query("deposit", { origin, value: planck });
      if (!dryRun.success) return error("Dry-run failed", dryRun.value);

      log("Signing and submitting...");
      let settled = false;
      await new Promise<void>((resolve, reject) => {
        dryRun.value
          .send()
          .signSubmitAndWatch(signer)
          .subscribe({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            next: (ev: any) => {
              log(`Event: ${ev.type}`);
              if (ev.type === "txBestBlocksState" && ev.found) {
                settled = true;
                resolve();
              }
              if (ev.type === "finalized" && !ev.ok) {
                settled = true;
                reject(new Error("Tx failed"));
              }
            },
            error: (err: unknown) => {
              settled = true;
              reject(err);
            },
            complete: () => {
              if (!settled)
                reject(new Error("tx stream completed before settling"));
            },
          });
      });

      return success(`Deposited ${amountStr} PAS`, {
        planck: String(planck),
        contract: SIMPLE_STORE_ADDRESS,
      });
    },
  },
  {
    id: "contract-withdraw",
    name: "Contract: Withdraw",
    description:
      "Calls withdraw() on the SimpleStore contract (write operation)",
    api: "contract.send('withdraw', { origin, data: { _amount } }).signSubmitAndWatch(signer)",
    timeoutMs: 90_000,
    args: [
      {
        name: "amount",
        label: "Amount (PAS)",
        defaultValue: "0.1",
      },
    ],
    category: "contract",
    async run(chain: ChainConfig, logger?: TestLogger, args?) {
      const log = logger || (() => {});

      log("Fetching account...");
      const accountsProvider = await accounts();
      const accountResult = await accountsProvider.getProductAccount(
        SELF_DOTNS,
        0,
      );
      const account = accountResult.match(
        (a) => a,
        () => null,
      );
      if (!account) return error("No product account available");

      const signer = accountsProvider.getProductAccountSigner(account);
      const origin = AccountId().dec(account.publicKey);

      const allowanceError = await ensureSmartContractAllowance(
        log,
        chain,
        account,
      );
      if (allowanceError) return allowanceError;

      const client = await getClient(chain.genesis);
      const sdk = createInkSdk(client);
      const contract = sdk.getContract(
        contracts.simpleStore,
        SIMPLE_STORE_ADDRESS,
      );

      const amountStr = args?.amount ?? "0.1";
      const [whole = "0", frac = ""] = amountStr.split(".");
      // withdraw() takes wei (18 decimals)
      const wei =
        BigInt(whole) * BigInt("1000000000000000000") +
        BigInt(frac.padEnd(18, "0").slice(0, 18));
      log(`Withdrawing ${amountStr} PAS (${wei} wei)...`);

      const dryRun = await contract.query("withdraw", {
        origin,
        data: { _amount: wei },
      });
      if (!dryRun.success) return error("Dry-run failed", dryRun.value);

      log("Signing and submitting...");
      let settled = false;
      await new Promise<void>((resolve, reject) => {
        dryRun.value
          .send()
          .signSubmitAndWatch(signer)
          .subscribe({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            next: (ev: any) => {
              log(`Event: ${ev.type}`);
              if (ev.type === "txBestBlocksState" && ev.found) {
                settled = true;
                resolve();
              }
              if (ev.type === "finalized" && !ev.ok) {
                settled = true;
                reject(new Error("Tx failed"));
              }
            },
            error: (err: unknown) => {
              settled = true;
              reject(err);
            },
            complete: () => {
              if (!settled)
                reject(new Error("tx stream completed before settling"));
            },
          });
      });

      return success(`Withdrew ${amountStr} PAS`, {
        wei: String(wei),
        contract: SIMPLE_STORE_ADDRESS,
      });
    },
  },
  {
    id: "contract-query-total-deposits",
    name: "Contract: Query Total Deposits",
    description: "Reads totalDeposits() from the SimpleStore contract",
    api: "contract.query('totalDeposits', { origin })",
    category: "contract",
    async run(chain: ChainConfig) {
      const contractAddress = SIMPLE_STORE_ADDRESS;
      const origin = READ_ORIGIN;
      const client = await getClient(chain.genesis);
      try {
        const sdk = createInkSdk(client);
        const contract = sdk.getContract(
          contracts.simpleStore,
          contractAddress,
        );
        const result = await contract.query("totalDeposits", { origin });
        if (!result.success) return error("Query failed", result.value);
        return success(`Total deposits: ${result.value.response}`, {
          deposits: String(result.value.response),
          contract: contractAddress,
        });
      } catch (e) {
        return error(`Failed to query: ${e}`);
      }
    },
  },
  {
    id: "contract-store-value-if-person",
    name: "Contract: Store Value if Person",
    description:
      "Generates a Ring VRF personhood proof (createRingVRFProof) and calls storeValueIfPerson; the contract verifies it via the individuality precompile (0x…0a010000) and stores the value only for a verified person. NOTE: needs an individuality-provisioned network AND a host matching the app's product-sdk — otherwise createRingVRFProof times out or the proof is rejected.",
    api: "createRingVRFProof(context, location, message) → contract.send('storeValueIfPerson', { _value, request })",
    args: [
      {
        name: "value",
        label: "Value (uint256)",
        defaultValue: "7",
      },
    ],
    category: "contract",
    async run(chain: ChainConfig, logger?: TestLogger, args?) {
      const log = logger || (() => {});

      try {
        log("Fetching product account...");
        const accountsProvider = await withTrace("accounts()", accounts());
        const account = await withTrace(
          "getProductAccount",
          accountsProvider.getProductAccount(SELF_DOTNS, 0).match(
            (a) => a,
            () => null,
          ),
        );
        if (!account) return error("No product account available");

        const signer = accountsProvider.getProductAccountSigner(account);
        const origin = AccountId().dec(account.publicKey);

        // The contract binds the proof to `abi.encodePacked(msg.sender)` — the
        // caller's H160 — so generate the proof over that exact address.
        const message = fromHex(deriveH160(account.publicKey));

        const peopleGenesis = ASSETHUB_GENESIS_TO_PEOPLE_GENESIS[chain.genesis];
        if (!peopleGenesis) {
          return error(
            `No People chain known for ${chain.name} — the personhood rings live there.`,
          );
        }

        // 0.19: createRingVRFProof resolves the ring itself and returns the full
        // bundle {proof, contextualAlias, ringIndex, ringRevision}. Guarded by a
        // timeout since an unprovisioned host never answers.
        log("Requesting Ring VRF personhood proof (createRingVRFProof)...");
        const proofResult = await withTrace(
          "createRingVRFProof",
          Promise.race([
            accountsProvider
              .createRingVRFProof(
                { productId: SELF_DOTNS, suffix: PRODUCT_ALIAS_CONTEXT_SUFFIX },
                personhoodRing(peopleGenesis),
                message,
              )
              .match(
                (p) => ({ ok: true as const, proof: p }),
                (e) => ({ ok: false as const, reason: e.tag }),
              ),
            new Promise<{ ok: false; reason: string }>((resolve) =>
              setTimeout(
                () =>
                  resolve({
                    ok: false,
                    reason: "timed out (host never answered)",
                  }),
                15000,
              ),
            ),
          ]),
        );
        if (!proofResult.ok) {
          return error(`createRingVRFProof ${proofResult.reason}`);
        }
        const proof = proofResult.proof;
        log(
          `Proof received (ring ${proof.ringIndex}, revision ${proof.ringRevision})`,
        );

        const allowanceError = await withTrace(
          "ensureSmartContractAllowance",
          ensureSmartContractAllowance(log, chain, account),
        );
        if (allowanceError) return allowanceError;

        const client = await withTrace("getClient", getClient(chain.genesis));
        const sdk = createInkSdk(client);
        const contract = sdk.getContract(
          contracts.simpleStore,
          SIMPLE_STORE_ADDRESS,
        );

        const value = BigInt(args?.value ?? "7");
        // expectedStatus 1 = Lite tier, matching the People Lite ring the
        // proof came from. `message` is overwritten with msg.sender inside
        // the contract. The alias and ring metadata come from the proof
        // bundle. The generated descriptor types the byte fields as
        // Uint8Array, but the sol ABI encoder underneath only accepts 0x hex
        // strings, so the values are hex and the cast restores the descriptor
        // shape.
        const request = {
          expectedStatus: 1,
          proof: toHexString(scaleBytes(proof.proof)),
          expectedAlias: toHexString(proof.contextualAlias.alias),
          ringIndex: proof.ringIndex,
          context: toHexString(proof.contextualAlias.context),
          revision: proof.ringRevision,
          message: toHexString(message),
        } as unknown as {
          expectedStatus: number;
          proof: Uint8Array;
          expectedAlias: Uint8Array;
          ringIndex: number;
          context: Uint8Array;
          revision: number;
          message: Uint8Array;
        };

        log("Dry-running storeValueIfPerson...");
        const dryRun = await withTrace(
          "contract.query(storeValueIfPerson)",
          contract.query("storeValueIfPerson", {
            origin,
            data: { _value: value, request },
          }),
        );
        if (!dryRun.success) {
          return error(
            "Dry-run failed — proof rejected (not a verified person?)",
            dryRun.value,
          );
        }

        log("Signing and submitting...");
        let settled = false;
        await withTrace(
          "signSubmitAndWatch",
          new Promise<void>((resolve, reject) => {
            dryRun.value
              .send()
              .signSubmitAndWatch(signer)
              .subscribe({
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                next: (ev: any) => {
                  log(`Event: ${ev.type}`);
                  if (ev.type === "txBestBlocksState" && ev.found) {
                    settled = true;
                    resolve();
                  }
                  if (ev.type === "finalized" && !ev.ok) {
                    settled = true;
                    reject(new Error("Tx failed"));
                  }
                },
                error: (err: unknown) => {
                  settled = true;
                  reject(err);
                },
                complete: () => {
                  if (!settled)
                    reject(new Error("tx stream completed before settling"));
                },
              });
          }),
        );

        return success(`Stored value ${value} with personhood proof`, {
          value: String(value),
          alias: toHex(proof.contextualAlias.alias),
          contract: SIMPLE_STORE_ADDRESS,
        });
      } catch (e) {
        return error(e instanceof Error ? e.message : String(e), e);
      }
    },
  },
];

// Theme Tests (v0.7)
export const themeTests: TestDefinition[] = [
  {
    id: "theme-subscribe",
    name: "Subscribe Theme",
    description: "Subscribes to host theme changes (light/dark)",
    api: "themeProvider.subscribeTheme(callback)",
    category: "theme",
    async run() {
      const themeProvider = await theme();

      return new Promise((resolve) => {
        const themes: string[] = [];
        const sub = themeProvider.subscribeTheme((theme) => {
          themes.push(theme.variant);
        });

        setTimeout(() => {
          sub.unsubscribe();
          resolve(success(`Received ${themes.length} theme updates`, themes));
        }, 3000);
      });
    },
  },
];

// Entropy Tests (v0.7 - RFC-0007)
export const entropyTests: TestDefinition[] = [
  {
    id: "derive-entropy",
    name: "Derive Entropy",
    description: "Derives deterministic 32-byte entropy from a key (RFC-0007)",
    api: "deriveEntropy(key)",
    args: [
      {
        name: "key",
        label: "Key (text)",
        defaultValue: "my-secret-key",
      },
    ],
    category: "entropy",
    async run(_chain, _logger, args) {
      const keyText = args?.key ?? "my-secret-key";
      const key = new TextEncoder().encode(keyText);

      try {
        const result = await deriveEntropy(key);
        if (!result.ok)
          return error(sdkErrorMessage(result.error), result.error);
        const entropy = result.value;
        return success(`Derived ${entropy.length} bytes of entropy`, {
          entropyHex: toHex(entropy),
        });
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        return error(e.message, e);
      }
    },
  },
];

// Auth Tests (v0.7 - RFC-0009, RFC-0010)
export const authTests: TestDefinition[] = [
  {
    id: "request-login",
    name: "Request Login",
    description: "Triggers the host login flow (RFC-0009)",
    api: "accountsProvider.requestLogin(reason)",
    args: [
      {
        name: "reason",
        label: "Reason",
        defaultValue: "Please sign in to use this feature",
      },
    ],
    category: "auth",
    async run(_chain, _logger, args) {
      const reason = args?.reason ?? "Please sign in to use this feature";
      const accountsProvider = await accounts();
      const result = await accountsProvider.requestLogin(reason);

      return result.match(
        (loginResult) => success(`Login result: ${loginResult}`),
        (err) => error(sdkErrorMessage(err), err),
      );
    },
  },
  {
    id: "get-user-id",
    name: "Get User Identity",
    description: "Gets the user's identity (RFC-0014)",
    api: "accountsProvider.getUserId()",
    category: "auth",
    async run() {
      const accountsProvider = await accounts();
      const result = await accountsProvider.getUserId();

      return result.match(
        (account) =>
          success("User identity", {
            ...account,
          }),
        (err) => error(sdkErrorMessage(err), err),
      );
    },
  },
];

// Payment Tests (v0.7 - RFC-0006)
export const paymentTests: TestDefinition[] = [
  {
    id: "payment-balance-subscribe",
    name: "Subscribe Balance",
    description: "Subscribes to payment balance updates",
    api: "paymentManager.subscribeBalance(callback)",
    category: "payments",
    async run(_chain, logger) {
      const paymentManager = await getPaymentManager();
      if (!paymentManager)
        return error(
          "getPaymentManager returned null - not inside a host container",
        );

      return new Promise((resolve) => {
        const balances: unknown[] = [];
        const sub = paymentManager.subscribeBalance((balance) => {
          balances.push(balance);
        });

        setTimeout(() => {
          sub.unsubscribe();
          resolve(
            success(`Received ${balances.length} balance updates`, balances),
          );
        }, 3000);
      });
    },
  },
];

async function runResourceAllocation(resources: AllocatableResource[]) {
  try {
    const result = await requestResourceAllocation(resources);
    if (!result.ok) return error(sdkErrorMessage(result.error), result.error);
    const outcomes = result.value.map((o, i) => ({
      resource: resources[i].tag,
      outcome: o,
    }));
    return success(`Received ${outcomes.length} outcome(s)`, outcomes);
  } catch (err) {
    const e = err as { name?: string };
    return error(e.name ?? String(err), err);
  }
}

export const allowancesTests: TestDefinition[] = [
  {
    id: "allowances-statement-store",
    name: "Allocate StatementStore Allowance",
    description:
      "Requests a statement-store allowance from the host (RFC-0010)",
    api: 'requestResourceAllocation([{ tag: "StatementStoreAllowance" }])',
    category: "allowances",
    async run() {
      return runResourceAllocation([
        { tag: "StatementStoreAllowance", value: undefined },
      ]);
    },
  },
  {
    id: "allowances-bulletin",
    name: "Allocate Bulletin Allowance",
    description: "Requests a bulletin allowance from the host (RFC-0010)",
    api: 'requestResourceAllocation([{ tag: "BulletinAllowance" }])',
    category: "allowances",
    async run() {
      return runResourceAllocation([
        { tag: "BulletinAllowance", value: undefined },
      ]);
    },
  },
  {
    id: "allowances-smart-contract",
    name: "Allocate SmartContract Allowance",
    description:
      "Requests a smart-contract allowance for a derivation index (RFC-0010)",
    api: 'requestResourceAllocation([{ tag: "SmartContractAllowance", value: { tag: "Left", value: derivationIndex } }])',
    args: [
      {
        name: "derivationIndex",
        label: "Derivation index",
        defaultValue: "0",
      },
    ],
    category: "allowances",
    async run(_chain, _logger, args) {
      const derivationIndex = Number(args?.derivationIndex ?? "0");
      return runResourceAllocation([
        { tag: "SmartContractAllowance", value: accountIndex(derivationIndex) },
      ]);
    },
  },
  {
    id: "allowances-all",
    name: "Allocate All Resources",
    description:
      "Requests every supported resource in a single call; outcomes are reported per resource",
    api: "requestResourceAllocation([...])",
    args: [
      {
        name: "derivationIndex",
        label: "SmartContract derivation index",
        defaultValue: "0",
      },
    ],
    category: "allowances",
    async run(_chain, _logger, args) {
      const derivationIndex = Number(args?.derivationIndex ?? "0");
      return runResourceAllocation([
        { tag: "StatementStoreAllowance", value: undefined },
        { tag: "BulletinAllowance", value: undefined },
        { tag: "SmartContractAllowance", value: accountIndex(derivationIndex) },
      ]);
    },
  },
];

export const testsByCategory = {
  accounts: accountTests,
  signing: signingTests,
  extension: extensionTests,
  storage: storageTests,
  permissions: permissionTests,
  statements: statementTests,
  preimage: preimageTests,
  notifications: notificationTests,
  navigation: navigationTests,
  chain: chainTests,
  contract: contractTests,
  theme: themeTests,
  entropy: entropyTests,
  auth: authTests,
  payments: paymentTests,
  allowances: allowancesTests,
};
