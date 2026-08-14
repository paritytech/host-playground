import { createApp, type App } from "@parity/product-sdk";
import { getSelfDotNs } from "./dotns";

/**
 * Runs `start` at most once and shares its promise, but forgets a rejection so
 * one transient failure doesn't brick the app until a reload.
 */
function singleFlight<T>(start: () => Promise<T>): () => Promise<T> {
  let pending: Promise<T> | undefined;
  return () => {
    if (!pending) {
      pending = start();
      pending.catch(() => {
        pending = undefined;
      });
    }
    return pending;
  };
}

/**
 * The App shared by the whole playground (wallet, localStorage, chain).
 *
 * `name` MUST be the host binding id (getSelfDotNs(): "localhost:3001" in dev /
 * "<name>.dot" deployed) — the host scopes signing permission to it, so a
 * mismatch signs as the wrong identity and is rejected with PermissionDenied.
 * cloudStorage is disabled here: an eager bulletin client at createApp() boot
 * opens a chainHead follow that competes with the chain cards' getClient follows
 * and corrupts the block tree (undefined.children). The single bulletin card
 * builds its own CloudStorageClient on demand instead.
 */
export const getApp: () => Promise<App> = singleFlight(() =>
  createApp({
    name: getSelfDotNs(),
    cloudStorage: false,
  }),
);

/** Idempotent wallet connect: wallet.connect() runs once, shared by every caller. */
export const connectApp: () => ReturnType<App["wallet"]["connect"]> =
  singleFlight(() => getApp().then((app) => app.wallet.connect()));
