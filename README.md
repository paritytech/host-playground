# Host Playground

> [!WARNING]
> The following is a prototype, reference implementation, and proof-of-concept. This open source code is provided for research, experimentation, and developer education only. This code has not been audited, is actively experimental, and may contain bugs, vulnerabilities, or incomplete features. Use at your own risk.

Every TrUAPI, one click away.

Host Playground is code developed and published by Parity that puts a button
behind every host API that `@parity/product-sdk` exposes.

A host API is what a sandboxed Polkadot application calls to reach the wallet
around it. Signing, accounts, chain state, notifications, storage. Each one gets
a card here, so you can press it and read the real answer instead of writing a
throwaway app to find out.

## Access

#### Browser

| Network    | Link                               |
| ---------- | ---------------------------------- |
| Paseo      | https://host-playground.paseo.li   |
| Previewnet | https://host-playground.testnet.li |

These are instances Parity runs for its own testing. They carry no availability
commitment. Deploy your own copy for anything you depend on.

#### Polkadot Desktop and Mobile

Install the Polkadot app, then search for the domain.

| Network    | Domain                |
| ---------- | --------------------- |
| Paseo      | host-playground.paseo |
| Previewnet | host-playground.dot   |

## Development

Node 22 and Corepack, which pins yarn to the version in `packageManager`.

```bash
corepack enable
yarn install --immutable
yarn dev              # Previewnet, the default
yarn dev:paseo        # Paseo
```

The cards that write to a network need a funded account on that network. The
read-only cards work without one.

## Test

```bash
yarn typecheck
yarn lint
yarn test:e2e         # Playwright against a mock Host
```

The E2E suite drives the real cards through `@parity/host-api-test-sdk`, so it
runs without a Host of its own.

## Deployment

Deploy your own copy with `bulletin-deploy`, published on npm. It uploads the
static export and publishes the dotNS records that make it resolvable in a
Polkadot host.

```bash
yarn build
npm install -g bulletin-deploy
export MNEMONIC="$(cat ~/.config/host-playground/deploy-seed)"
bulletin-deploy --env paseo-next-v2 apps/app/out your-name.paseo
```

Read the seed from a file rather than typing it inline. An inline assignment
lands in shell history and is readable from the process environment.

[bulletin-deploy.config.ts](bulletin-deploy.config.ts) is the product manifest.
The `domain` there has to match the domain argument exactly, suffix included.

In this repository, pushing to `main` deploys to Previewnet and Paseo through
GitHub Actions, and every pull request gets its own preview domain posted back
as a comment.

## Security

> [!WARNING]
> The following is a prototype, reference implementation, and proof-of-concept. This open source code is provided for research, experimentation, and developer education only. This code has not been audited, is actively experimental, and may contain bugs, vulnerabilities, or incomplete features. Use at your own risk.

This repository has not received a security audit. Treat it as a reference for
how the host APIs behave, not as a hardened build to depend on.

Before deploying this for real use cases, you are responsible for:

- Reviewing the code yourself. We publish a reference, not a production build.
- Checking that the dependencies are current and free of known vulnerabilities.
- Securing your own fork or deployment environment, including keys, secrets, and
  network configuration.
- Tracking the latest commits for security fixes. Older releases are not
  backported.

For the Parity security disclosure process and Bug Bounty programme, see
https://parity.io/bug-bounty.

## Contribute

[CONTRIBUTING.md](CONTRIBUTING.md) covers documentation and test style.
[AGENTS.md](AGENTS.md) maps the repo, one line per directory, and lists the
gotchas worth knowing before a first change. New cards go in
[apps/app/lib/tests/](apps/app/lib/tests/), one file per category.

## License

Apache-2.0. See [LICENSE](LICENSE).

Copyright 2026 Parity Technologies.

## Happy Building! 💻💻
