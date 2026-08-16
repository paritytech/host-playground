import { JsonRpcProvider, PolkadotSigner } from 'polkadot-api';
import { Topic, RemoteStatementStoreSubscribeItem, Statement, StatementProof, SignedStatement, HexString, scale, TrUApiClient, AllocatableResource, AllocationOutcome, VersionedHostGetUserIdError, HostRequestLoginResponse, VersionedHostRequestLoginError, ProductAccountId, ProductAccount as ProductAccount$1, VersionedHostAccountGetError, RingVrfKeyDisclosure, RegisteredRingVrfKey as RegisteredRingVrfKey$1, VersionedHostAccountListRingVrfKeysError, ProductProofContext, RingLocation, ContextualAlias as ContextualAlias$1, VersionedHostAccountGetAliasError, LegacyAccount, VersionedHostGetLegacyAccountsError, HostAccountCreateProofResponse, VersionedHostAccountCreateProofError, VrfTranscriptItem as VrfTranscriptItem$1, VrfSignature as VrfSignature$1, VersionedHostAccountSignVrfError, HostAccountConnectionStatusSubscribeItem, HostDevicePermissionRequest, RemotePermission, HostThemeSubscribeItem, ChatBotRegistrationStatus, HostChatCreateRoomRequest, ChatRoomRegistrationStatus, HostChatRegisterBotRequest, ChatMessageContent, ChatRoom, HostChatActionSubscribeItem, HostPaymentBalanceSubscribeItem, CoinPaymentPurseId, Balance, PaymentTopUpSource, HostPaymentStatusSubscribeItem, HostPushNotificationRequest, NotificationId } from '@parity/truapi';
export { AllocatableResource, AllocationOutcome, ChatMessageContent, ChatRoom, DerivationIndex, HexString, HostPaymentBalanceSubscribeItem, HostPaymentStatusSubscribeItem, NotificationId, PaymentTopUpSource, ProductAccountId, ProductProofContext, HostPushNotificationError as PushNotificationError, RemotePermission, RingLocation, RingVrfKeyDisclosure, SignedStatement, Statement, StatementProof, ThemeName, ThemeVariant, Topic } from '@parity/truapi';
import { SdkError } from '@parity/product-sdk-errors';
export { SdkError, isSdkError } from '@parity/product-sdk-errors';
import { Result } from '@parity/result';
export { Result, err, ok } from '@parity/result';
import { ResultAsync as ResultAsync$1 } from 'neverthrow';
export { i as isInsideContainerSync } from './transport-B0cdhwrp.js';

/**
 * Public types for the host wrappers.
 *
 * The statement-store types are re-exported from `@parity/truapi` so the Parity
 * surface stays in lockstep with the in-house protocol codec types. Their fields
 * are `0x`-prefixed hex strings (`HexString`) and their enums are `{ tag }` unions.
 */

/**
 * Persistent storage exposed by the host container, including string, JSON
 * and raw byte (`readBytes`/`writeBytes`) accessors. Most apps reach it
 * indirectly through the Storage package's `KvStore`; reach for it directly
 * via {@link getHostLocalStorage} when you need raw host storage without the
 * KV abstraction.
 *
 * Backed by `truApi.localStorage.*` (raw `read`/`write`/`clear` over hex bytes);
 * {@link getHostLocalStorage} adapts that into this richer surface. `readString`
 * resolves to `""` for a missing key and `readJSON`/`readBytes` to
 * `null`/`undefined`.
 */
interface HostLocalStorage {
    /** Read a UTF-8 string value; `""` when the key is absent. */
    readString(key: string): Promise<string>;
    /** Write a UTF-8 string value. */
    writeString(key: string, value: string): Promise<void>;
    /** Read and JSON-parse a value; `null` when the key is absent. */
    readJSON(key: string): Promise<unknown>;
    /** JSON-stringify and write a value. */
    writeJSON(key: string, value: unknown): Promise<void>;
    /** Read raw bytes; `undefined` when the key is absent. */
    readBytes(key: string): Promise<Uint8Array | undefined>;
    /** Write raw bytes. */
    writeBytes(key: string, value: Uint8Array): Promise<void>;
    /** Remove a key. */
    clear(key: string): Promise<void>;
}
/**
 * Topic-based subscription filter. The host delivers statements that match
 * either *all* of the listed topics (`matchAll`) or *any* of them (`matchAny`).
 *
 * This is a field-discriminated form of truapi's `RemoteStatementStoreSubscribeRequest`,
 * which is a tagged union (`{ tag: "MatchAll"; value: Topic[] } | { tag: "MatchAny"; value: Topic[] }`).
 * The transport maps between the two.
 */
type StatementTopicFilter = {
    matchAll: Topic[];
} | {
    matchAny: Topic[];
};
/**
 * A page of signed statements delivered by {@link HostStatementStore.subscribe}.
 *
 * truapi's `RemoteStatementStoreSubscribeItem`, re-exported under a friendlier
 * name. Pages arrive sequentially; `isComplete` is `false` while the host
 * streams the historical backfill and `true` once it's done (and on every
 * subsequent live-update page).
 */
type StatementsPage = RemoteStatementStoreSubscribeItem;
/**
 * Subscription handle returned by the host. Exposes `unsubscribe()` plus an
 * `onInterrupt` hook that fires if the host interrupts the subscription
 * server-side; `onInterrupt` returns a function that cancels the hook.
 */
interface HostSubscription {
    unsubscribe(): void;
    onInterrupt(callback: (reason?: unknown) => void): () => void;
}
/**
 * Statement Store handle exposed by the host container, backed by
 * `truApi.statementStore.*`. `subscribe` streams matching statements;
 * `createProofAuthorized` signs a statement with the product's RFC-10 allowance
 * account (the sponsored path — no per-call account id); `submit` publishes a
 * signed statement. The `statement-store` package layers a higher-level client
 * on top.
 */
interface HostStatementStore {
    subscribe(filter: StatementTopicFilter, callback: (page: StatementsPage) => void): HostSubscription;
    createProofAuthorized(statement: Statement): Promise<StatementProof>;
    submit(signedStatement: SignedStatement): Promise<void>;
}

