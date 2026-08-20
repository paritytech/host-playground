# Host Playground

Every TrUAPI, one click away.

Host Playground is a product for developers that puts a button behind every host API that `@parity/product-sdk`
exposes.

## Access

#### Browser

| Network    | Link                               |
| ---------- | ---------------------------------- |
| Paseo      | https://host-playground.paseo.li   |
| Previewnet | https://host-playground.testnet.li |

#### Desktop

1. Download the Polkadot Desktop from https://polkadotbrowser.novasama-technologies.workers.dev/.
2. Install.
3. Search for the domain.

| Network    | Domain                |
| ---------- | --------------------- |
| Paseo      | host-playground.paseo |
| Previewnet | host-playground.dot   |

#### Mobile

1. Search for the domain.

| Network    | Domain                |
| ---------- | --------------------- |
| Paseo      | host-playground.paseo |
| Previewnet | host-playground.dot   |

## Development

```bash
yarn install --immutable
yarn dev              # Previewnet, the default
yarn dev:paseo        # Paseo
```

### Against a real signing host

`yarn dev` runs the playground with no host at all, and the E2E suite runs it
against a mock. The third mode is a real host on your desk: the `truapi-host`
CLI, so every card exercises a real signer without a phone or desktop build.

Install the CLI once (a Rust binary, not yet on npm —
[host-rust-core#462](https://github.com/paritytech/host-rust-core/issues/462)
tracks shipping it as a dev dependency):

```bash
cargo install --git https://github.com/paritytech/host-rust-core \
  --bin truapi-host --locked truapi-host-cli
```

Then one command starts both sides:

```bash
yarn dev:host                 # app on :3000, host frames on :9955
yarn dev:host --port 3001     # extra args go to next dev
```

How it works, in three pieces:

1. [`scripts/lib/host.mjs`](scripts/lib/host.mjs) spawns
   `truapi-host signing-host --serve --auto-accept`, resolving once the CLI
   prints its ready line. `--auto-accept` is required: a process without a
   terminal cannot prompt, so every confirmation is approved automatically and
   logged to this terminal instead.
2. [`scripts/dev-host.mjs`](scripts/dev-host.mjs) pre-flights the host (waits
   for the signer, resolves the product account, signs a throwaway payload to
   prove the product id matches), then starts `next dev` with
   `NEXT_PUBLIC_TRUAPI_HOST_WS` pointing at the host.
3. [`apps/app/components/cli-host-bridge.tsx`](apps/app/components/cli-host-bridge.tsx)
   runs in the browser tab: the CLI serves one binary WebSocket message per
   SCALE frame, and `@parity/truapi`'s bootstrap already accepts a
   `MessagePort` on `window.__HOST_API_PORT__`, so the bridge is a
   `MessageChannel` pumped into the socket. The SDK then behaves exactly as if
   the tab were a hosted webview.

The host only signs for the product id it serves, and the app derives its own
id from the URL (`localhost:<port>` in dev — see
[`apps/app/lib/dotns.ts`](apps/app/lib/dotns.ts)), so the script keeps the two
in lock-step, port changes included. To act as a deployed product instead,
override the id — the script then tells both sides at once:

```bash
TRUAPI_HOST_PRODUCT_ID=play.paseo yarn dev:host
```

The signer stays this machine's headless session, so the product account is
that product's account *as derived by this signer* — right for local testing,
not the account any real user holds. One caveat the pre-flight also prints:
`@parity/product-sdk` normalizes wallet names by appending `.dot`, so with a
non-`.dot` id the `app.wallet` cards ask the host for `<id>.dot` and get
refused, while every product-account card uses the id verbatim and works.
Prefer an id ending in `.dot` when you want full coverage. `TRUAPI_HOST_NETWORK` (`paseo-next-v2`,
the default, or `previewnet`) steers the host preset and the app's genesis
hash together — though previewnet was wiped on 2026-08-19 and this repo's
`NETWORKS` still carries the pre-wipe genesis, so that leg needs a repo-wide
refresh first. A host already listening on the port is attached to instead of
replaced, so you can run one in its own window to watch approvals
interactively. `TRUAPI_HOST_LOG=debug yarn dev:host` makes the host narrate
every dispatched request (`sign_raw`, `create_transaction`, chain connects)
and, crucially, why one failed.

Chain-routed cards need one repair on our side:
[`apps/app/lib/host-operation-order.ts`](apps/app/lib/host-operation-order.ts)
re-establishes the chainHead_v1 guarantee that an operation's response arrives
before its follow events — over the host bridge the two race, and when an
event wins, papi silently drops it and client initialization hangs forever.
With the shim, chain reads work end to end (`Query Balance` answers with real
on-chain state).

What still fails does so for real host reasons, visible in the debug log:
`Create Transaction` gets refused with "pipeline version 0 does not declare
VerifyMultiSignature" (the CLI host cannot yet authorize transactions for the
asset-hub pipeline — People-chain transactions are what it grew up signing),
and the contract cards need a PGAS allowance the host only grants to a
personhood ring member, which a fresh headless signer is not.

## Test

```bash
yarn typecheck
yarn lint
yarn test:e2e         # Playwright against a mock Host
```

The E2E suite drives the real cards through `@parity/host-api-test-sdk`, so it
runs without a Host of its own.

## Deployment

Pushing to `main` deploys to Previewnet and Paseo through GitHub Actions.

Every pull request gets its own preview domain, posted back as a comment on the
pull request.

## Contribute

[CONTRIBUTING.md](CONTRIBUTING.md) covers documentation and test style.
[AGENTS.md](AGENTS.md) maps the repo, one line per directory, and lists the
gotchas worth knowing before a first change. New cards go in
[apps/app/lib/tests/](apps/app/lib/tests/), one file per category.

## Happy Building! 💻💻
