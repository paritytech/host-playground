import { SignerManager } from "@parity/product-sdk-signer";

export const signerManager = new SignerManager({ dappName: "host-playground" });

let connectPromise: Promise<unknown> | null = null;

export function ensureSignerConnected() {
  if (!connectPromise) {
    connectPromise = signerManager.connect();
  }
  return connectPromise;
}