/**
 * Thrown by {@link getHostProvider} when the host container is reachable but does
 * not support the requested chain — e.g. the chain isn't enabled in this host
 * build, or the descriptor's genesis hash has drifted from the host's after a
 * network reset.
 *
 * Surfacing this as a thrown error (rather than handing back a provider that
 * silently swallows every JSON-RPC request) is what lets callers of
 * `createChainClient` detect the failure. Without it, the host's fallback no-op
 * provider drops every request on the floor and queries await forever.
 */
declare class ChainNotSupportedError extends Error {
    /** Genesis hash of the chain the host refused, for programmatic detection. */
    readonly genesisHash: string;
    constructor(genesisHash: string);
}
/**
 * Detect if running inside a Host container (Polkadot Browser / Polkadot Desktop).
 *
 * The SDK is designed to run exclusively inside a host container. This function
 * is primarily useful for early validation or informational purposes.
 */
declare function isInsideContainer(): Promise<boolean>;
/**
 * Get the Host API localStorage instance when running inside a container.
 * Returns null outside a container or when the host transport is unavailable.
 */
declare function getHostLocalStorage(): Promise<HostLocalStorage | null>;
/**
 * Construct a host-backed `HostLocalStorage` instance. Retained for API
 * compatibility; with the single cached TruAPI client this is equivalent to
 * {@link getHostLocalStorage}.
 *
 * @returns A `HostLocalStorage` instance, or `null` if unavailable.
 */
declare function createHostLocalStorage(): Promise<HostLocalStorage | null>;
/**
 * Get a PAPI-compatible JSON-RPC provider that routes through the host connection.
 *
 * When running inside a Polkadot container, this builds a `JsonRpcProvider` over
 * `truApi.chain.*` (see {@link module:papi-provider}), enabling shared
 * connections and efficient routing. Returns `null` when not running inside a
 * container.
 *
 * @param genesisHash - Genesis hash of the target chain (`0x`-prefixed hex string).
 * @returns A host-routed `JsonRpcProvider`, or `null` if unavailable.
 * @throws {ChainNotSupportedError} When inside a container but the host can't serve
 *   the chain — surfaced instead of returning a provider that would hang forever.
 */
declare function getHostProvider(genesisHash: HexString): Promise<JsonRpcProvider | null>;
/**
 * Get the host statement store when running inside a container, backed by
 * `truApi.statementStore.*`.
 *
 * Returns a store with `subscribe`, `createProofAuthorized`, and `submit` that
 * communicate through the host's native binary protocol — bypassing JSON-RPC
 * entirely. Returns `null` outside a host container.
 *
 * @returns The host statement store, or `null` if unavailable.
 */
declare function getStatementStore(): Promise<HostStatementStore | null>;

/**
 * Shared chain network configuration — single source of truth for
 * chain-specific endpoints used by multiple packages.
 */
/**
 * Bulletin Chain RPC endpoints per network environment. `paseo` (Paseo Next v2)
 * and `devnet` (public Paseo testnet) are populated today; `polkadot` and
 * `kusama` are reserved for when those Bulletin deployments go live.
 */
declare const BULLETIN_RPCS: {
    readonly paseo: readonly ["wss://paseo-bulletin-next-rpc.polkadot.io"];
    readonly devnet: readonly ["wss://bulletin-paseo.tservices.es:8443"];
    readonly polkadot: string[];
    readonly kusama: string[];
};
/** Default Bulletin Chain endpoint — the first entry under {@link BULLETIN_RPCS}.paseo. */
declare const DEFAULT_BULLETIN_ENDPOINT: string;

/**
 * Typed errors carried on the `err` channel of the host public API's
 * {@link Result} returns.
 *
 * The hierarchy mirrors `@parity/product-sdk-signer`'s error classes
 * (`HostUnavailableError` / `HostRejectedError`), so the two layers share one
 * idiom: branch with `instanceof`, and every error is a real `Error` with a
 * stack trace and `cause`. The structured truapi wire error
 * ({@link HostErrorPayload}) rides along as {@link HostCallFailedError.payload}
 * for callers that want fine-grained tag-level handling.
 *
 * This module also owns {@link HostErrorPayload} (the wire-error shape) and
 * {@link formatHostError} (renders a payload to a message) — co-located with the
 * error classes that consume them so the host error model lives in one place.
 *
 * @module
 */

/**
 * What a `Domain`-tagged call error carries. Widened from truapi's per-domain
 * `Versioned*Error` types (all `{ tag: "V1", value: <domain error> }` today)
 * so one payload type covers every call.
 */
type VersionedDomainError = {
    tag: string;
    value?: unknown;
};
/**
 * The error a host call puts on its `Err` channel — truapi's canonical
 * {@link scale.CallErrorValue} envelope. `Denied` / `Unsupported` /
 * `MalformedFrame` / `HostFailure` are transport-level failures; `Domain`
 * wraps the actual per-domain error in a versioned envelope, which
 * {@link formatHostError} digs through when rendering.
 *
 * This is the payload {@link HostCallFailedError} carries — not the error
 * type consumers branch on.
 */
type HostErrorPayload = scale.CallErrorValue<VersionedDomainError>;
/**
 * Extract a human-readable message from a host-side error.
 *
 * Renders the {@link HostErrorPayload} shapes `@parity/truapi` surfaces. Accepts
 * `unknown` because it is also the catch-all formatter for thrown adapter-method
 * `Error` messages, so it falls back to `Error`/string/JSON rendering for
 * anything that isn't a recognized host error payload.
 *
 * Used by {@link HostCallFailedError} to render its message, and by the throwing
 * adapter-method helper `unwrapHostResult`.
 */
declare function formatHostError(error: unknown): string;
/**
 * Base class for all host errors. Use `instanceof HostError` (or {@link isHostError})
 * to catch any host-related failure. Implements the cross-package
 * {@link SdkError} marker so `isSdkError(e)` also recognizes it.
 */
declare class HostError extends Error implements SdkError {
    readonly isSdkError: true;
    readonly source = "host";
    constructor(message: string, options?: ErrorOptions);
}
/**
 * The host API is not available — the app is running outside a Polkadot host
 * container (no injected TruAPI transport). The dominant case during local
 * development. Branch with `instanceof HostUnavailableError` to surface an
 * "open this app in a Polkadot host" message.
 */
