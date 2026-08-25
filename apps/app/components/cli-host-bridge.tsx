"use client";

import { useEffect, useState } from "react";
import {
  connectCliHost,
  type CliHostBridgeStatus,
} from "@parity/truapi-dev-host/browser";
import { ACTIVE_CHAIN } from "@/lib/types";
import { getSelfDotNs } from "@/lib/dotns";

/**
 * Dev-only bridge to a local `truapi-host` CLI — a real host on the desk
 * instead of the phone, so hosted-mode code paths run in a plain browser tab.
 *
 * The pipe itself lives in `@parity/truapi-dev-host/browser`; this component
 * only arms it and shows its local-dev configuration in a fixed overlay.
 * Don't start the host by hand — `yarn dev:host` starts it with the right
 * `--product-id` (which MUST be what lib/dotns.ts derives, or the host
 * refuses every signature) and injects NEXT_PUBLIC_TRUAPI_HOST_WS for us.
 *
 * Dev-only by construction: production builds run without the env var, so
 * the bridge disarms before touching anything.
 */
export function CliHostBridge() {
  const enabled =
    process.env.NODE_ENV === "development" &&
    Boolean(process.env.NEXT_PUBLIC_TRUAPI_HOST_WS);
  const [status, setStatus] = useState<CliHostBridgeStatus>("connecting");
  const [productId, setProductId] = useState("");

  useEffect(() => {
    setProductId(getSelfDotNs());
    if (process.env.NODE_ENV !== "development") return () => {};
    return connectCliHost({
      url: process.env.NEXT_PUBLIC_TRUAPI_HOST_WS,
      onStatus: setStatus,
    });
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
