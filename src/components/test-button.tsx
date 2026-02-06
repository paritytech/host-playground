"use client";

import { AlertTriangle, Play } from "lucide-react";
import { Button } from "@/src/components/button";
import type { TestDefinition } from "@/src/lib/types";

interface TestButtonProps {
  test: TestDefinition;
  isRunning: boolean;
  onRun: () => void;
  disabled?: boolean;
}

export function TestButton({
  test,
  isRunning,
  onRun,
  disabled,
}: TestButtonProps) {
  const isCurrentlyRunning = isRunning;
  const isDisabled = disabled || isCurrentlyRunning;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onRun}
      disabled={isDisabled}
      loading={isCurrentlyRunning}
      className="justify-start text-left h-auto py-2 px-3"
    >
      {!isCurrentlyRunning && <Play className="h-3 w-3 shrink-0" />}
      <div className="flex flex-col items-start gap-0.5 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-medium truncate">{test.name}</span>
          {test.requiresWebview && (
            <AlertTriangle className="h-3 w-3 text-warning shrink-0" />
          )}
        </div>
        <span className="text-xs text-muted-foreground truncate w-full">
          {test.description}
        </span>
      </div>
    </Button>
  );
}
