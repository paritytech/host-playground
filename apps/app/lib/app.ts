import { createApp, type App } from "@parity/product-sdk";

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
 * The App shared by the whole playground, covering wallet, localStorage, and chain.
 *
 * cloudStorage stays off. An eager bulletin client at createApp() boot opens a
 * chainHead follow that competes with the getClient follows the chain cards
 * make, which corrupts the block tree and surfaces as undefined.children. The
 * single bulletin card builds its own CloudStorageClient on demand instead.
 */
export const getApp: () => Promise<App> = singleFlight(() =>
  createApp({ cloudStorage: false }),
);

/** Idempotent wallet connect: wallet.connect() runs once, shared by every caller. */
export const connectApp: () => ReturnType<App["wallet"]["connect"]> =
  singleFlight(() => getApp().then((app) => app.wallet.connect()));
