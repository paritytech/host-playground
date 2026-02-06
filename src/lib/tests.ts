import {
  createChat,
  createNonProductExtensionEnableFactory,
  createMetaProvider,
  createPapiProvider,
  sandboxTransport,
  hostApi,
  injectSpektrExtension,
  metaProvider,
} from "@novasamatech/product-sdk";
import { Binary, createClient } from "polkadot-api";
import { toHex } from "polkadot-api/utils";
import { getWsProvider } from "polkadot-api/ws-provider";
import { type StoredExtension } from "./use-accounts";
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
    async run(chain: ChainConfig) {
      const provider = createPapiProvider(chain.genesis);
      return success(`PAPI provider created for ${chain.name}`, {
        provider: typeof provider,
      });
    },
  },
];

// Account Tests
export const accountTests: TestDefinition[] = [
  {
    id: "account-get",
    name: "Get Account",
    description: "Gets accounts from injected extension",
    category: "accounts",
    requiresWebview: true,
    async run() {
      try {
        // Use the extension that was connected on mount (stored on window)
        const extension = (
          window as unknown as { __sdkExtension?: StoredExtension }
        ).__sdkExtension;

        if (!extension) {
          return error(
            "Extension not connected",
            "Extension should be connected on page load",
          );
        }

        const accounts = extension.getAccounts();
        return success(`Found ${accounts.length} accounts`, accounts);
      } catch (e) {
        return error("Exception", e instanceof Error ? e.message : String(e));
      }
    },
  },
  {
    id: "non-product-accounts",
    name: "Non-Product Accounts",
    description: "Gets all non-product accounts via hostApi",
    category: "accounts",
    requiresWebview: true,
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
];

// Signing Tests
export const signingTests: TestDefinition[] = [
  {
    id: "sign-raw",
    name: "Sign Raw Message",
    description: "Signs a raw message with a non-product account",
    category: "signing",
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
          blockHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
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
    requiresWebview: true,
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
  {
    id: "statement-store",
    name: "Statement Store Proof",
    description: "Creates a statement store proof",
    category: "signing",
    requiresWebview: true,
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

// Storage Tests
export const storageTests: TestDefinition[] = [
  {
    id: "storage-write-read",
    name: "Storage Write and Read",
    description: "Writes a value to storage and reads it back",
    category: "storage",
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
  {
    id: "storage-clear",
    name: "Storage Clear",
    description: "Clears a storage key",
    category: "storage",
    async run() {
      const result = await hostApi.localStorageClear({
        tag: "v1",
        value: "0x746573745f6b6579",
      });

      return result.match(
        () => success("Storage cleared"),
        (err) => error(err.value.name),
      );
    },
  },
];

// Permission Tests
export const permissionTests: TestDefinition[] = [
  // Note: permissionRequest API has been removed from the SDK
  {
    id: "feature-check",
    name: "Feature Check",
    description: "Checks if the selected chain is supported",
    category: "permissions",
    async run(chain: ChainConfig) {
      const result = await hostApi.feature({
        tag: "v1",
        value: { tag: "Chain", value: chain.genesis },
      });

      return result.match(
        (res) => success(`${chain.name} supported: ${res.value}`),
        (err) => error(err.value.name),
      );
    },
  },
];

// Chat Tests
export const chatTests: TestDefinition[] = [
  {
    id: "create-chat",
    name: "Create Chat and Send Message",
    description: "Creates a chat instance, registers, and sends a message",
    category: "chat",
    async run() {
      const chat = createChat();
      if (!chat) {
        return error("Failed to create chat");
      }

      try {
        // Register the product as a chat contact
        const registrationStatus = await chat.register({
          roomId: "test-room",
          name: "SDK Test Product",
          icon: "",
        });

        // Send a test message
        const result = await chat.sendMessage("test-room", {
          tag: "Text",
          value: `SDK Test: ${new Date().toISOString()}`,
        });

        return success(
          `Chat registered (status: ${registrationStatus}), message sent (ID: ${result.messageId})`,
        );
      } catch (e) {
        return error("Chat operation failed", e);
      }
    },
  },
  {
    id: "chat-create-room",
    name: "Create Room",
    description: "Creates a chat room",
    category: "chat",
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
    id: "chat-post-message",
    name: "Post Message",
    description: "Posts a message to the chat",
    category: "chat",
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

export const testsByCategory = {
  extension: extensionTests,
  accounts: accountTests,
  signing: signingTests,
  storage: storageTests,
  permissions: permissionTests,
  chat: chatTests,
};
