// One command for "run the playground as if it were inside the mobile host".
//
// Starts a local `truapi-host signing-host` (paritytech/host-rust-core,
// rust/crates/truapi-host-cli) and runs `next dev` against it, so a plain
// browser tab takes every hosted code path: real product account, real
// signing, real statement store, real permissions. The browser side of the
// pipe is `apps/app/components/cli-host-bridge.tsx`.
//
//   yarn dev:host                 # app on :3000, host frames on :9955
//   yarn dev:host --port 3001     # extra args go to next dev
//
// Knobs, all optional:
//   TRUAPI_HOST_PORT        frame WebSocket port       (default 9955)
//   TRUAPI_HOST_PRODUCT_ID  product id to act as       (default localhost:<app port>)
//   TRUAPI_HOST_NETWORK     paseo-next-v2 | previewnet (default paseo-next-v2)
//   TRUAPI_HOST_SESSION     signer session name        (default the CLI's)
//   TRUAPI_HOST_MNEMONIC    BIP-39 wallet root — sign as YOUR identity instead
//                           of the auto-managed headless one, so your real
//                           username shows up. Bypasses account auto-management
//                           (the CLI's HOST_CLI_SIGNER_MNEMONIC works too).
//                           Remember: --auto-accept means the browser tab can
//                           sign anything as that identity. Testnets only.
//
// The network and product-id knobs each steer BOTH sides, so they cannot
// disagree: the host gets `--network` / `--product-id`, the app gets the
// matching NEXT_PUBLIC_NETWORK_GENESIS_HASH / NEXT_PUBLIC_SELF_DOTNS.
//
// The product id defaults to `localhost:<port>` because that is what the app
// derives for itself in dev (lib/dotns.ts) — and the host refuses to *sign*
// for any product id other than the one it serves, so the two must match.
// Override it to act as a deployed product from localhost:
//
//   TRUAPI_HOST_PRODUCT_ID=dim2.paseo yarn dev:host
//
// The signer is still this machine's headless session, so the product account
// is dim2.paseo *as derived by this signer* — right for local testing, and not
// the account any real user has on their phone.
//
// A host already listening on the port is used as-is, so you can still run one
// in its own window when you want to watch approvals or type `/session`. First
// start provisions a lite username through the identity backend and registers
// the statement-store allowance on-chain, which can take minutes.
import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { AccountId } from "polkadot-api";
// Keep this dependency on the same major as the `@parity/truapi` that
// `@parity/product-sdk-host` pulls in (check its `dependencies`). This script
// talks to the host with its *own* client, so a skew here makes the pre-flight
// disagree with the browser: pre-0.6 predates RFC-0022 and encodes
// `derivation_index` as a bare `u32`, so every `getAccount` fails
// `MalformedFrame` against a current host while the app itself is fine.
import { attempt, connectHost, ensureHost, withTimeout } from "./lib/host.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** `yarn dev:host -- --port 3001` leaves the separator in argv; strip it. */
const nextArgs = process.argv.slice(2).filter((arg) => arg !== "--");

/** The port `next dev` will bind — the product id has to name it. */
function appPort(args) {
  const flag = args.findIndex((a) => a === "--port" || a === "-p");
  if (flag !== -1 && args[flag + 1]) return Number(args[flag + 1]);
  return Number(process.env.PORT ?? 3000);
}

const NETWORKS = {
  "paseo-next-v2":
    "0x23e730eb1c6fecae09c917439a5038cb6122d0d48980e8b9bbf0ff56f94a2ca6",
  previewnet:
    "0x4d11c803cc6921429e3876638977ad006ea1bba8cd3976a0bca2f164e7026210",
};

const PORT = Number(process.env.TRUAPI_HOST_PORT ?? 9955);
const NETWORK = process.env.TRUAPI_HOST_NETWORK ?? "paseo-next-v2";
const SESSION = process.env.TRUAPI_HOST_SESSION;
const MNEMONIC = process.env.TRUAPI_HOST_MNEMONIC;
/** Explicit override: the app is told to act as this id too (see below). The
 * localhost default needs no telling — the app derives it from the URL. */
const PRODUCT_ID_OVERRIDE = process.env.TRUAPI_HOST_PRODUCT_ID;
const PRODUCT_ID = PRODUCT_ID_OVERRIDE ?? `localhost:${appPort(nextArgs)}`;

const genesis = NETWORKS[NETWORK];
if (!genesis) {
  console.error(
    `unknown TRUAPI_HOST_NETWORK "${NETWORK}" — one of: ${Object.keys(NETWORKS).join(", ")}`,
  );
  process.exit(1);
}

const log = (message) => console.log(`[dev-host] ${message}`);

