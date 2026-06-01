"use client";

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  User,
} from "lucide-react";
import { isInsideContainerSync } from "@parity/product-sdk-host";
import { Badge } from "@/src/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/card";
import { type ChainConfig } from "@/src/lib/types";
import { type SdkAccount } from "@/src/lib/use-accounts";
import { truncateHash } from "@/src/lib/utils";

type ConnectionStatus = "connecting" | "connected" | "disconnected";

interface EnvironmentInfoProps {
  selectedChain: ChainConfig;
  connectionStatus: ConnectionStatus;
  accounts: SdkAccount[] | null;
  accountsLoading: boolean;
}

export function EnvironmentInfo({
  selectedChain,
  connectionStatus,
  accounts,
  accountsLoading,
}: EnvironmentInfoProps) {
  const isInWebview = isInsideContainerSync();

  if (!isInWebview) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-xs text-warning">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span>Not running inside a host container.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-2.5">
        <div className="flex items-center gap-2 text-sm">
          {accountsLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
          ) : accounts && accounts.length > 0 ? (
            <>
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-medium text-foreground truncate">
                {accounts[0].name ?? "Unnamed"}
              </span>
            </>
          ) : (
            <span className="text-muted-foreground">No accounts</span>
          )}
        </div>

        {accounts && accounts.length > 0 && (
          <div className="font-mono text-[10px] text-muted-foreground truncate">
            {truncateHash(accounts[0].publicKey)}
          </div>
        )}

        <div className="flex items-center justify-between text-xs pt-1.5 border-t border-border/60">
          <span className="text-muted-foreground">{selectedChain.name}</span>
          {connectionStatus === "connected" ? (
            <Badge variant="success" className="flex items-center gap-1 text-[10px] px-1.5 py-0">
              <CheckCircle2 className="h-2.5 w-2.5" />
              Connected
            </Badge>
          ) : connectionStatus === "connecting" ? (
            <Badge variant="outline" className="flex items-center gap-1 text-[10px] px-1.5 py-0">
              <Loader2 className="h-2.5 w-2.5 animate-spin" />
              Connecting
            </Badge>
          ) : (
            <Badge variant="warning" className="flex items-center gap-1 text-[10px] px-1.5 py-0">
              <AlertCircle className="h-2.5 w-2.5" />
              Disconnected
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-warning pt-1.5 border-t border-border/60">
          <AlertTriangle className="h-3 w-3 shrink-0" />
          <span>Not working with Desktop &lt;= 0.1.0</span>
        </div>
      </CardContent>
    </Card>
  );
}
