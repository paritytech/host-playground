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
in lock-step, port changes included. `TRUAPI_HOST_NETWORK` (`paseo-next-v2`,
the default, or `previewnet`) steers the host preset and the app's genesis
hash together. A host already listening on the port is attached to instead of
replaced, so you can run one in its own window to watch approvals
interactively.

Known gap: cards that talk to the host directly (accounts, raw signing,
statements, permissions) work end to end. Cards that open a papi client routed
through the host (`Query Balance`, `Create Transaction`, contracts) currently
stall until their 30s timeout: the CLI host answers every chainHead operation
on the wire, but `@parity/product-sdk-host`'s papi provider never finishes
client initialization against it. Under investigation; it reproduces the same
way from any product, so the fix belongs in the SDK or the CLI, not here.

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