declare class HostUnavailableError extends HostError {
    constructor(message?: string);
}
/**
 * A host call reached the container but failed on the `Err` channel. Wraps the
 * structured truapi {@link HostErrorPayload} as {@link payload} (also preserved
 * as `cause`); the message is rendered via {@link formatHostError}.
 */
declare class HostCallFailedError extends HostError {
    readonly payload: HostErrorPayload;
    constructor(label: string, payload: HostErrorPayload);
}
/** Check whether a value is any {@link HostError}. */
declare function isHostError(error: unknown): error is HostError;

/**
 * TruAPI - the protocol for communicating between apps and the Polkadot host container.
 *
 * This module centralizes access to the in-house `@parity/truapi` client,
 * allowing other `@parity/product-sdk-*` packages to import from here rather
 * than depending directly on the protocol package. The client is built and
 * cached by {@link module:transport}; this module adds the accessor plus the
 * two helpers the convenience wrappers fold truapi's `ResultAsync` through —
 * {@link mapHostResult} (returns a `Result`, used by the public operations) and
 * {@link unwrapHostResult} (throws, used by the adapter-object methods).
 *
 * @module
 */

/** Convert bytes to a `0x`-prefixed lower-case hex string. */
declare function toHex(bytes: Uint8Array): HexString;
/** Convert a hex string (with or without `0x`) to bytes. */
declare function fromHex(hex: string): Uint8Array;

/**
 * The TruApi client — namespaced access to every host protocol domain
 * (`permissions`, `entropy`, `signing`, `statementStore`, `system`,
 * `localStorage`, …). Identical to `TrUApiClient` from `@parity/truapi`.
 *
 * @example
 * ```ts
 * const truApi = await getTruApi();
 * if (truApi) {
 *   await truApi.permissions.requestRemotePermission({
 *     permission: { tag: "ChainSubmit", value: undefined },
 *   });
 *   await truApi.system.navigateTo({ url: "polkadot://settings" });
 * }
 * ```
 */
type TruApi = TrUApiClient;
/**
 * Get the TruAPI client for direct low-level access to host protocol domains.
 *
 * Returns the cached `@parity/truapi` client once the host transport is built
 * and the handshake has run, or `null` when running outside a container.
 *
 * For most use cases, prefer the higher-level functions like
 * {@link requestPermission}, {@link deriveEntropy}, or `getHostLocalStorage()`.
 *
 * @returns The TruAPI client, or `null` if unavailable.
 */
declare function getTruApi(): Promise<TruApi | null>;
/**
 * Preimage manager handle for bulletin chain operations, backed by
 * `truApi.preimage.*`. `lookup` opens a {@link HostSubscription} (`unsubscribe`
 * + `onInterrupt`) that delivers the preimage bytes — or `null` until the host
 * finds them; `submit` uploads a preimage and resolves to its `0x`-prefixed hex
 * key.
 */
interface PreimageManager {
    lookup(key: HexString, callback: (preimage: Uint8Array | null) => void): HostSubscription;
    submit(value: Uint8Array): Promise<HexString>;
}
/**
 * Get the preimage manager for bulletin chain operations.
 *
 * @returns The preimage manager, or `null` if unavailable (outside a container).
 */
declare function getPreimageManager(): Promise<PreimageManager | null>;
/**
 * Construct a `PreimageManager`. Retained for API compatibility; with the single
 * cached TruAPI client this is equivalent to {@link getPreimageManager}.
 *
 * @returns A `PreimageManager` instance, or `null` if unavailable.
 */
declare function createHostPreimageManager(): Promise<PreimageManager | null>;

/**
 * Request the host to pre-allocate one or more resource allowances.
 *
 * The host prompts the user once; subsequent operations covered by the
 * granted allowance don't re-prompt.
 *
 * @param resources - Resources to request.
 * @returns `ok` with per-resource outcomes in the same order as `resources`, or
 *   `err(HostUnavailableError | HostCallFailedError)`.
 *
 * @example
 * ```ts
 * const r = await requestResourceAllocation([
 *   { tag: "BulletinAllowance", value: undefined },
 * ]);
 * if (r.ok && r.value[0] === "Allocated") { ... }
 * ```
 */
declare function requestResourceAllocation(resources: AllocatableResource[]): Promise<Result<AllocationOutcome[], HostError>>;
/**
 * Have the host sign a Statement using the product's allowance-bearing account,
 * which it picks internally — RFC-10 §"Statement Store allowance". No per-call
 * account id is needed (this is the sponsored-submission path).
 *
 * Pairs with {@link getStatementStore}'s `submit`: call this to obtain a proof,
 * attach it to the Statement, and submit the result.
 *
 * @param statement - The Statement to be signed.
 * @returns `ok` with the proof to attach before submitting, or
 *   `err(HostUnavailableError | HostCallFailedError)`.
 */
declare function createProofAuthorized(statement: Statement): Promise<Result<StatementProof, HostError>>;
/**
 * Neverthrow-style ResultAsync returned by product-sdk methods.
 *
 * Use `.match(onOk, onErr)` to handle success/error cases.
 */
interface ResultAsync<T, E> {
    match: <A, B = A>(ok: (t: T) => A, err: (e: E) => B) => Promise<A | B>;
}

/**
 * Host wallet accounts, backed by `truApi.account.*` and `truApi.signing.*`.
 *
 * `getAccountsProvider()` returns the full accounts surface — user identity
 * (`getUserId` / `requestLogin`), the user's existing wallet accounts
 * (`getLegacyAccounts`), app-scoped product accounts (`getProductAccount` /
 * `getProductAccountAlias`), Ring VRF proofs (`createRingVRFProof`), sr25519 VRF
 * signatures over a caller-supplied Merlin transcript (`signVrf`), connection
 * status, and PAPI `PolkadotSigner` factories for both product and legacy
 * accounts.
 *
 * The signer factories build a PAPI `PolkadotSigner` directly over
 * `truApi.signing.createTransaction` (product) /
 * `createTransactionWithLegacyAccount` (legacy) — `signTx` derives the
 * metadata-driven `txExtVersion` and maps the signed extensions to the host's
 * wire shape; `signBytes` calls `signing.signRaw(WithLegacyAccount)`. No PJS
 * bridge is involved, so opaque signed extensions (e.g. Paseo Next's `AsPgas`)
 * survive end-to-end.
 *
 * @module
 */

