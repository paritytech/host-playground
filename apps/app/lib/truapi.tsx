"use client";

/**
 * Harness that drives `@use-truapi/react` hooks from a plain test `run` function.
 *
 * Every probe renders under one shared `TruapiProvider`, so hooks share the
 * runtime and the query cache the way components of a real app would.
 */
import { previewnet_asset_hub } from "@parity/product-sdk-descriptors/previewnet-asset-hub";
import { paseo_asset_hub } from "@parity/product-sdk-descriptors/paseo-asset-hub";
import type { QueryClient } from "@tanstack/react-query";
import {
  TruapiProvider,
  createRuntime,
  createTruapiQueryClient,
  defineConfig,
  type TruapiRuntime,
} from "@use-truapi/react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { getSelfDotNs } from "@/lib/dotns";
import { ACTIVE_CHAIN, ACTIVE_CHAIN_ID } from "@/lib/types";

const ASSET_HUB_DESCRIPTOR = {
  PASEO_ASSETHUBNEXTV2: paseo_asset_hub,
  PREVIEWNET_ASSETHUB: previewnet_asset_hub,
}[ACTIVE_CHAIN_ID];

function truapiConfig() {
  return defineConfig({
    chains: {
      assetHub: {
        descriptor: ASSET_HUB_DESCRIPTOR,
        hostChain: "AssetHub",
        genesisHash: ACTIVE_CHAIN.genesis,
        wsUrls: [ACTIVE_CHAIN.wsUrl],
      },
    },
    dappName: "host-playground",
    // Pin the product id the rest of the playground signs under. The host
    // product-account gate then sees the same identifier on both paths.
    productAccount: { dotNsIdentifier: getSelfDotNs() },
  });
}

// One runtime and query cache for the page, built on first use. The runtime
// owns the SignerManager, and destroying that is terminal.
let shared: {
  runtime: TruapiRuntime<ReturnType<typeof truapiConfig>["chains"]>;
  queryClient: QueryClient;
} | null = null;

function sharedRuntime() {
  shared ??= {
    runtime: createRuntime(truapiConfig()),
    queryClient: createTruapiQueryClient(),
  };
  return shared;
}

export interface MountedHook<T> {
  /** Hook value from the latest render. */
  current: () => T;
  /** Resolves with the first value `pick` returns that is not undefined, checked on every render. */
  waitFor: <R>(pick: (value: T) => R | undefined, timeoutMs?: number) => Promise<R>;
  unmount: () => void;
}

/**
 * Renders `useHook` in a detached React root under the shared `TruapiProvider`.
 *
 * A test `run` function can then drive a real hook the way a component would,
 * and read its value as renders arrive.
 */
export function mountHook<T>(useHook: () => T): MountedHook<T> {
  const { runtime, queryClient } = sharedRuntime();
  let latest: { value: T } | null = null;
  const listeners = new Set<() => void>();

  function Probe() {
    latest = { value: useHook() };
    // Notify after commit, not mid-render.
    queueMicrotask(() => listeners.forEach((listener) => listener()));
    return null;
  }

  const root = createRoot(document.createElement("div"));
  flushSync(() =>
    root.render(
      <TruapiProvider runtime={runtime} queryClient={queryClient}>
        <Probe />
      </TruapiProvider>,
    ),
  );

  return {
    current() {
      if (!latest) throw new Error("hook has not rendered yet");
      return latest.value;
    },
    waitFor(pick, timeoutMs = 20_000) {
      return new Promise((resolve, reject) => {
        const check = () => {
          if (!latest) return;
          let picked;
          try {
            picked = pick(latest.value);
          } catch (e) {
            done();
            reject(e);
            return;
          }
          if (picked === undefined) return;
          done();
          resolve(picked);
        };
        const timer = setTimeout(() => {
          done();
          reject(new Error(`hook did not settle within ${timeoutMs}ms`));
        }, timeoutMs);
        const done = () => {
          clearTimeout(timer);
          listeners.delete(check);
        };
        listeners.add(check);
        check();
      });
    },
    unmount() {
      listeners.clear();
      root.unmount();
    },
  };
}

/** Mounts `useHook`, hands it to `body`, and always unmounts afterwards. */
export async function withHook<T, R>(
  useHook: () => T,
  body: (hook: MountedHook<T>) => Promise<R>,
): Promise<R> {
  const hook = mountHook(useHook);
  try {
    return await body(hook);
  } finally {
    hook.unmount();
  }
}
