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

### Local signing host

`truapi-host dev` starts a signing host on loopback and then runs the dev server
with that host already live, so the cards work in a plain browser tab instead of
a Host webview:

```bash
cargo install --git https://github.com/paritytech/host-rust-core \
  --bin truapi-host --locked truapi-host-cli

truapi-host dev -- yarn dev:paseo
```

Open http://localhost:3000. In development the root layout loads the bridge
snippet the host serves at `http://127.0.0.1:9955/bootstrap.js`, which installs
the message port the SDK talks over. Confirmations are approved automatically,
so the host signs whatever a card asks for.

Host and app have to serve the same network, otherwise the chain cards report
`Host does not serve chain <genesis>`. `truapi-host dev` defaults to Paseo Next
v2, which is what `yarn dev:paseo` builds against.

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
