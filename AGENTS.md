# Guidance for Coding Agents

Working notes for anyone driving this repo through a coding agent. Skim, don't memorize.

Host Playground is a Next.js app that exercises `@parity/product-sdk` inside the Host webview, validating behavior across product-sdk, Host, and the Polkadot App. See [README.md](README.md) for how to open it and [CONTRIBUTING.md](CONTRIBUTING.md) for documentation style.

## Repo layout

- `apps/app/` — the Next.js app, and the Next project root: `next.config.js`, `postcss.config.mjs`, `tsconfig.json`, and `public/` live here, and the static export lands in `apps/app/out`.
- `apps/app/lib/tests/` — the heart of the project: one file per category, each entry defining one host-API test with its `run` function, and the UI renders them as cards. `index.ts` collects them into `testsByCategory`; `shared.ts` holds the helpers every category leans on (host accessors, `success`/`error`, the SimpleStore read/write plumbing, `watchTx`).
- `apps/app/lib/types.ts` — shared types plus the `NETWORKS` network table (genesis hash, ws URL per network).
- `apps/app/lib/categories.ts` — per-category title, description, icon, and the sidebar grouping/order.
- `apps/worker/` — a service worker bundled separately with Vite (`apps/worker/vite.config.ts`) into `apps/app/out/worker`.
- `evm/` — Foundry project for the `SimpleStore` contract that the on-network tests call.
  - `evm/src/` — Solidity sources and interfaces.
  - `evm/scripts/` — TypeScript deploy scripts run with `bun`, plus their own `package.json`.
  - `evm/deployment.json` — the deployed `SimpleStore` address the app imports.
- `e2e/` — Playwright specs plus the `playwright.config.ts` that runs them.

## Build / test / lint

Run from the repo root with `yarn`:

```bash
yarn install --immutable
yarn dev                # next dev apps/app
yarn build              # next build apps/app + vite worker build
yarn typecheck          # tsc --noEmit for the repo root and apps/app
yarn lint               # next lint apps/app
yarn test               # vitest run
yarn test:e2e           # playwright
yarn format             # prettier --write
```

Verify with `yarn typecheck`, `yarn lint`, and the relevant tests before calling work complete.

## Contracts and deployment

`evm/` is a Foundry project. Build with `forge build` from `evm/`. Deploy scripts live in `evm/scripts` and run under `bun`, with commands defined in [evm/scripts/package.json](evm/scripts/package.json):

```bash
cd evm/scripts
npm run deploy:paseo-next-v2      # deploy SimpleStore to Paseo Next v2 Hub
npm run deploy:previewnet         # deploy SimpleStore to Previewnet Hub
```

Each command runs `forge build`, deploys via viem over the network eth-rpc, and rewrites `evm/deployment.json`. Set `PRIVATE_KEY` to a testnet deployer account funded on the target network. There is no default key. A deploy is a live, hard-to-reverse action, so confirm before running one.

## Codebase gotchas

- **`evm/deployment.json` is a single flat `{ "simpleStore": "0x…" }`.** [shared.ts](apps/app/lib/tests/shared.ts) imports it at module load, so the app targets one deployed address at a time. Deploying to a second network overwrites it.
- **`evm/` is excluded from the root TypeScript build** (see [tsconfig.json](tsconfig.json)); the deploy scripts typecheck against their own [evm/scripts/tsconfig.json](evm/scripts/tsconfig.json).
- **Two TypeScript projects.** The root [tsconfig.json](tsconfig.json) covers everything outside `apps/app`, and [apps/app/tsconfig.json](apps/app/tsconfig.json) covers the app, where `@/*` means `apps/app/*` and `@root/*` means the repo root. `yarn typecheck` runs both.
- **`bulletin-deploy.config.ts` has to keep that exact filename.** The CLI finds it by walking up from the build dir looking for `bulletin-deploy.config.{ts,js,mjs}` and there is no flag to point it elsewhere. Rename the file and the deploy still uploads the app, then silently skips the manifest publish.
- **The configs live with what they configure.** [apps/worker/vite.config.ts](apps/worker/vite.config.ts), [apps/app/vitest.config.ts](apps/app/vitest.config.ts), and [e2e/playwright.config.ts](e2e/playwright.config.ts) are all passed to their tool with `--config` from the root package scripts, so run them through `yarn` rather than calling the tools bare.
- **`.papi/descriptors/dist/` is generated.** Don't hand-edit it.
- **Network config lives in one place — `NETWORKS` in [types.ts](apps/app/lib/types.ts).** Keep the deploy scripts in sync with it rather than inventing new endpoints.

## Bash command construction (keep commands auto-approvable)

The permission engine matches each sub-command of a Bash call against the
allowlist by prefix, and prompts unless **every** sub-command matches. Defensive
scaffolding (`export`, `cd`, `echo`, variable expansion) is inherently
un-allowlistable and forces a prompt. Keep commands plain:

- One command per call. Don't bundle multiple statements with newlines/`&&`/`;`
  when separate tool calls work.
- No pipes into a second tool (`… | grep`, `… | jq`). The piped-to command is a
  separate sub-command needing its own allowlist rule; if it lacks one the whole
  call prompts. Get the raw output and filter it yourself, or use a single tool
  that does both (e.g. `git grep <ref>` instead of `git show <ref> | grep`).
- No redirections (`2>/dev/null`, `>out.txt`). Redirect operators are shell
  scaffolding, not prefix-matchable, so they force a prompt. Let stderr surface.
- No `cd` — use absolute paths (the shell already runs in the repo).
- No `export PATH=…` or other env-var scaffolding; tools are already on PATH.
- No `echo` banners around command output.
- Read files with the Read tool, not `cat`/`head`/`tail`.

## Where to look first for X

| You're looking for | Start here |
|---|---|
| A host-API test definition | [apps/app/lib/tests/](apps/app/lib/tests/), one file per category |
| Helpers shared by the tests | [apps/app/lib/tests/shared.ts](apps/app/lib/tests/shared.ts) |
| Network table (genesis, ws URL) | `NETWORKS` in [apps/app/lib/types.ts](apps/app/lib/types.ts) |
| The demo contract the tests call | [evm/src/SimpleStore.sol](evm/src/SimpleStore.sol) |
| Deployed contract address | [evm/deployment.json](evm/deployment.json) |
| Contract deploy scripts | [evm/scripts/deploy.ts](evm/scripts/deploy.ts), [evm/scripts/lib.ts](evm/scripts/lib.ts) |
| Service worker | [apps/worker/index.ts](apps/worker/index.ts), [apps/worker/vite.config.ts](apps/worker/vite.config.ts) |
| Bulletin deploy config | [bulletin-deploy.config.ts](bulletin-deploy.config.ts) |
| E2E specs and conventions | [e2e/](e2e/), [e2e/playwright.config.ts](e2e/playwright.config.ts), [CONTRIBUTING.md](CONTRIBUTING.md) |

## Documentation style

Documentation style, including the Given/When/Then E2E convention, lives in [CONTRIBUTING.md](CONTRIBUTING.md).
