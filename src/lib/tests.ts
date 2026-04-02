import {
  createNonProductExtensionEnableFactory,
  createMetaProvider,
  createPapiProvider,
  sandboxTransport,
  hostApi,
  injectSpektrExtension,
  metaProvider,
  createProductChatManager,
  createAccountsProvider,
  createStatementStore,
  createLocalStorage,
  hostLocalStorage,
  createPreimageManager,
  preimageManager,
  WellKnownChain,
} from "@novasamatech/product-sdk";
import {
  Binary,
  FixedSizeBinary,
  createClient,
  type PolkadotClient,
} from "polkadot-api";
import { toHex } from "polkadot-api/utils";
import { createInkSdk } from "@polkadot-api/sdk-ink";
import { contracts } from "@polkadot-api/descriptors";
import { CHAINS } from "./types";

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
import {
  type ChainConfig,
  type TestDefinition,
  type TestLogger,
  type TestResult,
} from "./types";

function success(message: string, details?: unknown): TestResult {
  return { success: true, message, details };
}

function error(message: string, details?: unknown): TestResult {
  return { success: false, message, details };
}

// Account Tests
export const accountTests: TestDefinition[] = [
  {
    id: "accounts-provider-non-product",
    name: "Non-Product Accounts",
    description: "Gets non-product accounts via createAccountsProvider",
    api: "accountsProvider.getNonProductAccounts()",
    category: "accounts",
    async run() {
      const accountsProvider = createAccountsProvider();
      const result = await accountsProvider.getNonProductAccounts();

      return result.match(
        (accounts) =>
          success(
            `Found ${accounts.length} non-product accounts`,
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
    id: "non-product-accounts",
    name: "Non-Product Accounts (Legacy)",
    description: "Gets all non-product accounts via legacy hostApi",
    api: "hostApi.getNonProductAccounts({ tag, value })",
    category: "accounts",
    async run() {
      const result = await hostApi.getNonProductAccounts({
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
        defaultValue: "host-playground.dot",
      },
    ],
    category: "accounts",
    async run(_chain, _logger, args) {
      const dotNsIdentifier = args?.dotNsIdentifier ?? "host-playground.dot";
      const accountsProvider = createAccountsProvider();
      const result = await accountsProvider.getProductAccount(dotNsIdentifier);

      return result.match(
        (account) =>
          success(`Product account: ${account.name ?? "unnamed"}`, {
            ...account,
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
        defaultValue: "host-playground.dot",
      },
    ],
    category: "accounts",
    async run(_chain, _logger, args) {
      const dotNsIdentifier = args?.dotNsIdentifier ?? "host-playground.dot";
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
        defaultValue: "host-playground.dot",
      },
    ],
    category: "accounts",
    async run(_chain, _logger, args) {
      const dotNsIdentifier = args?.dotNsIdentifier ?? "host-playground.dot";
      const accountsProvider = createAccountsProvider();
      const accountResult =
        await accountsProvider.getProductAccount(dotNsIdentifier);

      return accountResult.match(
        (account) => {
          const signer = accountsProvider.getProductAccountSigner({
            dotNsIdentifier,
            derivationIndex: 0,
            publicKey: account.publicKey,
          });
          return success("Product account signer created", {
            publicKey: toHex(signer.publicKey),
          });
        },
        (err) => error(`${err.name}`, err),
      );
    },
  },
  {
    id: "accounts-provider-non-product-signer",
    name: "Non-Product Account Signer",
    description: "Creates a PolkadotSigner for a non-product account",
    api: "accountsProvider.getNonProductAccountSigner(account)",
    category: "accounts",
    async run() {
      const accountsProvider = createAccountsProvider();
      const accountsResult = await accountsProvider.getNonProductAccounts();

      return accountsResult.match(
        (accounts) => {
          if (accounts.length === 0) {
            return error("No non-product accounts available");
          }
          const account = accounts[0];
          const signer = accountsProvider.getNonProductAccountSigner({
            dotNsIdentifier: "",
            derivationIndex: 0,
            publicKey: account.publicKey,
          });
          return success("Non-product account signer created", {
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
    description: "Signs a raw message with a non-product account",
    api: "hostApi.signRaw({ tag, value: { address, data } })",
    args: [
      {
        name: "message",
        label: "Message",
        defaultValue: "Hello from Host Playground!",
      },
    ],
    category: "signing",
    async run(_chain, _logger, args) {
      const accountResult = await hostApi.getNonProductAccounts({
        tag: "v1",
        value: undefined,
      });

      let publicKey: Uint8Array | null = null;
      accountResult.match(
        (res) => {
          if (res.value.length > 0) {
            publicKey = res.value[0].publicKey;
          }
        },
        () => {},
      );

      if (!publicKey) {
        return error("No accounts available for signing");
      }

      const message =
        args?.message ??
        `Hello from Host Playground! ${new Date().toLocaleString()}`;
      const messageBytes = new TextEncoder().encode(message);

      const result = await hostApi.signRaw({
        tag: "v1",
        value: {
          address: toHex(publicKey),
          data: { tag: "Bytes", value: messageBytes },
        },
      });

      return result.match(
        (res) => success("Message signed", res.value),
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "sign-payload",
    name: "Sign & Submit Payload",
    description:
      "Signs a transaction payload and submits it to the selected chain (using non-product account signer)",
    api: "signer.signPayload(payload)",
    args: [
      {
        name: "message",
        label: "Remark",
        defaultValue: "Remark from Host Playground",
      },
    ],
    category: "signing",
    async run(chain: ChainConfig, logger?: TestLogger, args?) {
      const log = logger || (() => {});

      // Get non-product extension via enable factory
      log("Creating non-product extension...");
      const enableFactory =
        await createNonProductExtensionEnableFactory(sandboxTransport);

      if (!enableFactory) {
        return error("Transport not ready - enable factory returned null");
      }

      const injected = await enableFactory();

      if (!injected.accounts || !injected.signer) {
        return error("No accounts or signer available from extension");
      }

      // Get accounts from the injected extension
      const accounts = await injected.accounts.get();

      if (accounts.length === 0) {
        return error("No non-product accounts available for signing");
      }

      const account = accounts[0];
      const address = account.address;

      const client = getClient(chain.genesis);
      const api = client.getUnsafeApi();

      log("Preparing transaction...");
      const message = args?.message ?? "Remark from Host Playground";
      const tx = api.tx.System.remark({
        remark: Binary.fromBytes(new TextEncoder().encode(message)),
      });

      log("Signing with non-product signer...");

      const signer = injected.signer;

      if (!signer.signPayload) {
        return error("Signer does not support signPayload");
      }

      const callData = await tx.getEncodedData();
      const callDataHex = toHex(callData.asBytes());

      const signResult = await signer.signPayload({
        address,
        blockHash:
          "0x0000000000000000000000000000000000000000000000000000000000000000",
        blockNumber: "0x00000000",
        era: "0x00",
        genesisHash: chain.genesis,
        method: callDataHex,
        nonce: "0x00000000",
        signedExtensions: [],
        specVersion: "0x00000000",
        tip: "0x00000000000000000000000000000000",
        transactionVersion: "0x00000000",
        version: 4,
      });

      const txHash = signResult.signature;

      log(`Transaction signed!\nSignature: ${txHash}`);

      return success(`Transaction signed for ${chain.name}`, {
        txHash,
        address,
      });
    },
  },
  {
    id: "sign-batch-payload",
    name: "Sign & Submit Batch Payload",
    description:
      "Batches a remark + two contract increment calls, submits, and reads counter after finalization",
    api: "api.tx.Utility.batch_all([remark, Revive.call, Revive.call])",
    args: [
      {
        name: "remark",
        label: "Remark",
        defaultValue: "Batch test remark",
      },
    ],
    category: "signing",
    async run(chain: ChainConfig, logger?: TestLogger, args?) {
      const log = logger || (() => {});

      // Get address from injected extension (has .address)
      log("Creating non-product extension...");
      const enableFactory =
        await createNonProductExtensionEnableFactory(sandboxTransport);
      if (!enableFactory)
        return error("Transport not ready - enable factory returned null");
      const injected = await enableFactory();
      if (!injected.accounts)
        return error("No accounts available from extension");
      const extAccounts = await injected.accounts.get();
      if (extAccounts.length === 0)
        return error("No non-product accounts available");

      const address = extAccounts[0].address;
      // Get a PAPI-compatible PolkadotSigner via accountsProvider
      log("Getting PAPI signer...");
      const accountsProvider = createAccountsProvider();
      const accountsResult = await accountsProvider.getNonProductAccounts();
      const providerAccounts = accountsResult.match(
        (accs) => accs,
        (err) => {
          throw new Error(`Failed to get accounts: ${err.name}`);
        },
      );
      if (providerAccounts.length === 0)
        return error("No non-product accounts from provider");

      const signer = accountsProvider.getNonProductAccountSigner({
        dotNsIdentifier: "",
        derivationIndex: 0,
        publicKey: providerAccounts[0].publicKey,
      });

      const client = getClient(chain.genesis);
      try {
        const api = client.getUnsafeApi();

        // 1. Remark call
        const remarkMsg = args?.remark ?? "Batch test remark";
        log("Preparing remark call...");
        const remarkCall = api.tx.System.remark({
          remark: Binary.fromBytes(new TextEncoder().encode(remarkMsg)),
        }).decodedCall;

        // 2. Two increment contract calls
        // Connect to the Paseo testnet where the contract lives
        const contractAddr = "0x4e65b000448e9de00bfd8b674caa35699f7cef13";

        log("Connecting to contract chain...");
        const contractClient = getClient(CHAINS.PASEO_ASSET_HUB.genesis);
        const contractApi = contractClient.getUnsafeApi();

        const dest = Binary.fromHex(contractAddr);
        // increment() selector = 0xd09de08a
        const incrementData = Binary.fromHex("0xd09de08a");

        // Dry run to estimate gas (passing undefined = let runtime decide)
        const dryRun = await contractApi.apis.ReviveApi.call(
          address,
          dest,
          BigInt(0),
          undefined,
          undefined,
          incrementData,
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

        log("Preparing 2 increment calls...");
        const txDest = FixedSizeBinary.fromHex(contractAddr);
        const makeIncrementCall = () =>
          contractApi.tx.Revive.call({
            dest: txDest,
            value: BigInt(0),
            weight_limit: weightLimit,
            storage_deposit_limit: storageDepositLimit,
            data: incrementData,
          }).decodedCall;

        const incrementCall1 = makeIncrementCall();
        const incrementCall2 = makeIncrementCall();



        // 3. Batch all three calls
        log("Preparing batch of 3 calls (1 remark + 2 increments)...");
        const batchTx = api.tx.Utility.batch_all({
          calls: [remarkCall, incrementCall1, incrementCall2],
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

        // 5. Read counter value after finalization
        log("Reading counter value...");
        // count() selector = 0x06661abd
        const countData = Binary.fromHex("0x06661abd");
        const countResult = await api.apis.ReviveApi.call(
          address,
          Binary.fromHex(contractAddr),
          BigInt(0),
          undefined,
          undefined,
          countData,
        );

        let counterValue: string | null = null;
        if (countResult.result.success) {
          const data = countResult.result.value.data;
          let hexData: string;
          if (typeof data === "string") {
            hexData = data;
          } else if (data && typeof data.asHex === "function") {
            hexData = data.asHex();
          } else {
            hexData = "0x";
          }
          if (hexData !== "0x" && hexData.length >= 66) {
            // uint256 is 32 bytes = 64 hex chars + 0x prefix
            counterValue = String(BigInt(hexData));
          }
        }

        log(`Counter value: ${counterValue ?? "unknown"}`);

        return success(
          `Batch finalized on ${chain.name} — counter: ${counterValue ?? "unknown"}`,
          {
            address,
            calls: [
              "System.remark",
              "Revive.call (increment)",
              "Revive.call (increment)",
            ],
            contract: contractAddr,
            counterValue,
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
    description: "Creates a transaction (requires product account)",
    api: "hostApi.createTransaction({ tag, value: [accountId, payload] })",
    args: [
      {
        name: "dotNsIdentifier",
        label: "DotNS ID",
        defaultValue: "host-playground.dot",
      },
    ],
    category: "signing",
    async run(_chain, _logger, args) {
      const dotNsIdentifier = args?.dotNsIdentifier ?? "host-playground.dot";
      const txPayload = {
        version: 1 as const,
        signer: null,
        callData: "0x0000" as `0x${string}`,
        extensions: [] as Array<{
          id: string;
          extra: `0x${string}`;
          additionalSigned: `0x${string}`;
        }>,
        txExtVersion: 0,
        context: {
          metadata: "0x" as `0x${string}`,
          tokenSymbol: "DOT",
          tokenDecimals: 10,
          bestBlockHeight: 0,
        },
      };

      const result = await hostApi.createTransaction({
        tag: "v1",
        value: [[dotNsIdentifier, 0], txPayload],
      });

      return result.match(
        (res) =>
          success(`Transaction created: ${toHex(res.value).slice(0, 40)}...`),
        (err) => error(err.value.name, err.value),
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
    api: "createNonProductExtensionEnableFactory(transport)",
    category: "extension",
    async run() {
      const enableFactory =
        await createNonProductExtensionEnableFactory(sandboxTransport);
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
];

// Chat Tests
export const chatTests: TestDefinition[] = [
  {
    id: "chat-manager-register-room",
    name: "Register Room",
    description: "Registers a chat room via createProductChatManager",
    api: "chatManager.registerRoom({ roomId, name, icon })",
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

      const result = await chatManager.registerRoom({
        roomId: args?.roomId ?? "host-playground-room",
        name: args?.name ?? "Host Playground",
        icon: "",
      });

      return success(`Room registration: ${result}`);
    },
  },
  {
    id: "chat-manager-send-message",
    name: "Send Text Message to Room",
    description:
      "Sends a message to an existing room via createProductChatManager",
    api: "chatManager.sendMessage(roomId, { tag: 'Text', value })",
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
    id: "chat-manager-send-custom-message",
    name: "Send Custom Message to Room",
    description:
      "Sends a custom (binary) message to an existing room — register the room first",
    api: "chatManager.sendMessage(roomId, { tag: 'Custom', value })",
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
    description:
      "Sends a statement to a user-specific topic via createStatementStore (hackm3 notification flow)",
    api: "statementStore.createProof(accountId, statement) + statementStore.submit(signedStatement)",
    args: [
      {
        name: "senderDotNsId",
        label: "Sender DotNS ID",
        defaultValue: "host-playground.dot",
      },
      {
        name: "recipientUsername",
        label: "Recipient Username",
        async defaultValue() {
          const accountsProvider = createAccountsProvider();
          const result = await accountsProvider.getNonProductAccounts();
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
      const senderDotNsId = args?.senderDotNsId ?? "host-playground.dot";
      const messageText = args?.message ?? "Hello from Host Playground!";

      let recipientUsername = args?.recipientUsername ?? "";
      if (!recipientUsername) {
        const accountsProvider = createAccountsProvider();
        const accountsResult = await accountsProvider.getNonProductAccounts();
        recipientUsername = accountsResult.match(
          (accounts) => accounts[0]?.name ?? "",
          () => "",
        );
      }

      const statementStore = createStatementStore();
      if (!recipientUsername)
        return error("No recipient username — not signed in?");

      const encoder = new TextEncoder();

      const topic = encoder.encode(`host-playground:${recipientUsername}`);
      const data = encoder.encode(messageText);

      const statement = {
        proof: undefined,
        topics: [topic],
        data,
        channel: undefined,
        decryptionKey: undefined,
        expiry: undefined,
      };

      try {
        console.log(
          "[SendToUser] Creating proof for",
          senderDotNsId,
          "topic:",
          `host-playground:${recipientUsername}`,
        );
        const proof = await statementStore.createProof(
          [senderDotNsId, 0],
          statement,
        );
        console.log("[SendToUser] Proof created:", proof.tag);
        console.log("[SendToUser] Submitting statement...");
        await statementStore.submit({ ...statement, proof });
        console.log("[SendToUser] Statement submitted");
        return success(
          `Statement submitted to topic "host-playground:${recipientUsername}"`,
          {
            topic: `host-playground:${recipientUsername}`,
            message: messageText,
          },
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
            success(
              `Received ${rooms.length} room updates in 5s`,
              rooms.slice(-5),
            ),
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
            success(
              `Received ${actions.length} actions in 5s`,
              actions.slice(-5),
            ),
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
  {
    id: "chat-legacy-create-room",
    name: "Create Room (Legacy)",
    description: "Creates a chat room via legacy hostApi",
    api: "hostApi.chatCreateRoom({ tag, value: { roomId, name, icon } })",
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
      const result = await hostApi.chatCreateRoom({
        tag: "v1",
        value: {
          roomId: args?.roomId ?? "host-playground-room",
          name: args?.name ?? "Host Playground",
          icon: "https://example.com/icon.png",
        },
      });

      return result.match(
        (res) => success(`Room status: ${res.value}`),
        (err) => error(err.value.name),
      );
    },
  },
  {
    id: "chat-legacy-post-message",
    name: "Post Message (Legacy)",
    description: "Posts a message via legacy hostApi",
    api: "hostApi.chatPostMessage({ tag, value: { roomId, payload } })",
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
      const result = await hostApi.chatPostMessage({
        tag: "v1",
        value: {
          roomId,
          payload: {
            tag: "Text",
            value: `Hello from Host Playground! ${new Date().toLocaleString()}`,
          },
        },
      });

      return result.match(
        (res) => success(`Message ID: ${res.value.messageId}`),
        (err) => error(err.value.name),
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
        defaultValue: "host-playground.dot",
      },
    ],
    category: "statements",
    async run(_chain, _logger, args) {
      const dotNsIdentifier = args?.dotNsIdentifier ?? "host-playground.dot";
      const statementStore = createStatementStore();
      const messageBytes = new TextEncoder().encode(`Statement: ${Date.now()}`);

      const proof = await statementStore.createProof([dotNsIdentifier, 0], {
        proof: undefined,
        decryptionKey: undefined,
        expiry: undefined,
        channel: undefined,
        topics: [],
        data: messageBytes,
      });

      const proofValue = proof.value as { signature?: Uint8Array };
      const sig = proofValue.signature
        ? toHex(proofValue.signature).slice(0, 20)
        : "onchain";
      return success(`Proof type: ${proof.tag}, sig: ${sig}...`);
    },
  },
  {
    id: "statement-store-subscribe",
    name: "Subscribe Statements",
    description: "Subscribes to statement store topics (5s)",
    api: "statementStore.subscribe(topics, callback)",
    category: "statements",
    async run() {
      const statementStore = createStatementStore();

      return new Promise((resolve) => {
        const received: unknown[] = [];
        const subscription = statementStore.subscribe([], (statements) => {
          received.push(...statements);
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
    id: "statement-store-legacy",
    name: "Create Proof (Legacy)",
    description: "Creates a statement store proof via legacy hostApi",
    api: "hostApi.statementStoreCreateProof({ tag, value: [accountId, statement] })",
    args: [
      {
        name: "dotNsIdentifier",
        label: "DotNS ID",
        defaultValue: "host-playground.dot",
      },
    ],
    category: "statements",
    async run(_chain, _logger, args) {
      const dotNsIdentifier = args?.dotNsIdentifier ?? "host-playground.dot";
      const message = `Statement: ${Date.now()}`;
      const messageBytes = new TextEncoder().encode(message);

      const result = await hostApi.statementStoreCreateProof({
        tag: "v1",
        value: [
          [dotNsIdentifier, 0],
          {
            proof: undefined,
            decryptionKey: undefined,
            expiry: undefined,
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
    async run() {
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
    description: "Submits a preimage then looks it up by hash (5s)",
    api: "preimageManager.lookup(hash, callback)",
    category: "preimage",
    async run() {
      const data = new TextEncoder().encode(`lookup_${Date.now()}`);
      const hash = await preimageManager.submit(data);

      return new Promise((resolve) => {
        let found = false;
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
    async run() {
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
    async run(_chain, _logger, args) {
      const text = args?.text ?? "Hello from demo product!";
      const deeplink = args?.deeplink?.trim() || undefined;

      const result = await hostApi.pushNotification({
        tag: "v1",
        value: { text, deeplink },
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
    async run(_chain, _logger, args) {
      const url = args?.url ?? "https://search.dot";
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
    async run(_chain, _logger, args) {
      const url = args?.url ?? "https://polkadot.com";
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
    api: "hostApi.chainHeadFollow({ tag: 'v1', value: { genesisHash, withRuntime } }, callback)",
    category: "chain",
    async run(chain: ChainConfig) {
      return new Promise((resolve) => {
        const events: { tag: string; blockHash?: string }[] = [];

        const subscription = hostApi.chainHeadFollow(
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
    id: "chain-query-counter",
    name: "Query Program",
    description:
      "Reads count() from a Solidity counter contract using createPapiProvider and createInkSdk",
    api: "createInkSdk(client).getContract(contracts.counter, address).query('count', { origin })",
    category: "chain",
    async run(chain: ChainConfig) {
      const contractAddress = "0x2212ec401fc24ca50c55dcd8378ae7033f36f72b";
      const origin = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY";

      const client = getClient(chain.genesis);

      try {
        const sdk = createInkSdk(client);
        const contract = sdk.getContract(contracts.counter, contractAddress);
        const result = await contract.query("count", { origin });

        if (!result.success) {
          return error("Contract query failed", result.value);
        }

        const count = result.value.response;
        return success(`Counter value: ${count}`, {
          count: String(count),
          contract: contractAddress,
        });
      } catch (e) {
        return error(`Failed to query counter: ${e}`);
      }
    },
  },
  {
    id: "chain-query-balance",
    name: "Query Balance",
    description: "Queries System.Account balance using createPapiProvider",
    api: "createPapiProvider(genesis) → client.getUnsafeApi().query.System.Account.getValue(address)",
    args: [
      {
        name: "address",
        label: "Address (SS58)",
        defaultValue: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
      },
    ],
    category: "chain",
    async run(chain: ChainConfig, _logger, args) {
      const address =
        args?.address ?? "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY";
      const client = getClient(chain.genesis);

      try {
        const api = client.getUnsafeApi();
        const account = await api.query.System.Account.getValue(address);
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
};
