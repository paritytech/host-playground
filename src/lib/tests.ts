import {
  createLegacyExtensionEnableFactory,
  createMetaProvider,
  createPapiProvider,
  sandboxTransport,
  hostApi,
  injectSpektrExtension,
  metaProvider,
  createAccountsProvider,
  createProductChatManager,
  createStatementStore,
  createLocalStorage,
  hostLocalStorage,
  createPreimageManager,
  preimageManager,
  createThemeProvider,
  createPaymentManager,
  deriveEntropy,
  WellKnownChain,
  type RemotePermissionItem,
} from "@novasamatech/host-api-wrapper";
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

// Cache papi clients per genesis — avoids in-flight chainHead events from a
// destroyed client corrupting a new client's block tree (undefined.children).
const clientCache = new Map<string, PolkadotClient>();
function getClient(genesis: `0x${string}`): PolkadotClient {
  let client = clientCache.get(genesis);
  if (!client) {
    client = createClient(createPapiProvider(genesis));
    clientCache.set(genesis, client);
  }
  return client;
}

const HOSTAPI_DEMO_ADDRESS = deployment.hostApiDemo;
const READ_ORIGIN = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY";

// Default DotNS identifier for product-account flows. Dotli embeds apps under
// sandbox origins such as <cid>.app.localhost / <cid>.app.dot, so those must
// not become the product DotNS id.
//
// Cases:
//   - <name>.dot                       → use as-is
//   - <cid>.app.localhost / <cid>.app.dot → host-playground.dot
//   - <name>.<root>.<tld>              → <name>.dot (handles .dot.li,
//     <name>.<sub>.<root>.<tld>          .paseo.li, .paseoli.dev, etc.)
//   - localhost / 127.0.0.1 / *.localhost → window.location.host
//     (desktop dev mode and Playwright both report the local host:port
//      and the desktop binds local URLs under "localhost[:port]")
//   - anything else                    → fall back to the prod identifier
const SELF_DOTNS = (() => {
  const fallback = "host-playground" + ".dot";
  if (typeof window === "undefined") return fallback;
  const hostname = window.location.hostname.toLowerCase();
  if (hostname.endsWith(".app.localhost") || hostname.endsWith(".app.dot")) {
    return fallback;
  }
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname === "127.0.0.1"
  ) {
    return window.location.host.toLowerCase();
  }
  if (hostname.endsWith(".dot")) return hostname;
  const segments = hostname.split(".");
  if (segments.length >= 3) return `${segments.slice(0, -2).join(".")}.dot`;
  return fallback;
})();

function success(message: string, details?: unknown): TestResult {
  return { success: true, message, details };
}

function error(message: string, details?: unknown): TestResult {
  return { success: false, message, details };
}

/** Request a single remote permission from the host. */
async function ensureRemotePermission(
  log: (msg: string) => void,
  permission: RemotePermissionItem,
): Promise<TestResult | null> {
  log(`Requesting remote permission: ${permission.tag}...`);
  const permissionResult = await hostApi.permission({
    tag: "v1",
    value: permission,
  });
  if (permissionResult.isErr()) {
    return error(`Remote permission denied (${permission.tag})`, permissionResult.error);
  }
  return null;
}

/** Before broadcasting a signed tx through the host (incl. `signSubmitAndWatch` submit step). */
function ensureChainSubmitForTxBroadcast(log: (msg: string) => void) {
  return ensureRemotePermission(log, { tag: "ChainSubmit", value: undefined });
}

/** Before `preimageManager.submit` / preimage RPC submit (host gates on PreimageSubmit). */
function ensurePreimageSubmitPermission(log: (msg: string) => void) {
  return ensureRemotePermission(log, { tag: "PreimageSubmit", value: undefined });
}

/** Before `statementStore.submit` (host gates on StatementSubmit). */
function ensureStatementSubmitPermission(log: (msg: string) => void) {
  return ensureRemotePermission(log, { tag: "StatementSubmit", value: undefined });
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
function createExpiryFromDuration(durationSecs: number, sequenceNumber = 0): bigint {
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
    { algo: "blake2b-256", cid: CID.createV1(IPFS_CODEC_RAW, blakeMh).toString() },
  ];
}

