# Local CLI host demo: handoff and package wishlist

This is the handoff for the local `truapi-host` integration in this playground.
It records the working demo path, the problems found while integrating it, and
the work a future `truapi-dev-host` npm package should own. Preserve the
distinction between a local launcher workaround and an upstream host or SDK
fix.

The original packaging request is
[host-rust-core#462](https://github.com/paritytech/host-rust-core/issues/462).

## Current state

The playground runs a real native `truapi-host signing-host` beside Next.js.
`yarn dev:host` starts the host, bridges browser frames over a local WebSocket,
waits for a real signer identity, preflights the product account, then starts
the app. The fixed overlay at the top right identifies the local CLI host,
network, and resolved product id.

The normal Paseo Next v2 demo works with an automatic signer or a supplied
testnet mnemonic. The Previewnet automatic-signer failure is fixed on
host-rust-core `main` since 2026-08-25 (the identity.dotspark migration
landed a JWT handshake superset of the local `preview-identity-auth` branch,
which is retired — PR #506 closed as superseded). A CLI installed from
current `main` provisions a fresh Previewnet signer end to end; `main` also
accepts the `.test` dotNS TLD now. Successor plan and live status:
[truapi-dev-host-plan.md](truapi-dev-host-plan.md).

## Demo runbook

Install the released CLI once for the ordinary flow:

```bash
cargo install --git https://github.com/paritytech/host-rust-core \
  --bin truapi-host --locked truapi-host-cli
```

Use `.env.local` for the demo configuration. It is loaded by `dev:host` and is
gitignored. Never put a mnemonic in argv or logs. `--auto-accept` means the
browser may approve any request as that identity, so use testnet keys only.

```bash
TRUAPI_HOST_LOG=debug
TRUAPI_HOST_PRODUCT_ID=play
TRUAPI_HOST_NETWORK=nextv2
# Optional. Leave unset to use a CLI-managed signer.
TRUAPI_HOST_MNEMONIC="..."
```

Run:

```bash
yarn dev:host --port 3001
```

For the locally fixed Preview CLI, build the adjacent checkout and point the
launcher at its binary without changing the globally installed one:

```bash
cargo build --manifest-path ../truapi/Cargo.toml -p truapi-host-cli --bin truapi-host
```

```bash
TRUAPI_HOST_NETWORK=preview
TRUAPI_HOST_PRODUCT_ID=play
TRUAPI_HOST_BIN=/Users/you/git/truapi/target/debug/truapi-host
```

`nextv2` and `preview` are launcher aliases for the CLI-native
`paseo-next-v2` and `previewnet` respectively. Native names remain accepted.

When the wrapper owns the host, `Ctrl-C` stops Next.js and sends the host
`SIGTERM`. Use `pkill -f truapi-host` only when an earlier host survived a
terminal crash or another terminal owns port 9955. If the wrapper attaches to
an existing host, that host and its logs remain in the terminal that started
it.

## Product identity and network rules

`TRUAPI_HOST_PRODUCT_ID` accepts a label or a qualified identifier. A label is
resolved before startup and the resolved value is passed to both the CLI and
the browser bundle. This is essential: a host only signs for the product it
serves.

| selected network | label `play` resolves to now | desired canonical name |
| --- | --- | --- |
| Paseo Next v2 | `play.paseo` | `play.paseo` |
| Previewnet | `play.dot` | `play.test` |
| production Polkadot | not supported by this test-only CLI | `play.dot` |

Previewnet uses `play.dot` only because the current CLI validates DotNS ids as
`.dot` or `localhost`; it rejects `play.test`. Do not represent `play.paseo.dot`
as a valid product id. The suffix must be selected by network, not appended to
an already qualified id.

There is a related SDK issue: `product-sdk-signer` versions 0.12.1 and 0.13.0
append `.dot` to every non-local dapp name. That produced the original
`signRaw` `PermissionDenied` when the host correctly served `play.paseo`. The
playground works around it for testnet namespaces by using the equivalent
product-account signer directly for the raw-message card. This is a bridge
workaround, not the desired SDK behavior.

`TRUAPI_HOST_NETWORK` also sets the browser genesis hash. Keep both sides under
one launcher knob. The Previewnet network was reset on 2026-08-19 and the
playground `NETWORKS` table still needs a repo-wide genesis refresh before that
browser chain path is considered reliable.

## What the launcher does

- `scripts/dev-host.mjs` maps friendly network names, resolves product labels,
  injects browser environment values, and starts Next.js only after preflight.
- `scripts/lib/host.mjs` supervises the CLI process and provides a Node-side
  TrUAPI client for preflight calls.
- `apps/app/components/cli-host-bridge.tsx` pipes binary SCALE frames between
  the browser `MessagePort` and the local CLI WebSocket.
- `apps/app/lib/host-operation-order.ts` buffers chainHead events until the
  response that names their operation id. Without it, papi can drop a raced
  event and silently hang during initialization.
- `apps/app/lib/tests/signing.ts` contains the raw-signing testnet workaround
  and treats the known Asset Hub capability refusal as an expected result.

The launcher waits for `account.getUserId()` to return a username. The CLI
line `Signing host ready` only proves that a signing runtime exists. It does
not prove the signer has a People-chain identity, especially for a supplied
mnemonic.

The first-run output should be compact and intentional. `[host]` is output
from the CLI. `[dev-host]` is launcher context. The repeated standalone
`ws://127.0.0.1:9955` line is suppressed after its first occurrence. Keep the
two prefixes: they explain which process emitted the line without duplicating
raw logs.

## Demo behavior and known limits

The intended card tour is:

1. **Get User Identity** returns the signer username.
2. **Sign Raw Message** returns a real signature and logs an automatic approval.
3. **Query Balance** reads real chain state through the host.
4. **Create Transaction on People Chain** produces a signed remark and logs an
   automatic approval.
5. **Create Transaction on Asset Hub** demonstrates a host-side capability
   refusal: pipeline version 0 does not declare `VerifyMultiSignature`.

The `preview` field returned from `createTransaction` is an encoded transaction
preview. It is response data, not a separate network or chain operation. Its
`length` is the encoded byte size.

The CLI line `playing as play.paseo/0` used to mean the derived product account
at derivation index 0. The launcher now prints the clearer product id and SS58
account instead.

Other limits:

- People and Asset Hub do not expose identical signing capabilities. Do not
  hide the Asset Hub `VerifyMultiSignature` refusal as a successful transfer.
- PGAS and contract allowances need a personhood ring member. A fresh headless
  signer is not automatically one.
- `@parity/truapi` well-known chains still name the pre-reset Next v2
  Individuality genesis (`0xc5af...` instead of live `0x89a63...`) in 0.9.0.
  This breaks `signMessageWithDotNsIdentity` outside the launcher workaround.

## Previewnet identity-backend diagnosis

The old Preview preset targeted `https://polkadot-app-stg.parity.io/api/v1`.
With no mnemonic, the CLI generated a signer then failed during username
registration with `401 Missing Authorization Header`. The correct Preview
deployment is `https://identity-previewnet.dotspark.app/api/v1`.

There is no static Authorization header to copy from another backend. The new
backend requires a short-lived JWT issued after the client proves control of an
sr25519 account:

1. `POST /auth/challenges` returns a base64 challenge.
2. Derive the signing host `uid.dot` account from its mnemonic entropy.
3. Sign `SHA256(challenge || clientId || SHA256(body))` using the Substrate
   sr25519 signing context, where `body` is `{}`.
4. `POST /auth/token` with base64 `Auth-ClientId`, `Auth-ClientProof`, and
   `Auth-Challenge` headers returns `{ token, refreshToken }`.
5. Send `Authorization: Bearer <token>` for `/usernames/available?version=v1`
   and `/usernames`.

The local `../truapi` branch `preview-identity-auth` implements this flow,
updates the Preview base URL, parses the new availability response shape, and
keeps the legacy unauthenticated Paseo backend unchanged. Verification there:
`cargo check -p truapi-host-cli` and 106 passing CLI tests, with one deliberate
live-chain test skipped. A strict clippy run is blocked by an existing unused
`truapi-server` method when warnings are denied.

Still unresolved: a mnemonic that has no registered Preview People identity
causes `getUserId` to remain unavailable. This is correct behavior for the
launcher, but the CLI should distinguish signing readiness from identity
readiness with a structured actionable state.

## Wishlist for `truapi-dev-host`

### Package and supervision

- `pnpm add -D truapi-dev-host` should deliver a version-pinned native binary
  and matching `@parity/truapi` wire client. Today wire skew presents as a
  misleading `MalformedFrame` naming a struct field.
- Start `signing-host --serve --auto-accept`, resolve after a real identity
  check, and terminate it with the parent process.
- Support attach mode, but explain the log location and product-id mismatch
  risk. Preflight an attached host with a throwaway signature. Skip that noisy
  approval for a host just spawned with known arguments.
- Stream stdout and stderr with clear source prefixes and pass
  `TRUAPI_HOST_LOG` through. Debug output often contains the actual refusal
  reason.
- Support a binary-path override like `TRUAPI_HOST_BIN` for local host work.

### Configuration and overlay

- Own one network configuration source for host preset, app genesis, RPC
  endpoints, identity backend, and canonical product namespace.
- Resolve a bare product label per network and inject the result into host and
  browser. Do not hardcode `.dot` as universal behavior.
- Replace the current status-only overlay with an explicit development overlay
  that can change network and product label. It should show the resolved
  product id, genesis hash, host endpoint, signer username, and derived product
  account, then restart or rebind the host and reload the app as one deliberate
  action. Never silently retain an old host binding on the same port.
- Treat mnemonic and session as mutually exclusive, never log either secret,
  and state that auto-accept is testnet-only.

### Browser and host upstream work

- Ship the WebSocket-to-`MessagePort` transport, or add a WebSocket transport
  to `@parity/truapi`; each product should not rebuild the same frame pump.
- Move the chainHead ordering guarantee into `@parity/product-sdk-host` or the
  host frame layer. The playground shim is a temporary compatibility layer.
- Teach the CLI DotNS validation and SDK signer fallback about network-specific
  suffixes such as `.paseo` and `.test`.
- Merge and release the Preview JWT identity-backend flow from
  `preview-identity-auth`, then cover it with a non-destructive integration
  test against the Preview deployment.
- Expose structured host readiness that separates process, signing, identity,
  and personhood-ring readiness.
- Address the Asset Hub `VerifyMultiSignature` capability declaration rather
  than relying on an expected-failure demo card.
