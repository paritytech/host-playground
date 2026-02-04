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
import { fromBufferToBase58 } from "@polkadot-api/substrate-bindings";
import { getWsProvider } from "polkadot-api/ws-provider/web";
import { toHex } from "polkadot-api/utils";
import {
  type ChainConfig,
  type TestDefinition,
  type TestLogger,
  type TestResult,
} from "./types";

// RPC endpoints for each chain
const CHAIN_RPC_ENDPOINTS: Record<string, string> = {
  "0xfd974cf9eaf028f5e44b9fdd1949ab039c6cf9cc54449b0b60d71b042e79aeb6":
    "wss://passet-hub-paseo.ibp.network",
  "0xd6eec26135305a8ad257a20d003357284c8aa03d0bdb2b357ab0a22371e11ef2":
    "wss://sys.ibp.network/asset-hub-paseo",
  "0x68d56f15f85d3136970ec16946040bc1752654e906147f7e43e9d539d7c3de2f":
    "wss://polkadot-asset-hub-rpc.polkadot.io",
};

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
    id: "check-environment",
    name: "Check Environment",
    description: "Verifies hostApi environment is properly configured",
    category: "accounts",
    async run() {
      const hasWebviewMark =
        typeof window !== "undefined" &&
        (window as any).__HOST_WEBVIEW_MARK__ === true;
      const hasApiPort =
        typeof window !== "undefined" &&
        (window as any).__HOST_API_PORT__ !== undefined;

      const details = {
        __HOST_WEBVIEW_MARK__: hasWebviewMark,
        __HOST_API_PORT__: hasApiPort,
        windowTop:
          typeof window !== "undefined" ? window === window.top : "N/A",
      };

      if (hasWebviewMark && hasApiPort) {
        return success("Environment properly configured", details);
      } else if (!hasWebviewMark && !hasApiPort) {
        return error("Not running in Polkadot Desktop webview", details);
      } else {
        return error("Partial environment setup", details);
      }
    },
  },
  {
    id: "account-get",
    name: "Get Account",
    description: "Gets a product account (requires iframe)",
    category: "accounts",
    requiresIframe: true,
    async run() {
      const result = await hostApi.accountGet({
        tag: "v1",
        value: ["spektr.app", 0],
      });

      return result.match(
        (res) => success("Account retrieved", res.value),
        (err) => error(err.value.name, err.value),
      );
    },
  },
  {
    id: "non-product-accounts",
    name: "Non-Product Accounts",
    description: "Gets all non-product accounts",
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
      "Signs a transaction payload and submits it to the selected chain",
    category: "signing",
    async run(chain: ChainConfig, logger?: TestLogger) {
      const log = logger || (() => {});

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

      // Convert publicKey to SS58 address format (use ss58Format 42 for generic Substrate)
      const address = fromBufferToBase58(42)(publicKey);

      // Get RPC endpoint for this chain
      const rpcEndpoint = CHAIN_RPC_ENDPOINTS[chain.genesis];
      if (!rpcEndpoint) {
        return error(`No RPC endpoint configured for ${chain.name}`);
      }

      // Create a proper PAPI client and transaction with WebSocket fallback
      const provider = createPapiProvider(
        chain.genesis,
        getWsProvider([rpcEndpoint]),
      );
      const client = createClient(provider);
      const api = client.getUnsafeApi();

      try {
        log("Preparing transaction...");

        const message = `Sign this message to verify wallet ownership.\n\nWallet: ${address}\n\nThis will not trigger a blockchain transaction or cost any fees.`;
        const tx = api.tx.System.remark({
          remark: Binary.fromBytes(new TextEncoder().encode(message)),
        });
        const callData = await tx.getEncodedData();
        const block = await client.getFinalizedBlock();

        // Fetch runtime version from chain
        const runtimeVersion = await api.apis.Core.version();
        const specVersion = runtimeVersion.spec_version;
        const transactionVersion = runtimeVersion.transaction_version;

        // Fetch account nonce from chain
        const accountInfo = await api.query.System.Account.getValue(address);
        const nonce = accountInfo.nonce;

        const payload = {
          address,
          blockHash: chain.genesis, // For immortal era, use genesis hash
          blockNumber: `0x${block.number.toString(16)}` as `0x${string}`,
          era: "0x00" as `0x${string}`, // Immortal era (single byte)
          genesisHash: chain.genesis,
          method: toHex(callData.asBytes()) as `0x${string}`,
          nonce: `0x${nonce.toString(16)}` as `0x${string}`,
          specVersion: `0x${specVersion.toString(16)}` as `0x${string}`,
          tip: "0x0" as `0x${string}`,
          transactionVersion:
            `0x${transactionVersion.toString(16)}` as `0x${string}`,
          signedExtensions: [],
          version: 4,
          assetId: undefined,
          metadataHash: undefined,
          mode: undefined,
          withSignedTransaction: true,
        };

        log("Waiting for signature...");

        const result = await hostApi.signPayload({
          tag: "v1",
          value: payload,
        });

        return await result.match(
          async (res) => {
            const signedTx = res.value.signedTransaction as
              | `0x${string}`
              | undefined;

            if (!signedTx) {
              client.destroy();
              return success(
                `Payload signed for ${chain.name} (no signed tx returned)`,
                res.value,
              );
            }

            try {
              log("Submitting transaction...");

              const txResult = await new Promise<{
                hash: string;
                status: string;
              }>((resolve, reject) => {
                const subscription = client.submitAndWatch(signedTx).subscribe({
                  next: (event) => {
                    if (event.type === "broadcasted") {
                      log(`⏳ BROADCASTED\nTxHash: ${event.txHash}`);
                    } else if (event.type === "txBestBlocksState") {
                      if (event.found) {
                        log(
                          `📦 IN BEST BLOCK (${event.ok ? "success" : "failed"})\nBlock: ${event.block.hash}\nTxHash: ${event.txHash}`,
                        );
                      } else {
                        log(`⏳ Waiting for block...\nTxHash: ${event.txHash}`);
                      }
                    } else if (event.type === "finalized") {
                      const status = event.ok ? "success" : "failed";
                      log(
                        `✅ FINALIZED (${status})\nBlock: ${event.block.hash}\nTxHash: ${event.txHash}`,
                      );
                      resolve({
                        hash: event.txHash,
                        status: `finalized (${status})`,
                      });
                      subscription.unsubscribe();
                    } else {
                      log(`${event.type}`);
                    }
                  },
                  error: (err) => {
                    reject(err);
                  },
                });
              });

              client.destroy();
              return success(
                `Payload signed and submitted for ${chain.name}: ${txResult.status}`,
                {
                  ...res.value,
                  txHash: txResult.hash,
                  txStatus: txResult.status,
                },
              );
            } catch (submitErr) {
              client.destroy();
              return error(
                `Signed but failed to submit: ${submitErr}`,
                res.value,
              );
            }
          },
          async (err) => {
            client.destroy();
            return error(err.value.name, err.value);
          },
        );
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
    requiresIframe: true,
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
    requiresIframe: true,
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