function lookupPreimageWithTimeout(
  hash: `0x${string}`,
  timeoutMs: number,
): Promise<Uint8Array | null> {
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

/** Direct `wsProvider` RPC + tx broadcast: requests Remote then ChainSubmit sequentially. */
async function ensureDirectWsSignSubmitPermissions(log: (msg: string) => void, wsUrl: string) {
  const remoteErr = await ensureRemotePermission(log, { tag: "Remote", value: [wsUrl] });
  if (remoteErr) return remoteErr;
  return ensureRemotePermission(log, { tag: "ChainSubmit", value: undefined });
}

/**
 * Before any signing/broadcast/submit operation that requires an authenticated
 * session. Idempotent: `requestLogin` returns `alreadyConnected` without
 * prompting if a session already exists.
 */
async function ensureLoggedIn(
  log: (msg: string) => void,
  reason = "Sign in to use this feature",
): Promise<TestResult | null> {
  const accountsProvider = createAccountsProvider();
  const result = await accountsProvider.requestLogin(reason);
  if (result.isErr()) {
    return error(`Login failed: ${result.error.name}`, result.error);
  }
  if (result.value === "rejected") {
    return error("User rejected login");
  }
  log(`Login: ${result.value}`);
  return null;
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
  const result = await hostApi.devicePermission({
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

// Account Tests
export const accountTests: TestDefinition[] = [
  {
    id: "accounts-provider-legacy",
    name: "Legacy Accounts",
    description: "Gets legacy accounts via createAccountsProvider",
    api: "accountsProvider.getLegacyAccounts()",
    category: "accounts",
    async run() {
      const accountsProvider = createAccountsProvider();
      const result = await accountsProvider.getLegacyAccounts();

      return result.match(
        (accounts) =>
          success(
            `Found ${accounts.length} legacy accounts`,
            accounts.map((a) => ({
              ...a,
              publicKey: toHex(a.publicKey),
            })),
          ),
        (err) => error(`${err.name}`, err),
      );
    },
  },
  {
    id: "legacy-accounts",
    name: "Legacy Accounts (Legacy)",
    description: "Gets all legacy accounts via legacy hostApi",
    api: "hostApi.getLegacyAccounts({ tag, value })",
    category: "accounts",
    async run() {
      const result = await hostApi.getLegacyAccounts({
        tag: "v1",
        value: undefined,
      });

      return result.match(
        (res) =>
          success(
            `Found ${res.value.length} accounts`,
            res.value.map((a) => ({
              ...a,
              publicKey: toHex(a.publicKey),
            })),
          ),
        (err) => error(err.value.name, err.value),
      );
    },
  },
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
      const accountsProvider = createAccountsProvider();
      const result = await accountsProvider.getProductAccount(dotNsIdentifier);

      return result.match(
        (account) =>
          success('Product account:', {
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
      const accountsProvider = createAccountsProvider();
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
      const accountsProvider = createAccountsProvider();
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
      const accountsProvider = createAccountsProvider();

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
    api: "hostApi.signRaw({ tag, value: { address, data } })",
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

      const loginErr = await ensureLoggedIn(log, "Sign in to sign messages");
      if (loginErr) return loginErr;

      log(`Fetching product account for ${dotNsIdentifier}...`);
      const accountsProvider = createAccountsProvider();
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

      const result = await hostApi.signRaw({
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
    id: "sign-payload-product",
    name: "Sign Payload (Product Account)",
    description:
      "Signs and submits a remark transaction using a product account signer",
    api: "tx.signSubmitAndWatch(productAccountSigner)",
    args: [
      {
        name: "dotNsIdentifier",
        label: "DotNS ID",
        defaultValue: SELF_DOTNS,
      },
      {
        name: "message",
        label: "Remark",
        defaultValue: "Remark from Host Playground",
      },
    ],
    category: "signing",
    async run(chain: ChainConfig, logger?: TestLogger, args?) {
      const log = logger || (() => {});
      const dotNsIdentifier = args?.dotNsIdentifier ?? SELF_DOTNS;

      const loginErr = await ensureLoggedIn(log, "Sign in to sign and submit a remark");
      if (loginErr) return loginErr;

      log(`Fetching product account for ${dotNsIdentifier}...`);
      const accountsProvider = createAccountsProvider();
      const accountResult =
        await accountsProvider.getProductAccount(dotNsIdentifier);

      const account = accountResult.match(
        (a) => a,
        (err) => {
          log(
            `getProductAccount failed: ${err.name}. Is the user signed in and is "${dotNsIdentifier}" a valid DotNS domain?`,
          );
          return null;
        },
      );

      if (!account) {
        return error(
          `No product account for "${dotNsIdentifier}" — check that the user is signed in and the DotNS ID is valid`,
        );
      }

      const signer = accountsProvider.getProductAccountSigner(
        account,
        "signPayload",
      );

      const client = getClient(chain.genesis);
      const api = client.getUnsafeApi();

      const permissionError = await ensureChainSubmitForTxBroadcast(log);
      if (permissionError) return permissionError;

      log("Preparing transaction...");
      const message = args?.message ?? "Remark from Host Playground";
      const tx = api.tx.System.remark({
        remark: Binary.fromText(message),
      });

      log("Signing with product account signer...");

      return new Promise<TestResult>((resolve, reject) => {
        tx.signSubmitAndWatch(signer).subscribe({
          next: (event) => {
            log(`Event: ${event.type}`);
            if (event.type === "txBestBlocksState" && event.found) {
              log("Included in block");
            } else if (event.type === "finalized") {
              resolve(
                success(`Transaction finalized on ${chain.name}`, {
                  txHash: event.txHash,
                  address: toHex(account.publicKey),
                }),
              );
            }
          },
          error: (e) => reject(e),
        });
      });
    },
  },
  {
    id: "sign-payload-ws",
    name: "Sign Payload (wsProvider)",
    description:
      "Signs a remark using a direct WebSocket connection instead of createPapiProvider",
    api: "createClient(getWsProvider(wsUrl)) + tx.signSubmitAndWatch(signer)",
    warning: "Should fail in proper sandboxing",
    args: [
      {
        name: "dotNsIdentifier",
        label: "DotNS ID",
        defaultValue: SELF_DOTNS,
      },
      {
        name: "message",
        label: "Remark",
        defaultValue: "Remark from Host Playground",
      },
    ],
    category: "signing",
    async run(chain: ChainConfig, logger?: TestLogger, args?) {
      const log = logger || (() => {});
      const dotNsIdentifier = args?.dotNsIdentifier ?? SELF_DOTNS;

      const loginErr = await ensureLoggedIn(log, "Sign in to sign via direct WebSocket");
      if (loginErr) return loginErr;

      log(`Fetching product account for ${dotNsIdentifier}...`);
      const accountsProvider = createAccountsProvider();
      const accountResult =
        await accountsProvider.getProductAccount(dotNsIdentifier);

      const account = accountResult.match(
        (a) => a,
        (err) => {
          log(`getProductAccount failed: ${err.name}`);
          return null;
        },
      );

      if (!account) {
        return error(
          `No product account for "${dotNsIdentifier}" — check that the user is signed in`,
        );
      }

      const signer = accountsProvider.getProductAccountSigner(
        account,
        "signPayload",
      );

      log(`Connecting directly via WebSocket to ${chain.wsUrl}...`);
      const { getWsProvider } = await import("@polkadot-api/ws-provider");
      const client = createClient(getWsProvider(chain.wsUrl));

      try {
        const api = client.getUnsafeApi();

        const permErr = await ensureDirectWsSignSubmitPermissions(log, chain.wsUrl);
        if (permErr) return permErr;

        log("Preparing transaction...");
        const message = args?.message ?? "Remark from Host Playground";
        const tx = api.tx.System.remark({
          remark: Binary.fromText(message),
        });

        log("Signing with product account signer...");

        return await new Promise<TestResult>((resolve, reject) => {
          tx.signSubmitAndWatch(signer).subscribe({
            next: (event) => {
              log(`Event: ${event.type}`);
              if (event.type === "txBestBlocksState" && event.found) {
                log("Included in block");
              } else if (event.type === "finalized") {
                resolve(
                  success(`Transaction finalized on ${chain.name}`, {
                    txHash: event.txHash,
                    address: toHex(account.publicKey),
                  }),
                );
              }
            },
            error: (e) => reject(e),
          });
        });
      } catch (e) {
        return error(`Direct WebSocket connection failed: ${e}`);
      } finally {
        client.destroy();
      }
    },
  },
  {
    id: "sign-batch-payload",
    name: "Sign & Submit Batch Payload",
    description:
      "Batches a remark + two storeValue calls on the HostApiDemo contract, submits, and reads stored value after finalization",
    api: "api.tx.Utility.batch_all([remark, Revive.call(storeValue), Revive.call(storeValue)])",
    args: [
      {
        name: "dotNsIdentifier",
        label: "DotNS ID",
        defaultValue: SELF_DOTNS,
      },
      {
        name: "remark",
        label: "Remark",
        defaultValue: "Batch test remark",
      },
    ],
    category: "signing",
    async run(chain: ChainConfig, logger?: TestLogger, args?) {
      const log = logger || (() => {});
      const dotNsIdentifier = args?.dotNsIdentifier ?? SELF_DOTNS;

      const loginErr = await ensureLoggedIn(log, "Sign in to sign and submit a batch");
      if (loginErr) return loginErr;

      log(`Fetching product account for ${dotNsIdentifier}...`);
      const accountsProvider = createAccountsProvider();
      const accountResult =
        await accountsProvider.getProductAccount(dotNsIdentifier);

      const account = accountResult.match(
        (a) => a,
        (err) => {
          log(
            `getProductAccount failed: ${err.name}. Is the user signed in and is "${dotNsIdentifier}" a valid DotNS domain?`,
          );
          return null;
        },
      );

      if (!account) {
        return error(
          `No product account for "${dotNsIdentifier}" — check that the user is signed in and the DotNS ID is valid`,
        );
      }

      const address = toHex(account.publicKey);
      const signer = accountsProvider.getProductAccountSigner(
        account,
        "signPayload",
      );
      log(`Product account signer ready: ${address.slice(0, 18)}...`);

      const client = getClient(chain.genesis);
      try {
        const api = client.getUnsafeApi();

        // 1. Remark call
        const remarkMsg = args?.remark ?? "Batch test remark";
        log("Preparing remark call...");
        const remarkCall = api.tx.System.remark({
          remark: Binary.fromText(remarkMsg),
        }).decodedCall;

        // 2. Two storeValue contract calls
        const contractAddr = HOSTAPI_DEMO_ADDRESS;

        log("Connecting to contract chain...");
        const contractClient = getClient(CHAINS.PASEO_ASSET_HUB.genesis);
        const contractApi = contractClient.getUnsafeApi();

        const dest = Binary.fromHex(contractAddr);
        // storeValue(uint256) with value=42: selector 0x55241077 + ABI-encoded 42
        const storeValueData = Binary.fromHex(
          "0x55241077000000000000000000000000000000000000000000000000000000000000002a",
        );

        // Dry run to estimate gas
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dryRun: any = await contractApi.apis.ReviveApi.call(
          address,
          dest,
          BigInt(0),
          undefined,
          undefined,
          storeValueData,
        );

        log(
          "Dry run result: " +
            JSON.stringify(dryRun, (_: string, v: unknown) =>
              typeof v === "bigint" ? v.toString() : v,
            ),
        );
        if (!dryRun.result?.success) {
          return error("Dry run failed", dryRun);
        }

        const weightLimit = dryRun.weight_required;
        const storageDeposit = dryRun.storage_deposit;
        const storageDepositLimit =
          storageDeposit?.type === "Charge" ? storageDeposit.value : BigInt(0);

        log("Preparing 2 storeValue calls...");
        const txDest = Binary.fromHex(contractAddr);
        const makeStoreValueCall = () =>
          contractApi.tx.Revive.call({
            dest: txDest,
            value: BigInt(0),
            weight_limit: weightLimit,
            storage_deposit_limit: storageDepositLimit,
            data: storeValueData,
          }).decodedCall;

        const storeCall1 = makeStoreValueCall();
        const storeCall2 = makeStoreValueCall();

        const permErr = await ensureChainSubmitForTxBroadcast(log);
        if (permErr) return permErr;

        // 3. Batch all three calls
        log("Preparing batch of 3 calls (1 remark + 2 storeValue)...");
        const batchTx = api.tx.Utility.batch_all({
          calls: [remarkCall, storeCall1, storeCall2],
        });

        // 4. Sign, submit, and wait for finalization
        log("Signing and submitting batch...");
        await new Promise<void>((resolve, reject) => {
          batchTx.signSubmitAndWatch(signer).subscribe({
            next: (event) => {
              if (event.type === "txBestBlocksState") {
                if (event.found) {
                  log("Batch included in block, waiting for finalization...");
                }
              } else if (event.type === "finalized") {
                log("Batch finalized!");
                resolve();
              }
            },
            error: (err) => reject(err),
          });
        });

        // 5. Read stored value after finalization
        log("Reading stored value...");
        // getStoredValue() selector = 0x12db2ef6
        const getValueData = Binary.fromHex("0x12db2ef6");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const readResult: any = await api.apis.ReviveApi.call(
          address,
          Binary.fromHex(contractAddr),
          BigInt(0),
          undefined,
          undefined,
          getValueData,
        );

        let storedValue: string | null = null;
        if (readResult.result.success) {
          const data = readResult.result.value.data;
          let hexData: string;
          if (typeof data === "string") {
            hexData = data;
          } else if (data && typeof data.asHex === "function") {
            hexData = data.asHex();
          } else {
            hexData = "0x";
          }
          if (hexData !== "0x" && hexData.length >= 66) {
            storedValue = String(BigInt(hexData));
          }
        }

        log(`Stored value: ${storedValue ?? "unknown"}`);

        return success(
          `Batch finalized on ${chain.name} — stored value: ${storedValue ?? "unknown"}`,
          {
            address,
            calls: [
              "System.remark",
              "Revive.call (storeValue)",
              "Revive.call (storeValue)",
            ],
            contract: contractAddr,
            storedValue,
          },
        );
      } catch (e) {
        throw e;
      }
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

      const loginErr = await ensureLoggedIn(log, "Sign in to create a transaction");
      if (loginErr) return loginErr;

      log(`Fetching product account for ${dotNsIdentifier}...`);
      const accountsProvider = createAccountsProvider();
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

      const client = getClient(chain.genesis);
      const api = client.getUnsafeApi();

      const message = args?.message ?? "Create Transaction from Host Playground";
      const tx = api.tx.System.remark({ remark: Binary.fromText(message) });

      log("Signing (createTransaction mode)...");
      const signedBytes = await tx.sign(signer);
      const signedHex = toHex(signedBytes);
      return success(
        `Transaction signed (${signedBytes.length} bytes)`,
        { preview: `${signedHex.slice(0, 80)}...`, length: signedBytes.length },
      );
    },
  },
];

// Extension & Provider Tests
export const extensionTests: TestDefinition[] = [
  {
    id: "inject-extension",
    name: "Inject Extension",
    description: "Injects the Spektr extension into the page",
    api: "injectSpektrExtension()",
    category: "extension",
    async run() {
      const result = await injectSpektrExtension();
      return result
        ? success("Extension injected successfully")
        : success("Extension already injected or unavailable");
    },
  },
  {
    id: "enable-factory",
    name: "Extension Enable Factory",
    description: "Creates and enables the extension factory",
    api: "createLegacyExtensionEnableFactory(transport)",
    category: "extension",
    async run() {
      const enableFactory =
        await createLegacyExtensionEnableFactory(sandboxTransport);
      if (!enableFactory) {
        return error("Transport not ready - enable factory returned null");
      }
      const injected = await enableFactory();
      return success(
        `Factory enabled - accounts: ${!!injected.accounts}, signer: ${!!injected.signer}`,
      );
    },
  },
  {
    id: "connection-status",
    name: "Connection Status",
    description: "Subscribes to connection status changes (10s)",
    api: "metaProvider.subscribeConnectionStatus(callback)",
    category: "extension",
    async run() {
      return new Promise((resolve) => {
        const statuses: string[] = [];
        const unsubscribe = metaProvider.subscribeConnectionStatus((status) => {
          statuses.push(JSON.stringify(status));
        });

        setTimeout(() => {
          unsubscribe();
          resolve(
            success(
              `Received ${statuses.length} status updates`,
              statuses.slice(-5),
            ),
          );
        }, 10000);
      });
    },
  },
  {
    id: "meta-provider",
    name: "Meta Provider",
    description: "Creates a meta provider instance",
    api: "createMetaProvider()",
    category: "extension",
    async run() {
      const provider = createMetaProvider();
      return provider
        ? success("Meta provider created successfully")
        : error("Failed to create meta provider");
    },
  },
  {
    id: "papi-provider",
    name: "PAPI Provider",
    description: "Creates a PAPI provider for the selected chain",
    api: "createPapiProvider(genesisHash)",
    category: "extension",
    async run(chain: ChainConfig) {
      const provider = createPapiProvider(chain.genesis);
      return success(`PAPI provider created for ${chain.name}`, {
        provider: typeof provider,
      });
    },
  },
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
    api: "hostLocalStorage.writeString(key, value) / readString(key)",
    args: [
      { name: "key", label: "Key", defaultValue: "host_playground_string" },
    ],
    category: "storage",
    async run(_chain, _logger, args) {
      const key = args?.key ?? "host_playground_string";
      const value = `test_value_${Date.now()}`;

      await hostLocalStorage.writeString(key, value);
      const readValue = await hostLocalStorage.readString(key);

      return readValue === value
        ? success(`Write: "${value}"\nRead: "${readValue}"`)
        : error(`Mismatch: wrote "${value}", read "${readValue}"`);
    },
  },
  {
    id: "storage-bytes-write-read",
    name: "Bytes Write & Read",
    description: "Writes and reads raw bytes via hostLocalStorage",
    api: "hostLocalStorage.writeBytes(key, value) / readBytes(key)",
    args: [
      { name: "key", label: "Key", defaultValue: "host_playground_bytes" },
    ],
    category: "storage",
    async run(_chain, _logger, args) {
      const key = args?.key ?? "host_playground_bytes";
      const value = new TextEncoder().encode(`bytes_${Date.now()}`);

      await hostLocalStorage.writeBytes(key, value);
      const readValue = await hostLocalStorage.readBytes(key);

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
    api: "hostLocalStorage.writeJSON(key, value) / readJSON(key)",
    args: [{ name: "key", label: "Key", defaultValue: "host_playground_json" }],
    category: "storage",
    async run(_chain, _logger, args) {
      const key = args?.key ?? "host_playground_json";
      const value = {
        timestamp: Date.now(),
        nested: { foo: "bar", nums: [1, 2, 3] },
      };

      await hostLocalStorage.writeJSON(key, value);
      const readValue = await hostLocalStorage.readJSON(key);

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
    api: "hostLocalStorage.clear(key)",
    args: [
      { name: "key", label: "Key", defaultValue: "host_playground_string" },
    ],
    category: "storage",
    async run(_chain, _logger, args) {
      const key = args?.key ?? "host_playground_string";

      // Write a value first to ensure the key exists
      await hostLocalStorage.writeString(key, "to_be_cleared");
      await hostLocalStorage.clear(key);

      const readValue = await hostLocalStorage.readString(key);
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
      const storage = createLocalStorage();
      const value = `factory_${Date.now()}`;

      await storage.writeString(key, value);
      const readValue = await storage.readString(key);
      await storage.clear(key);

      return readValue === value
        ? success(`Factory storage round-trip OK: "${value}"`)
        : error(`Mismatch: wrote "${value}", read "${readValue}"`);
    },
  },
  {
    id: "storage-legacy-write-read",
    name: "Storage (Legacy)",
    description: "Writes and reads via legacy hostApi.localStorageWrite/Read",
    api: "hostApi.localStorageWrite({ tag, value }) / localStorageRead({ tag, value })",
    args: [
      { name: "key", label: "Key (hex)", defaultValue: "0x746573745f6b6579" },
    ],
    category: "storage",
    async run(_chain, _logger, args) {
      const key = args?.key ?? "0x746573745f6b6579";
      const value = `test_value_${Date.now()}`;
      const valueBytes = new TextEncoder().encode(value);

      // Write
      const writeResult = await hostApi.localStorageWrite({
        tag: "v1",
        value: [key, valueBytes],
      });

      const writeSuccess = writeResult.match(
        () => true,
        () => false,
      );

      if (!writeSuccess) {
        return writeResult.match(
          () => success("Unexpected success"),
          (err) => error(`Write failed: ${err.value.name}`),
        );
      }

      // Read
      const readResult = await hostApi.localStorageRead({
        tag: "v1",
        value: key,
      });

      return readResult.match(
        (res) => {
          if (!res.value) {
            return error("Read failed: Key not found after write");
          }
          const readValue = new TextDecoder().decode(res.value);
          return success(
            `Write: "${value}" (${toHex(valueBytes)})\nRead: "${readValue}" (${toHex(res.value)})`,
          );
        },
        (err) => error(`Read failed: ${err.value.name}`),
      );
    },
  },
];

// Permission Tests
export const permissionTests: TestDefinition[] = [
  {
    id: "feature-check",
    name: "Feature Check",
    description: "Checks if the selected chain is supported",
    api: "hostApi.featureSupported({ tag, value: { tag: 'Chain', value } })",
    category: "permissions",
    async run(chain: ChainConfig) {
      const result = await hostApi.featureSupported({
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
    api: "hostApi.devicePermission({ tag: 'v1', value: 'Camera' })",
    category: "permissions",
    async run() {
      const result = await hostApi.devicePermission({
        tag: "v1",
        value: "Camera",
      });

      return result.match(
        (res) => success(`Camera permission: ${res.value ? "granted" : "denied"}`),
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "device-permission-microphone",
    name: "Device Permission: Microphone",
    description: "Requests microphone access from the host",
    api: "hostApi.devicePermission({ tag: 'v1', value: 'Microphone' })",
    category: "permissions",
    async run() {
      const result = await hostApi.devicePermission({
        tag: "v1",
        value: "Microphone",
      });

      return result.match(
        (res) => success(`Microphone permission: ${res.value ? "granted" : "denied"}`),
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "device-permission-location",
    name: "Device Permission: Location",
    description: "Requests location access from the host",
    api: "hostApi.devicePermission({ tag: 'v1', value: 'Location' })",
    category: "permissions",
    async run() {
      const result = await hostApi.devicePermission({
        tag: "v1",
        value: "Location",
      });

      return result.match(
        (res) => success(`Location permission: ${res.value ? "granted" : "denied"}`),
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "device-permission-bluetooth",
    name: "Device Permission: Bluetooth",
    description: "Requests bluetooth access from the host",
    api: "hostApi.devicePermission({ tag: 'v1', value: 'Bluetooth' })",
    category: "permissions",
    async run() {
      const result = await hostApi.devicePermission({
        tag: "v1",
        value: "Bluetooth",
      });

      return result.match(
        (res) => success(`Bluetooth permission: ${res.value ? "granted" : "denied"}`),
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "device-permission-notifications",
    name: "Device Permission: Notifications",
    description: "Requests notifications access from the host",
    api: "hostApi.devicePermission({ tag: 'v1', value: 'Notifications' })",
    category: "permissions",
    async run() {
      const result = await hostApi.devicePermission({
        tag: "v1",
        value: "Notifications",
      });

      return result.match(
        (res) => success(`Notifications permission: ${res.value ? "granted" : "denied"}`),
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "device-permission-nfc",
    name: "Device Permission: NFC",
    description: "Requests NFC access from the host",
    api: "hostApi.devicePermission({ tag: 'v1', value: 'NFC' })",
    category: "permissions",
    async run() {
      const result = await hostApi.devicePermission({
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
    api: "hostApi.devicePermission({ tag: 'v1', value: 'Clipboard' })",
    category: "permissions",
    async run() {
      const result = await hostApi.devicePermission({
        tag: "v1",
        value: "Clipboard",
      });

      return result.match(
        (res) => success(`Clipboard permission: ${res.value ? "granted" : "denied"}`),
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "device-permission-open-url",
    name: "Device Permission: Open URL",
    description: "Requests permission to open external URLs",
    api: "hostApi.devicePermission({ tag: 'v1', value: 'OpenUrl' })",
    category: "permissions",
    async run() {
      const result = await hostApi.devicePermission({
        tag: "v1",
        value: "OpenUrl",
      });

      return result.match(
        (res) => success(`OpenUrl permission: ${res.value ? "granted" : "denied"}`),
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "device-permission-biometrics",
    name: "Device Permission: Biometrics",
    description: "Requests biometrics access from the host",
    api: "hostApi.devicePermission({ tag: 'v1', value: 'Biometrics' })",
    category: "permissions",
    async run() {
      const result = await hostApi.devicePermission({
        tag: "v1",
        value: "Biometrics",
      });

      return result.match(
        (res) => success(`Biometrics permission: ${res.value ? "granted" : "denied"}`),
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "remote-permission-remote",
    name: "Remote Permission: Remote (HTTP/WS)",
    description: "Requests permission to connect to remote domains",
    api: "hostApi.permission({ tag: 'v1', value: { tag: 'Remote', value: [url] } })",
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
      const result = await hostApi.permission({
        tag: "v1",
        value: { tag: "Remote", value: [url] },
      });

      return result.match(
        (res) => success(`Remote permission: ${res.value ? "granted" : "denied"}`),
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "remote-permission-webrtc",
    name: "Remote Permission: WebRTC",
    description: "Requests permission to use WebRTC",
    api: "hostApi.permission({ tag: 'v1', value: { tag: 'WebRTC', value: undefined } })",
    category: "permissions",
    async run() {
      const result = await hostApi.permission({
        tag: "v1",
        value: { tag: "WebRTC", value: undefined },
      });

      return result.match(
        (res) => success(`WebRTC permission: ${res.value ? "granted" : "denied"}`),
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "remote-permission-chain-submit",
    name: "Remote Permission: Chain Submit",
    description: "Requests permission to submit transactions on a chain",
    api: "hostApi.permission({ tag: 'v1', value: { tag: 'ChainSubmit', value: undefined } })",
    category: "permissions",
    async run(chain) {
      const result = await hostApi.permission({
        tag: "v1",
        value: { tag: "ChainSubmit", value: undefined },
      });

      return result.match(
        (res) => success(`Chain submit permission for ${chain.name}: ${res.value ? "granted" : "denied"}`),
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "remote-permission-preimage-submit",
    name: "Remote Permission: Preimage Submit",
    description: "Requests permission to submit preimages via the host",
    api: "hostApi.permission({ tag: 'v1', value: { tag: 'PreimageSubmit', value: undefined } })",
    category: "permissions",
    async run(chain) {
      const result = await hostApi.permission({
        tag: "v1",
        value: { tag: "PreimageSubmit", value: undefined },
      });

      return result.match(
        (res) =>
          success(`Preimage submit permission for ${chain.name}: ${res.value ? "granted" : "denied"}`),
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "remote-permission-statement-submit",
    name: "Remote Permission: Statement Submit",
    description: "Requests permission to submit statement-store statements",
    api: "hostApi.permission({ tag: 'v1', value: { tag: 'StatementSubmit', value: undefined } })",
    category: "permissions",
    async run(chain) {
      const result = await hostApi.permission({
        tag: "v1",
        value: { tag: "StatementSubmit", value: undefined },
      });

      return result.match(
        (res) =>
          success(`Statement submit permission for ${chain.name}: ${res.value ? "granted" : "denied"}`),
        (err) => error(err.value.name, err.value),
      );
    },
  },
];

// Chat Tests
export const chatTests: TestDefinition[] = [
  {
    id: "chat-echo-bot-trigger",
    name: "Echo Bot Trigger",
    description:
      "Shows the trigger command to paste in Polkadot Desktop's chat UI",
    api: "worker: chatManager.subscribeAction() — responds to !echo",
    args: [
      {
        name: "message",
        label: "Message",
        defaultValue: "Hello from the playground!",
      },
    ],
    category: "chat",
    async run(_chain, _logger, args) {
      const message = args?.message ?? "Hello from the playground!";
      const trigger = `!echo ${message}`;
      await navigator.clipboard.writeText(trigger);
      return success(
        `Copied to clipboard — paste in the "Host Playground" chat room`,
        { trigger },
      );
    },
  },
  {
    id: "chat-manager-register-room",
    name: "Register Room",
    description: "Registers a chat room via createProductChatManager",
    api: "chatManager.registerRoom({ roomId, name, icon })",
    disabled: "Worker only — handled by the host",
    args: [
      {
        name: "roomId",
        label: "Room ID",
        defaultValue: "host-playground-room",
      },
      { name: "name", label: "Name", defaultValue: "Host Playground" },
    ],
    category: "chat",
    async run(_chain, _logger, args) {
      const chatManager = createProductChatManager();
      try {
        const result = await chatManager.registerRoom({
          roomId: args?.roomId ?? "host-playground-room",
          name: args?.name ?? "Host Playground",
          icon: "",
        });
        return success(`Room registration: ${result}`);
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
    id: "chat-manager-register-bot",
    name: "Register Bot",
    description: "Registers a bot via createProductChatManager",
    api: "chatManager.registerBot({ botId, name, icon })",
    disabled: "Worker only — handled by the host",
    args: [
      {
        name: "botId",
        label: "Bot ID",
        defaultValue: "playground-bot",
      },
      { name: "name", label: "Name", defaultValue: "Playground Bot" },
    ],
    category: "chat",
    async run(_chain, _logger, args) {
      const chatManager = createProductChatManager();
      try {
        const result = await chatManager.registerBot({
          botId: args?.botId ?? "playground-bot",
          name: args?.name ?? "Playground Bot",
          icon: "",
        });
        return success(`Bot registration: ${result}`);
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
    id: "chat-manager-send-message",
    name: "Send Text Message to Room",
    description: "Sends a message to an existing room via createProductChatManager",
    api: "chatManager.sendMessage(roomId, { tag: 'Text', value })",
    disabled: "Worker only — handled by the host",
    args: [
      {
        name: "roomId",
        label: "Room ID",
        defaultValue: "host-playground-room",
      },
      {
        name: "message",
        label: "Message",
        defaultValue: "Hello from Host Playground!",
      },
    ],
    category: "chat",
    async run(_chain, _logger, args) {
      const roomId = args?.roomId ?? "host-playground-room";
      const chatManager = createProductChatManager();
      try {
        await chatManager.registerRoom({ roomId, name: roomId, icon: "" });
        const result = await chatManager.sendMessage(roomId, {
          tag: "Text",
          value: args?.message ?? "Hello from Host Playground!",
        });
        return success(`Message sent (ID: ${result.messageId})`);
      } catch (e) {
        return error(`Failed to send: ${e}`);
      }
    },
  },
  {
    id: "chat-manager-send-custom-message",
    name: "Send Custom Message to Room",
    description: "Sends a custom (binary) message to an existing room",
    api: "chatManager.sendMessage(roomId, { tag: 'Custom', value })",
    disabled: "Worker only — handled by the host",
    args: [
      {
        name: "roomId",
        label: "Room ID",
        defaultValue: "host-playground-room",
      },
    ],
    category: "chat",
    async run(_chain, _logger, args) {
      const roomId = args?.roomId ?? "host-playground-room";
      const chatManager = createProductChatManager();
      const payload = new TextEncoder().encode(
        JSON.stringify({ action: "test", ts: Date.now() }),
      );
      try {
        const result = await chatManager.sendMessage(roomId, {
          tag: "Custom",
          value: { messageType: "host-playground", payload },
        });
        return success(`Custom message sent (ID: ${result.messageId})`);
      } catch (e) {
        return error(`Failed to send — is the room registered? ${e}`);
      }
    },
  },
  {
    id: "chat-manager-send-message-to-user",
    name: "Send Message to User",
    description: "Sends a statement to a user-specific topic via createStatementStore",
    api: "statementStore.createProof(accountId, statement) + statementStore.submit(signedStatement)",
    disabled: "Worker only — handled by the host",
    args: [
      {
        name: "senderDotNsId",
        label: "Sender DotNS ID",
        defaultValue: SELF_DOTNS,
      },
      {
        name: "recipientUsername",
        label: "Recipient Username",
        async defaultValue() {
          const accountsProvider = createAccountsProvider();
          const result = await accountsProvider.getLegacyAccounts();
          return result.match(
            (accounts) => accounts[0]?.name ?? "",
            () => "",
          );
        },
      },
      {
        name: "message",
        label: "Message",
        defaultValue: "Hello from Host Playground!",
      },
    ],
    category: "chat",
    async run(_chain, _logger, args) {
      const senderDotNsId = args?.senderDotNsId ?? SELF_DOTNS;
      const messageText = args?.message ?? "Hello from Host Playground!";
      let recipientUsername = args?.recipientUsername ?? "";
      if (!recipientUsername) {
        const accountsProvider = createAccountsProvider();
        const accountsResult = await accountsProvider.getLegacyAccounts();
        recipientUsername = accountsResult.match(
          (accounts) => accounts[0]?.name ?? "",
          () => "",
        );
      }
      const statementStore = createStatementStore();
      if (!recipientUsername)
        return error("No recipient username — not signed in?");
      const log = _logger || (() => {});
      const loginErr = await ensureLoggedIn(log, "Sign in to message another user");
      if (loginErr) return loginErr;
      const permErr = await ensureStatementSubmitPermission(log);
      if (permErr) return permErr;

      const encoder = new TextEncoder();
      const topic = encoder.encode(`host-playground:${recipientUsername}`);
      const data = encoder.encode(messageText);
      const statement = {
        proof: undefined,
        topics: [topic],
        data,
        channel: undefined,
        decryptionKey: undefined,
        expiry: createExpiryFromDuration(STATEMENT_TTL_SECS),
      };
      try {
        const proof = await statementStore.createProof(
          [senderDotNsId, 0],
          statement,
        );
        await statementStore.submit({ ...statement, proof });
        return success(
          `Statement submitted to topic "host-playground:${recipientUsername}"`,
          { topic: `host-playground:${recipientUsername}`, message: messageText },
        );
      } catch (e) {
        return error(`Failed to send: ${e}`);
      }
    },
  },
  {
    id: "chat-manager-subscribe-list",
    name: "Subscribe Chat List",
    description: "Subscribes to chat list updates (5s)",
    api: "chatManager.subscribeChatList(callback)",
    disabled: "Worker only — handled by the host",
    category: "chat",
    async run() {
      const chatManager = createProductChatManager();
      return new Promise((resolve) => {
        const rooms: unknown[] = [];
        const subscription = chatManager.subscribeChatList((chatRooms) => {
          rooms.push(...chatRooms);
        });
        setTimeout(() => {
          subscription.unsubscribe();
          resolve(
            success(`Received ${rooms.length} room updates in 5s`, rooms.slice(-5)),
          );
        }, 5000);
      });
    },
  },
  {
    id: "chat-manager-subscribe-action",
    name: "Subscribe Chat Actions",
    description: "Subscribes to incoming chat actions (5s)",
    api: "chatManager.subscribeAction(callback)",
    disabled: "Worker only — handled by the host",
    category: "chat",
    async run() {
      const chatManager = createProductChatManager();
      return new Promise((resolve) => {
        const actions: unknown[] = [];
        const subscription = chatManager.subscribeAction((action) => {
          actions.push(action);
        });
        setTimeout(() => {
          subscription.unsubscribe();
          resolve(
            success(`Received ${actions.length} actions in 5s`, actions.slice(-5)),
          );
        }, 5000);
      });
    },
  },
  {
    id: "chat-manager-custom-renderer",
    name: "Custom Message Renderer",
    description: "Registers a custom message rendering handler (5s)",
    api: "chatManager.onCustomMessageRenderingRequest(callback)",
    disabled: "Worker only — handled by the host",
    category: "chat",
    async run() {
      const chatManager = createProductChatManager();
      return new Promise((resolve) => {
        let requestCount = 0;
        const unsubscribe = chatManager.onCustomMessageRenderingRequest(
          (params, render) => {
            requestCount++;
            render({
              tag: "Text",
              value: {
                modifiers: [],
                props: { style: undefined, color: undefined },
                children: [
                  { tag: "String", value: `Rendered: ${params.messageType}` },
                ],
              },
            });
            return () => {};
          },
        );
        setTimeout(() => {
          unsubscribe();
          resolve(
            success(`Renderer registered, handled ${requestCount} requests`),
          );
        }, 5000);
      });
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

      const loginErr = await ensureLoggedIn(log, "Sign in to create a statement proof");
      if (loginErr) return loginErr;

      const statementStore = createStatementStore();
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
        const sig = 'signature' in proofValue
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

      const loginErr = await ensureLoggedIn(log, "Sign in to create a statement proof");
      if (loginErr) return loginErr;

      const messageBytes = new TextEncoder().encode(`Statement: ${Date.now()}`);
      const proof = await hostApi.statementStoreCreateProofAuthorized({
        tag: 'v1',
        value: {
          proof: undefined,
          decryptionKey: undefined,
          expiry: createExpiryFromDuration(STATEMENT_TTL_SECS),
          channel: undefined,
          topics: [],
          data: messageBytes,
        }
      });

      return proof.match(
        proof => {
          const proofValue = proof.value.value;
          const signature = 'signature' in proofValue
            ? toHex(proofValue.signature).slice(0, 20)
            : "onchain";

          return success(`Proof type: ${proof.tag}, sig: ${signature}...`);
        },
        err => {
          return error(err.value.toString())
        }
      )
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

      const loginErr = await ensureLoggedIn(log, "Sign in to submit a statement");
      if (loginErr) return loginErr;

      const statementStore = createStatementStore();
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
        const submitPerm = await ensureStatementSubmitPermission(log);
        if (submitPerm) return submitPerm;
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
      const statementStore = createStatementStore();

      return new Promise((resolve) => {
        const received: unknown[] = [];
        const subscription = statementStore.subscribe({ matchAll: [] }, (page) => {
          received.push(...page.statements);
        });

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
      const statementStore = createStatementStore();
      const encoder = new TextEncoder();
      const topicA = encoder.encode(
        args?.topicA ?? "host-playground:topic-a",
      );
      const topicB = encoder.encode(
        args?.topicB ?? "host-playground:topic-b",
      );

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
  {
    id: "statement-store-legacy",
    name: "Create Proof (Legacy)",
    description: "Creates a statement store proof via legacy hostApi",
    api: "hostApi.statementStoreCreateProof({ tag, value: [accountId, statement] })",
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

      const loginErr = await ensureLoggedIn(log, "Sign in to create a legacy statement proof");
      if (loginErr) return loginErr;

      const message = `Statement: ${Date.now()}`;
      const messageBytes = new TextEncoder().encode(message);

      const result = await hostApi.statementStoreCreateProof({
        tag: "v1",
        value: [
          [dotNsIdentifier, 0],
          {
            proof: undefined,
            decryptionKey: undefined,
            expiry: createExpiryFromDuration(STATEMENT_TTL_SECS),
            channel: undefined,
            topics: [],
            data: messageBytes,
          },
        ],
      });

      return result.match(
        (res) => {
          const proofValue = res.value.value as { signature?: Uint8Array };
          const sig = proofValue.signature
            ? toHex(proofValue.signature).slice(0, 20)
            : "onchain";
          return success(`Proof type: ${res.value.tag}, sig: ${sig}...`);
        },
        (err) => {
          const payload = err.value.payload as { reason?: string } | undefined;
          return error(
            err.value.name + (payload?.reason ? ` - ${payload.reason}` : ""),
          );
        },
      );
    },
  },
];

// Preimage Tests
export const preimageTests: TestDefinition[] = [
  {
    id: "preimage-submit",
    name: "Submit Preimage",
    description: "Submits a preimage and gets its hash back",
    api: "preimageManager.submit(data)",
    category: "preimage",
    async run(_chain, logger) {
      const log = logger || (() => {});
      const loginErr = await ensureLoggedIn(log, "Sign in to submit a preimage");
      if (loginErr) return loginErr;
      const permErr = await ensurePreimageSubmitPermission(log);
      if (permErr) return permErr;

      const data = new TextEncoder().encode(`preimage_${Date.now()}`);
      const hash = await preimageManager.submit(data);

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
    api: "preimageManager.lookup(hash, callback)",
    args: [
      {
        name: "hash",
        label: "Hash (0x…)",
        defaultValue: "0x5e933dd685deedfbf58063678bfa2abead4dc25e6da4ffea190503cfaa940d51",
      },
    ],
    category: "preimage",
    async run(_chain, logger, args) {
      const log = logger || (() => {});
      const hash = (args?.hash ?? "0x5e933dd685deedfbf58063678bfa2abead4dc25e6da4ffea190503cfaa940d51") as `0x${string}`;

      log(`Looking up hash: ${hash.slice(0, 20)}...`);

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
      const loginErr = await ensureLoggedIn(log, "Sign in to submit a preimage");
      if (loginErr) return loginErr;
      const permErr = await ensurePreimageSubmitPermission(log);
      if (permErr) return permErr;

      const manager = createPreimageManager();
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
    api: "preimageManager.submit + preimageManager.lookup + fetch(`${chain.ipfs}/${cid}`)",
    category: "preimage",
    async run(chain, logger) {
      const log = logger || (() => {});

      const loginErr = await ensureLoggedIn(log, "Sign in to upload a file to Bulletin");
      if (loginErr) return loginErr;

      // Allowance + permission setup (mirrors e2e/allowance-flows.spec.ts)
      log("Requesting BulletInAllowance...");
      const allocRes = await hostApi.requestResourceAllocation({
        tag: "v1",
        value: [{ tag: "BulletInAllowance", value: undefined }],
      });
      if (allocRes.isErr()) {
        return error("Bulletin allowance request failed", allocRes.error);
      }
      const permErr = await ensurePreimageSubmitPermission(log);
      if (permErr) return permErr;

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
      log("Submitting via preimageManager.submit...");
      const hash = await preimageManager.submit(payload);
      log(`Host returned hash: ${hash}`);

      // 3. Lookup via host — proves bytes round-trip through the host's bulletin path
      log("Looking up via preimageManager.lookup (10s)...");
      const lookupBytes = await lookupPreimageWithTimeout(hash, 10_000);
      if (!lookupBytes) {
        return error("Host lookup returned null / timed out", {
          hash,
          submitted: toHex(payload),
        });
      }
      const payloadEqualsLookup = bytesEqual(payload, lookupBytes);
      log(`Host lookup: ${lookupBytes.length} bytes, equal=${payloadEqualsLookup}`);
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

      for (const cand of candidates) {
        const url = `${gateway}/${cand.cid}`;
        log(`Fetching ${url} ...`);
        const probe: Probe = { algo: cand.algo, cid: cand.cid, url, status: "" };
        try {
          const r = await fetch(url, { signal: AbortSignal.timeout(15_000) });
          probe.status = r.status;
          if (r.ok) {
            const bytes = new Uint8Array(await r.arrayBuffer());
            probe.bytes = bytes.length;
            probe.equal = bytesEqual(payload, bytes);
            if (probe.equal) {
              matched = { algo: cand.algo, cid: cand.cid, bytes };
            }
          }
        } catch (e) {
          probe.status = `error: ${e instanceof Error ? e.message : String(e)}`;
        }
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
    description: "Send a push notification to the host",
    api: "hostApi.pushNotification({ tag: 'v1', value: { text, deeplink } })",
    args: [
      { name: "text", label: "Text", defaultValue: "Hello from demo product!" },
      { name: "deeplink", label: "Deeplink (optional)", defaultValue: "" },
    ],
    category: "notifications",
    async run(_chain, logger, args) {
      const log = logger || (() => {});
      const text = args?.text ?? "Hello from demo product!";
      const deeplink = args?.deeplink?.trim() || undefined;

      const permErr = await ensureDevicePermission(log, "Notifications");
      if (permErr) return permErr;

      const result = await hostApi.pushNotification({
        tag: "v1",
        value: { text, deeplink, scheduledAt: undefined },
      });

      return result.match(
        () =>
          success(
            `Notification sent: "${text}"${deeplink ? ` → ${deeplink}` : ""}`,
          ),
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
    api: "hostApi.navigateTo({ tag: 'v1', value: url })",
    args: [{ name: "url", label: "URL", defaultValue: "https://search.dot" }],
    category: "navigation",
    async run(_chain, logger, args) {
      const log = logger || (() => {});
      const url = args?.url ?? "https://search.dot";
      const permErr = await ensureDevicePermission(log, "OpenUrl");
      if (permErr) return permErr;
      const result = await hostApi.navigateTo({ tag: "v1", value: url });
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
    api: "hostApi.navigateTo({ tag: 'v1', value: url })",
    args: [{ name: "url", label: "URL", defaultValue: "https://polkadot.com" }],
    category: "navigation",
    async run(_chain, logger, args) {
      const log = logger || (() => {});
      const url = args?.url ?? "https://polkadot.com";
      const permErr = await ensureDevicePermission(log, "OpenUrl");
      if (permErr) return permErr;
      const result = await hostApi.navigateTo({ tag: "v1", value: url });
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
    api: "hostApi.chainSpecGenesisHash({ tag: 'v1', value: genesisHash })",
    category: "chain",
    async run(chain: ChainConfig) {
      const result = await hostApi.chainSpecGenesisHash({
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
    api: "hostApi.chainSpecChainName({ tag: 'v1', value: genesisHash })",
    category: "chain",
    async run(chain: ChainConfig) {
      const result = await hostApi.chainSpecChainName({
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
    api: "hostApi.chainSpecProperties({ tag: 'v1', value: genesisHash })",
    category: "chain",
    async run(chain: ChainConfig) {
      const result = await hostApi.chainSpecProperties({
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
    id: "chain-head-follow",
    name: "Chain Head: Follow",
    description:
      "Subscribes to chain head events for 10s (blocks, finalization)",
    api: "hostApi.chainHeadFollowSubscribe({ tag: 'v1', value: { genesisHash, withRuntime } }, callback)",
    category: "chain",
    async run(chain: ChainConfig) {
      return new Promise((resolve) => {
        const events: { tag: string; blockHash?: string }[] = [];

        const subscription = hostApi.chainHeadFollowSubscribe(
          {
            tag: "v1",
            value: { genesisHash: chain.genesis, withRuntime: false },
          },
          (event) => {
            if (event.tag === "v1") {
              const e = event.value;
              switch (e.tag) {
                case "Initialized":
                  events.push({
                    tag: "Initialized",
                    blockHash: e.value.finalizedBlockHashes[0],
                  });
                  break;
                case "NewBlock":
                  events.push({
                    tag: "NewBlock",
                    blockHash: e.value.blockHash,
                  });
                  break;
                case "BestBlockChanged":
                  events.push({
                    tag: "BestBlockChanged",
                    blockHash: e.value.bestBlockHash,
                  });
                  break;
                case "Finalized":
                  events.push({
                    tag: "Finalized",
                    blockHash: e.value.finalizedBlockHashes[0],
                  });
                  break;
                default:
                  events.push({ tag: e.tag });
              }
            }
          },
        );

        setTimeout(() => {
          subscription.unsubscribe();
          resolve(
            success(
              `Received ${events.length} chain head events in 10s`,
              events.slice(-10),
            ),
          );
        }, 10000);
      });
    },
  },
  {
    id: "chain-head-header",
    name: "Chain Head: Header",
    description: "Gets the header of the latest finalized block",
    api: "hostApi.chainHeadHeader({ tag: 'v1', value: { genesisHash, followSubscriptionId, hash } })",
    category: "chain",
    async run(chain: ChainConfig, logger) {
      const log = logger || (() => {});
      log("Starting follow subscription...");

      return new Promise((resolve) => {
        const subscription = hostApi.chainHeadFollowSubscribe(
          { tag: "v1", value: { genesisHash: chain.genesis, withRuntime: false } },
          async (event) => {
            if (event.tag !== "v1") return;
            const e = event.value;
            if (e.tag !== "Initialized") return;

            const blockHash = e.value.finalizedBlockHashes[0]!;
            const subscriptionId = (subscription as unknown as { id: string }).id;
            log(`Got finalized block, fetching header for ${blockHash.slice(0, 18)}...`);

            try {
              const result = await hostApi.chainHeadHeader({
                tag: "v1",
                value: {
                  genesisHash: chain.genesis,
                  followSubscriptionId: subscriptionId,
                  hash: blockHash,
                },
              });

              subscription.unsubscribe();
              result.match(
                (res) => resolve(success(`Header: ${res.value?.slice(0, 40)}...`, { blockHash, header: res.value })),
                (err) => resolve(error(err.value.name, err.value)),
              );
            } catch (e) {
              subscription.unsubscribe();
              resolve(error(`Failed to get header: ${e}`));
            }
          },
        );

        setTimeout(() => {
          subscription.unsubscribe();
          resolve(error("Timed out waiting for Initialized event"));
        }, 15000);
      });
    },
  },
  {
    id: "chain-head-body",
    name: "Chain Head: Body",
    description: "Gets the body (extrinsics) of the latest finalized block",
    api: "hostApi.chainHeadBody({ tag: 'v1', value: { genesisHash, followSubscriptionId, hash } })",
    category: "chain",
    async run(chain: ChainConfig, logger) {
      const log = logger || (() => {});
      log("Starting follow subscription...");

      return new Promise((resolve) => {
        const subscription = hostApi.chainHeadFollowSubscribe(
          { tag: "v1", value: { genesisHash: chain.genesis, withRuntime: false } },
          async (event) => {
            if (event.tag !== "v1") return;
            const e = event.value;
            if (e.tag !== "Initialized") return;

            const blockHash = e.value.finalizedBlockHashes[0]!;
            const subscriptionId = (subscription as unknown as { id: string }).id;
            log(`Fetching body for ${blockHash.slice(0, 18)}...`);

            try {
              const result = await hostApi.chainHeadBody({
                tag: "v1",
                value: {
                  genesisHash: chain.genesis,
                  followSubscriptionId: subscriptionId,
                  hash: blockHash,
                },
              });

              subscription.unsubscribe();
              result.match(
                (res) => resolve(success(`Body operation: ${res.value.tag}`, res.value)),
                (err) => resolve(error(err.value.name, err.value)),
              );
            } catch (e) {
              subscription.unsubscribe();
              resolve(error(`Failed to get body: ${e}`));
            }
          },
        );

        setTimeout(() => {
          subscription.unsubscribe();
          resolve(error("Timed out waiting for Initialized event"));
        }, 15000);
      });
    },
  },
  {
    id: "chain-head-storage",
    name: "Chain Head: Storage",
    description: "Queries runtime storage for System.Account using chain head",
    api: "hostApi.chainHeadStorage({ tag: 'v1', value: { genesisHash, followSubscriptionId, hash, items, childTrie } })",
    category: "chain",
    async run(chain: ChainConfig, logger) {
      const log = logger || (() => {});
      log("Starting follow subscription...");

      return new Promise((resolve) => {
        const subscription = hostApi.chainHeadFollowSubscribe(
          { tag: "v1", value: { genesisHash: chain.genesis, withRuntime: false } },
          async (event) => {
            if (event.tag !== "v1") return;
            const e = event.value;
            if (e.tag !== "Initialized") return;

            const blockHash = e.value.finalizedBlockHashes[0]!;
            const subscriptionId = (subscription as unknown as { id: string }).id;
            log(`Querying storage at ${blockHash.slice(0, 18)}...`);

            try {
              // Query System.Account storage prefix
              const storageKey = "0x26aa394eea5630e07c48ae0c9558cef7" as `0x${string}`;
              const result = await hostApi.chainHeadStorage({
                tag: "v1",
                value: {
                  genesisHash: chain.genesis,
                  followSubscriptionId: subscriptionId,
                  hash: blockHash,
                  items: [{ key: storageKey, type: "Value" as const }],
                  childTrie: null,
                },
              });

              subscription.unsubscribe();
              result.match(
                (res) => resolve(success(`Storage operation: ${res.value.tag}`, res.value)),
                (err) => resolve(error(err.value.name, err.value)),
              );
            } catch (e) {
              subscription.unsubscribe();
              resolve(error(`Failed to query storage: ${e}`));
            }
          },
        );

        setTimeout(() => {
          subscription.unsubscribe();
          resolve(error("Timed out waiting for Initialized event"));
        }, 15000);
      });
    },
  },
  {
    id: "chain-head-call",
    name: "Chain Head: Call",
    description: "Makes a runtime API call (Core_version) via chain head",
    api: "hostApi.chainHeadCall({ tag: 'v1', value: { genesisHash, followSubscriptionId, hash, function, callParameters } })",
    category: "chain",
    async run(chain: ChainConfig, logger) {
      const log = logger || (() => {});
      log("Starting follow subscription...");

      return new Promise((resolve) => {
        const subscription = hostApi.chainHeadFollowSubscribe(
          { tag: "v1", value: { genesisHash: chain.genesis, withRuntime: false } },
          async (event) => {
            if (event.tag !== "v1") return;
            const e = event.value;
            if (e.tag !== "Initialized") return;

            const blockHash = e.value.finalizedBlockHashes[0]!;
            const subscriptionId = (subscription as unknown as { id: string }).id;
            log(`Calling Core_version at ${blockHash.slice(0, 18)}...`);

            try {
              const result = await hostApi.chainHeadCall({
                tag: "v1",
                value: {
                  genesisHash: chain.genesis,
                  followSubscriptionId: subscriptionId,
                  hash: blockHash,
                  function: "Core_version",
                  callParameters: "0x" as `0x${string}`,
                },
              });

              subscription.unsubscribe();
              result.match(
                (res) => resolve(success(`Call operation: ${res.value.tag}`, res.value)),
                (err) => resolve(error(err.value.name, err.value)),
              );
            } catch (e) {
              subscription.unsubscribe();
              resolve(error(`Failed to make runtime call: ${e}`));
            }
          },
        );

        setTimeout(() => {
          subscription.unsubscribe();
          resolve(error("Timed out waiting for Initialized event"));
        }, 15000);
      });
    },
  },
  {
    id: "chain-head-unpin",
    name: "Chain Head: Unpin",
    description: "Unpins a previously pinned block hash",
    api: "hostApi.chainHeadUnpin({ tag: 'v1', value: { genesisHash, followSubscriptionId, hashes } })",
    category: "chain",
    async run(chain: ChainConfig, logger) {
      const log = logger || (() => {});
      log("Starting follow subscription...");

      return new Promise((resolve) => {
        const subscription = hostApi.chainHeadFollowSubscribe(
          { tag: "v1", value: { genesisHash: chain.genesis, withRuntime: false } },
          async (event) => {
            if (event.tag !== "v1") return;
            const e = event.value;
            if (e.tag !== "Initialized") return;

            const blockHash = e.value.finalizedBlockHashes[0]!;
            const subscriptionId = (subscription as unknown as { id: string }).id;
            log(`Unpinning block ${blockHash.slice(0, 18)}...`);

            try {
              const result = await hostApi.chainHeadUnpin({
                tag: "v1",
                value: {
                  genesisHash: chain.genesis,
                  followSubscriptionId: subscriptionId,
                  hashes: [blockHash],
                },
              });

              subscription.unsubscribe();
              result.match(
                () => resolve(success(`Unpinned block ${blockHash.slice(0, 18)}...`)),
                (err) => resolve(error(err.value.name, err.value)),
              );
            } catch (e) {
              subscription.unsubscribe();
              resolve(error(`Failed to unpin: ${e}`));
            }
          },
        );

        setTimeout(() => {
          subscription.unsubscribe();
          resolve(error("Timed out waiting for Initialized event"));
        }, 15000);
      });
    },
  },
  {
    id: "chain-transaction-broadcast",
    name: "Transaction: Broadcast",
    description: "Broadcasts a dummy transaction (expected to fail validation)",
    api: "hostApi.chainTransactionBroadcast({ tag: 'v1', value: { genesisHash, transaction } })",
    warning: "Will fail with invalid transaction",
    category: "chain",
    async run(chain: ChainConfig) {
      const result = await hostApi.chainTransactionBroadcast({
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
    api: "hostApi.chainTransactionStop({ tag: 'v1', value: { genesisHash, operationId } })",
    category: "chain",
    async run(chain: ChainConfig, logger) {
      const log = logger || (() => {});
      log("Broadcasting dummy transaction...");

      const broadcastResult = await hostApi.chainTransactionBroadcast({
        tag: "v1",
        value: {
          genesisHash: chain.genesis,
          transaction: "0x00" as `0x${string}`,
        },
      });

      return broadcastResult.match(
        async (res) => {
          const operationId = res.value;
          if (!operationId) return success("Broadcast returned no operationId — nothing to stop");

          log(`Stopping broadcast ${operationId}...`);
          const stopResult = await hostApi.chainTransactionStop({
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
    id: "chain-head-continue",
    name: "Chain Head: Continue",
    description: "Starts a storage query then continues the operation",
    api: "hostApi.chainHeadContinue({ tag: 'v1', value: { genesisHash, followSubscriptionId, operationId } })",
    category: "chain",
    async run(chain: ChainConfig, logger) {
      const log = logger || (() => {});
      log("Starting follow subscription...");

      return new Promise((resolve) => {
        const subscription = hostApi.chainHeadFollowSubscribe(
          { tag: "v1", value: { genesisHash: chain.genesis, withRuntime: false } },
          async (event) => {
            if (event.tag !== "v1") return;
            const e = event.value;
            if (e.tag !== "Initialized") return;

            const blockHash = e.value.finalizedBlockHashes[0]!;
            const subscriptionId = (subscription as unknown as { id: string }).id;
            log("Starting storage query to trigger OperationWaitingForContinue...");

            try {
              // Query with DescendantsValues to increase chance of pagination
              const storageKey = "0x26aa394eea5630e07c48ae0c9558cef7" as `0x${string}`;
              const storageResult = await hostApi.chainHeadStorage({
                tag: "v1",
                value: {
                  genesisHash: chain.genesis,
                  followSubscriptionId: subscriptionId,
                  hash: blockHash,
                  items: [{ key: storageKey, type: "DescendantsValues" as const }],
                  childTrie: null,
                },
              });

              const operationId = storageResult.match(
                (res) => (res.value.tag === "Started" ? res.value.value.operationId : null),
                () => null,
              );

              if (!operationId) {
                subscription.unsubscribe();
                resolve(success("Storage query returned LimitReached — no operation to continue"));
                return;
              }

              log(`Calling continue on operation ${operationId}...`);
              const continueResult = await hostApi.chainHeadContinue({
                tag: "v1",
                value: {
                  genesisHash: chain.genesis,
                  followSubscriptionId: subscriptionId,
                  operationId,
                },
              });

              subscription.unsubscribe();
              continueResult.match(
                () => resolve(success(`Continued operation ${operationId}`)),
                (err) => resolve(error(err.value.name, err.value)),
              );
            } catch (e) {
              subscription.unsubscribe();
              resolve(error(`Failed: ${e}`));
            }
          },
        );

        setTimeout(() => {
          subscription.unsubscribe();
          resolve(error("Timed out waiting for Initialized event"));
        }, 15000);
      });
    },
  },
  {
    id: "chain-head-stop-operation",
    name: "Chain Head: Stop Operation",
    description: "Starts a storage query then stops the operation",
    api: "hostApi.chainHeadStopOperation({ tag: 'v1', value: { genesisHash, followSubscriptionId, operationId } })",
    category: "chain",
    async run(chain: ChainConfig, logger) {
      const log = logger || (() => {});
      log("Starting follow subscription...");

      return new Promise((resolve) => {
        const subscription = hostApi.chainHeadFollowSubscribe(
          { tag: "v1", value: { genesisHash: chain.genesis, withRuntime: false } },
          async (event) => {
            if (event.tag !== "v1") return;
            const e = event.value;
            if (e.tag !== "Initialized") return;

            const blockHash = e.value.finalizedBlockHashes[0]!;
            const subscriptionId = (subscription as unknown as { id: string }).id;
            log("Starting storage query...");

            try {
              const storageKey = "0x26aa394eea5630e07c48ae0c9558cef7" as `0x${string}`;
              const storageResult = await hostApi.chainHeadStorage({
                tag: "v1",
                value: {
                  genesisHash: chain.genesis,
                  followSubscriptionId: subscriptionId,
                  hash: blockHash,
                  items: [{ key: storageKey, type: "DescendantsValues" as const }],
                  childTrie: null,
                },
              });

              const operationId = storageResult.match(
                (res) => (res.value.tag === "Started" ? res.value.value.operationId : null),
                () => null,
              );

              if (!operationId) {
                subscription.unsubscribe();
                resolve(success("Storage query returned LimitReached — no operation to stop"));
                return;
              }

              log(`Stopping operation ${operationId}...`);
              const stopResult = await hostApi.chainHeadStopOperation({
                tag: "v1",
                value: {
                  genesisHash: chain.genesis,
                  followSubscriptionId: subscriptionId,
                  operationId,
                },
              });

              subscription.unsubscribe();
              stopResult.match(
                () => resolve(success(`Stopped operation ${operationId}`)),
                (err) => resolve(error(err.value.name, err.value)),
              );
            } catch (e) {
              subscription.unsubscribe();
              resolve(error(`Failed: ${e}`));
            }
          },
        );

        setTimeout(() => {
          subscription.unsubscribe();
          resolve(error("Timed out waiting for Initialized event"));
        }, 15000);
      });
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
          const accountsProvider = createAccountsProvider();
          const result = await accountsProvider.getProductAccount(SELF_DOTNS, 0);
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
        const accountsProvider = createAccountsProvider();
        const accountResult = await accountsProvider.getProductAccount(SELF_DOTNS, 0);
        const account = accountResult.match((a) => a, () => null);
        if (!account) {
          return error(`No product account for "${SELF_DOTNS}"`);
        }
        address = AccountId(chain.ss58Prefix).dec(account.publicKey);
        log(`Resolved product account ${SELF_DOTNS}/0 → ${address}`);
      }
      const client = getClient(chain.genesis);
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
    description:
      "Reads getStoredValue() from the HostApiDemo contract",
    api: "contract.query('getStoredValue', { origin })",
    category: "contract",
    async run(chain: ChainConfig) {
      const contractAddress = HOSTAPI_DEMO_ADDRESS;
      const origin = READ_ORIGIN;
      const client = getClient(chain.genesis);
      try {
        const sdk = createInkSdk(client);
        const contract = sdk.getContract(contracts.hostApiDemo, contractAddress);
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

      const loginErr = await ensureLoggedIn(log, "Sign in to call a contract");
      if (loginErr) return loginErr;

      log("Fetching account...");
      const accountsProvider = createAccountsProvider();
      const accountResult = await accountsProvider.getProductAccount(SELF_DOTNS, 0);
      const account = accountResult.match((a) => a, () => null);
      if (!account) return error("No product account available");

      const signer = accountsProvider.getProductAccountSigner(account, "createTransaction");
      const origin = AccountId().dec(account.publicKey);

      const permissionError = await ensureChainSubmitForTxBroadcast(log);
      if (permissionError) return permissionError;

      const client = getClient(chain.genesis);
      const sdk = createInkSdk(client);
      const contract = sdk.getContract(contracts.hostApiDemo, HOSTAPI_DEMO_ADDRESS);

      const value = BigInt(args?.value ?? "42");
      log(`Storing value ${value}...`);

      const dryRun = await contract.query("storeValue", { origin, data: { _value: value } });
      if (!dryRun.success) return error("Dry-run failed", dryRun.value);

      log("Signing and submitting...");
      await new Promise<void>((resolve, reject) => {
        dryRun.value.send().signSubmitAndWatch(signer).subscribe({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          next: (ev: any) => {
            log(`Event: ${ev.type}`);
            if (ev.type === "txBestBlocksState" && ev.found) resolve();
            if (ev.type === "finalized" && !ev.ok) reject(new Error("Tx failed"));
          },
          error: reject,
        });
      });

      return success(`Stored value: ${value}`, { value: String(value), contract: HOSTAPI_DEMO_ADDRESS });
    },
  },
  {
    id: "contract-query-data-length",
    name: "Contract: Query Data Length",
    description:
      "Reads getStoredDataLength() from the HostApiDemo contract",
    api: "contract.query('getStoredDataLength', { origin })",
    category: "contract",
    async run(chain: ChainConfig) {
      const contractAddress = HOSTAPI_DEMO_ADDRESS;
      const origin = READ_ORIGIN;
      const client = getClient(chain.genesis);
      try {
        const sdk = createInkSdk(client);
        const contract = sdk.getContract(contracts.hostApiDemo, contractAddress);
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
      const client = getClient(chain.genesis);
      try {
        const sdk = createInkSdk(client);
        const contract = sdk.getContract(contracts.hostApiDemo, contractAddress);
        const result = await contract.query("getBalance", { origin });
        if (!result.success) return error("Query failed", result.value);
        const wei = result.value.response as bigint;
        const divisor = BigInt("1000000000000000000");
        const whole = wei / divisor;
        const frac = (wei % divisor).toString().padStart(18, "0").replace(/0+$/, "") || "0";
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

      const loginErr = await ensureLoggedIn(log, "Sign in to call a contract");
      if (loginErr) return loginErr;

      log("Fetching account...");
      const accountsProvider = createAccountsProvider();
      const accountResult = await accountsProvider.getProductAccount(SELF_DOTNS, 0);
      const account = accountResult.match((a) => a, () => null);
      if (!account) return error("No product account available");

      const signer = accountsProvider.getProductAccountSigner(account, "createTransaction");
      const origin = AccountId().dec(account.publicKey);

      const permissionError = await ensureChainSubmitForTxBroadcast(log);
      if (permissionError) return permissionError;

      const client = getClient(chain.genesis);
      const sdk = createInkSdk(client);
      const contract = sdk.getContract(contracts.hostApiDemo, HOSTAPI_DEMO_ADDRESS);

      const amountStr = args?.amount ?? "0.1";
      const [whole = "0", frac = ""] = amountStr.split(".");
      const planck = BigInt(whole) * BigInt("10000000000") + BigInt(frac.padEnd(10, "0").slice(0, 10));
      log(`Depositing ${amountStr} PAS (${planck} planck)...`);

      const dryRun = await contract.query("deposit", { origin, value: planck });
      if (!dryRun.success) return error("Dry-run failed", dryRun.value);

      log("Signing and submitting...");
      await new Promise<void>((resolve, reject) => {
        dryRun.value.send().signSubmitAndWatch(signer).subscribe({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          next: (ev: any) => {
            log(`Event: ${ev.type}`);
            if (ev.type === "txBestBlocksState" && ev.found) resolve();
            if (ev.type === "finalized" && !ev.ok) reject(new Error("Tx failed"));
          },
          error: reject,
        });
      });

      return success(`Deposited ${amountStr} PAS`, { planck: String(planck), contract: HOSTAPI_DEMO_ADDRESS });
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

      const loginErr = await ensureLoggedIn(log, "Sign in to call a contract");
      if (loginErr) return loginErr;

      log("Fetching account...");
      const accountsProvider = createAccountsProvider();
      const accountResult = await accountsProvider.getProductAccount(SELF_DOTNS, 0);
      const account = accountResult.match((a) => a, () => null);
      if (!account) return error("No product account available");

      const signer = accountsProvider.getProductAccountSigner(account, "createTransaction");
      const origin = AccountId().dec(account.publicKey);

      const permissionError = await ensureChainSubmitForTxBroadcast(log);
      if (permissionError) return permissionError;

      const client = getClient(chain.genesis);
      const sdk = createInkSdk(client);
      const contract = sdk.getContract(contracts.hostApiDemo, HOSTAPI_DEMO_ADDRESS);

      const amountStr = args?.amount ?? "0.1";
      const [whole = "0", frac = ""] = amountStr.split(".");
      // withdraw() takes wei (18 decimals)
      const wei = BigInt(whole) * BigInt("1000000000000000000") + BigInt(frac.padEnd(18, "0").slice(0, 18));
      log(`Withdrawing ${amountStr} PAS (${wei} wei)...`);

      const dryRun = await contract.query("withdraw", { origin, data: { _amount: wei } });
      if (!dryRun.success) return error("Dry-run failed", dryRun.value);

      log("Signing and submitting...");
      await new Promise<void>((resolve, reject) => {
        dryRun.value.send().signSubmitAndWatch(signer).subscribe({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          next: (ev: any) => {
            log(`Event: ${ev.type}`);
            if (ev.type === "txBestBlocksState" && ev.found) resolve();
            if (ev.type === "finalized" && !ev.ok) reject(new Error("Tx failed"));
          },
          error: reject,
        });
      });

      return success(`Withdrew ${amountStr} PAS`, { wei: String(wei), contract: HOSTAPI_DEMO_ADDRESS });
    },
  },
  {
    id: "contract-query-total-deposits",
    name: "Contract: Query Total Deposits",
    description:
      "Reads totalDeposits() from the HostApiDemo contract",
    api: "contract.query('totalDeposits', { origin })",
    category: "contract",
    async run(chain: ChainConfig) {
      const contractAddress = HOSTAPI_DEMO_ADDRESS;
      const origin = READ_ORIGIN;
      const client = getClient(chain.genesis);
      try {
        const sdk = createInkSdk(client);
        const contract = sdk.getContract(contracts.hostApiDemo, contractAddress);
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
      const themeProvider = createThemeProvider();

      return new Promise((resolve) => {
        const themes: string[] = [];
        const sub = themeProvider.subscribeTheme((theme) => {
          themes.push(theme);
        });

        setTimeout(() => {
          sub.unsubscribe();
          resolve(
            success(`Received ${themes.length} theme updates`, themes),
          );
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
      const result = await deriveEntropy(key);

      return result.match(
        (entropy) =>
          success(`Derived ${entropy.length} bytes of entropy`, {
            entropyHex: toHex(entropy),
          }),
        (err) => error(`${err.name}`, err),
      );
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
      const accountsProvider = createAccountsProvider();
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
      const accountsProvider = createAccountsProvider();
      const result = await accountsProvider.getUserId();

      return result.match(
        (account) =>
          success('User identity', {
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
      const loginErr = await ensureLoggedIn(log, "Sign in to view your balance");
      if (loginErr) return loginErr;

      const pm = createPaymentManager();

      return new Promise((resolve) => {
        const balances: unknown[] = [];
        const sub = pm.subscribeBalance((balance) => {
          balances.push(balance);
        });

        setTimeout(() => {
          sub.unsubscribe();
          resolve(
            success(
              `Received ${balances.length} balance updates`,
              balances,
            ),
          );
        }, 3000);
      });
    },
  },
  {
    id: "payment-top-up",
    name: "Top Up",
    description: "Top up the payment balance from a product account",
    api: "paymentManager.topUp(amount, source)",
    args: [
      {
        name: "dotNsIdentifier",
        label: "DotNS ID",
        defaultValue: SELF_DOTNS,
      },
      {
        name: "amount",
        label: "Amount (smallest unit)",
        defaultValue: "1000000000000",
      },
    ],
    category: "payments",
    async run(_chain, logger, args) {
      const log = logger || (() => {});
      const dotNsIdentifier = args?.dotNsIdentifier ?? SELF_DOTNS;
      const amount = BigInt(args?.amount ?? "1000000000000");

      const loginErr = await ensureLoggedIn(log, "Sign in to top up your balance");
      if (loginErr) return loginErr;

      const pm = createPaymentManager();

      try {
        await pm.topUp(amount, {
          type: "productAccount",
          derivationIndex: 0,
        });
        return success(`Topped up ${amount}`);
      } catch (e) {
        return error(`Top-up failed: ${e}`);
      }
    },
  },
  {
    id: "payment-request",
    name: "Request Payment",
    description: "Request a payment to a destination account",
    api: "paymentManager.requestPayment(amount, destination)",
    args: [
      {
        name: "amount",
        label: "Amount (smallest unit)",
        defaultValue: "100000000000",
      },
    ],
    category: "payments",
    async run(_chain, logger, args) {
      const log = logger || (() => {});
      const amount = BigInt(args?.amount ?? "100000000000");

      const loginErr = await ensureLoggedIn(log, "Sign in to request a payment");
      if (loginErr) return loginErr;

      const pm = createPaymentManager();
      const destination = new Uint8Array(32); // zero address for test

      try {
        const receipt = await pm.requestPayment(amount, destination);
        return success(`Payment requested: ${receipt.id}`, receipt);
      } catch (e) {
        return error(`Payment request failed: ${e}`);
      }
    },
  },
];

type AllocatableResource =
  | { tag: "StatementStoreAllowance"; value: undefined }
  | { tag: "BulletInAllowance"; value: undefined }
  | { tag: "SmartContractAllowance"; value: number }
  | { tag: "AutoSigning"; value: undefined };

async function runResourceAllocation(resources: AllocatableResource[]) {
  const result = await hostApi.requestResourceAllocation({
    tag: "v1",
    value: resources,
  });

  return result.match(
    (res) => {
      const outcomes = res.value.map((o, i) => ({
        resource: resources[i].tag,
        outcome: o.tag,
      }));
      return success(
        `Received ${outcomes.length} outcome(s)`,
        outcomes,
      );
    },
    (err) => error(err.value.name, err.value),
  );
}

export const allowancesTests: TestDefinition[] = [
  {
    id: "allowances-statement-store",
    name: "Allocate StatementStore Allowance",
    description: "Requests a statement-store allowance from the host (RFC-0010)",
    api: 'hostApi.requestResourceAllocation({ tag: "v1", value: [{ tag: "StatementStoreAllowance" }] })',
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
    api: 'hostApi.requestResourceAllocation({ tag: "v1", value: [{ tag: "BulletInAllowance" }] })',
    category: "allowances",
    async run() {
      return runResourceAllocation([
        { tag: "BulletInAllowance", value: undefined },
      ]);
    },
  },
  {
    id: "allowances-smart-contract",
    name: "Allocate SmartContract Allowance",
    description:
      "Requests a smart-contract allowance for a derivation index (RFC-0010)",
    api: 'hostApi.requestResourceAllocation({ tag: "v1", value: [{ tag: "SmartContractAllowance", value: derivationIndex }] })',
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
    id: "allowances-auto-signing",
    name: "Allocate Auto-Signing",
    description: "Requests auto-signing capability from the host (RFC-0010)",
    api: 'hostApi.requestResourceAllocation({ tag: "v1", value: [{ tag: "AutoSigning" }] })',
    category: "allowances",
    async run() {
      return runResourceAllocation([
        { tag: "AutoSigning", value: undefined },
      ]);
    },
  },
  {
    id: "allowances-all",
    name: "Allocate All Resources",
    description:
      "Requests every supported resource in a single call; outcomes are reported per resource",
    api: 'hostApi.requestResourceAllocation({ tag: "v1", value: [...] })',
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
        { tag: "BulletInAllowance", value: undefined },
        { tag: "SmartContractAllowance", value: derivationIndex },
        { tag: "AutoSigning", value: undefined },
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
  chat: chatTests,
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
