"use client";

import { AlertCircle, CheckCircle2, Loader2, User } from "lucide-react";
import { SpektrExtensionName } from "@novasamatech/product-sdk";
import { type InjectedPolkadotAccount } from "@polkadot-api/pjs-signer";
import { Badge } from "@/src/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/card";
import { type ChainConfig } from "@/src/lib/types";
import { truncateHash } from "@/src/lib/utils";

type ConnectionStatus = "connecting" | "connected" | "disconnected";

interface EnvironmentInfoProps {
  selectedChain: ChainConfig;
  connectionStatus: ConnectionStatus;
  accounts: InjectedPolkadotAccount[] | null;
  accountsLoading: boolean;
}

export function EnvironmentInfo({
  selectedChain,
  connectionStatus,
  accounts,
  accountsLoading,
}: EnvironmentInfoProps) {
  const isInWebview = accountsLoading ? null : accounts !== null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Environment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Extension</span>
          <Badge variant="outline">{SpektrExtensionName}</Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Webview Context</span>
          {isInWebview === null ? (
            <Badge variant="outline">Checking...</Badge>
          ) : isInWebview ? (
            <Badge variant="success" className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Yes
            </Badge>
          ) : (
            <Badge variant="warning" className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              No
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Connection</span>
          {connectionStatus === "connected" ? (
            <Badge variant="success" className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Connected
            </Badge>
          ) : connectionStatus === "connecting" ? (
            <Badge variant="outline" className="flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Connecting
            </Badge>
          ) : (
            <Badge variant="warning" className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Disconnected
            </Badge>
          )}
        </div>

        <div className="pt-4 border-t border-border/60">
          <div className="text-sm font-medium mb-3">Connected Account</div>
          {accountsLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </div>
          ) : accounts && accounts.length > 0 ? (
            <>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-foreground">
                  {accounts[0].name}
                </span>
              </div>
              <div className="font-mono text-xs text-muted-foreground mt-1">
                {truncateHash(accounts[0].address)}
              </div>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">No accounts</div>
          )}
        </div>

        <div className="pt-4 border-t border-border/60">
          <div className="text-sm font-medium mb-3">Selected Chain</div>
          <div className="text-sm">
            <span className="font-medium text-foreground">
              {selectedChain.name}
            </span>
            <span className="mx-2 text-muted-foreground">·</span>
            <span className="text-muted-foreground">
              {selectedChain.network}
            </span>
          </div>
          <div className="font-mono text-xs text-muted-foreground mt-1">
            {truncateHash(selectedChain.genesis)}
          </div>
        </div>

        {isInWebview === false && (
          <div className="pt-4 border-t border-border/60">
            <div className="flex items-start gap-2 text-xs text-warning">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Some tests require running inside a Nova Wallet webview. Tests marked
                with ⚠️ may hang or fail when not in a webview context.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
