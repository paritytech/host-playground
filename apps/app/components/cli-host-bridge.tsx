"use client";

import { useEffect, useState } from "react";
import { ACTIVE_CHAIN } from "@/lib/types";
import { getSelfDotNs } from "@/lib/dotns";

/**
 * Dev-only bridge to a local `truapi-host` CLI (paritytech/host-rust-core,
 * `rust/crates/truapi-host-cli`) — a real host on the desk instead of the
 * phone, so hosted-mode code paths run in a plain browser tab.
 *
 * The CLI serves product frames as "one binary WebSocket message per SCALE
 * protocol frame". `@parity/truapi`'s sandbox bootstrap speaks exactly that
 * frame format, but only over two browser transports: the iframe `truapi-init`
 * handover, and a `MessagePort` parked on `window.__HOST_API_PORT__`. It has
 * no WebSocket transport — so we supply the missing pipe: a `MessageChannel`
 * whose far end we pump into the CLI's socket. The SDK then detects a
 * container and talks to the CLI without knowing anything changed
 * (`isCorrectEnvironment` returns true as soon as `__HOST_API_PORT__` is set,
 * and it polls for up to 20s, so connecting from an effect is fine).
 *
 * This is the browser half of what paritytech/host-rust-core#462 asks to ship
 * as an npm package; `scripts/dev-host.mjs` is the node half. Don't start the
 * host by hand — `yarn dev:host` starts it with the right `--product-id`
 * (which MUST be what lib/dotns.ts derives, `localhost:<port>` in dev, or the
 * host refuses every signature) and sets NEXT_PUBLIC_TRUAPI_HOST_WS for us.
 *
 * Dev-only by construction: production builds run without the env var, so
 * `connect` returns before touching anything.
 */

declare global {
  interface Window {
    /** MessagePort the truapi sandbox adopts as its host transport */
    __HOST_API_PORT__?: MessagePort;
  }
}

type ConnectionStatus = "connecting" | "connected" | "disconnected";

function connect(onStatus: (status: ConnectionStatus) => void): () => void {
  if (process.env.NODE_ENV !== "development") return () => {};
  const url = process.env.NEXT_PUBLIC_TRUAPI_HOST_WS;
  if (!url) return () => {};
  if (window.__HOST_API_PORT__) {
    onStatus("connected");
    return () => {};
  }

  onStatus("connecting");
  const ws = new WebSocket(url);
  ws.binaryType = "arraybuffer";
  const { port1, port2 } = new MessageChannel();
  // Frames the app produces before the socket is open. The SDK queues nothing
  // on its side once it has a port, so the queue has to live here.
  const pending: Uint8Array[] = [];

  port2.onmessage = (event: MessageEvent<Uint8Array>) => {
    if (ws.readyState === WebSocket.OPEN) ws.send(event.data);
    else pending.push(event.data);
  };
  port2.start();

  ws.onopen = () => {
    onStatus("connected");
    console.info(`[cli-host] connected to ${url}`);
    for (const frame of pending.splice(0)) ws.send(frame);
  };
  // The SDK's provider only accepts `Uint8Array`, never a bare ArrayBuffer.
  ws.onmessage = (event: MessageEvent<ArrayBuffer>) => {
    port2.postMessage(new Uint8Array(event.data));
  };
  ws.onclose = () => {
    onStatus("disconnected");
    // Nothing to signal down a MessagePort — every pending host call just
    // stops resolving, which looks like a hung app. Say so loudly instead.
    console.warn(
      `[cli-host] socket to ${url} closed — reload after restarting the host`,
    );
  };
  ws.onerror = () => {
    onStatus("disconnected");
    console.error(
      `[cli-host] cannot reach ${url} — is \`truapi-host\` running?`,
    );
  };

  window.__HOST_API_PORT__ = port1;
  console.info(`[cli-host] host bridge armed for ${url}`);
  // Keep the singleton socket alive across React development-mode effect
  // replays. The SDK owns the MessagePort for the page lifetime.
  return () => {};
}

/** Arms the bridge and exposes its local-dev configuration in a fixed overlay. */
export function CliHostBridge() {
  const enabled =
    process.env.NODE_ENV === "development" &&
    Boolean(process.env.NEXT_PUBLIC_TRUAPI_HOST_WS);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [productId, setProductId] = useState("");

  useEffect(() => {
    setProductId(getSelfDotNs());
    return connect(setStatus);
  }, []);

  if (!enabled) return null;

  const statusLabel =
    status === "connected"
      ? "Connected"
      : status === "connecting"
        ? "Connecting"
        : "Disconnected";
  const statusColor =
    status === "connected"
      ? "bg-emerald-500"
      : status === "connecting"
        ? "bg-amber-500"
        : "bg-destructive";

  return (
    <aside
      aria-label="Local CLI host status"
      className="fixed right-3 top-[calc(env(safe-area-inset-top)+0.75rem)] z-50 max-w-[calc(100vw-1.5rem)] rounded-lg border border-border bg-background/95 px-3 py-2 text-xs shadow-lg backdrop-blur"
    >
      <div className="flex items-center gap-2 font-medium text-foreground">
        <span className={`size-2 rounded-full ${statusColor}`} />
        Local CLI host · {statusLabel}
      </div>
      <div className="mt-1 truncate text-muted-foreground">
        {ACTIVE_CHAIN.name} · {productId || "Resolving product…"}
      </div>
    </aside>
  );
}
