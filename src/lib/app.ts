import { createApp, type App } from "@parity/product-sdk";
import { getSelfDotNs } from "./dotns";

// Lazily-created singleton App shared by the whole playground (wallet,
// localStorage, chain), driven via connectApp() below.
// `name` MUST be the host binding id (getSelfDotNs(): "localhost:3001" in dev /
// "<name>.dot" deployed) — the host scopes signing permission to it, so a
// mismatch signs as the wrong identity and is rejected with PermissionDenied.
// cloudStorage is disabled here: an eager bulletin client at createApp() boot
// opens a chainHead follow that competes with the chain cards' getClient follows
// and corrupts the block tree (undefined.children). The single bulletin card
// builds its own CloudStorageClient on demand instead (see tests.ts).
let appPromise: Promise<App> | undefined;
export function getApp(): Promise<App> {
  // Single-flight, but don't cache a rejected promise — clear it on failure so
  // one transient createApp() error doesn't brick the app until a reload.
  if (!appPromise) {
    appPromise = createApp({
      name: getSelfDotNs(),
      cloudStorage: false,
    });
    appPromise.catch(() => {
      appPromise = undefined;
    });
  }
  return appPromise;
}

// Idempotent wallet connect: wallet.connect() runs once, shared by every caller.
let connectPromise:
  | ReturnType<App["wallet"]["connect"]>
  | undefined;
export function connectApp(): ReturnType<App["wallet"]["connect"]> {
  // Same don't-cache-rejection contract as getApp() so a failed connect doesn't
  // make the useAccounts retry handle a permanent no-op.
  if (!connectPromise) {
    connectPromise = getApp().then((app) => app.wallet.connect());
    connectPromise.catch(() => {
      connectPromise = undefined;
    });
  }
  return connectPromise;
}
