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
import { Binary, createClient } from "polkadot-api";
import { toHex } from "polkadot-api/utils";
import { getWsProvider } from "polkadot-api/ws-provider";
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

// Extension & Provider Tests
export const extensionTests: TestDefinition[] = [
  {
    id: "inject-extension",
    name: "Inject Extension",
    description: "Injects the Spektr extension into the page",
    category: "extension",
    isWorking: true,
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
    category: "extension",
    isWorking: true,
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
    category: "extension",
    isWorking: true,
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
    category: "extension",
    isWorking: true,
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
    category: "extension",
    isWorking: true,
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
    category: "extension",
    isWorking: true,
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

// Account Tests
export const accountTests: TestDefinition[] = [
  {
    id: "account-get",
    name: "Get Accounts (Provider)",
    description: "Gets non-product accounts via createAccountsProvider",
    category: "accounts",
    isWorking: true,
    async run() {
      const accountsProvider = createAccountsProvider();
      const result = await accountsProvider.getNonProductAccounts();

      return result.match(
        (accounts) =>
          success(
            `Found ${accounts.length} accounts`,
            accounts.map((a) => ({
              publicKey: toHex(a.publicKey),
              name: a.name,
            })),
          ),
        (err) => error(`${err.name}`, err),
      );
    },
  },
  {
    id: "non-product-accounts",
    name: "Non-Product Accounts (hostApi)",
    description: "Gets all non-product accounts via legacy hostApi",
    category: "accounts",
    isWorking: true,
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
    id: "accounts-provider-non-product",
    name: "Non-Product Accounts (Provider)",
    description: "Gets non-product accounts via createAccountsProvider",
    category: "accounts",
    isWorking: true,
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
    id: "accounts-provider-product",
    name: "Get Product Account",
    description: "Gets a product account via createAccountsProvider",
    category: "accounts",
    isWorking: false,
    async run() {
      const accountsProvider = createAccountsProvider();
      const result = await accountsProvider.getProductAccount("spektr.app");

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
    category: "accounts",
    isWorking: false,
    async run() {
      const accountsProvider = createAccountsProvider();
      const result =
        await accountsProvider.getProductAccountAlias("spektr.app");

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
    category: "accounts",
    isWorking: false,
    async run() {
      const accountsProvider = createAccountsProvider();
      const accountResult =
        await accountsProvider.getProductAccount("spektr.app");

      return accountResult.match(
        (account) => {
          const signer = accountsProvider.getProductAccountSigner({
            dotNsIdentifier: "spektr.app",
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
    category: "accounts",
    isWorking: false,
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
];

// Signing Tests
export const signingTests: TestDefinition[] = [
  {
    id: "sign-raw",
    name: "Sign Raw Message",
    description: "Signs a raw message with a non-product account",
    category: "signing",
    isWorking: false,
    async run() {
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

      const message = `SDK Test: ${new Date().toISOString()}`;
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
    category: "signing",
    isWorking: true,
    async run(chain: ChainConfig, logger?: TestLogger) {
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

      // Create a pure PAPI client with direct WebSocket
      const client = createClient(getWsProvider(chain.wsUrl));

      try {
        // Wait for client to connect by fetching a block
        log("Connecting to chain...");
        await client.getFinalizedBlock();

        const api = client.getUnsafeApi();

        log("Preparing transaction...");
        const message = `Test remark from SDK Test`;
        const tx = api.tx.System.remark({
          remark: Binary.fromBytes(new TextEncoder().encode(message)),
        });

        log("Signing with non-product signer...");

        // Use the injected signer's signPayload method
        const signer = injected.signer;

        if (!signer.signPayload) {
          client.destroy();
          return error("Signer does not support signPayload");
        }

        // Get the encoded call data for signing
        const callData = await tx.getEncodedData();
        const callDataHex = toHex(callData.asBytes());

        // Sign using the injected signer
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

        log(`✅ Transaction signed!\nSignature: ${txHash}`);

        client.destroy();
        return success(`Transaction signed for ${chain.name}`, {
          txHash,
          address,
        });
      } catch (e) {
        client.destroy();
        throw e;
      }
    },
  },
  {
    id: "create-transaction",
    name: "Create Transaction",
    description: "Creates a transaction (requires product account)",
    category: "signing",
    isWorking: false,
    async run() {
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
        value: [["spektr.app", 0], txPayload],
      });

      return result.match(
        (res) =>
          success(`Transaction created: ${toHex(res.value).slice(0, 40)}...`),
        (err) => error(err.value.name, err.value),
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
    category: "storage",
    isWorking: true,
    async run() {
      const key = "sdk_test_string";
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
    category: "storage",
    isWorking: true,
    async run() {
      const key = "sdk_test_bytes";
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
    category: "storage",
    isWorking: true,
    async run() {
      const key = "sdk_test_json";
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
    category: "storage",
    isWorking: true,
    async run() {
      const key = "sdk_test_string";

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
    category: "storage",
    isWorking: true,
    async run() {
      const storage = createLocalStorage();
      const key = "sdk_test_factory";
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
    name: "Legacy Storage (hostApi)",
    description: "Writes and reads via legacy hostApi.localStorageWrite/Read",
    category: "storage",
    isWorking: true,
    async run() {
      const key = "0x746573745f6b6579";
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
    category: "permissions",
    isWorking: true,
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
    category: "chat",
    isWorking: false,
    async run() {
      const chatManager = createProductChatManager();

      const result = await chatManager.registerRoom({
        roomId: "test-room",
        name: "SDK Test Room",
        icon: "",
      });

      return success(`Room registration: ${result}`);
    },
  },
  {
    id: "chat-manager-register-bot",
    name: "Register Bot",
    description: "Registers a chat bot via createProductChatManager",
    category: "chat",
    isWorking: false,
    async run() {
      const chatManager = createProductChatManager();

      const result = await chatManager.registerBot({
        botId: "test-bot",
        name: "SDK Test Bot",
        icon: "",
      });

      return success(`Bot registration: ${result}`);
    },
  },
  {
    id: "chat-manager-send-message",
    name: "Send Message",
    description:
      "Registers a room and sends a message via createProductChatManager",
    category: "chat",
    isWorking: false,
    async run() {
      const chatManager = createProductChatManager();

      // Ensure room exists first
      await chatManager.registerRoom({
        roomId: "test-room",
        name: "SDK Test Room",
        icon: "",
      });

      const result = await chatManager.sendMessage("test-room", {
        tag: "Text",
        value: `SDK Test: ${new Date().toISOString()}`,
      });

      return success(`Message sent (ID: ${result.messageId})`);
    },
  },
  {
    id: "chat-manager-subscribe-list",
    name: "Subscribe Chat List",
    description: "Subscribes to chat list updates (5s)",
    category: "chat",
    isWorking: false,
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
    category: "chat",
    isWorking: false,
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
    id: "chat-legacy-create-room",
    name: "Create Room (hostApi)",
    description: "Creates a chat room via legacy hostApi",
    category: "chat",
    isWorking: false,
    async run() {
      const result = await hostApi.chatCreateRoom({
        tag: "v1",
        value: {
          roomId: "test-room",
          name: "SDK Test Product",
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
    name: "Post Message (hostApi)",
    description: "Posts a message via legacy hostApi",
    category: "chat",
    isWorking: false,
    async run() {
      const result = await hostApi.chatPostMessage({
        tag: "v1",
        value: {
          roomId: "test-room",
          payload: {
            tag: "Text",
            value: `SDK Test: ${new Date().toISOString()}`,
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
    category: "statements",
    isWorking: false,
    async run() {
      const statementStore = createStatementStore();
      const messageBytes = new TextEncoder().encode(`Statement: ${Date.now()}`);

      const proof = await statementStore.createProof(["spektr.app", 0], {
        proof: undefined,
        decryptionKey: undefined,
        priority: undefined,
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
    category: "statements",
    isWorking: false,
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
    name: "Create Proof (hostApi)",
    description: "Creates a statement store proof via legacy hostApi",
    category: "statements",
    isWorking: false,
    async run() {
      const message = `Statement: ${Date.now()}`;
      const messageBytes = new TextEncoder().encode(message);

      const result = await hostApi.statementStoreCreateProof({
        tag: "v1",
        value: [
          ["spektr.app", 0],
          {
            proof: undefined,
            decryptionKey: undefined,
            priority: undefined,
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
    category: "preimage",
    isWorking: false,
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
    category: "preimage",
    isWorking: false,
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
    category: "preimage",
    isWorking: false,
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

export const testsByCategory = {
  extension: extensionTests,
  accounts: accountTests,
  signing: signingTests,
  storage: storageTests,
  permissions: permissionTests,
  chat: chatTests,
  statements: statementTests,
  preimage: preimageTests,
};
