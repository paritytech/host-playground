import {
  SpektrExtensionName,
  injectSpektrExtension,
} from "@novasamatech/product-sdk";
import {
  type InjectedPolkadotAccount,
  connectInjectedExtension,
} from "@polkadot-api/pjs-signer";
import { useCallback, useEffect, useState } from "react";

// Type for the extension stored on window
export type StoredExtension = Awaited<
  ReturnType<typeof connectInjectedExtension>
>;

export const useAccounts = () => {
  const [accounts, setAccounts] = useState<InjectedPolkadotAccount[] | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState<boolean | null>(null); // Extension ready state
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

      const extension = await connectInjectedExtension(SpektrExtensionName);
      // Store extension on window for tests to reuse
      (
        window as unknown as { __sdkExtension?: StoredExtension }
      ).__sdkExtension = extension;

      const accounts = extension.getAccounts();

      setAccounts(accounts);
      return accounts;
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
