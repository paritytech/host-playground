import { getClient, isCorrectEnvironment, subscribeWithInterrupt } from './chunk-GDXSV7JV.js';
export { isCorrectEnvironment as isInsideContainerSync } from './chunk-GDXSV7JV.js';
import { createLogger } from '@parity/product-sdk-logger';
import { scale } from '@parity/truapi';
import { err, ok } from '@parity/result';
export { err, ok } from '@parity/result';
export { isSdkError } from '@parity/product-sdk-errors';
import { unifyMetadata, decAnyMetadata } from '@polkadot-api/substrate-bindings';
import { AccountId } from 'polkadot-api';

// src/errors.ts
function isTagged(value) {
  return value != null && typeof value === "object" && typeof value.tag === "string";
}
function hasReason(value) {
  return value != null && typeof value === "object" && typeof value.reason === "string";
}
function formatHostError(error) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (isTagged(error)) {
    if (error.tag === "Domain" && isTagged(error.value) && error.value.value !== void 0) {
      return formatHostError(error.value.value);
    }
    if (hasReason(error.value)) {
      return `${error.tag}: ${error.value.reason}`;
    }
    return error.tag;
  }
  if (hasReason(error)) {
    return error.reason;
  }
  if (error != null && typeof error === "object" && "message" in error) {
    const message = error.message;
    if (typeof message === "string") return message;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}
