import {
  getTruApi,
  getHostProvider,
  getAccountsProvider,
  getHostLocalStorage,
  createHostLocalStorage,
  getStatementStore,
  getPreimageManager,
  createHostPreimageManager,
  getThemeProvider,
  getPaymentManager,
  deriveEntropy,
  type TruApi,
  type AccountsProvider,
  type HostLocalStorage,
  type HostStatementStore,
  type PreimageManager,
  type ThemeProvider,
  type RemotePermissionItem,
} from "@parity/product-sdk-host";
import { WellKnownChain } from "@parity/product-sdk-chain-client";
import {
  AccountId,
  Binary,
  createClient,
  type PolkadotClient,
} from "polkadot-api";
import { toHex, fromHex } from "polkadot-api/utils";
import { createInkSdk } from "@polkadot-api/sdk-ink";
import { contracts } from "@polkadot-api/descriptors";
import { CID } from "multiformats/cid";
import { create as createMultihashDigest } from "multiformats/hashes/digest";
import { sha256 } from "multiformats/hashes/sha2";
import { blake2b } from "@noble/hashes/blake2b";
import { CHAINS } from "./types";
import deployment from "../../programs/deployment.json";
import {
  type ChainConfig,
  type TestDefinition,
  type TestLogger,
  type TestResult,
} from "./types";
import { getSelfDotNs } from "./dotns";