/**
 * One of the user's existing wallet accounts, surfaced through the host and
 * identified by its public key and an optional name. Contrast with
 * {@link ProductAccount}, which is also user-controlled but derived by the
 * host for a specific app rather than picked from the user's existing keys.
 *
 * Derived from `@parity/truapi`'s `LegacyAccount`, with `publicKey` decoded to bytes.
 */
type HostAccount = Omit<LegacyAccount, "publicKey"> & {
    /** Raw public key bytes. */
    publicKey: Uint8Array;
};
/**
 * A product account — an app-scoped derived account managed by the host wallet.
 *
 * The host derives a unique keypair for each app (identified by `dotNsIdentifier`)
 * so apps get their own account that the user controls but is scoped to the app.
 *
 * Combines `@parity/truapi`'s `ProductAccountId` (the `{ dotNsIdentifier,
 * derivationIndex }` lookup key) with the `ProductAccount` payload, with
 * `publicKey` decoded to bytes and `derivationIndex` kept as the plain
 * numeric index (the adapter wraps it into the wire's tagged
 * {@link DerivationIndex} selector).
 */
type ProductAccount = Omit<ProductAccountId, "derivationIndex"> & Omit<ProductAccount$1, "publicKey"> & {
    /** Plain account index within the product subtree. */
    derivationIndex: number;
    /** Raw public key bytes. */
    publicKey: Uint8Array;
};
/**
 * How callers address a product account: app identifier plus an optional index,
 * defaulting to 0. A {@link ProductAccount} satisfies this, so an account from
 * {@link AccountsProvider.getProductAccount} can be passed straight back in.
 */
type ProductAccountLookup = Omit<ProductAccountId, "derivationIndex"> & {
    /** Plain account index within the product subtree. Defaults to 0. */
    derivationIndex?: number;
};
declare const ringVrfKeyHandleBrand: unique symbol;
/**
 * Opaque public name of a registered ring-VRF key.
 *
 * Handles come from {@link AccountsProvider.listRingVrfKeys}; product code
 * cannot construct one from a derivation index.
 */
type RingVrfKeyHandle = {
    readonly [ringVrfKeyHandleBrand]: "RingVrfKeyHandle";
};
/** Ring-VRF member public key, decoded from the wire's hex string. */
type RingVrfPublicKey = Uint8Array;
/** Registered key metadata returned by the host. */
type RegisteredRingVrfKey = Omit<RegisteredRingVrfKey$1, "handle" | "publicKey"> & {
    /** Opaque handle to pass back for alias and proof requests. */
    handle: RingVrfKeyHandle;
    /** Present when public-key disclosure was granted. */
    publicKey?: RingVrfPublicKey;
};
/**
 * Select a registered key by its declared ring and return its opaque handle.
 *
 * Consumers must not hard-code another product's derivation index. Registry
 * order breaks ties when an owner declares multiple keys for the same ring.
 */
declare function findRingVrfKeyHandle(keys: RegisteredRingVrfKey[], ring: RingLocation): RingVrfKeyHandle | undefined;
/**
 * A contextual alias obtained from Ring VRF.
 *
 * Proves account membership in a ring without revealing which account.
 *
 * Derived from `@parity/truapi`'s `ContextualAlias`, with both fields decoded to bytes.
 */
type ContextualAlias = {
    [K in keyof ContextualAlias$1]: Uint8Array;
};
/**
 * A Ring VRF proof plus the values needed to verify it downstream (e.g.
 * against a precompile): the alias it commits to, and the ring member index /
 * revision the proof was generated against.
 *
 * Derived from `@parity/truapi`'s `HostAccountCreateProofResponse`, with the
 * byte fields decoded.
 */
type RingVRFProof = Omit<HostAccountCreateProofResponse, "proof" | "contextualAlias"> & {
    /** Raw ring VRF proof bytes. */
    proof: Uint8Array;
    /** Alias derived for the request's context. */
    contextualAlias: ContextualAlias;
};
/**
 * One `append_message(label, value)` call replayed against a VRF transcript.
 * Merlin labels are ASCII by convention: use `utf8ToBytes("round")`.
 *
 * Derived from `@parity/truapi`'s `VrfTranscriptItem`, decoded to bytes.
 */
type VrfTranscriptItem = {
    [K in keyof VrfTranscriptItem$1]: Uint8Array;
};
/**
 * An sr25519 VRF signature: the pre-output and its DLEQ proof.
 *
 * Derived from `@parity/truapi`'s `VrfSignature`, decoded to bytes.
 */
type VrfSignature = {
    [K in keyof VrfSignature$1]: Uint8Array;
};
/**
 * Accounts provider handle, backed by `truApi.account.*` / `truApi.signing.*`.
 * Surfaces the user's wallet accounts, app-scoped product accounts, Ring VRF,
 * user identity, connection status, and `PolkadotSigner` factories.
 *
 * Lookup methods return a neverthrow `ResultAsync` (use `.match(ok, err)`);
 * the signer factories return a synchronous PAPI `PolkadotSigner`. The `err`
 * channel carries truapi's canonical `CallErrorValue` envelope around the
 * per-call versioned domain error, exactly as the generated client returns it.
 */
