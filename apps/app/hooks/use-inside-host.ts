"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { isInsideContainer, isInsideContainerSync } from "@parity/product-sdk";

const noSubscription = () => () => {};

/**
 * Whether the app is running inside a Host webview, `null` until known.
 *
 * Answers with the synchronous heuristic first, then converges on the
 * SDK-backed answer. The heuristic's server snapshot is `null`, so the SSR and
 * CSR first renders match.
 */
export function useInsideHost(): boolean | null {
  const heuristic = useSyncExternalStore(
    noSubscription,
    isInsideContainerSync,
    () => null,
  );
  const [confirmed, setConfirmed] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    void isInsideContainer().then((inside) => {
      if (!cancelled) setConfirmed(inside);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return confirmed ?? heuristic;
}