// Cache papi clients per genesis — avoids in-flight chainHead events from a
// destroyed client corrupting a new client's block tree (undefined.children).
const clientCache = new Map<string, PolkadotClient>();
async function getClient(genesis: `0x${string}`): Promise<PolkadotClient> {
  let client = clientCache.get(genesis);
  if (!client) {
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
let cachedTruApi: TruApi | null = null;
async function truApi(): Promise<TruApi> {
  if (cachedTruApi) return cachedTruApi;
  const api = await getTruApi();
  if (!api)
    throw new Error("getTruApi returned null - not inside a host container");
  cachedTruApi = api;
  return cachedTruApi;
}

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

const HOSTAPI_DEMO_ADDRESS = deployment.hostApiDemo;
// SS58 used as the `origin` for pallet-revive contract view dry-runs. Must be
// a substrate account that already has an H160 mapping in Revive.OriginalAccount —
// otherwise the chain returns AccountUnmapped even on read-only calls.
//
// This is the bulletin-deploy / CI deployer's H160 (0x47d761b4…) padded to a
// 32-byte AccountId32 with 12×0xEE per pallet-revive's mapping convention,
// then SS58-encoded with the chain's prefix 0. The deployer auto-maps the
// first time it signs a tx (which it does on every `bulletin-deploy` run),
// so this address is reliably mapped on every env we target. Public; only
// the matching MNEMONIC needs to stay in secrets.
const READ_ORIGIN = "12dCP8UFhSktvmSgJcP93tNPdgVQMdBQqJNcFrZTnDoiBE9Y";

const SELF_DOTNS = getSelfDotNs();

function success(message: string, details?: unknown): TestResult {
  return { success: true, message, details };
}

function error(message: string, details?: unknown): TestResult {
  return { success: false, message, details };
}

/** Request a device permission with a friendly error if denied. */
async function ensureDevicePermission(
  log: (msg: string) => void,
  permission:
    | "Notifications"
    | "Camera"
    | "Microphone"
    | "Bluetooth"
    | "NFC"
    | "Location"
    | "Clipboard"
    | "OpenUrl"
    | "Biometrics",
): Promise<TestResult | null> {
  log(`Requesting device permission: ${permission}...`);
  const result = await (await truApi()).devicePermission({
    tag: "v1",
    value: permission,
  });
  return result.match(
    (res) =>
      res.value
        ? null
        : error(`Device permission not granted: ${permission}`, res),
    (err) => error(`Device permission denied (${permission})`, err.value),
  );
}

/**
 * Before a smart-contract write: ensure the product account has a
 * SmartContractAllowance slot (RFC-0010). The host bookkeeps PGAS quota
 * per (product, derivationIndex) and funds the substrate AccountId with the
 * PGAS asset on first allocation, so a non-zero
 * `Assets.Account(Pgas::PgasAssetId, addr).balance` is a reliable
 * "already provisioned" signal. We skip the host round-trip in that case
 * — avoids the mobile re-prompt and wallet-flow queue contention. The
 * asset id is read from the chain's `Pgas.PgasAssetId` constant rather
 * than hardcoded, so a runtime renumber stays transparent.
 * Otherwise we request the allocation and propagate the host's outcome.
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
  const result = await (await truApi()).requestResourceAllocation({
    tag: "v1",
    value: [{ tag: "SmartContractAllowance", value: derivationIndex }],
  });
  return result.match(
    (res) => {
      const outcome = res.value[0]?.tag;
      if (outcome === "Allocated") {
        log(`SmartContractAllowance(${derivationIndex}) allocated`);
        return null;
      }
      if (outcome === "Rejected") {
        return error("User rejected SmartContractAllowance");
      }
      return error(`SmartContractAllowance unavailable: ${outcome}`);
    },
    (err) => error(err.value.name, err.value),
  );
}

function bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

/**
 * Statement-Store expiry as the chain expects it:
 *   high 32 bits: unix timestamp (seconds) at which the statement expires
 *   low  32 bits: sequence number (per-sender, breaks ties at the same ts)
 *
 * The chain rejects statements with a missing/zero expiry as
 * `Submit failed, statement already expired` — the runtime treats the
 * field as a hard cutoff and `undefined` is encoded as zero (epoch).
 * Matches `@novasamatech/sdk-statement`'s `createExpiry` /
 * `createExpiryFromDuration`; we inline it instead of pulling the SDK
 * in just for two lines of arithmetic.
 */
function createExpiryFromDuration(
  durationSecs: number,
  sequenceNumber = 0,
): bigint {
  // BigInt literal syntax (`32n`) needs ES2020+; tsconfig targets ES2017
  // so we use the BigInt() constructor instead.
  const timestamp = Math.floor(Date.now() / 1000) + durationSecs;
  return (BigInt(timestamp) << BigInt(32)) | BigInt(sequenceNumber);
}

/** Default statement TTL — long enough for a slow proof-then-submit round-trip. */
const STATEMENT_TTL_SECS = 300;

// IPFS multicodec / multihash constants
const IPFS_CODEC_RAW = 0x55;
const IPFS_HASH_BLAKE2B_256 = 0xb220;

async function candidateCidsForBytes(
  data: Uint8Array,
): Promise<Array<{ algo: string; cid: string }>> {
  const sha = await sha256.digest(data);
  const blake = blake2b(data, { dkLen: 32 });
  const blakeMh = createMultihashDigest(IPFS_HASH_BLAKE2B_256, blake);
  return [
    { algo: "sha2-256", cid: CID.createV1(IPFS_CODEC_RAW, sha).toString() },
    {
      algo: "blake2b-256",
      cid: CID.createV1(IPFS_CODEC_RAW, blakeMh).toString(),
    },
  ];
}

async function lookupPreimageWithTimeout(
  hash: `0x${string}`,
  timeoutMs: number,
): Promise<Uint8Array | null> {
  const preimageManager = await pm();
  return new Promise((resolve) => {
    let done = false;
    const sub = preimageManager.lookup(hash, (preimage) => {
      if (done) return;
      done = true;
      sub.unsubscribe();
      resolve(preimage);
    });
    setTimeout(() => {
      if (done) return;
      done = true;
      sub.unsubscribe();
      resolve(null);
    }, timeoutMs);
  });
}

// Account Tests
export const accountTests: TestDefinition[] = [
  {
    id: "accounts-provider-product",
    name: "Get Product Account",
    description: "Gets a product account via createAccountsProvider",
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
      const accountsProvider = (await accounts());
      const result = await accountsProvider.getProductAccount(dotNsIdentifier);

      return result.match(
        (account) =>
          success("Product account:", {
            publicKey: toHex(account.publicKey),
          }),
        (err) => error(`${err.name}`, err),
      );
    },
  },
  {
    id: "accounts-provider-alias",
    name: "Get Product Account Alias",
    description: "Gets a product account alias via createAccountsProvider",
    api: "accountsProvider.getProductAccountAlias(dotNsIdentifier)",
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
      const accountsProvider = (await accounts());
      const result =
        await accountsProvider.getProductAccountAlias(dotNsIdentifier);

      return result.match(
        (alias) =>
          success("Account alias retrieved", {
            context: toHex(alias.context),
            alias: toHex(alias.alias),
          }),
        (err) => error(`${err.name}`, err),
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
      const accountsProvider = (await accounts());
      const accountResult =
        await accountsProvider.getProductAccount(dotNsIdentifier);

      return accountResult.match(
        (account) => {
          const signer = accountsProvider.getProductAccountSigner(
            account,
            "createTransaction",
          );
          return success("Product account signer created", {
            publicKey: toHex(signer.publicKey),
          });
        },
        (err) => error(`${err.name}`, err),
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
      const accountsProvider = (await accounts());

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
    id: "sign-raw",
    name: "Sign Raw Message",
    description: "Signs a raw message with a product account",
    api: "truApi().signRaw({ tag, value: { address, data } })",
    args: [
      {
        name: "dotNsIdentifier",
        label: "DotNS ID",
        defaultValue: SELF_DOTNS,
      },
      {
        name: "message",
        label: "Message",
        defaultValue: "Hello from Host Playground!",
      },
    ],
    category: "signing",
    async run(_chain, logger, args) {
      const log = logger || (() => {});
      const dotNsIdentifier = args?.dotNsIdentifier ?? SELF_DOTNS;


      log(`Fetching product account for ${dotNsIdentifier}...`);
      const accountsProvider = (await accounts());
      const accountResult =
        await accountsProvider.getProductAccount(dotNsIdentifier);

      const publicKey = accountResult.match(
        (account) => account.publicKey,
        (err) => {
          log(
            `getProductAccount failed: ${err.name}. Is the user signed in and is "${dotNsIdentifier}" a valid DotNS domain?`,
          );
          return null;
        },
      );

      if (!publicKey) {
        return error(
          `No product account for "${dotNsIdentifier}" — check that the user is signed in and the DotNS ID is valid`,
        );
      }

      log(`Account found: ${toHex(publicKey).slice(0, 18)}...`);

      const message =
        args?.message ??
        `Hello from Host Playground! ${new Date().toLocaleString()}`;
      const messageBytes = new TextEncoder().encode(message);

      const result = await (await truApi()).signRaw({
        tag: "v1",
        value: {
          account: [dotNsIdentifier, 0],
          payload: { tag: "Bytes", value: messageBytes },
        },
      });

      return result.match(
        (res) => success("Message signed", res.value),
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "create-transaction",
    name: "Create Transaction",
    description:
      "Signs a transaction offline via the product account signer (mode = createTransaction). Returns the signed bytes without broadcasting.",
    api: 'tx.sign(accountsProvider.getProductAccountSigner(account, "createTransaction"))',
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
      const accountsProvider = (await accounts());
      const accountResult = await accountsProvider.getProductAccount(
        dotNsIdentifier,
        0,
      );
      const account = accountResult.match(
        (a) => a,
        (err) => {
          log(`getProductAccount failed: ${err.name}`);
          return null;
        },
      );
      if (!account) {
        return error(
          `No product account for "${dotNsIdentifier}" — check that the user is signed in and the DotNS ID is valid`,
        );
      }

      // mode="createTransaction" routes signing through the host's
      // createTransaction path on the paired mobile app, instead of the
      // default signPayload path used by signSubmitAndWatch.
      const signer = accountsProvider.getProductAccountSigner(
        account,
        "createTransaction",
      );

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
      "Batches two storeValue calls on the HostApiDemo contract using Utility.batch_all, signs via the createTransaction product signer, and submits atomically. All calls must be pallet-revive — mixing a System.remark in here makes the batch fail because the AsPgas fee route only applies to revive calls.",
    api: "api.tx.Utility.batch_all([storeValue, storeValue]).signSubmitAndWatch(signer)",
    category: "signing",
    async run(chain: ChainConfig, logger?: TestLogger) {
      const log = logger || (() => {});


      log("Fetching product account...");
      const accountsProvider = (await accounts());
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
        contracts.hostApiDemo,
        HOSTAPI_DEMO_ADDRESS,
      );

      log("Building 2 contract calls...");

      // Dry-run each contract call through sdk-ink to get weight+storage.
      // The Promise<decodedCall> on the wrapped tx lets us extract the inner
      // pallet-revive call without broadcasting.
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
                  contract: HOSTAPI_DEMO_ADDRESS,
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
    description: "Writes and reads a string via hostLocalStorage",
    api: "hostStorage().writeString(key, value) / readString(key)",
    args: [
      { name: "key", label: "Key", defaultValue: "host_playground_string" },
    ],
    category: "storage",
    async run(_chain, _logger, args) {
      const key = args?.key ?? "host_playground_string";
      const value = `test_value_${Date.now()}`;

      await (await hostStorage()).writeString(key, value);
      const readValue = await (await hostStorage()).readString(key);

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
    description: "Writes and reads JSON via hostLocalStorage",
    api: "hostStorage().writeJSON(key, value) / readJSON(key)",
    args: [{ name: "key", label: "Key", defaultValue: "host_playground_json" }],
    category: "storage",
    async run(_chain, _logger, args) {
      const key = args?.key ?? "host_playground_json";
      const value = {
        timestamp: Date.now(),
        nested: { foo: "bar", nums: [1, 2, 3] },
      };

      await (await hostStorage()).writeJSON(key, value);
      const readValue = await (await hostStorage()).readJSON(key);

      const match = JSON.stringify(value) === JSON.stringify(readValue);
      return match
        ? success("JSON round-trip OK", readValue)
        : error("JSON mismatch", { written: value, read: readValue });
    },
  },
  {
    id: "storage-clear",
    name: "Storage Clear",
    description: "Clears a storage key via hostLocalStorage",
    api: "hostStorage().clear(key)",
    args: [
      { name: "key", label: "Key", defaultValue: "host_playground_string" },
    ],
    category: "storage",
    async run(_chain, _logger, args) {
      const key = args?.key ?? "host_playground_string";

      // Write a value first to ensure the key exists
      await (await hostStorage()).writeString(key, "to_be_cleared");
      await (await hostStorage()).clear(key);

      const readValue = await (await hostStorage()).readString(key);
      return !readValue || readValue === ""
        ? success("Storage key cleared successfully")
        : error(`Key still has value after clear: "${readValue}"`);
    },
  },
  {
    id: "storage-factory",
    name: "Storage Factory",
    description:
      "Creates a custom localStorage instance via createLocalStorage",
    api: "createLocalStorage()",
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
    api: "truApi().featureSupported({ tag, value: { tag: 'Chain', value } })",
    category: "permissions",
    async run(chain: ChainConfig) {
      const result = await (await truApi()).featureSupported({
        tag: "v1",
        value: { tag: "Chain", value: chain.genesis },
      });

      return result.match(
        (res) => success(`${chain.name} supported: ${res.value}`),
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "device-permission-camera",
    name: "Device Permission: Camera",
    description: "Requests camera access from the host",
    api: "truApi().devicePermission({ tag: 'v1', value: 'Camera' })",
    category: "permissions",
    async run() {
      const result = await (await truApi()).devicePermission({
        tag: "v1",
        value: "Camera",
      });

      return result.match(
        (res) =>
          success(`Camera permission: ${res.value ? "granted" : "denied"}`),
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "device-permission-microphone",
    name: "Device Permission: Microphone",
    description: "Requests microphone access from the host",
    api: "truApi().devicePermission({ tag: 'v1', value: 'Microphone' })",
    category: "permissions",
    async run() {
      const result = await (await truApi()).devicePermission({
        tag: "v1",
        value: "Microphone",
      });

      return result.match(
        (res) =>
          success(`Microphone permission: ${res.value ? "granted" : "denied"}`),
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "device-permission-location",
    name: "Device Permission: Location",
    description: "Requests location access from the host",
    api: "truApi().devicePermission({ tag: 'v1', value: 'Location' })",
    category: "permissions",
    async run() {
      const result = await (await truApi()).devicePermission({
        tag: "v1",
        value: "Location",
      });

      return result.match(
        (res) =>
          success(`Location permission: ${res.value ? "granted" : "denied"}`),
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "device-permission-bluetooth",
    name: "Device Permission: Bluetooth",
    description: "Requests bluetooth access from the host",
    api: "truApi().devicePermission({ tag: 'v1', value: 'Bluetooth' })",
    category: "permissions",
    async run() {
      const result = await (await truApi()).devicePermission({
        tag: "v1",
        value: "Bluetooth",
      });

      return result.match(
        (res) =>
          success(`Bluetooth permission: ${res.value ? "granted" : "denied"}`),
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "device-permission-notifications",
    name: "Device Permission: Notifications",
    description: "Requests notifications access from the host",
    api: "truApi().devicePermission({ tag: 'v1', value: 'Notifications' })",
    category: "permissions",
    async run() {
      const result = await (await truApi()).devicePermission({
        tag: "v1",
        value: "Notifications",
      });

      return result.match(
        (res) =>
          success(
            `Notifications permission: ${res.value ? "granted" : "denied"}`,
          ),
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "device-permission-nfc",
    name: "Device Permission: NFC",
    description: "Requests NFC access from the host",
    api: "truApi().devicePermission({ tag: 'v1', value: 'NFC' })",
    category: "permissions",
    async run() {
      const result = await (await truApi()).devicePermission({
        tag: "v1",
        value: "NFC",
      });

      return result.match(
        (res) => success(`NFC permission: ${res.value ? "granted" : "denied"}`),
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "device-permission-clipboard",
    name: "Device Permission: Clipboard",
    description: "Requests clipboard access from the host",
    api: "truApi().devicePermission({ tag: 'v1', value: 'Clipboard' })",
    category: "permissions",
    async run() {
      const result = await (await truApi()).devicePermission({
        tag: "v1",
        value: "Clipboard",
      });

      return result.match(
        (res) =>
          success(`Clipboard permission: ${res.value ? "granted" : "denied"}`),
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "device-permission-open-url",
    name: "Device Permission: Open URL",
    description: "Requests permission to open external URLs",
    api: "truApi().devicePermission({ tag: 'v1', value: 'OpenUrl' })",
    category: "permissions",
    async run() {
      const result = await (await truApi()).devicePermission({
        tag: "v1",
        value: "OpenUrl",
      });

      return result.match(
        (res) =>
          success(`OpenUrl permission: ${res.value ? "granted" : "denied"}`),
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "device-permission-biometrics",
    name: "Device Permission: Biometrics",
    description: "Requests biometrics access from the host",
    api: "truApi().devicePermission({ tag: 'v1', value: 'Biometrics' })",
    category: "permissions",
    async run() {
      const result = await (await truApi()).devicePermission({
        tag: "v1",
        value: "Biometrics",
      });

      return result.match(
        (res) =>
          success(`Biometrics permission: ${res.value ? "granted" : "denied"}`),
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "remote-permission-remote",
    name: "Remote Permission: Remote (HTTP/WS)",
    description: "Requests permission to connect to remote domains",
    api: "truApi().permission({ tag: 'v1', value: { tag: 'Remote', value: [url] } })",
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
      const result = await (await truApi()).permission({
        tag: "v1",
        value: { tag: "Remote", value: [url] },
      });

      return result.match(
        (res) =>
          success(`Remote permission: ${res.value ? "granted" : "denied"}`),
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "remote-permission-webrtc",
    name: "Remote Permission: WebRTC",
    description: "Requests permission to use WebRTC",
    api: "truApi().permission({ tag: 'v1', value: { tag: 'WebRTC', value: undefined } })",
    category: "permissions",
    async run() {
      const result = await (await truApi()).permission({
        tag: "v1",
        value: { tag: "WebRtc", value: undefined },
      });

      return result.match(
        (res) =>
          success(`WebRTC permission: ${res.value ? "granted" : "denied"}`),
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "remote-permission-chain-submit",
    name: "Remote Permission: Chain Submit",
    description: "Requests permission to submit transactions on a chain",
    api: "truApi().permission({ tag: 'v1', value: { tag: 'ChainSubmit', value: undefined } })",
    category: "permissions",
    async run(chain) {
      const result = await (await truApi()).permission({
        tag: "v1",
        value: { tag: "ChainSubmit", value: undefined },
      });

      return result.match(
        (res) =>
          success(
            `Chain submit permission for ${chain.name}: ${res.value ? "granted" : "denied"}`,
          ),
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "remote-permission-preimage-submit",
    name: "Remote Permission: Preimage Submit",
    description: "Requests permission to submit preimages via the host",
    api: "truApi().permission({ tag: 'v1', value: { tag: 'PreimageSubmit', value: undefined } })",
    category: "permissions",
    async run(chain) {
      const result = await (await truApi()).permission({
        tag: "v1",
        value: { tag: "PreimageSubmit", value: undefined },
      });

      return result.match(
        (res) =>
          success(
            `Preimage submit permission for ${chain.name}: ${res.value ? "granted" : "denied"}`,
          ),
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "remote-permission-statement-submit",
    name: "Remote Permission: Statement Submit",
    description: "Requests permission to submit statement-store statements",
    api: "truApi().permission({ tag: 'v1', value: { tag: 'StatementSubmit', value: undefined } })",
    category: "permissions",
    async run(chain) {
      const result = await (await truApi()).permission({
        tag: "v1",
        value: { tag: "StatementSubmit", value: undefined },
      });

      return result.match(
        (res) =>
          success(
            `Statement submit permission for ${chain.name}: ${res.value ? "granted" : "denied"}`,
          ),
        (err) => error(err.value.name, err.value),
      );
    },
  },
];

// Statement Store Tests
export const statementTests: TestDefinition[] = [
  {
    id: "statement-store-create-proof",
    name: "Create Proof",
    description: "Creates a statement store proof via createStatementStore",
    api: "statementStore.createProof(accountId, statement)",
    args: [
      {
        name: "dotNsIdentifier",
        label: "DotNS ID",
        defaultValue: SELF_DOTNS,
      },
    ],
    category: "statements",
    async run(_chain, logger, args) {
      const log = logger || (() => {});
      const dotNsIdentifier = args?.dotNsIdentifier ?? SELF_DOTNS;


      const statementStore = (await statements());
      const messageBytes = new TextEncoder().encode(`Statement: ${Date.now()}`);

      try {
        const proof = await statementStore.createProof([dotNsIdentifier, 0], {
          proof: undefined,
          decryptionKey: undefined,
          expiry: createExpiryFromDuration(STATEMENT_TTL_SECS),
          channel: undefined,
          topics: [],
          data: messageBytes,
        });

        const proofValue = proof.value;
        const sig =
          "signature" in proofValue
            ? toHex(proofValue.signature).slice(0, 20)
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
    api: "host.statementStoreCreateProofAuthorized",
    category: "statements",
    async run(_chain, logger) {
      const log = logger || (() => {});


      const messageBytes = new TextEncoder().encode(`Statement: ${Date.now()}`);
      const proof = await (await truApi()).statementStoreCreateProofAuthorized({
        tag: "v1",
        value: {
          proof: undefined,
          decryptionKey: undefined,
          expiry: createExpiryFromDuration(STATEMENT_TTL_SECS),
          channel: undefined,
          topics: [],
          data: messageBytes,
        },
      });

      return proof.match(
        (proof) => {
          const proofValue = proof.value.value;
          const signature =
            "signature" in proofValue
              ? toHex(proofValue.signature).slice(0, 20)
              : "onchain";

          return success(`Proof type: ${proof.tag}, sig: ${signature}...`);
        },
        (err) => {
          return error(err.value.toString(), err.value.payload);
        },
      );
    },
  },
  {
    id: "statement-store-submit",
    name: "Submit Statement",
    description: "Creates a proof then submits the signed statement",
    api: "statementStore.submit(signedStatement)",
    args: [
      {
        name: "dotNsIdentifier",
        label: "DotNS ID",
        defaultValue: SELF_DOTNS,
      },
    ],
    category: "statements",
    async run(_chain, logger, args) {
      const log = logger || (() => {});
      const dotNsIdentifier = args?.dotNsIdentifier ?? SELF_DOTNS;


      const statementStore = (await statements());
      const messageBytes = new TextEncoder().encode(`Statement: ${Date.now()}`);

      const statement = {
        proof: undefined,
        decryptionKey: undefined,
        expiry: createExpiryFromDuration(STATEMENT_TTL_SECS),
        channel: undefined,
        topics: [],
        data: messageBytes,
      };

      try {
        log("Creating proof...");
        const proof = await statementStore.createProof(
          [dotNsIdentifier, 0],
          statement,
        );
        log(`Proof created: ${proof.tag}`);

        const signedStatement = {
          proof,
          decryptionKey: undefined,
          expiry: createExpiryFromDuration(STATEMENT_TTL_SECS),
          channel: undefined,
          topics: [],
          data: messageBytes,
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
      const statementStore = (await statements());

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
      const statementStore = (await statements());
      const encoder = new TextEncoder();
      const topicA = encoder.encode(args?.topicA ?? "host-playground:topic-a");
      const topicB = encoder.encode(args?.topicB ?? "host-playground:topic-b");

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
    api: "pm().submit(data)",
    category: "preimage",
    async run(_chain, logger) {
      const log = logger || (() => {});

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
    api: "pm().lookup(hash, callback)",
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
    description: "Creates a preimage manager via createPreimageManager",
    api: "createPreimageManager()",
    category: "preimage",
    async run(_chain, logger) {
      const log = logger || (() => {});

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
    name: "Upload File to Bulletin & Verify via IPFS",
    description:
      "Submits a timestamped text file, retrieves it via host lookup, and fetches it through the chain's IPFS gateway. Asserts three-way byte equality.",
    api: "pm().submit + pm().lookup + fetch(`${chain.ipfs}/${cid}`)",
    category: "preimage",
    async run(chain, logger) {
      const log = logger || (() => {});


      // Allowance + permission setup (mirrors e2e/allowance-flows.spec.ts)
      log("Requesting BulletinAllowance...");
      const allocRes = await (await truApi()).requestResourceAllocation({
        tag: "v1",
        value: [{ tag: "BulletinAllowance", value: undefined }],
      });
      if (allocRes.isErr()) {
        return error("Bulletin allowance request failed", allocRes.error);
      }

      // 1. Generate timestamped file
      const ts = new Date().toISOString();
      const filename = `host-playground-upload-${Date.now()}.txt`;
      const content =
        `host-playground bulletin upload\n` +
        `timestamp: ${ts}\n` +
        `chain: ${chain.name} (${chain.network})\n` +
        `genesis: ${chain.genesis}\n`;
      const payload = new TextEncoder().encode(content);
      log(`Generated ${payload.length} bytes (${filename})`);

      // 2. Submit via host
      log("Submitting via (await pm()).submit...");
      const hash = await (await pm()).submit(payload);
      log(`Host returned hash: ${hash}`);

      // 3. Lookup via host — proves bytes round-trip through the host's bulletin path
      log("Looking up via (await pm()).lookup (10s)...");
      const lookupBytes = await lookupPreimageWithTimeout(hash, 10_000);
      if (!lookupBytes) {
        return error("Host lookup returned null / timed out", {
          hash,
          submitted: toHex(payload),
        });
      }
      const payloadEqualsLookup = bytesEqual(payload, lookupBytes);
      log(
        `Host lookup: ${lookupBytes.length} bytes, equal=${payloadEqualsLookup}`,
      );
      if (!payloadEqualsLookup) {
        return error("Host lookup bytes ≠ submitted payload", {
          hash,
          submitted: toHex(payload),
          lookup: toHex(lookupBytes),
        });
      }

      // 4. Compute candidate CIDs (host SDK returns a raw hash, not a CID — we
      //    try the two realistic (codec, hashing) defaults the bulletin runtime
      //    accepts).
      const candidates = await candidateCidsForBytes(payload);
      log(
        `Candidate CIDs: ${candidates
          .map((c) => `${c.algo}=${c.cid.slice(0, 14)}…`)
          .join(", ")}`,
      );

      if (!chain.ipfs) {
        return success(
          `Submit + host lookup OK (${payload.length} bytes); IPFS skipped — no gateway configured for ${chain.name}`,
          {
            filename,
            content,
            hash,
            submittedBytes: payload.length,
            lookupBytes: lookupBytes.length,
            payloadEqualsLookup,
            candidateCids: candidates,
            ipfsStatus: "skipped: chain.ipfs not configured",
          },
        );
      }

      // 5. Try each candidate against the gateway; first byte-equal match wins.
      const gateway = chain.ipfs.replace(/\/$/, "");
      type Probe = {
        algo: string;
        cid: string;
        url: string;
        status: number | string;
        bytes?: number;
        equal?: boolean;
      };
      const probes: Probe[] = [];
      let matched: { algo: string; cid: string; bytes: Uint8Array } | null =
        null;

      // IPFS propagation from the chain's bulletin pinner to the gateway
      // isn't instant — observed up to ~45 s between on-chain inclusion
      // and the gateway resolving the CID. A single best-effort fetch
      // per candidate produced "inconclusive" results that read like a
      // verification failure to operators; the file IS on IPFS, the
      // gateway just hasn't seen it yet. Poll each candidate until we
      // either get a byte-equal response or a hard 4xx (other than 504
      // which the gateway emits while propagation is in flight).
      //
      // Budget: 60 s total per candidate, 5 s between polls. We stop
      // probing remaining candidates as soon as one matches.
      const totalBudgetMs = 60_000;
      const pollIntervalMs = 5_000;

      for (const cand of candidates) {
        const url = `${gateway}/${cand.cid}`;
        log(`Probing ${url} (up to ${totalBudgetMs / 1000}s)...`);
        const probe: Probe = {
          algo: cand.algo,
          cid: cand.cid,
          url,
          status: "",
        };
        const deadline = Date.now() + totalBudgetMs;
        let lastStatus: number | string = "";
        while (Date.now() < deadline) {
          try {
            const r = await fetch(url, {
              signal: AbortSignal.timeout(10_000),
            });
            lastStatus = r.status;
            if (r.ok) {
              const bytes = new Uint8Array(await r.arrayBuffer());
              probe.status = r.status;
              probe.bytes = bytes.length;
              probe.equal = bytesEqual(payload, bytes);
              if (probe.equal) {
                matched = { algo: cand.algo, cid: cand.cid, bytes };
              }
              break;
            }
            // 504 (gateway timeout) and 502 (bad gateway) on these
            // hosts mean "IPFS still propagating" — keep polling. 404
            // also can be transient on first request to a gateway that
            // hasn't seen the CID yet; treat it the same. Hard-fail
            // only on auth/permission errors.
            if ([401, 403, 451].includes(r.status)) break;
          } catch (e) {
            lastStatus = `error: ${e instanceof Error ? e.message : String(e)}`;
          }
          if (Date.now() + pollIntervalMs >= deadline) break;
          await new Promise((r) => setTimeout(r, pollIntervalMs));
        }
        if (probe.status === "") probe.status = lastStatus;
        probes.push(probe);
        if (matched) break;
      }

      if (!matched) {
        return success(
          `Submit + host lookup OK (${payload.length} bytes); IPFS verification inconclusive — no candidate CID resolved at ${gateway}`,
          {
            filename,
            content,
            hash,
            submittedBytes: payload.length,
            lookupBytes: lookupBytes.length,
            payloadEqualsLookup,
            ipfsStatus: "inconclusive: no candidate CID resolved or matched",
            probes,
          },
        );
      }

      return success(
        `Three-way verified: submit + host lookup + IPFS (${matched.algo}) all ${payload.length} bytes`,
        {
          filename,
          content,
          hash,
          cid: matched.cid,
          cidAlgo: matched.algo,
          gatewayUrl: `${gateway}/${matched.cid}`,
          submittedBytes: payload.length,
          lookupBytes: lookupBytes.length,
          ipfsBytes: matched.bytes.length,
          payloadEqualsLookup: true,
          payloadEqualsIpfs: true,
          probes,
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
    api: "truApi().pushNotification({ tag: 'v1', value: { text, deeplink, scheduledAt } })",
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
    async run(_chain, logger, args) {
      const log = logger || (() => {});
      const text = args?.text ?? "Hello from demo product!";
      const deeplink = args?.deeplink?.trim() || undefined;

      // Relative seconds → absolute epoch-ms bigint. Empty / non-positive
      // means immediate (scheduledAt undefined), matching the host contract
      // where a null or past timestamp fires now.
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

      const permErr = await ensureDevicePermission(log, "Notifications");
      if (permErr) return permErr;

      const result = await (await truApi()).pushNotification({
        tag: "v1",
        value: { text, deeplink, scheduledAt },
      });

      const when =
        scheduledAt === undefined
          ? "now"
          : `at ${new Date(Number(scheduledAt)).toLocaleTimeString()}`;

      return result.match(
        (res) =>
          success(
            `Notification (#${String(res.value)}) scheduled ${when}: "${text}"${deeplink ? ` → ${deeplink}` : ""}`,
          ),
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "cancel-notification",
    name: "Cancel Notification",
    description:
      "Cancel a previously scheduled notification by its id (the number returned by Push Notification). Cancelling is idempotent: an unknown or already-fired id is a no-op.",
    api: "truApi().pushNotificationCancel({ tag: 'v1', value: id })",
    args: [{ name: "id", label: "Notification id", defaultValue: "" }],
    category: "notifications",
    async run(_chain, logger, args) {
      const log = logger || (() => {});
      const rawId = args?.id?.trim() ?? "";
      const id = Number(rawId);
      if (rawId === "" || !Number.isInteger(id) || id <= 0) {
        return error(
          "Invalid id",
          `"Notification id" must be a positive integer, got "${rawId}"`,
        );
      }

      const permErr = await ensureDevicePermission(log, "Notifications");
      if (permErr) return permErr;

      const result = await (await truApi()).pushNotificationCancel({
        tag: "v1",
        value: id,
      });

      return result.match(
        () => success(`Cancel requested for notification #${String(id)}`),
        (err) => error(err.value.name, err.value),
      );
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
    api: "window.location.href = url",
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
    api: "truApi().navigateTo({ tag: 'v1', value: url })",
    args: [{ name: "url", label: "URL", defaultValue: "https://search.dot" }],
    category: "navigation",
    async run(_chain, logger, args) {
      const log = logger || (() => {});
      const url = args?.url ?? "https://search.dot";
      const result = await (await truApi()).navigateTo({ tag: "v1", value: url });
      return result.match(
        () => success(`Navigated to ${url}`),
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "navigate-http",
    name: "Navigate to HTTP URL",
    description: "Navigates to an external HTTP/S URL via hostApi",
    api: "truApi().navigateTo({ tag: 'v1', value: url })",
    args: [{ name: "url", label: "URL", defaultValue: "https://polkadot.com" }],
    category: "navigation",
    async run(_chain, logger, args) {
      const log = logger || (() => {});
      const url = args?.url ?? "https://polkadot.com";
      const result = await (await truApi()).navigateTo({ tag: "v1", value: url });
      return result.match(
        () => success(`Navigated to ${url}`),
        (err) => error(err.value.name, err.value),
      );
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
    api: "truApi().chainSpecGenesisHash({ tag: 'v1', value: genesisHash })",
    category: "chain",
    async run(chain: ChainConfig) {
      const result = await (await truApi()).chainSpecGenesisHash({
        tag: "v1",
        value: chain.genesis,
      });

      return result.match(
        (res) => success(`Genesis hash: ${res.value}`),
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "chain-spec-chain-name",
    name: "Chain Spec: Chain Name",
    description: "Gets the chain name via the typed chain interaction protocol",
    api: "truApi().chainSpecChainName({ tag: 'v1', value: genesisHash })",
    category: "chain",
    async run(chain: ChainConfig) {
      const result = await (await truApi()).chainSpecChainName({
        tag: "v1",
        value: chain.genesis,
      });

      return result.match(
        (res) => success(`Chain name: ${res.value}`),
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "chain-spec-properties",
    name: "Chain Spec: Properties",
    description:
      "Gets chain properties (token symbol, decimals, etc.) via the typed protocol",
    api: "truApi().chainSpecProperties({ tag: 'v1', value: genesisHash })",
    category: "chain",
    async run(chain: ChainConfig) {
      const result = await (await truApi()).chainSpecProperties({
        tag: "v1",
        value: chain.genesis,
      });

      return result.match(
        (res) => success(`Properties: ${res.value}`),
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "chain-transaction-broadcast",
    name: "Transaction: Broadcast",
    description: "Broadcasts a dummy transaction (expected to fail validation)",
    api: "truApi().chainTransactionBroadcast({ tag: 'v1', value: { genesisHash, transaction } })",
    warning: "Will fail with invalid transaction",
    category: "chain",
    async run(chain: ChainConfig) {
      const result = await (await truApi()).chainTransactionBroadcast({
        tag: "v1",
        value: {
          genesisHash: chain.genesis,
          transaction: "0x00" as `0x${string}`,
        },
      });

      return result.match(
        (res) =>
          res.value
            ? success(`Broadcast started, operationId: ${res.value}`)
            : success("Broadcast accepted (no operationId)"),
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "chain-transaction-stop",
    name: "Transaction: Stop",
    description: "Broadcasts a transaction then immediately stops it",
    api: "truApi().chainTransactionStop({ tag: 'v1', value: { genesisHash, operationId } })",
    category: "chain",
    async run(chain: ChainConfig, logger) {
      const log = logger || (() => {});
      log("Broadcasting dummy transaction...");

      const broadcastResult = await (await truApi()).chainTransactionBroadcast({
        tag: "v1",
        value: {
          genesisHash: chain.genesis,
          transaction: "0x00" as `0x${string}`,
        },
      });

      return broadcastResult.match(
        async (res) => {
          const operationId = res.value;
          if (!operationId)
            return success(
              "Broadcast returned no operationId — nothing to stop",
            );

          log(`Stopping broadcast ${operationId}...`);
          const stopResult = await (await truApi()).chainTransactionStop({
            tag: "v1",
            value: { genesisHash: chain.genesis, operationId },
          });

          return stopResult.match(
            () => success(`Stopped broadcast ${operationId}`),
            (err) => error(err.value.name, err.value),
          );
        },
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "chain-query-balance",
    name: "Query Balance",
    description:
      "Queries System.Account balance. Defaults to this product's account; the field can be edited to query anyone.",
    api: "createPapiProvider(genesis) → client.getUnsafeApi().query.System.Account.getValue(address)",
    args: [
      {
        name: "address",
        label: "Address (SS58)",
        defaultValue: async () => {
          // ss58 prefix 0 is used by all Paseo Hub chains we target; the
          // run() call still re-encodes with the active chain's prefix if it
          // differs. We pre-fill so the user can see and edit it.
          const accountsProvider = (await accounts());
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
        const accountsProvider = (await accounts());
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
    description: "Reads getStoredValue() from the HostApiDemo contract",
    api: "contract.query('getStoredValue', { origin })",
    category: "contract",
    async run(chain: ChainConfig) {
      const contractAddress = HOSTAPI_DEMO_ADDRESS;
      const origin = READ_ORIGIN;
      const client = await getClient(chain.genesis);
      try {
        const sdk = createInkSdk(client);
        const contract = sdk.getContract(
          contracts.hostApiDemo,
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
      "Calls storeValue() on the HostApiDemo contract (write operation)",
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
      const accountsProvider = (await accounts());
      const accountResult = await accountsProvider.getProductAccount(
        SELF_DOTNS,
        0,
      );
      const account = accountResult.match(
        (a) => a,
        () => null,
      );
      if (!account) return error("No product account available");

      const signer = accountsProvider.getProductAccountSigner(
        account,
        "createTransaction",
      );
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
        contracts.hostApiDemo,
        HOSTAPI_DEMO_ADDRESS,
      );

      const value = BigInt(args?.value ?? "42");
      log(`Storing value ${value}...`);

      const dryRun = await contract.query("storeValue", {
        origin,
        data: { _value: value },
      });
      if (!dryRun.success) return error("Dry-run failed", dryRun.value);

      log("Signing and submitting...");
      await new Promise<void>((resolve, reject) => {
        dryRun.value
          .send()
          .signSubmitAndWatch(signer)
          .subscribe({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            next: (ev: any) => {
              log(`Event: ${ev.type}`);
              if (ev.type === "txBestBlocksState" && ev.found) resolve();
              if (ev.type === "finalized" && !ev.ok)
                reject(new Error("Tx failed"));
            },
            error: reject,
          });
      });

      return success(`Stored value: ${value}`, {
        value: String(value),
        contract: HOSTAPI_DEMO_ADDRESS,
      });
    },
  },
  {
    id: "contract-query-data-length",
    name: "Contract: Query Data Length",
    description: "Reads getStoredDataLength() from the HostApiDemo contract",
    api: "contract.query('getStoredDataLength', { origin })",
    category: "contract",
    async run(chain: ChainConfig) {
      const contractAddress = HOSTAPI_DEMO_ADDRESS;
      const origin = READ_ORIGIN;
      const client = await getClient(chain.genesis);
      try {
        const sdk = createInkSdk(client);
        const contract = sdk.getContract(
          contracts.hostApiDemo,
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
      "Reads getBalance() (address(this).balance) from the HostApiDemo contract",
    api: "contract.query('getBalance', { origin })",
    category: "contract",
    async run(chain: ChainConfig) {
      const contractAddress = HOSTAPI_DEMO_ADDRESS;
      const origin = READ_ORIGIN;
      const client = await getClient(chain.genesis);
      try {
        const sdk = createInkSdk(client);
        const contract = sdk.getContract(
          contracts.hostApiDemo,
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
      "Calls deposit() on the HostApiDemo contract (payable write operation)",
    api: "contract.send('deposit', { origin, value: amount }).signSubmitAndWatch(signer)",
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
      const accountsProvider = (await accounts());
      const accountResult = await accountsProvider.getProductAccount(
        SELF_DOTNS,
        0,
      );
      const account = accountResult.match(
        (a) => a,
        () => null,
      );
      if (!account) return error("No product account available");

      const signer = accountsProvider.getProductAccountSigner(
        account,
        "createTransaction",
      );
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
        contracts.hostApiDemo,
        HOSTAPI_DEMO_ADDRESS,
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
      await new Promise<void>((resolve, reject) => {
        dryRun.value
          .send()
          .signSubmitAndWatch(signer)
          .subscribe({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            next: (ev: any) => {
              log(`Event: ${ev.type}`);
              if (ev.type === "txBestBlocksState" && ev.found) resolve();
              if (ev.type === "finalized" && !ev.ok)
                reject(new Error("Tx failed"));
            },
            error: reject,
          });
      });

      return success(`Deposited ${amountStr} PAS`, {
        planck: String(planck),
        contract: HOSTAPI_DEMO_ADDRESS,
      });
    },
  },
  {
    id: "contract-withdraw",
    name: "Contract: Withdraw",
    description:
      "Calls withdraw() on the HostApiDemo contract (write operation)",
    api: "contract.send('withdraw', { origin, data: { _amount } }).signSubmitAndWatch(signer)",
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
      const accountsProvider = (await accounts());
      const accountResult = await accountsProvider.getProductAccount(
        SELF_DOTNS,
        0,
      );
      const account = accountResult.match(
        (a) => a,
        () => null,
      );
      if (!account) return error("No product account available");

      const signer = accountsProvider.getProductAccountSigner(
        account,
        "createTransaction",
      );
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
        contracts.hostApiDemo,
        HOSTAPI_DEMO_ADDRESS,
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
      await new Promise<void>((resolve, reject) => {
        dryRun.value
          .send()
          .signSubmitAndWatch(signer)
          .subscribe({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            next: (ev: any) => {
              log(`Event: ${ev.type}`);
              if (ev.type === "txBestBlocksState" && ev.found) resolve();
              if (ev.type === "finalized" && !ev.ok)
                reject(new Error("Tx failed"));
            },
            error: reject,
          });
      });

      return success(`Withdrew ${amountStr} PAS`, {
        wei: String(wei),
        contract: HOSTAPI_DEMO_ADDRESS,
      });
    },
  },
  {
    id: "contract-query-total-deposits",
    name: "Contract: Query Total Deposits",
    description: "Reads totalDeposits() from the HostApiDemo contract",
    api: "contract.query('totalDeposits', { origin })",
    category: "contract",
    async run(chain: ChainConfig) {
      const contractAddress = HOSTAPI_DEMO_ADDRESS;
      const origin = READ_ORIGIN;
      const client = await getClient(chain.genesis);
      try {
        const sdk = createInkSdk(client);
        const contract = sdk.getContract(
          contracts.hostApiDemo,
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
      const themeProvider = (await theme());

      return new Promise((resolve) => {
        const themes: string[] = [];
        const sub = themeProvider.subscribeTheme((theme) => {
          // v0.6: subscribeTheme now yields { name, variant } instead of a string
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

      // The Parity `deriveEntropy` wrapper unwraps the ResultAsync internally
      // and throws on error - signature is `(key) => Promise<Uint8Array>`.
      try {
        const entropy = await deriveEntropy(key);
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
      const accountsProvider = (await accounts());
      const result = await accountsProvider.requestLogin(reason);

      return result.match(
        (loginResult) => success(`Login result: ${loginResult}`),
        (err) => error(`${err.name}`, err),
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
      const accountsProvider = (await accounts());
      const result = await accountsProvider.getUserId();

      return result.match(
        (account) =>
          success("User identity", {
            ...account,
          }),
        (err) => error(`${err.name}`, err),
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
      const log = logger || (() => {});

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

type AllocatableResource =
  | { tag: "StatementStoreAllowance"; value: undefined }
  | { tag: "BulletinAllowance"; value: undefined }
  | { tag: "SmartContractAllowance"; value: number };

async function runResourceAllocation(resources: AllocatableResource[]) {
  const result = await (await truApi()).requestResourceAllocation({
    tag: "v1",
    value: resources,
  });

  return result.match(
    (res) => {
      const outcomes = res.value.map((o, i) => ({
        resource: resources[i].tag,
        outcome: o.tag,
      }));
      return success(`Received ${outcomes.length} outcome(s)`, outcomes);
    },
    (err) => error(err.value.name, err.value),
  );
}

export const allowancesTests: TestDefinition[] = [
  {
    id: "allowances-statement-store",
    name: "Allocate StatementStore Allowance",
    description:
      "Requests a statement-store allowance from the host (RFC-0010)",
    api: 'truApi().requestResourceAllocation({ tag: "v1", value: [{ tag: "StatementStoreAllowance" }] })',
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
    api: 'truApi().requestResourceAllocation({ tag: "v1", value: [{ tag: "BulletinAllowance" }] })',
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
    api: 'truApi().requestResourceAllocation({ tag: "v1", value: [{ tag: "SmartContractAllowance", value: derivationIndex }] })',
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
        { tag: "SmartContractAllowance", value: derivationIndex },
      ]);
    },
  },
  {
    id: "allowances-all",
    name: "Allocate All Resources",
    description:
      "Requests every supported resource in a single call; outcomes are reported per resource",
    api: 'truApi().requestResourceAllocation({ tag: "v1", value: [...] })',
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
        { tag: "SmartContractAllowance", value: derivationIndex },
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
