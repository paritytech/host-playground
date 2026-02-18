import {
  injectSpektrExtension,
  createAccountsProvider,
} from "@novasamatech/product-sdk";
import { toHex } from "polkadot-api/utils";
import { useCallback, useEffect, useState } from "react";

export interface SdkAccount {
  publicKey: string; // hex-encoded
  name: string | undefined;
}

export const useAccounts = () => {
  const [accounts, setAccounts] = useState<SdkAccount[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState<boolean | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const connect = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const ready = await injectSpektrExtension();
      setIsReady(ready);

      if (!ready) {
        setAccounts(null);
        return null;
      }

      const accountsProvider = createAccountsProvider();
      const result = await accountsProvider.getNonProductAccounts();

      const mapped = result.match(
        (accs) =>
          accs.map((a) => ({
            publicKey: toHex(a.publicKey),
            name: a.name,
          })),
        () => null,
      );

      setAccounts(mapped);
      return mapped;
    } catch (err) {
      console.error("[useAccounts] Error:", err);
      setError(err instanceof Error ? err : new Error("Failed to connect"));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    connect();
  }, [connect]);

  return { accounts, isLoading, isReady, error, connect };
};