/**
 * Block until the host answers a real call. `--serve` prints its ready line
 * once the signer exists, but attaching to someone else's host gives us no
 * such signal, and an open port is not readiness — `getUserId` returning a
 * username is.
 */
async function waitForSigner(ws) {
  let told = false;
  for (;;) {
    const { client, close } = connectHost(ws);
    const result = await withTimeout(
      attempt(client.account.getUserId()),
      10_000,
    );
    close();
    if (result?.isOk()) return result.value.primaryUsername;
    if (!told) {
      log("host is up, waiting for its signer (first run provisions on-chain)");
      told = true;
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
}

/**
 * Report the account the app will play as, and check that this host is really
 * serving `PRODUCT_ID`. `getAccount` succeeds for *any* product (a foreign one
 * only costs a consent prompt), so only signing separates "this host is ours"
 * from "this host serves something else and will refuse every signature later".
 */
async function reportProductAccount(ws) {
  const { client, close } = connectHost(ws);
  const account = {
    dotNsIdentifier: PRODUCT_ID,
    derivationIndex: { tag: "Left", value: 0 },
  };
  try {
    const got = await client.account.getAccount({ productAccountId: account });
    if (got.isErr()) {
      log(
        `product account unavailable: ${JSON.stringify(got.error)}. A MalformedFrame naming ` +
          "`ProductAccountId::derivation_index` is a wire-version mismatch on RFC-0022 " +
          "product accounts: this script's own `@parity/truapi` must stay on the major " +
          "`@parity/product-sdk-host` depends on. It says nothing about the browser app, " +
          "which uses the sdk-host client, not this one.",
      );
      return;
    }
    log(
      `playing as ${PRODUCT_ID}/0 = ${AccountId(0).dec(got.value.account.publicKey)}`,
    );

    // Signs 0xdeadbeef and throws the signature away. On a host without
    // --auto-accept this raises a confirmation, so never block on it.
    const signed = await withTimeout(
      attempt(
        client.signing.signRaw({
          account,
          payload: { tag: "Bytes", value: { bytes: "0xdeadbeef" } },
        }),
      ),
      5000,
    );
    if (signed === undefined) {
      log("signing probe still pending — approve it in the host transcript");
    } else if (signed.isErr()) {
      log(
        `WARNING: this host refuses to sign for ${PRODUCT_ID}, so it is serving a ` +
          `different product id. Restart it with --product-id ${PRODUCT_ID}.`,
      );
    }
  } finally {
    close();
  }
}

if (PRODUCT_ID_OVERRIDE && !PRODUCT_ID_OVERRIDE.endsWith(".dot")) {
  log(
    `NOTE: @parity/product-sdk normalizes wallet names by appending ".dot", so ` +
      `the app.wallet path will ask for "${PRODUCT_ID_OVERRIDE}.dot" and be ` +
      `refused, while product-account cards use "${PRODUCT_ID_OVERRIDE}" as-is ` +
      `and work. Prefer an id ending in .dot for full coverage.`,
  );
}

// A mnemonic IS the identity — the CLI refuses --session next to it.
if (MNEMONIC && SESSION) {
  log(
    `TRUAPI_HOST_SESSION="${SESSION}" is ignored: a mnemonic carries its own ` +
      "identity, and the CLI refuses --session alongside it.",
  );
}

const host = await ensureHost({
  port: PORT,
  productId: PRODUCT_ID,
  network: NETWORK,
  session: MNEMONIC ? undefined : SESSION,
  mnemonic: MNEMONIC,
  log: (line) => console.log(`[host] ${line}`),
});
if (MNEMONIC && host.attached) {
  log(
    "TRUAPI_HOST_MNEMONIC is set but an already-running host was attached — " +
      "it keeps whatever identity it started with. Stop it to sign as yours.",
  );
}
if (!host.attached) log(`started a host on ${host.ws}`);

const username = await waitForSigner(host.ws);
log(`signer ready: ${username}`);
await reportProductAccount(host.ws);

const next = spawn("yarn", ["next", "dev", "apps/app", ...nextArgs], {
  cwd: repoRoot,
  stdio: "inherit",
  env: {
    ...process.env,
    NEXT_PUBLIC_TRUAPI_HOST_WS: host.ws,
    NEXT_PUBLIC_NETWORK_GENESIS_HASH: genesis,
    // Only on explicit override — the localhost default is what the app
    // derives from its URL anyway, and deriving beats duplicating.
    ...(PRODUCT_ID_OVERRIDE
      ? { NEXT_PUBLIC_SELF_DOTNS: PRODUCT_ID_OVERRIDE }
      : {}),
  },
});

// The host is ours to clean up when we started it; an attached one keeps running.
const shutdown = () => host.stop();
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
next.on("exit", (code) => {
  shutdown();
  process.exit(code ?? 0);
});