var HostError = class extends Error {
  isSdkError = true;
  source = "host";
  constructor(message, options) {
    super(message, options);
    this.name = "HostError";
  }
};
var HostUnavailableError = class extends HostError {
  constructor(message = "Host API is not available") {
    super(message);
    this.name = "HostUnavailableError";
  }
};
var HostCallFailedError = class extends HostError {
  payload;
  constructor(label, payload) {
    super(`${label}: ${formatHostError(payload)}`, { cause: payload });
    this.name = "HostCallFailedError";
    this.payload = payload;
  }
};
function isHostError(error) {
  return error instanceof HostError;
}
var log = createLogger("host:papi");
var JSON_RPC_INTERNAL_ERROR = -32603;
var JSON_RPC_METHOD_NOT_FOUND = -32601;
var STORAGE_TYPE_MAP = {
  value: "Value",
  hash: "Hash",
  closestDescendantMerkleValue: "ClosestDescendantMerkleValue",
  descendantsValues: "DescendantsValues",
  descendantsHashes: "DescendantsHashes"
};
function convertRuntimeToJsonRpc(runtime) {
  if (!runtime || typeof runtime !== "object") return null;
  if (runtime.tag === "Valid") {
    const spec = runtime.value;
    const apis = {};
    for (const api of spec.apis) {
      apis[api.name] = api.version;
    }
    return {
      type: "valid",
      spec: {
        specName: spec.specName,
        implName: spec.implName,
        specVersion: spec.specVersion,
        implVersion: spec.implVersion,
        transactionVersion: spec.transactionVersion,
        apis
      }
    };
  }
  if (runtime.tag === "Invalid") {
    return { type: "invalid", error: runtime.value.error };
  }
  return null;
}
function convertFollowEventToJsonRpc(item) {
  switch (item.tag) {
    case "Initialized":
      return {
        event: "initialized",
        finalizedBlockHashes: item.value.finalizedBlockHashes,
        finalizedBlockRuntime: convertRuntimeToJsonRpc(item.value.finalizedBlockRuntime)
      };
    case "NewBlock":
      return {
        event: "newBlock",
        blockHash: item.value.blockHash,
        parentBlockHash: item.value.parentBlockHash,
        newRuntime: convertRuntimeToJsonRpc(item.value.newRuntime)
      };
    case "BestBlockChanged":
      return { event: "bestBlockChanged", bestBlockHash: item.value.bestBlockHash };
    case "Finalized":
      return {
        event: "finalized",
        finalizedBlockHashes: item.value.finalizedBlockHashes,
        prunedBlockHashes: item.value.prunedBlockHashes
      };
    case "OperationBodyDone":
      return {
        event: "operationBodyDone",
        operationId: item.value.operationId,
        value: item.value.value
      };
    case "OperationCallDone":
      return {
        event: "operationCallDone",
        operationId: item.value.operationId,
        output: item.value.output
      };
    case "OperationStorageItems":
      return {
        event: "operationStorageItems",
        operationId: item.value.operationId,
        items: item.value.items
      };
    case "OperationStorageDone":
      return { event: "operationStorageDone", operationId: item.value.operationId };
    case "OperationWaitingForContinue":
      return { event: "operationWaitingForContinue", operationId: item.value.operationId };
    case "OperationInaccessible":
      return { event: "operationInaccessible", operationId: item.value.operationId };
    case "OperationError":
      return {
        event: "operationError",
        operationId: item.value.operationId,
        error: item.value.error
      };
    case "Stop":
      return { event: "stop" };
    default: {
      return { event: "stop" };
    }
  }
}
function convertStorageType(type) {
  return STORAGE_TYPE_MAP[type] ?? "Value";
}
function convertOperationResultToJsonRpc(result) {
  if (result.tag === "Started") {
    return { result: "started", operationId: result.value.operationId };
  }
  return { result: "limitReached" };
}
function createHostPapiProvider(client, genesisHash) {
  const chain = client.chain;
  return (onMessage) => {
    const activeFollows = /* @__PURE__ */ new Map();
    const activeBroadcasts = /* @__PURE__ */ new Set();
    function sendJsonRpcResponse(id, result) {
      onMessage({ jsonrpc: "2.0", id, result });
    }
    function sendJsonRpcError(id, code, message) {
      onMessage({ jsonrpc: "2.0", id, error: { code, message } });
    }
    function sendFollowEvent(subscription, event) {
      onMessage({
        jsonrpc: "2.0",
        method: "chainHead_v1_followEvent",
        params: { subscription, result: event }
      });
    }
    const hostError = (id) => (error) => sendJsonRpcError(id, JSON_RPC_INTERNAL_ERROR, formatHostError(error));
    function handleMessage(message) {
      const { id, method } = message;
      const params = message.params ?? [];
      switch (method) {
        case "chainHead_v1_follow": {
          const [withRuntime] = params;
          const ref = {};
          const pendingItems = [];
          const forwardItem = (followSubscriptionId2, item) => {
            if (item.tag === "Stop" && activeFollows.delete(followSubscriptionId2)) {
              ref.handle?.unsubscribe();
            }
            sendFollowEvent(followSubscriptionId2, convertFollowEventToJsonRpc(item));
          };
          ref.handle = subscribeWithInterrupt(
            chain.followHeadSubscribe({ request: { genesisHash, withRuntime } }),
            (item) => {
              const followSubscriptionId2 = ref.handle?.subscriptionId;
              if (!followSubscriptionId2) {
                pendingItems.push(item);
                return;
              }
              forwardItem(followSubscriptionId2, item);
            }
          );
          const followSubscriptionId = ref.handle.subscriptionId;
          if (!followSubscriptionId) {
            ref.handle.unsubscribe();
            sendJsonRpcError(
              id,
              JSON_RPC_INTERNAL_ERROR,
              "Host follow subscription did not start"
            );
            break;
          }
          ref.handle.onInterrupt(() => {
            if (activeFollows.delete(followSubscriptionId)) {
              sendFollowEvent(followSubscriptionId, { event: "stop" });
            }
          });
          activeFollows.set(followSubscriptionId, ref.handle);
          sendJsonRpcResponse(id, followSubscriptionId);
          for (const item of pendingItems) {
            forwardItem(followSubscriptionId, item);
          }
          break;
        }
        case "chainHead_v1_unfollow": {
          const [followSubId] = params;
          const follow = activeFollows.get(followSubId);
          if (follow) {
            follow.unsubscribe();
            activeFollows.delete(followSubId);
          }
          sendJsonRpcResponse(id, null);
          break;
        }
        case "chainHead_v1_header": {
          const [followSubscriptionId, hash] = params;
          chain.getHeadHeader({ genesisHash, followSubscriptionId, hash }).match(
            (response) => sendJsonRpcResponse(id, response.header ?? null),
            hostError(id)
          );
          break;
        }
        case "chainHead_v1_body": {
          const [followSubscriptionId, hash] = params;
          chain.getHeadBody({ genesisHash, followSubscriptionId, hash }).match(
            (response) => sendJsonRpcResponse(
              id,
              convertOperationResultToJsonRpc(response.operation)
            ),
            hostError(id)
          );
          break;
        }
        case "chainHead_v1_storage": {
          const [followSubscriptionId, hash, items, childTrie] = params;
          const queryItems = items.map((item) => ({
            key: item.key,
            queryType: convertStorageType(item.type)
          }));
          chain.getHeadStorage({
            genesisHash,
            followSubscriptionId,
            hash,
            items: queryItems,
            // PAPI passes `null` for an absent child trie, but the
            // truapi codec encodes the optional `childTrie` field as
            // `Option<Hex>` — it treats `undefined` as None yet runs
            // the inner Hex codec on `null`, which throws
            // (`null.startsWith`). Coerce `null` → `undefined`.
            childTrie: childTrie ?? void 0
          }).match(
            (response) => sendJsonRpcResponse(
              id,
              convertOperationResultToJsonRpc(response.operation)
            ),
            hostError(id)
          );
          break;
        }
        case "chainHead_v1_call": {
          const [followSubscriptionId, hash, fn, callParameters] = params;
          chain.callHead({
            genesisHash,
            followSubscriptionId,
            hash,
            function: fn,
            callParameters
          }).match(
            (response) => sendJsonRpcResponse(
              id,
              convertOperationResultToJsonRpc(response.operation)
            ),
            hostError(id)
          );
          break;
        }
        case "chainHead_v1_unpin": {
          const [followSubscriptionId, hashOrHashes] = params;
          const hashes = Array.isArray(hashOrHashes) ? hashOrHashes : [hashOrHashes];
          chain.unpinHead({ genesisHash, followSubscriptionId, hashes }).match(() => sendJsonRpcResponse(id, null), hostError(id));
          break;
        }
        case "chainHead_v1_continue": {
          const [followSubscriptionId, operationId] = params;
          chain.continueHead({ genesisHash, followSubscriptionId, operationId }).match(() => sendJsonRpcResponse(id, null), hostError(id));
          break;
        }
        case "chainHead_v1_stopOperation": {
          const [followSubscriptionId, operationId] = params;
          chain.stopHeadOperation({ genesisHash, followSubscriptionId, operationId }).match(() => sendJsonRpcResponse(id, null), hostError(id));
          break;
        }
        case "chainSpec_v1_genesisHash": {
          chain.getSpecGenesisHash({ genesisHash }).match(
            (response) => sendJsonRpcResponse(id, response.genesisHash),
            hostError(id)
          );
          break;
        }
        case "chainSpec_v1_chainName": {
          chain.getSpecChainName({ genesisHash }).match(
            (response) => sendJsonRpcResponse(id, response.chainName),
            hostError(id)
          );
          break;
        }
        case "chainSpec_v1_properties": {
          chain.getSpecProperties({ genesisHash }).match((response) => {
            try {
              sendJsonRpcResponse(id, JSON.parse(response.properties));
            } catch {
              sendJsonRpcResponse(id, response.properties);
            }
          }, hostError(id));
          break;
        }
        case "transaction_v1_broadcast": {
          const [transaction] = params;
          chain.broadcastTransaction({ genesisHash, transaction }).match((response) => {
            const operationId = response.operationId ?? null;
            if (operationId !== null) activeBroadcasts.add(operationId);
            sendJsonRpcResponse(id, operationId);
          }, hostError(id));
          break;
        }
        case "transaction_v1_stop": {
          const [operationId] = params;
          activeBroadcasts.delete(operationId);
          chain.stopTransaction({ genesisHash, operationId }).match(() => sendJsonRpcResponse(id, null), hostError(id));
          break;
        }
        default:
          sendJsonRpcError(
            id,
            JSON_RPC_METHOD_NOT_FOUND,
            `Method "${method}" is not supported by the host`
          );
          break;
      }
    }
    return {
      send(message) {
        try {
          handleMessage(message);
        } catch (error) {
          log.warn("send: handler threw before settling the request", {
            error: formatHostError(error)
          });
          sendJsonRpcError(message.id, JSON_RPC_INTERNAL_ERROR, formatHostError(error));
        }
      },
      disconnect() {
        for (const handle of activeFollows.values()) {
          handle.unsubscribe();
        }
        activeFollows.clear();
        for (const operationId of activeBroadcasts) {
          chain.stopTransaction({ genesisHash, operationId }).match(
            () => {
            },
            () => {
            }
          );
        }
        activeBroadcasts.clear();
      }
    };
  };
}

