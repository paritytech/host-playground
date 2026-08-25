// Starting and talking to a local `truapi-host signing-host`.
//
// Ported from dim2-spa's `apps/web/scripts/lib/host.mjs` — the shape of what
// paritytech/host-rust-core#462 asks to ship as an npm package. Two things
// live here: spawning a host on a known port, and a truapi client over its
// frame socket, so `dev-host.mjs` can pre-flight the host before Next starts.
import { spawn } from "node:child_process";
import { createConnection } from "node:net";
import { createClient, createTransport } from "@parity/truapi";

/** The line `--serve` prints once the signer exists and calls will be answered. */
const READY_LINE = "Signing host ready";

/**
 * The CLI is a Rust binary installed from the repo. It is not on crates.io, so
 * plain `cargo install truapi-host-cli` finds nothing, and `@parity/truapi-host`
 * on npm is a different thing (the WASM host runtime) that people reach for by
 * mistake. Spell out the command that works.
 */
const INSTALL_HELP = [
  "`truapi-host` is not on PATH. Install it with cargo, straight from the repo:",
  "",
  "    cargo install --git https://github.com/paritytech/host-rust-core \\",
  "      --bin truapi-host --locked truapi-host-cli",
  "",
  "It lands in Cargo's bin dir, so ~/.cargo/bin must be on PATH.",
  "Not on crates.io, and `npm i @parity/truapi-host` is a different package.",
].join("\n");

/** Resolve `promise`, or `undefined` if it takes longer than `ms`. */
export function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((r) => setTimeout(() => r(undefined), ms)),
  ]);
}

/** Await a truapi call, `undefined` if the transport threw. The client hands
 * back a neverthrow `ResultAsync`: awaitable, but not a Promise, so it has no
 * `.catch` of its own. */
export async function attempt(call) {
  try {
    return await call;
  } catch {
    return undefined;
  }
}

export function portIsOpen(port) {
  return new Promise((done) => {
    const socket = createConnection({ port, host: "127.0.0.1" });
    socket.once("connect", () => (socket.destroy(), done(true)));
    socket.once("error", () => (socket.destroy(), done(false)));
  });
}

/**
 * A truapi client over the CLI's frame socket — the node-side twin of
 * `apps/app/components/cli-host-bridge.tsx`. One binary WebSocket message per
 * SCALE frame, which is the wire both ends already speak, so this is a pipe
 * and nothing more.
 */
export function connectHost(wsUrl) {
  const ws = new WebSocket(wsUrl);
  ws.binaryType = "arraybuffer";
  const listeners = new Set();
  const closeListeners = new Set();
  const pending = [];
  let open = false;

  ws.addEventListener("open", () => {
    open = true;
    for (const frame of pending.splice(0)) ws.send(frame);
  });
  ws.addEventListener("message", (event) => {
    const bytes = new Uint8Array(event.data);
    for (const listener of listeners) listener(bytes);
  });
  ws.addEventListener("close", () => {
    for (const listener of closeListeners) listener(new Error("socket closed"));
  });

  const client = createClient(
    createTransport({
      postMessage: (frame) => (open ? ws.send(frame) : pending.push(frame)),
      subscribe: (cb) => (listeners.add(cb), () => listeners.delete(cb)),
      subscribeClose: (cb) => (
        closeListeners.add(cb), () => closeListeners.delete(cb)
      ),
      dispose: () => ws.close(),
    }),
  );
  return { client, close: () => ws.close() };
}

/**
 * Spawn a signing host and resolve once it is ready to answer calls.
 *
 * `--serve` is what makes this possible: without it the CLI draws a
 * full-screen transcript and refuses to start without a TTY, which no dev
 * server can give it. It logs one line at a time instead and stays up until
 * stopped, so this can supervise it. `--auto-accept` goes with it, because a
 * process with no terminal cannot prompt for confirmations.
 */
export function startHost({
  port,
  productId,
  network,
  session,
  mnemonic,
  binary = "truapi-host",
  log,
}) {
  const args = [
    "signing-host",
    "--serve",
    "--auto-accept",
    "--frame-listen",
    `127.0.0.1:${port}`,
    "--product-id",
    productId,
  ];
  if (network) args.push("--network", network);
  if (session) args.push("--session", session);

  // The mnemonic travels as the env var the CLI reads natively, never as an
  // argv (visible to every process via `ps`) and never into a log line.
  const env = mnemonic
    ? { ...process.env, HOST_CLI_SIGNER_MNEMONIC: mnemonic }
    : process.env;

  const child = spawn(binary, args, {
    stdio: ["ignore", "pipe", "pipe"],
    env,
  });
  const stop = () => child.kill("SIGTERM");
  const ws = `ws://127.0.0.1:${port}`;

  return new Promise((resolve, reject) => {
    let ready = false;
    let tail = "";
    let announcedFrameEndpoint = false;

    const onLine = (line) => {
      // The CLI colours its output; strip so the ready check is on the text.
      const clean = line.replace(/\x1b\[[0-9;]*m/g, "").trim();
      if (!clean) return;
      // `signing-host --serve` prints the frame endpoint after both its
      // "listening" and "serving" lifecycle messages. It is one endpoint, so
      // retain the first occurrence and keep the startup transcript compact.
      if (clean === ws) {
        if (announcedFrameEndpoint) return;
        announcedFrameEndpoint = true;
      }
      tail = `${tail}\n${clean}`.split("\n").slice(-12).join("\n");
      log?.(clean);
      if (!ready && clean.includes(READY_LINE)) {
        ready = true;
        resolve({ ws, stop, child });
      }
    };
    const pump = (stream) => {
      let buffer = "";
      stream.setEncoding("utf8");
      stream.on("data", (chunk) => {
        buffer += chunk;
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) onLine(line);
      });
    };
    pump(child.stdout);
    pump(child.stderr);

    child.once("error", (error) => {
      reject(
        error.code === "ENOENT" && binary === "truapi-host"
          ? new Error(INSTALL_HELP)
          : error,
      );
    });
    child.once("exit", (code) => {
      if (ready) return;
      reject(
        new Error(
          `truapi-host exited with ${code} before printing "${READY_LINE}".` +
            (tail ? `\n${tail}` : ""),
        ),
      );
    });
  });
}

/**
 * Use the host already on `port` if there is one, otherwise start our own.
 *
 * Attaching matters when you want to watch approvals or type `/session` in the
 * CLI's own window: start it there, and this stays out of the way.
 */
export async function ensureHost(options) {
  const ws = `ws://127.0.0.1:${options.port}`;
  if (await portIsOpen(options.port)) {
    options.log?.(
      `attaching to the host already on ${ws} — its [host] logs stay in the ` +
        `terminal that started it, and it may serve a different --product-id ` +
        `than this app derives. Stop it first to let this command own both.`,
    );
    return { ws, stop: () => {}, attached: true };
  }
  const started = await startHost(options);
  return { ...started, attached: false };
}
