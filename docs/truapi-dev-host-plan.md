# Plan: `@parity/truapi-dev-host`

Agreed plan for turning the local CLI host PoC (`feat/local-cli-host`) into a
distributable npm package, per
[host-rust-core#462](https://github.com/paritytech/host-rust-core/issues/462).
Companion to [dev-host-npm-wishlist.md](dev-host-npm-wishlist.md), which
records the findings this plan is built on.

## Locked decisions

1. **Scope: the de facto local development helper for truapi**, not just an
   installer. The package owns: bin + binary resolution chain, host
   supervision (spawn/attach, readiness, teardown), network presets and
   product-label resolution, and the browser bridge. It does **not** ship
   workarounds for upstream bugs.
2. **Location: `js/packages/truapi-dev-host` in `paritytech/truapi`** from day
   one. No separate repo. The core value is version pairing — the CLI binary
   and the `@parity/truapi` wire client release from the same commit, so the
   lockfile rules out SCALE wire skew.
3. **Publishing: only via `npm_publish_automation`**, same as every other
   package in that repo. No manual publishes, ever — this package spawns a
   binary that holds a mnemonic and auto-approves signatures; it must carry
   org-scope + provenance from its first version. Consequence: **no npm
   artifact exists until the truapi team merges the packaging PRs.** Interim
   consumers use the branch (`TRUAPI_HOST_BIN` + `npm pack` tarballs from CI).
   After merge, `dev-YYYYMMDD` dist-tag snapshots via a `dev-publish.yml`
   extension precede any stable release.
4. **Name: `@parity/truapi-dev-host`, bin `truapi-host`.** The adjacency to
   `@parity/truapi-host` (the WASM host runtime) is truthful — both are hosts;
   `dev-` marks the development one. Both READMEs cross-link. The bin
   shadowing of a cargo-installed global `truapi-host` is accepted: inside a
   project, the lockfile version wins.
5. **Upstream boundary: fixes land upstream, shims die in the playground.**
   - chainHead event-ordering guarantee → host frame layer (position to argue
     with the team; alternative is `@parity/product-sdk-host`, a different
     repo — avoid if possible).
   - DotNS network-suffix validation (`.paseo`, `.test`) → CLI.
   - Previewnet JWT identity-backend flow → CLI (branch
     `preview-identity-auth` joins the PR train).
   - WS↔MessagePort browser bridge → **`@parity/truapi-dev-host/browser`**,
     not `@parity/truapi`: production hosts embed truapi in-process and will
     never dial a WebSocket, so the transport is dev-tool-owned. If the remote
     signer materializes it can move down into `@parity/truapi` later with a
     re-export (non-breaking).
   - host-playground keeps its shims only until the fixed versions release,
     then deletes them. The published package never contains a shim.
6. **Binary distribution: per-platform packages via `optionalDependencies`**
   (the esbuild/Biome pattern): `@parity/truapi-dev-host-{darwin-arm64,
   darwin-x64,linux-x64,linux-arm64,win32-x64}`, each with `os`/`cpu` fields,
   pinned **exactly** (no ranges) from the main package. Script-free installs,
   lockfile-pinned binaries, npm provenance on every artifact. Windows is in
   the initial matrix (cheap in Rust CI, painful to retrofit); droppable if
   review pushes back.
   Binary resolution chain in the bin shim: explicit `TRUAPI_HOST_BIN` →
   installed platform package → `cargo build -p truapi-host-cli` fallback when
   a checkout/toolchain exists. The chain is what makes unpublished tarballs
   demoable.
7. **Remote signer (mordamax's comment on #462): out of v0, designed-for.**
   His picture — signing-cli paired to *real* web/desktop hosts via QR →
   deep link, DUB-attested lite-personhood, long-term one hosted signing-cli
   deployment per maintained truapi version — is complementary (host-side),
   not competing with the npm package (app-side). v0 keeps "where the host
   runs" an endpoint, not an assumption: the browser bridge takes a WS URL,
   attach mode means "I didn't spawn it". A future hosted signer is an attach
   target plus auth, not a redesign. Alignment happens publicly via a comment
   on #462 before the team conversation.

## PR train (branch in `../truapi`)

Sequenced so each PR is small and independently reviewable; the branch as a
whole is testable end-to-end from host-playground without any published
artifact.

- **PR1 — package skeleton.** `js/packages/truapi-dev-host`: package.json,
  bin shim + resolution chain, supervisor (port of
  `scripts/lib/host.mjs`), network presets + product-label resolution (port of
  the mapping in `scripts/dev-host.mjs`), `/browser` export (port of
  `cli-host-bridge.tsx`, de-React'd into a framework-agnostic module; the
  React component becomes a thin optional wrapper), README with the
  `truapi-host` cross-link and the auto-accept-is-testnet-only warning.
  No CI changes. CI uploads an `npm pack` tarball artifact for demos.
- **PR2 — binary pipeline.** Cross-compile matrix for the five targets,
  platform-package generation, `release.yml` extension (target regex, paths,
  atomic ordering: platform packages publish before the main package),
  changesets + `release-version-check` updates, `dev-publish.yml` extension
  for dev-host snapshots. The contentious PR; line-for-line comparable to
  esbuild/Biome's public setups.
- **PR3 — CLI fixes.** DotNS network-suffix rules; open
  `preview-identity-auth` as a PR (Previewnet JWT auth + base URL + response
  shape); structured readiness states (process / signing / identity /
  personhood) if cheap, else tracked as follow-up.
- **PR4 — chainHead ordering guarantee** in the host frame layer. Needs the
  design conversation first (frame layer vs product-sdk-host).

Version pairing mechanics: the main package declares the exact matching
`@parity/truapi` and releases from the same commit via one `release:` subject
listing both.

## host-playground follow-ups

- Point the playground at the branch tarballs (`TRUAPI_HOST_BIN` + tarball
  install); the diff that deletes `scripts/dev-host.mjs`,
  `scripts/lib/host.mjs`, and `cli-host-bridge.tsx` **is the demo** for the
  team pitch.
- Delete `host-operation-order.ts` and the `signing.ts` raw-signing
  workaround when the fixed host/SDK versions release.
- Still open regardless: `NETWORKS` genesis refresh after the 2026-08-19
  Previewnet reset; the `product-sdk-signer` `.dot`-appending fix lives in the
  product-sdk repo and is tracked separately.

## Risks / to verify

- Truapi team buy-in is a hard gate on distribution (accepted). Pitch =
  working PR1 + playground deletion diff, not an abstract proposal.
- Verify `npm_publish_automation` can publish six packages from one run and
  handle first-time package names (all visible flows publish pre-existing
  `@parity/*` names).
- Frame-layer vs product-sdk-host ownership of the ordering guarantee is a
  design conversation, not unilaterally decidable.
- linux-arm64 cross-compilation (ring/openssl-style build issues) is the
  likeliest matrix annoyance; `cross` or zig-cc if native runners misbehave.

## Status 2026-08-25

Everything above stands except where noted; the artifacts are live:

- **PR1 is up and pinned to the `@parity/truapi` 0.9 wire** (the major
  current `product-sdk-host` 0.16 pairs with):
  [host-rust-core#502](https://github.com/paritytech/host-rust-core/pull/502),
  draft. `js/packages/truapi-dev-host` on branch `feat/truapi-dev-host`;
  local worktree `../truapi/.worktrees/dev-host`, symlinked as
  `~/git/host-rust-core` so sibling-checkout `file:` paths resolve.
  Verification found and fixed a spawn recursion: `spawn("truapi-host")`
  under a package runner resolves to the package's own bin shim, so binary
  resolution scans PATH itself, skipping `node_modules/.bin`.
- **Consumers:**
  [host-playground#77](https://github.com/paritytech/host-playground/pull/77)
  (demo-only draft, still on the 0.7 pairing — needs a refresh) and
  [dim2-spa#137](https://github.com/paritytech/dim2-spa/pull/137)
  (**mergeable, CI green**: sdk-host 0.16 bump + chainHead ordering shim +
  the dev-host swap as a docs recipe; the launcher swap itself stays out of
  the tree until the package is published).
- **`preview-identity-auth` is dead.** host-rust-core main independently
  landed a superset (JWT handshake with token cache, identity.dotspark
  migration) and `f277f39c` accepted the `.test` dotNS TLD;
  [PR #506](https://github.com/paritytech/host-rust-core/pull/506) closed as
  superseded after verifying a current-main binary provisions a fresh
  Previewnet signer end to end. Two wishlist items (Preview JWT flow, `.test`
  suffix) are therefore already upstream.
- **The chainHead ordering race is now reproduced in two products**
  (playground and dim2 both hang without the app-side shim) — strengthens
  the case for the frame-layer fix, still to be filed/landed upstream.
- **Live E2E on Previewnet through the packaged launcher:** sudo-scheduled
  game #5 (dim2), funded `dim2.dot/0`, `Game.sign_up_with_account` signed by
  the CLI host landed on chain, game window through the reporting phase.
- **Gap found:** the launcher reads only `process.env` — no `.env.local`
  loading yet (the playground's old script had it). Candidate for PR1 review
  feedback or a fast follow.
- **Next:** team conversation with #502 as the pitch → PR2 (binary matrix +
  release wiring) → consumers drop their `file:` recipes for a versioned
  devDependency.
