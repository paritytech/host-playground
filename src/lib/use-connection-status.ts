import { useEffect, useState } from "react";
import type { SignerState } from "@parity/product-sdk-signer";
import { signerManager, ensureSignerConnected } from "./signer";

type ConnectionStatus = "connecting" | "connected" | "disconnected";

export const useConnectionStatus = () => {
  const [state, setState] = useState<SignerState | null>(null);

  useEffect(() => {
    setState(signerManager.getState());
    const unsubscribe = signerManager.subscribe(setState);
    void ensureSignerConnected();
    return unsubscribe;
  }, []);

  if (!state) return null;
  return state.status as ConnectionStatus;
};
