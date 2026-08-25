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
yarn dev:host         # Paseo Next v2 behind a local CLI signing host
```

### Local CLI host

`yarn dev:host` runs the app against a real `truapi-host signing-host` on
this machine via [`@parity/truapi-dev-host`](https://github.com/paritytech/host-rust-core/issues/462),
so hosted-mode code paths (product account, signing, chain access) work in a
plain browser tab. The package is consumed as a `file:` dependency from a
sibling checkout of that repo's `feat/truapi-dev-host` branch until it is
merged and published — adjust the path in `package.json` if your checkout
lives elsewhere. It needs a `truapi-host` binary (`TRUAPI_HOST_BIN`, a cargo
build in the checkout, or one on PATH); configuration knobs live in
`.env.local` and are documented in the package README.

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