// src/truapi.ts
var log2 = createLogger("host");
function unwrapHostResult(result, label) {
  return result.match(
    (value) => value,
    (error) => {
      throw new Error(`${label}: ${formatHostError(error)}`, { cause: error });
    }
  );
}
function mapHostResult(result, map, label) {
  return result.match(
    (value) => ok(map(value)),
    (error) => err(new HostCallFailedError(label, error))
  );
}
function toHex(bytes) {
  return scale.bytesToHex(bytes);
}
function fromHex(hex) {
  return scale.hexToBytes(hex);
}
async function getTruApi() {
  return getClient();
}
function adaptPreimageManager(client) {
  const preimage = client.preimage;
  return {
    lookup(key, callback) {
      return subscribeWithInterrupt(
        preimage.lookupSubscribe({ request: { key } }),
        (item) => callback(item.value !== void 0 ? fromHex(item.value) : null)
      );
    },
    submit(value) {
      return unwrapHostResult(preimage.submit(toHex(value)), "preimage submit failed");
    }
  };
}
async function getPreimageManager() {
  const client = await getClient();
  return client ? adaptPreimageManager(client) : null;
}
async function createHostPreimageManager() {
  return getPreimageManager();
}
async function requestResourceAllocation(resources) {
  const truApi = await getTruApi();
  if (!truApi) {
    return err(new HostUnavailableError("requestResourceAllocation: TruAPI unavailable"));
  }
  log2.debug("requestResourceAllocation", { resources: resources.map((r) => r.tag) });
  return mapHostResult(
    truApi.resourceAllocation.request({ resources }),
    (response) => response.outcomes,
    "requestResourceAllocation failed"
  );
}
async function createProofAuthorized(statement) {
  const truApi = await getTruApi();
  if (!truApi) {
    return err(new HostUnavailableError("createProofAuthorized: TruAPI unavailable"));
  }
  log2.debug("createProofAuthorized", { topics: statement.topics.length });
  return mapHostResult(
    truApi.statementStore.createProofAuthorized(statement),
    (response) => response.proof,
    "createProofAuthorized failed"
  );
}

