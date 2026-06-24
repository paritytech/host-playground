import { useCallback, useEffect, useRef, useState } from "react";
import { AccountId } from "polkadot-api";
import { toHex } from "polkadot-api/utils";
import { type Account } from "@parity/product-sdk";
import { getApp, connectApp } from "./app";

export interface SdkAccount {
  publicKey: string; // hex-encoded
  name: string | undefined;
}

// app.wallet's Account carries an SS58 `address`; consumers expect a hex public
// key, so decode the SS58 back to its 32 bytes (AccountId().enc) and hex-encode.
const ss58ToHexPublicKey = AccountId();
function mapAccounts(accounts: Account[]): SdkAccount[] {
  return accounts.map((a) => ({
    publicKey: toHex(ss58ToHexPublicKey.enc(a.address)),
    name: a.name ?? undefined,
  }));
}

type ConnectState = "connecting" | "connected" | "error";

export const useAccounts = () => {
  const [accounts, setAccounts] = useState<SdkAccount[] | null>(null);
  const [status, setStatus] = useState<ConnectState>("connecting");
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);
  const unsubscribeRef = useRef<(() => void) | undefined>(undefined);

  // Stateful connect for the mount effect and the returned retry handle;
  // connectApp() clears its cache on failure so a retry genuinely re-attempts.
  const connect = useCallback(async () => {
    if (mountedRef.current) setStatus("connecting");
    try {
      await connectApp();
      const app = await getApp();
      if (!mountedRef.current) return;
      const refresh = () => {
        if (mountedRef.current)
          setAccounts(mapAccounts(app.wallet.getAccounts()));
      };
      refresh();
      setStatus("connected");
      setError(null);
      // Re-read on account change; drop any prior sub so retries don't stack.
      unsubscribeRef.current?.();
      unsubscribeRef.current = app.wallet.onAccountChange(refresh);
    } catch (err) {
      if (mountedRef.current) {
        setStatus("error");
        setError(toError(err));
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    void connect();
    return () => {
      mountedRef.current = false;
      unsubscribeRef.current?.();
      unsubscribeRef.current = undefined;
    };
  }, [connect]);

  const isLoading = status === "connecting";
  // isReady mirrors the previous tri-state: true once connected, false once the
  // connect attempt has explicitly failed, null while still connecting.
  const isReady: boolean | null =
    status === "connected" ? true : status === "error" ? false : null;

  return { accounts, isLoading, isReady, error, connect };
};

function toError(err: unknown): Error {
  if (err instanceof Error) return err;
  return new Error(typeof err === "string" ? err : JSON.stringify(err));
}
