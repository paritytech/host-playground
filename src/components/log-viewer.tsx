"use client";

import { Download, RotateCcw, Trash2 } from "lucide-react";
import { Badge } from "@/src/components/badge";
import { Button } from "@/src/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/card";
import type { LogEntry } from "@/src/lib/types";
import { formatTimestamp } from "@/src/lib/utils";

interface LogViewerProps {
  logs: LogEntry[];
  onClear: () => void;
  onExport: () => void;
  onReset?: () => void;
}

const statusVariant: Record<string, "success" | "error" | "info" | "warning"> =
  {
    success: "success",
    error: "error",
    info: "info",
    pending: "warning",
  };

export function LogViewer({ logs, onClear, onExport, onReset }: LogViewerProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold">Logs</CardTitle>
        <div className="flex gap-2">
          {onReset && (
            <Button variant="ghost" size="sm" onClick={onReset}>
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onExport}
            disabled={logs.length === 0}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            disabled={logs.length === 0}
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div className="h-[400px] overflow-y-auto rounded-xl bg-muted/50 p-4 font-mono text-sm">
          {logs.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No logs yet. Run a test to see results.
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((entry) => (
                <div
                  key={entry.id}
                  className="border-b border-border/40 pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-start gap-2 flex-wrap">
                    <span className="text-muted-foreground shrink-0 text-xs">
                      {formatTimestamp(entry.timestamp)}
                    </span>
                    <Badge
                      variant={statusVariant[entry.status]}
                      className="shrink-0"
                    >
                      {entry.status}
                    </Badge>
                    <span className="text-info font-medium">
                      [{entry.action}]
                    </span>
                  </div>
                  <div className="mt-2 text-foreground/90 break-all">
                    {entry.message}
                  </div>
                  {entry.details && (
                    <pre className="mt-2 text-xs text-muted-foreground overflow-x-auto whitespace-pre-wrap">
                      {entry.details}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