// src/container.ts
var textEncoder = new TextEncoder();
var textDecoder = new TextDecoder();
var ChainNotSupportedError = class extends Error {
  /** Genesis hash of the chain the host refused, for programmatic detection. */
  genesisHash;
  constructor(genesisHash) {
    super(
      `Chain ${genesisHash} is not supported by the current host. It may not be enabled in this host build, or its genesis hash may have drifted after a network reset.`
    );
    this.name = "ChainNotSupportedError";
    this.genesisHash = genesisHash;
  }
};
async function isChainSupportedByHost(client, genesisHash) {
  return client.system.featureSupported({ tag: "Chain", value: { genesisHash } }).match(
    (response) => response.supported,
    (error) => {
      throw new Error(
        `Host rejected the chain-support check for ${genesisHash}: ${formatHostError(error)}`
      );
    }
  );
}
async function isInsideContainer() {
  return isCorrectEnvironment();
}
function adaptLocalStorage(client) {
  const ls = client.localStorage;
  async function readBytes(key) {
    const response = await unwrapHostResult(ls.read({ key }), "host localStorage read failed");
    return response.value !== void 0 ? fromHex(response.value) : void 0;
  }
  async function writeBytes(key, value) {
    await unwrapHostResult(
      ls.write({ key, value: toHex(value) }),
      "host localStorage write failed"
    );
  }
  async function readString(key) {
    const bytes = await readBytes(key);
    return bytes ? textDecoder.decode(bytes) : "";
  }
  async function writeString(key, value) {
    return writeBytes(key, textEncoder.encode(value));
  }
  async function readJSON(key) {
    const text = await readString(key);
    return text ? JSON.parse(text) : null;
  }
  async function writeJSON(key, value) {
    return writeString(key, JSON.stringify(value));
  }
  async function clear(key) {
    await unwrapHostResult(ls.clear({ key }), "host localStorage clear failed");
  }
  return { readString, writeString, readJSON, writeJSON, readBytes, writeBytes, clear };
}
async function getHostLocalStorage() {
  const client = await getClient();
  return client ? adaptLocalStorage(client) : null;
}
async function createHostLocalStorage() {
  return getHostLocalStorage();
}
async function getHostProvider(genesisHash) {
  const client = await getClient();
  if (!client) return null;
  return resolveHostProvider(client, genesisHash);
}
async function resolveHostProvider(client, genesisHash) {
  if (!await isChainSupportedByHost(client, genesisHash)) {
    throw new ChainNotSupportedError(genesisHash);
  }
  return createHostPapiProvider(client, genesisHash);
}
function adaptStatementStore(client) {
  const ss = client.statementStore;
  return {
    subscribe(filter, callback) {
      const request = "matchAll" in filter ? { tag: "MatchAll", value: filter.matchAll } : { tag: "MatchAny", value: filter.matchAny };
      return subscribeWithInterrupt(ss.subscribe({ request }), callback);
    },
    async createProofAuthorized(statement) {
      const response = await unwrapHostResult(
        ss.createProofAuthorized(statement),
        "createProofAuthorized failed"
      );
      return response.proof;
    },
    async submit(signedStatement) {
      await unwrapHostResult(ss.submit(signedStatement), "statement submit failed");
    }
  };
}
async function getStatementStore() {
  const client = await getClient();
  return client ? adaptStatementStore(client) : null;
}