interface AccountsProvider {
    getUserId(): ResultAsync$1<{
        primaryUsername: string;
    }, scale.CallErrorValue<VersionedHostGetUserIdError>>;
    requestLogin(reason?: string): ResultAsync$1<HostRequestLoginResponse, scale.CallErrorValue<VersionedHostRequestLoginError>>;
    getProductAccount(dotNsIdentifier: string, derivationIndex?: number): ResultAsync$1<ProductAccount, scale.CallErrorValue<VersionedHostAccountGetError>>;
    /** List an owner's registered ring-VRF keys. */
    listRingVrfKeys(owner: string, disclosure?: RingVrfKeyDisclosure): ResultAsync$1<RegisteredRingVrfKey[], scale.CallErrorValue<VersionedHostAccountListRingVrfKeysError>>;
    /** Derive a contextual alias with an explicitly registered ring-VRF key. */
    getProductAccountAlias(keyHandle: RingVrfKeyHandle, context: ProductProofContext, location: RingLocation): ResultAsync$1<ContextualAlias, scale.CallErrorValue<VersionedHostAccountGetAliasError>>;
    getLegacyAccounts(): ResultAsync$1<HostAccount[], scale.CallErrorValue<VersionedHostGetLegacyAccountsError>>;
    /**
     * Generate a Ring VRF proof with an explicitly registered key, binding
     * `message` to the product-scoped `context`.
     */
    createRingVRFProof(keyHandle: RingVrfKeyHandle, context: ProductProofContext, location: RingLocation, message: Uint8Array): ResultAsync$1<RingVRFProof, scale.CallErrorValue<VersionedHostAccountCreateProofError>>;
    /**
     * Produce an sr25519 VRF signature from a product account (RFC-0023).
     *
     * The host builds a Merlin transcript from `transcriptLabel` and `items`,
     * then signs it with the account's key. Unlike {@link createRingVRFProof},
     * this names the signing account instead of proving ring membership.
     *
     * The caller owns four things the types cannot enforce:
     *
     * - Domain separation. A label borrowed from another protocol makes the
     *   output replayable across both.
     * - Freshness. The VRF is deterministic, so per-round values belong in
     *   `items`.
     * - Size. Hosts cap the transcript at 32 items and 8 KiB total.
     * - Authorization. An `AutoSigning` allowance makes these calls silent. It
     *   is not VRF-scoped, so it covers other signing by that account too.
     *
     * Hosts predating the call reject it through the error channel.
     */
    signVrf(account: ProductAccountLookup, transcriptLabel: Uint8Array, items: VrfTranscriptItem[]): ResultAsync$1<VrfSignature, scale.CallErrorValue<VersionedHostAccountSignVrfError>>;
    /**
     * Build a `PolkadotSigner` for a product account. Signing routes through the
     * host's `createTransaction` path: the host decodes the metadata and forwards
     * the opaque signed-extension bytes, so unknown extensions survive end-to-end.
     */
    getProductAccountSigner(account: ProductAccount): PolkadotSigner;
    /**
     * Build a `PolkadotSigner` for one of the user's existing wallet accounts.
     * `name` is accepted for callsite ergonomics but unused — the signer is
     * derived from `publicKey` alone.
     */
    getLegacyAccountSigner(account: {
        publicKey: Uint8Array;
        name?: string;
    }): PolkadotSigner;
    subscribeAccountConnectionStatus(callback: (status: HostAccountConnectionStatusSubscribeItem) => void): HostSubscription;
}
/**
 * Get the accounts provider for managing host accounts, backed by
 * `truApi.account.*` / `truApi.signing.*`. Returns `null` when running outside
 * a host container.
 *
 * @returns The accounts provider, or `null` if unavailable.
 */
declare function getAccountsProvider(): Promise<AccountsProvider | null>;

/**
 * Higher-level wrappers for the host's single-permission flows.
 *
 * `truApi.permissions.requestRemotePermission` / `requestDevicePermission`
 * return a neverthrow `ResultAsync` of a `{ granted }` response.
 * {@link requestPermission} and {@link requestDevicePermission} collapse that
 * to one-liners returning a `Result<boolean, HostError>` — the granted flag on
 * success, a typed {@link HostError} on the `err` channel.
 *
 * @module
 */

/**
 * Device permission the dapp can ask the host to grant via
 * {@link requestDevicePermission}. A string union (`"Camera"`, `"Microphone"`,
 * …) re-exported from `@parity/truapi`.
 */
type DevicePermissionKind = HostDevicePermissionRequest;
/**
 * Legacy alias of {@link RemotePermission}, kept for back-compat with code that
 * used the older name. Use either freely.
 */
type RemotePermissionItem = RemotePermission;
/**
 * Request a single remote permission from the host.
 *
 * Calls `truApi.permissions.requestRemotePermission` and returns the host's
 * boolean granted/denied outcome.
 *
 * @param permission - The remote permission to request.
 * @returns `ok(true)` if the host granted the permission, `ok(false)` if denied,
 *   or `err(HostUnavailableError | HostCallFailedError)`.
 *
 * @example
 * ```ts
 * const r = await requestPermission({ tag: "ChainSubmit", value: undefined });
 * if (!r.ok || !r.value) {
 *   tellUserToReconnect();
 * }
 * ```
 */
declare function requestPermission(permission: RemotePermission): Promise<Result<boolean, HostError>>;
/**
 * Request a single device permission (camera, microphone, etc.) from the
 * host.
 *
 * Calls `truApi.permissions.requestDevicePermission` and returns the host's
 * boolean granted/denied outcome.
 *
 * @param permission - The device permission to request.
 * @returns `ok(true)` if the host granted the permission, `ok(false)` if denied,
 *   or `err(HostUnavailableError | HostCallFailedError)`.
 *
 * @example
 * ```ts
 * const r = await requestDevicePermission("Camera");
 * if (!r.ok || !r.value) {
 *   showCameraDeniedMessage();
 * }
 * ```
 */
declare function requestDevicePermission(permission: DevicePermissionKind): Promise<Result<boolean, HostError>>;

/**
 * Higher-level wrapper for the host's theme subscription, backed by
 * `truApi.theme.subscribe`.
 *
 * `getThemeProvider` returns a handle whose `subscribeTheme(cb)` delivers a
 * typed {@link ThemeMode} — a `{ name, variant }` struct where `variant` is
 * `"Light" | "Dark"` and `name` is `{ tag: "Default" }` or
 * `{ tag: "Custom", value }` — and yields a {@link HostSubscription}
 * (`unsubscribe` + `onInterrupt`).
 *
 * @module
 */

/**
 * Host theme value. A `{ name, variant }` struct re-exported from
 * `@parity/truapi`.
 */
type ThemeMode = HostThemeSubscribeItem;

/**
 * Host theme provider handle. `subscribeTheme(callback)` receives a typed
 * {@link ThemeMode} on every change and returns a {@link HostSubscription}.
 */
interface ThemeProvider {
    subscribeTheme(callback: (theme: ThemeMode) => void): HostSubscription;
}
/**
 * Get the host theme provider, backed by `truApi.theme.*`. Returns `null` when
 * running outside a host container.
 *
 * @returns The theme provider, or `null` if unavailable.
 *
 * @example
 * ```ts
 * import { getThemeProvider } from "@parity/product-sdk-host";
 *
 * const provider = await getThemeProvider();
 * if (provider) {
 *   const sub = provider.subscribeTheme((theme) => {
 *     document.documentElement.dataset.theme = theme.variant.toLowerCase();
 *     if (theme.name.tag === "Custom") loadCustomTheme(theme.name.value);
 *   });
 *   // sub.unsubscribe() to stop listening
 * }
 * ```
 */
