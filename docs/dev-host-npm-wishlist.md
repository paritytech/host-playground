# What the `truapi-dev-host` npm package should cover

Running list, grown from building `yarn dev:host` here and in dim2-spa. The
ask itself is [host-rust-core#462](https://github.com/paritytech/host-rust-core/issues/462);
this file is what "wraps all of this up" has turned out to mean in practice,
so the package ships what every SPA otherwise rebuilds.

## Install

- `pnpm add -D truapi-dev-host` delivers the host binary — no Rust toolchain,
  no `cargo install --git`, no three-minute first build.
- The binary and the `@parity/truapi` wire version it speaks are pinned
  together in the lockfile. Skew today is invisible (`--version` is not even
  accepted) and fails as `MalformedFrame` naming random struct fields.

## Start and supervise

- Spawn `signing-host --serve --auto-accept`, resolve a promise on the ready
  line, kill on exit. `--auto-accept` is non-negotiable for a process with no
  terminal; the package should say so loudly.
- Attach mode: a host already on the port is used as-is — but the package must
  say whose logs go where and that the attached host may serve a different
  product id (both bit us).
- Stream host stdout/stderr with a prefix; pass `TRUAPI_HOST_LOG` through.
  `debug` is where the host explains *why* it refused something
  ("no ring includes our member key", "pipeline version 0 does not declare
  VerifyMultiSignature") — the difference between a demo and an afternoon.

## Pre-flight

- Wait for the signer with a real call (`getUserId` returning a username), not
  the ready line — attaching gives no ready line, and an open port is not
  readiness.
- Resolve and print the product account the app will play as.
- Sign a throwaway payload: `getAccount` succeeds for *any* product id, so only
  a signature proves the host serves ours. A refusal here, printed with the
  fix, saves the "every signature fails and nothing says why" session.

## Configuration (all proven necessary here)

| knob | why it exists |
| --- | --- |
| product id | Defaults derived from the app URL (`localhost:<port>`); an explicit override MUST reach both the host (`--product-id`) and the app (its `getSelfDotNs` equivalent) or every signature is refused. Caveat to surface: `@parity/product-sdk` normalizes wallet names by appending `.dot`, so non-`.dot` overrides split the wallet path from the product-account path. |
| network | One knob steering both the host preset and the app's genesis hash, so they cannot disagree. |
| mnemonic | Sign as a real identity instead of the auto-managed headless one, so real usernames show in demos. Env var / `.env.local` only — never argv (visible in `ps`), never logged. Mutually exclusive with a session — the CLI refuses `--session` next to a mnemonic, because the mnemonic is its own identity (the wrapper should drop the session and say so, not die). Testnets only while `--auto-accept` is on: the browser tab can sign anything as that identity. |
| session | Isolated signer sessions; two players on one machine is `SESSION=bob PORT=9956`. |
| ports | Frame WebSocket port and app port, independently. |

## Browser transport

- The missing pipe: the CLI serves one binary WebSocket message per SCALE
  frame; `@parity/truapi`'s bootstrap accepts a `MessagePort` on
  `window.__HOST_API_PORT__`. The pump between them is ~80 mechanical lines
  every product writes identically. Either ship it, or give `@parity/truapi` a
  WebSocket transport and delete the concept.

## The chainHead ordering shim (until fixed upstream)

- chainHead_v1 requires an operation's response (naming the `operationId`) to
  arrive before any operation event for that id. Over the bridge they race;
  when an event wins, papi drops it and client initialization hangs forever
  with no error. `apps/app/lib/host-operation-order.ts` is the fix — buffer
  events until the response naming their id has passed. Belongs in
  `@parity/product-sdk-host` (still absent in 0.16.0) or in the host's frame
  ordering; until then the package must carry it, because every papi-over-host
  product hits it as a silent hang.

## Known host gaps the package should NOT paper over (report, don't hide)

- createTransaction is refused for the asset-hub pipeline ("pipeline version 0
  does not declare VerifyMultiSignature"); People-chain pipelines work.
- PGAS/contract allowances need a personhood ring member; fresh headless
  signers are not one.
- `@parity/truapi`'s well-known-chains still name the pre-reset nextv2
  Individuality genesis (`0xc5af…` vs live `0x89a63b…`), which breaks
  `signMessageWithDotNsIdentity` from any product (still stale in 0.9.0).