// src/chains.ts
var BULLETIN_RPCS = {
  paseo: ["wss://paseo-bulletin-next-rpc.polkadot.io"],
  devnet: ["wss://bulletin-paseo.tservices.es:8443"],
  polkadot: [],
  kusama: []
};
var DEFAULT_BULLETIN_ENDPOINT = BULLETIN_RPCS.paseo[0];
function sameRingLocation(a, b) {
  if (a.chainId.toLowerCase() !== b.chainId.toLowerCase() || a.junctions.length !== b.junctions.length) {
    return false;
  }
  return a.junctions.every((junction, index) => {
    const candidate = b.junctions[index];
    if (junction.tag === "PalletInstance") {
      return candidate.tag === "PalletInstance" && junction.value === candidate.value;
    }
    return candidate.tag === "CollectionId" && junction.value.toLowerCase() === candidate.value.toLowerCase();
  });
}
function findRingVrfKeyHandle(keys, ring) {
  return keys.find((key) => key.rings.some((candidate) => sameRingLocation(candidate, ring)))?.handle;
}
function deriveTxExtVersion(metadata) {
  const versions = unifyMetadata(decAnyMetadata(metadata)).extrinsic.version;
  if (versions.length === 0) {
    throw new Error("No extrinsic version found in metadata");
  }
  const latestVersion = versions.reduce((acc, v) => Math.max(acc, v), 0);
  return latestVersion === 4 ? 0 : latestVersion;
}
var deps = { deriveTxExtVersion };
function toHostExtensions(signedExtensions) {
  return Object.values(signedExtensions).map((ext) => ({
    id: ext.identifier,
    extra: toHex(ext.value),
    additionalSigned: toHex(ext.additionalSigned)
  }));
}
function toWireProductAccountId({
  dotNsIdentifier,
  derivationIndex = 0
}) {
  return { dotNsIdentifier, derivationIndex: { tag: "Index", value: derivationIndex } };
}
function adaptAccountsProvider(client) {
  const account = client.account;
  const signing = client.signing;
  return {
    getUserId() {
      return account.getUserId().map((response) => ({
        primaryUsername: response.primaryUsername
      }));
    },
    requestLogin(reason) {
      return account.requestLogin({ reason });
    },
    getProductAccount(dotNsIdentifier, derivationIndex = 0) {
      return account.getAccount({
        productAccountId: toWireProductAccountId({ dotNsIdentifier, derivationIndex })
      }).map((response) => ({
        publicKey: fromHex(response.account.publicKey),
        dotNsIdentifier,
        derivationIndex
      }));
    },
    listRingVrfKeys(owner, disclosure = "Anonymized") {
      return account.listRingVrfKeys({ owner, disclosure }).map(
        (keys) => keys.map((key) => ({
          ...key,
          handle: key.handle,
          publicKey: key.publicKey === void 0 ? void 0 : fromHex(key.publicKey)
        }))
      );
    },
    getProductAccountAlias(keyHandle, context, location) {
      return account.getAccountAlias({
        keyHandle,
        context,
        ringLocation: location
      }).map((response) => ({
        context: fromHex(response.context),
        alias: fromHex(response.alias)
      }));
    },
    getLegacyAccounts() {
      return account.getLegacyAccounts().map(
        (response) => response.accounts.map((a) => ({
          publicKey: fromHex(a.publicKey),
          name: a.name
        }))
      );
    },
    createRingVRFProof(keyHandle, context, location, message) {
      return account.createAccountProof({
        keyHandle,
        context,
        ringLocation: location,
        message: toHex(message)
      }).map((response) => ({
        proof: fromHex(response.proof),
        contextualAlias: {
          context: fromHex(response.contextualAlias.context),
          alias: fromHex(response.contextualAlias.alias)
        },
        ringIndex: response.ringIndex,
        ringRevision: response.ringRevision
      }));
    },
    signVrf(account_, transcriptLabel, items) {
      return account.signVrf({
        account: toWireProductAccountId(account_),
        transcriptLabel: toHex(transcriptLabel),
        items: items.map(({ label, value }) => ({
          label: toHex(label),
          value: toHex(value)
        }))
      }).map((response) => ({
        preOutput: fromHex(response.preOutput),
        proof: fromHex(response.proof)
      }));
    },
    getProductAccountSigner(account_) {
      const productAccountId = toWireProductAccountId(account_);
      return {
        publicKey: account_.publicKey,
        async signTx(callData, signedExtensions, metadata) {
          const checkGenesis = signedExtensions.CheckGenesis;
          if (!checkGenesis) {
            throw new Error("Can't find genesis hash on transaction");
          }
          const response = await unwrapHostResult(
            signing.createTransaction({
              signer: productAccountId,
              genesisHash: toHex(checkGenesis.additionalSigned),
              callData: toHex(callData),
              extensions: toHostExtensions(signedExtensions),
              txExtVersion: deps.deriveTxExtVersion(metadata)
            }),
            "createTransaction failed"
          );
          return fromHex(response.transaction);
        },
        async signBytes(data) {
          const response = await unwrapHostResult(
            signing.signRaw({
              account: productAccountId,
              payload: { tag: "Bytes", value: { bytes: toHex(data) } }
            }),
            "signRaw failed"
          );
          return fromHex(response.signature);
        }
      };
    },
    getLegacyAccountSigner(account_) {
      const signerHex = toHex(account_.publicKey);
      const ss58Address = AccountId().dec(account_.publicKey);
      return {
        publicKey: account_.publicKey,
        async signTx(callData, signedExtensions, metadata) {
          const checkGenesis = signedExtensions.CheckGenesis;
          if (!checkGenesis) {
            throw new Error("Can't find genesis hash on transaction");
          }
          const response = await unwrapHostResult(
            signing.createTransactionWithLegacyAccount({
              signer: signerHex,
              genesisHash: toHex(checkGenesis.additionalSigned),
              callData: toHex(callData),
              extensions: toHostExtensions(signedExtensions),
              txExtVersion: deps.deriveTxExtVersion(metadata)
            }),
            "createTransactionWithLegacyAccount failed"
          );
          return fromHex(response.transaction);
        },
        async signBytes(data) {
          const response = await unwrapHostResult(
            signing.signRawWithLegacyAccount({
              signer: ss58Address,
              payload: { tag: "Bytes", value: { bytes: toHex(data) } }
            }),
            "signRawWithLegacyAccount failed"
          );
          return fromHex(response.signature);
        }
      };
    },
    subscribeAccountConnectionStatus(callback) {
      return subscribeWithInterrupt(account.connectionStatusSubscribe(), callback);
    }
  };
}
async function getAccountsProvider() {
  const client = await getClient();
  return client ? adaptAccountsProvider(client) : null;
}
var log3 = createLogger("host:permissions");
async function requestPermission(permission) {
  const truApi = await getTruApi();
  if (!truApi) {
    return err(new HostUnavailableError("requestPermission: TruAPI unavailable"));
  }
  log3.debug("requestPermission", { tag: permission.tag });
  return mapHostResult(
    truApi.permissions.requestRemotePermission({ permission }),
    (response) => response.granted,
    "requestPermission failed"
  );
}
async function requestDevicePermission(permission) {
  const truApi = await getTruApi();
  if (!truApi) {
    return err(new HostUnavailableError("requestDevicePermission: TruAPI unavailable"));
  }
  log3.debug("requestDevicePermission", { permission });
  return mapHostResult(
    truApi.permissions.requestDevicePermission(permission),
    (response) => response.granted,
    "requestDevicePermission failed"
  );
}

