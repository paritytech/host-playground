---
name: product-sdk-bump
description: Use when checking whether @parity/product-sdk has a newer version, bumping it, or figuring out which host APIs changed between versions in this repo (host-playground). Diffs the published .d.ts API surface between the installed and target versions, lists breaking changes and the call sites they hit, then migrates and verifies. Triggers on "see if product-sdk has a new version", "bump product-sdk", "which host APIs changed", "migrate to product-sdk X".
---

# product-sdk bump

host-playground exists to exercise `@parity/product-sdk` across versions, so
"is there a new version and what changed?" recurs constantly. This skill is the
runbook. It is package-diff driven — never guess the API from memory; extract it
from the published `.d.ts` and grep the repo for the call sites.

The umbrella `@parity/product-sdk` re-exports sub-packages (`-host`, `-signer`,
`-chain-client`, `-cloud-storage`, `-address`, …) and bundles `@parity/truapi`.
**Breaking changes usually live in a sub-package (esp. `-host`) or in truapi's
wire schema, not in the umbrella's own exports** — so diff the sub-package, not
just the umbrella index.

## 1. Check versions

```
npm view @parity/product-sdk version
npm view @parity/product-sdk-descriptors version
```

The umbrella pins its sub-packages; find the resolved host + truapi versions:

```
node -e "console.log(require('@parity/product-sdk-host/package.json').version)"   # may be blocked by exports; fall back to the file:
grep '\"version\"' node_modules/@parity/product-sdk-host/package.json
grep '\"version\"' node_modules/@parity/truapi/package.json
npm view @parity/product-sdk@<target> dependencies.@parity/product-sdk-host
```

Note the caret trap: `^0.x` does **not** cross a minor (`^0.18.0` stays `0.18.x`,
won't take `0.19`). To pin exactly, write the bare version (`0.19.0`).

## 2. Diff the API surface (installed ↔ target)

Pull both tarballs and diff the exported `.d.ts` — this is the reliable way to
see breaking changes:

```
cd /tmp && rm -rf sdkdiff && mkdir -p sdkdiff/old sdkdiff/new
curl -sL "$(npm view @parity/product-sdk-host@<old> dist.tarball)" | tar -xz -C sdkdiff/old --strip-components=1
curl -sL "$(npm view @parity/product-sdk-host@<new> dist.tarball)" | tar -xz -C sdkdiff/new --strip-components=1
# normalize chunk-hash filenames, then diff the export lists
diff <(grep -hoE 'export .*' sdkdiff/old/dist/index.d.ts | sort -u) \
     <(grep -hoE 'export .*' sdkdiff/new/dist/index.d.ts | sort -u)
```

For signature-level changes, diff the whole `index.d.ts` (normalize the
`types-<hash>.js` / `chunk-<hash>.js` names first so they don't show as noise).
Also diff `@parity/product-sdk-descriptors` for added/removed chains, and
`@parity/truapi/dist/generated/types.d.ts` for wire-schema changes.

## 3. Report breaking changes + call sites

For each breaking change, grep the repo for the affected call sites:

```
grep -rn "<changed-symbol>" src/ worker/
```

The heart of the app is [src/lib/tests.ts](src/lib/tests.ts) (one entry per host-API
test card). Historical breaking changes to expect:

- **0.18** — host methods became `Result<T, HostError>` (unwrap `.ok`/`.value`);
  error unions moved to `.tag`; `createProof(accountId, statement)` →
  `createProofAuthorized(statement)`; chat `sendMessage` takes `{ text }`.
- **0.19** — `AccountsProvider` errors became `scale.CallErrorValue<Versioned…>`
  (framework envelope; real variant nests under `.value.value`);
  `getProductAccountAlias(dotNsId)` → `(context: ProductProofContext, location: RingLocation)`;
  `createRingVRFProof(dotNsId, derivIdx, location, message)` → `(context, location, message)`
  returning the rich `RingVRFProof` (`{proof, contextualAlias, ringIndex, ringRevision}`);
  descriptors dropped the `summit-*` chains.
- **0.20**: RFC-0022 turned `DerivationIndex` into a tagged selector,
  `{tag:"Left", value:number}` for a plain index or `{tag:"Right", value:HexString}`
  for raw 32 bytes. Hosts expand `Left(n)` to `index_bytes(n)`, so `Left` is the form
  products use. It reaches every wire field that picks an account inside a product
  subtree: `ProductAccountId.derivationIndex`, `ProductProofContext.suffix`,
  `AllocatableResource::SmartContractAllowance`, `PaymentTopUpSource::ProductAccount`.
  RFC-0004 packed suffixes are obsolete, so a `"0x00"`-style suffix becomes `Left(0)`.
  RFC-0023 adds `account.signVrf`.

## 4. Bump, install, migrate, verify

1. Edit `package.json` (`@parity/product-sdk` + `-descriptors`).
2. `yarn install`.
3. Migrate the call sites found in step 3.
4. Verify: `yarn typecheck` → `yarn lint` → `yarn test` (all must pass before done).

## Gotchas (learned the hard way)

- **A local copy of an SDK type hides call sites.** Before counting the sites a changed
  type breaks, grep for a local re-declaration of it. In the 0.20 bump a hand-written
  `AllocatableResource` in [tests.ts](src/lib/tests.ts) declared `value: number` and
  swallowed two of the six sites, so `typecheck` reported four. Deleting the duplicate
  and importing the type from `@parity/product-sdk-host` surfaced the rest. Fix the
  duplicate first, then count.
- **Descriptor regen.** After changing the contract ABI, regenerate the papi
  descriptor: refresh `.papi/contracts/*.json` from the forge artifact, then
  `npx papi generate` (needs `esbuild` — `yarn add -D esbuild` if missing), then
  `yarn install --check-files` to re-sync the `file:.papi/descriptors` dep into
  `node_modules` (a plain `yarn install` won't copy it).
- **truapi and host version skew.** The SDK wire schema can run *ahead* of the
  shipped host. The 0.19 `createAccountProof` response is a `V1`-versioned struct.
  Desktop hosts on an older `@novasamatech/host-api` frame it without the `V1`
  envelope, so `decodeResponse` inside truapi throws
  `RangeError: Offset is outside the bounds of the DataView`. This is not an app
  bug. It is also not fixable by pinning back to 0.18, which sends the old request
  shape the new host rejects. It needs a host aligned to the SDK truapi version.
- **Ring-VRF / personhood is host+network dependent.** `createRingVRFProof`
  delegates to the host (it selects the member key); the member key is derived
  from the user's private seed, so the app can't build it. Errors surface as the
  host `CreateProofErr` (`RingNotFound` = no ring on the requested chain).
- **Stale testnet genesis.** Testnets reset; the hardcoded genesis hashes in
  `CHAINS` ([src/lib/types.ts](src/lib/types.ts)) go stale (Previewnet did). If the
  host reports "does not serve chain 0x…", verify against the live RPC before
  assuming a host problem:
  `curl -s -H 'Content-Type: application/json' -d '{"jsonrpc":"2.0","id":1,"method":"chain_getBlockHash","params":[0]}' <https-rpc>`.
