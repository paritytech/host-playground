"use client";

import { useEffect, useState } from "react";
import { isInsideContainer, isInsideContainerSync } from "@parity/product-sdk";

/**
 * Whether the app is running inside a Host webview, `null` until known.
 *
 * Answers with the synchronous heuristic first, then converges on the
 * SDK-backed answer. Detection runs in an effect rather than in the initial
 * state so the SSR and CSR first renders match.
 */
export function useInsideHost(): boolean | null {
  const [insideHost, setInsideHost] = useState<boolean | null>(null);

  useEffect(() => {
    setInsideHost(isInsideContainerSync());
    let cancelled = false;
    void isInsideContainer().then((inside) => {
      if (!cancelled) setInsideHost(inside);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return insideHost;
}
