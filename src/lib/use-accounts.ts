import { useEffect, useState } from "react";
import { toHex } from "polkadot-api/utils";
import type { SignerState } from "@parity/product-sdk-signer";
import { signerManager, ensureSignerConnected } from "./signer";

export interface SdkAccount {
  publicKey: string; // hex-encoded
  name: string | undefined;
}

function mapAccounts(state: SignerState): SdkAccount[] | null {
  if (state.status !== "connected") return null;
  return state.accounts.map((a) => ({
    publicKey: toHex(a.publicKey),
    name: a.name ?? undefined,
  }));
}

export const useAccounts = () => {
  const [state, setState] = useState<SignerState>(() => signerManager.getState());

  useEffect(() => {
    setState(signerManager.getState());
    const unsubscribe = signerManager.subscribe(setState);
    void ensureSignerConnected();
    return unsubscribe;
  }, []);

  const accounts = mapAccounts(state);
  const isLoading = state.status === "connecting";
  // isReady mirrors the previous injectSpektrExtension() boolean: true once a
  // host connection is established, false once the host has explicitly failed,
  // null while we are still attempting the first connect.
  const isReady: boolean | null =
    state.status === "connected"
      ? true
      : state.error
        ? false
        : null;
  const error = state.error ? toError(state.error) : null;

  return { accounts, isLoading, isReady, error, connect: ensureSignerConnected };
};

function toError(err: unknown): Error {
  if (err instanceof Error) return err;
  return new Error(typeof err === "string" ? err : JSON.stringify(err));
}