// src/theme.ts
function adaptThemeProvider(client) {
  return {
    subscribeTheme(callback) {
      return subscribeWithInterrupt(client.theme.subscribe(), callback);
    }
  };
}
async function getThemeProvider() {
  const client = await getClient();
  return client ? adaptThemeProvider(client) : null;
}
var log4 = createLogger("host:entropy");
async function deriveEntropy(key) {
  const truApi = await getTruApi();
  if (!truApi) {
    return err(new HostUnavailableError("deriveEntropy: TruAPI unavailable"));
  }
  log4.debug("deriveEntropy", { keyLen: key.length });
  return mapHostResult(
    truApi.entropy.derive({ context: toHex(key) }),
    (response) => fromHex(response.entropy),
    "deriveEntropy failed"
  );
}

// src/chat.ts
function adaptChatManager(client) {
  const chat = client.chat;
  const roomStatus = /* @__PURE__ */ new Map();
  const botStatus = /* @__PURE__ */ new Map();
  return {
    async registerRoom(request) {
      const cached = roomStatus.get(request.roomId);
      if (cached) return cached;
      const response = await unwrapHostResult(
        chat.createRoom(request),
        "chat registerRoom failed"
      );
      roomStatus.set(request.roomId, response.status);
      return response.status;
    },
    async registerBot(request) {
      const cached = botStatus.get(request.botId);
      if (cached) return cached;
      const response = await unwrapHostResult(
        chat.registerBot(request),
        "chat registerBot failed"
      );
      botStatus.set(request.botId, response.status);
      return response.status;
    },
    async sendMessage(roomId, payload) {
      const response = await unwrapHostResult(
        chat.postMessage({ roomId, payload }),
        "chat sendMessage failed"
      );
      return { messageId: response.messageId };
    },
    subscribeChatList(callback) {
      return subscribeWithInterrupt(chat.listSubscribe(), (item) => callback(item.rooms));
    },
    subscribeAction(callback) {
      return subscribeWithInterrupt(chat.actionSubscribe(), callback);
    }
  };
}
async function getChatManager() {
  const client = await getClient();
  return client ? adaptChatManager(client) : null;
}