declare function getThemeProvider(): Promise<ThemeProvider | null>;

/**
 * Higher-level wrapper for the host's entropy derivation (RFC-0007).
 *
 * `truApi.entropy.derive` takes a hex `context` and returns a hex `entropy`
 * payload wrapped in a neverthrow `ResultAsync`. `deriveEntropy` keeps the
 * ergonomic `Uint8Array → Result<Uint8Array, HostError>` signature: it
 * hex-encodes the context on the way in and decodes the entropy on the way out.
 *
 * @module
 */

/**
 * Derive deterministic entropy from a context key (RFC-0007).
 *
 * The host derives entropy from the user's wallet + the provided context
 * key. Calling with the same key on the same wallet yields the same bytes;
 * different keys (or different wallets) yield uncorrelated entropy.
 *
 * @param key - Context key bytes (typically a SCALE-encoded discriminator).
 * @returns `ok` with the derived entropy bytes, or
 *   `err(HostUnavailableError | HostCallFailedError)`.
 *
 * @example
 * ```ts
 * import { deriveEntropy } from "@parity/product-sdk-host";
 *
 * const r = await deriveEntropy(new TextEncoder().encode("my-app:seed-v1"));
 * if (r.ok) { const seed = r.value; }
 * ```
 */
declare function deriveEntropy(key: Uint8Array): Promise<Result<Uint8Array, HostError>>;

/**
 * Wrapper for the host's chat surface, backed by `truApi.chat.*`.
 *
 * `getChatManager()` returns a manager for room/bot registration, message
 * sending, and subscription to the room list and incoming actions.
 *
 * @module
 */

/** Action received via {@link ChatManager.subscribeAction} (`{ roomId, peer, payload }`). Re-exported from `@parity/truapi`. */
type ChatReceivedAction = HostChatActionSubscribeItem;
/** Result of registering a chat room (`"New" | "Exists"`). Re-exported from `@parity/truapi`. */
type ChatRoomRegistrationResult = ChatRoomRegistrationStatus;
/** Result of registering a bot (`"New" | "Exists"`). Re-exported from `@parity/truapi`. */
type ChatBotRegistrationResult = ChatBotRegistrationStatus;
/**
 * Chat manager handle. Exposes room/bot registration, message sending, and
 * subscription to the room list and incoming actions.
 */
interface ChatManager {
    registerRoom(request: HostChatCreateRoomRequest): Promise<ChatRoomRegistrationResult>;
    registerBot(request: HostChatRegisterBotRequest): Promise<ChatBotRegistrationResult>;
    sendMessage(roomId: string, payload: ChatMessageContent): Promise<{
        messageId: string;
    }>;
    subscribeChatList(callback: (rooms: ChatRoom[]) => void): HostSubscription;
    subscribeAction(callback: (action: ChatReceivedAction) => void): HostSubscription;
}
/**
 * Get the host chat manager, backed by `truApi.chat.*`. Returns `null` when
 * running outside a host container.
 *
 * @returns The chat manager, or `null` if unavailable.
 *
 * @example
 * ```ts
 * import { getChatManager } from "@parity/product-sdk-host";
 *
 * const chat = await getChatManager();
 * if (chat) {
 *   await chat.registerBot({ botId: "echo", name: "Echo Bot", icon: "" });
 *   chat.subscribeAction((action) => { ... });
 * }
 * ```
 */
declare function getChatManager(): Promise<ChatManager | null>;

/**
 * Wrapper for the host's payment manager (RFC-0006), backed by
 * `truApi.payment.*`.
 *
 * Exposes balance subscription, top-up, payment requests, and payment-status
 * subscription. The flow is distinct from the CoinPayment / merchant-payments
 * surface (RFC-0017) — RFC-0006 is the user-initiated balance / top-up /
 * payment-request flow — but both operate on the same CoinPayment purses,
 * hence the shared `CoinPaymentPurseId` (omitted = the main purse).
 *
 * @module
 */

/**
 * Payment manager handle. Exposes balance subscription, top-up, payment
 * requests, and payment-status subscription.
 *
 * The balance / status / top-up-source shapes are `@parity/truapi`'s
 * `HostPaymentBalanceSubscribeItem`, `HostPaymentStatusSubscribeItem`, and
 * `PaymentTopUpSource` — used directly rather than re-aliased.
 */
interface PaymentManager {
    subscribeBalance(callback: (balance: HostPaymentBalanceSubscribeItem) => void, purse?: CoinPaymentPurseId): HostSubscription;
    topUp(amount: Balance, source: PaymentTopUpSource, into?: CoinPaymentPurseId): Promise<void>;
    requestPayment(amount: Balance, destination: HexString, from?: CoinPaymentPurseId): Promise<{
        id: string;
    }>;
    subscribePaymentStatus(paymentId: string, callback: (status: HostPaymentStatusSubscribeItem) => void): HostSubscription;
}
/**
 * Get the host payment manager, backed by `truApi.payment.*`. Returns `null`
 * when running outside a host container.
 *
 * @returns The payment manager, or `null` if unavailable.
 *
 * @example
 * ```ts
 * import { getPaymentManager } from "@parity/product-sdk-host";
 *
 * const payments = await getPaymentManager();
 * if (payments) {
 *   const sub = payments.subscribeBalance((b) => { ... });
 *   await payments.topUp(1_000_000n, { tag: "ProductAccount", value: { derivationIndex: { tag: "Index", value: 0 } } });
 *   const { id } = await payments.requestPayment(500n, "0x…");
 *   sub.unsubscribe();
 * }
 * ```
 */
declare function getPaymentManager(): Promise<PaymentManager | null>;

/**
 * Wrapper for the host's scheduled push-notification surface (RFC-0019),
 * backed by `truApi.notifications.*`.
 *
 * `getNotificationManager()` returns a handle exposing `push(input)` (resolves
 * to a {@link NotificationId}) and `cancel(id)`, matching the singleton
 * pattern already used by {@link getPaymentManager}, {@link getPreimageManager},
 * and {@link getHostLocalStorage}.
 *
 * @module
 */

