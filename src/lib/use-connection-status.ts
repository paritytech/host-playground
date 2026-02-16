import { metaProvider } from "@novasamatech/product-sdk";
import { useEffect, useState } from "react";

type ConnectionStatus = "connecting" | "connected" | "disconnected";

export const useConnectionStatus = () => {
  const [status, setStatus] = useState<ConnectionStatus | null>(null);

  useEffect(() => {
    const unsubscribe = metaProvider.subscribeConnectionStatus((s) => {
      setStatus(s);
    });
    return unsubscribe;
  }, []);

  return status;
};
