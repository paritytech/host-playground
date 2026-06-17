import { useEffect, useState } from "react";
import { connectApp } from "./app";

type ConnectionStatus = "connecting" | "connected" | "disconnected";

export const useConnectionStatus = () => {
  // null before mount (matches the previous pre-subscription state); after mount
  // the value is derived from the shared connectApp() lifecycle on the single
  // app.wallet. A failed connect maps to "disconnected", preserving the three
  // statuses this hook has always surfaced.
  const [status, setStatus] = useState<ConnectionStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    setStatus("connecting");
    void connectApp()
      .then(() => {
        if (!cancelled) setStatus("connected");
      })
      .catch(() => {
        if (!cancelled) setStatus("disconnected");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return status;
};