/**
 * Push payload: `text`, an optional `deeplink`, and an optional `scheduledAt`
 * (Unix timestamp in milliseconds; omit for immediate delivery). Re-exported
 * from the truapi wire request type so the shape stays in lockstep with the
 * protocol.
 */
type PushNotificationInput = HostPushNotificationRequest;
/**
 * Host notification manager handle. Exposes `push(input)` (resolves to a
 * {@link NotificationId}) and `cancel(id)`.
 */
interface NotificationManager {
    push(input: PushNotificationInput): Promise<NotificationId>;
    cancel(id: NotificationId): Promise<void>;
}
/**
 * Get the host notification manager, backed by `truApi.notifications.*`.
 * Returns `null` when running outside a host container.
 *
 * @returns The notification manager, or `null` if unavailable.
 *
 * @example
 * ```ts
 * import { getNotificationManager, type PushNotificationError } from "@parity/product-sdk-host";
 *
 * const notifications = await getNotificationManager();
 * if (notifications) {
 *   try {
 *     const id = await notifications.push({
 *       text: "Doors open in 1h",
 *       scheduledAt: someUnixMs,
 *     });
 *     // later: await notifications.cancel(id);
 *   } catch (err) {
 *     const cause = (err as Error).cause as PushNotificationError | undefined;
 *     if (cause?.tag === "ScheduleLimitReached") {
 *       // host hit its pending-notification cap — surface to the user
 *     }
 *   }
 * }
 * ```
 */
declare function getNotificationManager(): Promise<NotificationManager | null>;

/**
 * Higher-level wrapper for the host's deep-link navigation.
 *
 * `truApi.system.navigateTo` returns a neverthrow `ResultAsync`; consumers
 * still have to unwrap it themselves. {@link navigateTo} collapses that to a
 * `Result<void, HostError>`-returning Promise.
 *
 * @module
 */

/**
 * Ask the host to navigate to a URL (deep link or external link).
 *
 * Calls `truApi.system.navigateTo` and unwraps the response. The host resolves
 * the destination itself — a `dot`-suffixed deep link (e.g.
 * `"https://search.dot"`) routes to another app/route inside the container, an
 * `https://` URL opens externally.
 *
 * @param url - The URL to navigate to.
 * @returns `ok` on success, or `err`: {@link HostUnavailableError} if the host
 *   is unavailable, or {@link HostCallFailedError} if it denies the navigation
 *   (`NavigateToErr::PermissionDenied`) or fails otherwise (`NavigateToErr::Unknown`).
 *
 * @example
 * ```ts
 * import { navigateTo } from "@parity/product-sdk-host";
 *
 * const r = await navigateTo("https://search.dot");
 * if (!r.ok) handle(r.error);
 * ```
 */
declare function navigateTo(url: string): Promise<Result<void, HostError>>;

/**
 * Higher-level wrappers for the host's feature-support probe.
 *
 * `truApi.system.featureSupported` returns a neverthrow `ResultAsync`;
 * {@link featureSupported} collapses that to a `Result` carrying the host's
 * boolean answer. {@link isChainSupported} is a convenience over the only
 * feature variant the host exposes today (`Chain`).
 *
 * @module
 */

/**
 * A feature the host can be probed for via {@link featureSupported}.
 *
 * The only variant today is `Chain`, carrying the chain's `0x`-prefixed genesis
 * hash. This is a flattened form of truapi's `HostFeatureSupportedRequest`,
 * which nests the hash as `{ tag: "Chain"; value: { genesisHash } }` — we
 * inline `value` as the `HexString` for ergonomics and re-nest it at the call
 * site. New variants surface here as a widening of the union.
 */
type Feature = {
    tag: "Chain";
    value: HexString;
};
/**
 * Probe the host for support of a specific feature.
 *
 * Calls `truApi.system.featureSupported`, unwraps the response, and returns the
 * host's boolean answer.
 *
 * @param feature - The feature to probe for.
 * @returns `ok(true)` if the host supports the feature, `ok(false)` otherwise,
 *   or `err(HostUnavailableError | HostCallFailedError)`.
 *
 * @example
 * ```ts
 * import { featureSupported } from "@parity/product-sdk-host";
 *
 * const r = await featureSupported({ tag: "Chain", value: genesisHash });
 * if (r.ok && r.value) { ... }
 * ```
 */
declare function featureSupported(feature: Feature): Promise<Result<boolean, HostError>>;
/**
 * Convenience probe: is the chain with the given genesis hash supported by the
 * host? Wraps {@link featureSupported} for the `Chain` feature variant.
 *
 * @param genesisHash - The chain's `0x`-prefixed genesis hash.
 * @returns `ok(true)` if the host supports the chain, `ok(false)` otherwise, or
 *   `err(HostUnavailableError | HostCallFailedError)`.
 *
 * @example
 * ```ts
 * import { isChainSupported } from "@parity/product-sdk-host";
 *
 * const r = await isChainSupported(genesisHash);
 * if (!r.ok || !r.value) {
 *   tellUserChainUnavailable();
 * }
 * ```
 */
declare function isChainSupported(genesisHash: HexString): Promise<Result<boolean, HostError>>;

/**
 * Higher-level wrapper for the host's chain-spec lookups.
 *
 * The host exposes three separate chain-spec calls — `chain.getSpecGenesisHash`,
 * `chain.getSpecChainName`, and `chain.getSpecProperties` — each reachable via
 * {@link getTruApi} and each returning a neverthrow `ResultAsync`.
 * {@link getChainSpec} fetches all three in one call and returns a single
 * struct so callers read whichever field they need, matching the JSON-RPC
 * `chainSpec_v1_*` family they mirror.
 *
 * @module
 */

/**
 * Chain SS58/token properties as reported by the host's
 * `chainSpecProperties` call.
 *
 * The host returns this as a JSON string (mirroring the substrate
 * `chainSpec_v1_properties` JSON-RPC, whose payload is an open-ended object).
 * {@link getChainSpec} parses it into {@link ChainSpec.properties} and also
 * surfaces the untouched JSON as {@link ChainSpec.propertiesRaw}. The well-known substrate fields are
 * typed for convenience; the index signature keeps any chain-specific extras
 * reachable without `any` at the call site.
 */
