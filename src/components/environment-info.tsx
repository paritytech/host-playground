"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { SpektrExtensionName } from "@novasamatech/product-sdk";
import { Badge } from "@/src/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/card";
import { type ChainConfig } from "@/src/lib/types";
import { truncateHash } from "@/src/lib/utils";

interface EnvironmentInfoProps {
  selectedChain: ChainConfig;
}

export function EnvironmentInfo({ selectedChain }: EnvironmentInfoProps) {
  const [isInIframe, setIsInIframe] = useState<boolean | null>(null);

  useEffect(() => {
    setIsInIframe(window !== window.top);
  }, []);

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
          <span className="text-sm text-muted-foreground">Iframe Context</span>
          {isInIframe === null ? (
            <Badge variant="outline">Checking...</Badge>
          ) : isInIframe ? (
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

        {isInIframe === false && (
          <div className="pt-4 border-t border-border/60">
            <div className="flex items-start gap-2 text-xs text-warning">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Some tests require running inside a Spektr iframe. Tests marked
                with ⚠️ may hang or fail when not in an iframe context.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