// src/payments.ts
function adaptPaymentManager(client) {
  const payment = client.payment;
  return {
    subscribeBalance(callback, purse) {
      return subscribeWithInterrupt(
        payment.balanceSubscribe({ request: { purse } }),
        callback
      );
    },
    topUp(amount, source, into) {
      return unwrapHostResult(
        payment.topUp({ into, amount, source }),
        "payment topUp failed"
      );
    },
    async requestPayment(amount, destination, from) {
      const response = await unwrapHostResult(
        payment.request({ from, amount, destination }),
        "payment requestPayment failed"
      );
      return { id: response.id };
    },
    subscribePaymentStatus(paymentId, callback) {
      return subscribeWithInterrupt(
        payment.statusSubscribe({ request: { paymentId } }),
        callback
      );
    }
  };
}
async function getPaymentManager() {
  const client = await getClient();
  return client ? adaptPaymentManager(client) : null;
}

// src/notifications.ts
function adaptNotificationManager(client) {
  const notifications = client.notifications;
  return {
    async push(input) {
      const response = await unwrapHostResult(
        notifications.sendPushNotification(input),
        "notification push failed"
      );
      return response.id;
    },
    async cancel(id) {
      await unwrapHostResult(
        notifications.cancelPushNotification({ id }),
        "notification cancel failed"
      );
    }
  };
}
async function getNotificationManager() {
  const client = await getClient();
  return client ? adaptNotificationManager(client) : null;
}
var log5 = createLogger("host:navigation");
async function navigateTo(url) {
  const truApi = await getTruApi();
  if (!truApi) {
    return err(new HostUnavailableError("navigateTo: TruAPI unavailable"));
  }
  log5.debug("navigateTo", { url });
  return mapHostResult(truApi.system.navigateTo({ url }), () => void 0, "navigateTo failed");
}
var log6 = createLogger("host:features");
async function featureSupported(feature) {
  const truApi = await getTruApi();
  if (!truApi) {
    return err(new HostUnavailableError("featureSupported: TruAPI unavailable"));
  }
  log6.debug("featureSupported", { tag: feature.tag });
  return mapHostResult(
    truApi.system.featureSupported({ tag: feature.tag, value: { genesisHash: feature.value } }),
    (response) => response.supported,
    "featureSupported failed"
  );
}
async function isChainSupported(genesisHash) {
  return featureSupported({ tag: "Chain", value: genesisHash });
}
var log7 = createLogger("host:chain-spec");
async function getChainSpec(genesisHash) {
  const truApi = await getTruApi();
  if (!truApi) {
    log7.debug("getChainSpec: TruAPI unavailable");
    return ok(null);
  }
  log7.debug("getChainSpec", { genesisHash });
  const [genesisHashResult, nameResult, propertiesResult] = await Promise.all([
    mapHostResult(
      truApi.chain.getSpecGenesisHash({ genesisHash }),
      (response) => response.genesisHash,
      "getChainSpec (genesisHash) failed"
    ),
    mapHostResult(
      truApi.chain.getSpecChainName({ genesisHash }),
      (response) => response.chainName,
      "getChainSpec (chainName) failed"
    ),
    mapHostResult(
      truApi.chain.getSpecProperties({ genesisHash }),
      (response) => response.properties,
      "getChainSpec (properties) failed"
    )
  ]);
  if (!genesisHashResult.ok) return genesisHashResult;
  if (!nameResult.ok) return nameResult;
  if (!propertiesResult.ok) return propertiesResult;
  const propertiesRaw = propertiesResult.value;
  let properties;
  try {
    properties = JSON.parse(propertiesRaw);
  } catch (parseError) {
    log7.debug("getChainSpec: properties JSON parse failed", parseError);
    properties = null;
  }
  return ok({
    genesisHash: genesisHashResult.value,
    name: nameResult.value,
    properties,
    propertiesRaw
  });
}
var log8 = createLogger("host:chain-transaction");
async function broadcastTransaction(genesisHash, transaction) {
  const truApi = await getTruApi();
  if (!truApi) {
    return err(new HostUnavailableError("broadcastTransaction: TruAPI unavailable"));
  }
  log8.debug("broadcastTransaction", { genesisHash });
  return mapHostResult(
    truApi.chain.broadcastTransaction({ genesisHash, transaction }),
    (response) => response.operationId ?? null,
    "broadcastTransaction failed"
  );
}
async function stopTransaction(genesisHash, operationId) {
  const truApi = await getTruApi();
  if (!truApi) {
    return err(new HostUnavailableError("stopTransaction: TruAPI unavailable"));
  }
  log8.debug("stopTransaction", { genesisHash, operationId });
  return mapHostResult(
    truApi.chain.stopTransaction({ genesisHash, operationId }),
    () => void 0,
    "stopTransaction failed"
  );
}

export { BULLETIN_RPCS, ChainNotSupportedError, DEFAULT_BULLETIN_ENDPOINT, HostCallFailedError, HostError, HostUnavailableError, broadcastTransaction, createHostLocalStorage, createHostPreimageManager, createProofAuthorized, deriveEntropy, featureSupported, findRingVrfKeyHandle, formatHostError, fromHex, getAccountsProvider, getChainSpec, getChatManager, getHostLocalStorage, getHostProvider, getNotificationManager, getPaymentManager, getPreimageManager, getStatementStore, getThemeProvider, getTruApi, isChainSupported, isHostError, isInsideContainer, navigateTo, requestDevicePermission, requestPermission, requestResourceAllocation, stopTransaction, toHex };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map