interface ChainProperties {
    /** Address prefix used for SS58 encoding (e.g. `0` for Polkadot). */
    ss58Format?: number;
    /** Decimal places of the chain's native token(s). */
    tokenDecimals?: number | number[];
    /** Ticker symbol(s) of the chain's native token(s). */
    tokenSymbol?: string | string[];
    /** Chain-specific extras passed through verbatim from the JSON payload. */
    [key: string]: unknown;
}
/**
 * Combined chain-spec view returned by {@link getChainSpec}.
 */
interface ChainSpec {
    /** The chain's `0x`-prefixed genesis hash, as reported by the host. */
    genesisHash: HexString;
    /** Human-readable chain name (e.g. `"Polkadot"`). */
    name: string;
    /**
     * Parsed chain properties, or `null` if the host's JSON payload couldn't
     * be parsed. Inspect {@link propertiesRaw} for the original string.
     */
    properties: ChainProperties | null;
    /** The untouched JSON string the host returned for properties. */
    propertiesRaw: string;
}
/**
 * Fetch a chain's full spec (genesis hash, name, and properties) from the host
 * in one call.
 *
 * Issues the three underlying `chain.getSpec*` requests concurrently, unwraps
 * each response, and parses the properties JSON. Note the `genesisHash` in the
 * result is the value the host echoes back from `getSpecGenesisHash` for the
 * looked-up chain — pass the chain's known genesis hash as the lookup key.
 *
 * `null` (outside a container) is preserved as an `ok` value — it is an
 * expected state, not a failure — so callers branch on `r.ok && r.value`. A
 * real host-call failure surfaces on the `err` channel.
 *
 * @param genesisHash - The `0x`-prefixed genesis hash identifying the chain.
 * @returns `ok(spec)` with the combined {@link ChainSpec}, `ok(null)` if the
 *   host is unavailable (running outside a container), or
 *   `err(HostCallFailedError)` if any underlying host call fails.
 *
 * @example
 * ```ts
 * import { getChainSpec } from "@parity/product-sdk-host";
 *
 * const r = await getChainSpec(genesisHash);
 * if (r.ok && r.value) {
 *   console.log(r.value.name, r.value.properties?.tokenSymbol);
 * }
 * ```
 */
declare function getChainSpec(genesisHash: HexString): Promise<Result<ChainSpec | null, HostError>>;

/**
 * Higher-level wrappers for the host's transaction broadcast lifecycle.
 *
 * `truApi.chain.broadcastTransaction` / `truApi.chain.stopTransaction` are
 * reachable via {@link getTruApi}, but consumers have to unwrap the neverthrow
 * `ResultAsync` themselves. {@link broadcastTransaction} and
 * {@link stopTransaction} collapse that to `Result`-returning Promises, mirroring
 * the JSON-RPC `transaction_v1_broadcast` / `transaction_v1_stop` pair they
 * wrap.
 *
 * @module
 */

/**
 * Broadcast a signed transaction to the network via the host.
 *
 * Calls `truApi.chain.broadcastTransaction` and unwraps the response. The host
 * keeps re-broadcasting until the transaction is finalized/dropped or
 * {@link stopTransaction} is called with the returned operation id.
 *
 * @param genesisHash - The `0x`-prefixed genesis hash of the target chain.
 * @param transaction - The `0x`-prefixed SCALE-encoded signed transaction.
 * @returns `ok` with the operation id to pass to {@link stopTransaction} (or
 *   `null` if the host accepted the broadcast without issuing one), or
 *   `err(HostUnavailableError | HostCallFailedError)`.
 *
 * @example
 * ```ts
 * import { broadcastTransaction, stopTransaction } from "@parity/product-sdk-host";
 *
 * const r = await broadcastTransaction(genesisHash, signedTx);
 * // later, to stop re-broadcasting:
 * if (r.ok && r.value) await stopTransaction(genesisHash, r.value);
 * ```
 */
declare function broadcastTransaction(genesisHash: HexString, transaction: HexString): Promise<Result<string | null, HostError>>;
/**
 * Stop an in-flight broadcast started by {@link broadcastTransaction}.
 *
 * Calls `truApi.chain.stopTransaction` and unwraps the response.
 *
 * @param genesisHash - The `0x`-prefixed genesis hash of the target chain.
 * @param operationId - The operation id returned by
 *   {@link broadcastTransaction}.
 * @returns `ok` on success, or `err(HostUnavailableError | HostCallFailedError)`.
 *
 * @example
 * ```ts
 * await stopTransaction(genesisHash, operationId);
 * ```
 */
declare function stopTransaction(genesisHash: HexString, operationId: string): Promise<Result<void, HostError>>;

export { type AccountsProvider, BULLETIN_RPCS, ChainNotSupportedError, type ChainProperties, type ChainSpec, type ChatBotRegistrationResult, type ChatManager, type ChatReceivedAction, type ChatRoomRegistrationResult, type ContextualAlias, DEFAULT_BULLETIN_ENDPOINT, type DevicePermissionKind, type Feature, type HostAccount, HostCallFailedError, HostError, type HostErrorPayload, type HostLocalStorage, type HostStatementStore, type HostSubscription, HostUnavailableError, type NotificationManager, type PaymentManager, type PreimageManager, type ProductAccount, type ProductAccountLookup, type PushNotificationInput, type RegisteredRingVrfKey, type RemotePermissionItem, type ResultAsync, type RingVRFProof, type RingVrfKeyHandle, type RingVrfPublicKey, type StatementTopicFilter, type StatementsPage, type ThemeMode, type ThemeProvider, type TruApi, type VrfSignature, type VrfTranscriptItem, broadcastTransaction, createHostLocalStorage, createHostPreimageManager, createProofAuthorized, deriveEntropy, featureSupported, findRingVrfKeyHandle, formatHostError, fromHex, getAccountsProvider, getChainSpec, getChatManager, getHostLocalStorage, getHostProvider, getNotificationManager, getPaymentManager, getPreimageManager, getStatementStore, getThemeProvider, getTruApi, isChainSupported, isHostError, isInsideContainer, navigateTo, requestDevicePermission, requestPermission, requestResourceAllocation, stopTransaction, toHex };
