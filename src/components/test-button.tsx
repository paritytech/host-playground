"use client";

import { useEffect, useMemo, useState } from "react";
import { Play, TriangleAlert } from "lucide-react";
import { Button } from "@/src/components/button";
import type { TestDefinition } from "@/src/lib/types";

interface TestButtonProps {
  test: TestDefinition;
  isRunning: boolean;
  onRun: (args?: Record<string, string>) => void;
  disabled?: boolean;
}

export function TestButton({
  test,
  isRunning,
  onRun,
  disabled,
}: TestButtonProps) {
  const isCurrentlyRunning = isRunning;
  const isDisabled = disabled || isCurrentlyRunning || !!test.disabled;

  const hasArgs = test.args && test.args.length > 0;

  const initialArgs = useMemo(() => {
    if (!test.args) return {};
    return Object.fromEntries(
      test.args
        .filter((arg) => typeof arg.defaultValue === "string")
        .map((arg) => [arg.name, arg.defaultValue as string]),
    );
  }, [test.args]);

  const [argValues, setArgValues] = useState<Record<string, string>>(initialArgs);

  useEffect(() => {
    const dynamicArgs = test.args?.filter((a) => typeof a.defaultValue === "function") ?? [];
    if (dynamicArgs.length === 0) return;

    void Promise.all(
      dynamicArgs.map(async (arg) => {
        const value = await (arg.defaultValue as () => Promise<string>)();
        return [arg.name, value] as [string, string];
      }),
    ).then((resolved) => {
      setArgValues((prev) => {
        const updates = Object.fromEntries(resolved.filter(([, v]) => v));
        return { ...prev, ...updates };
      });
    });
  }, [test.args]);

  const handleRun = () => {
    onRun(hasArgs ? argValues : undefined);
  };

  return (
    <div
      id={`test-${test.id}`}
      data-testid={`test-${test.id}`}
      className="scroll-mt-[calc(var(--header-height)+1rem)] border border-border rounded-md overflow-hidden"
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={handleRun}
        disabled={isDisabled}
        loading={isCurrentlyRunning}
        data-testid={`run-${test.id}`}
        className="justify-start text-left h-auto py-2 px-3 w-full rounded-none hover:bg-accent"
      >
        {!isCurrentlyRunning && <Play className="h-3 w-3 shrink-0" />}
        <div className="flex flex-col items-start gap-0.5 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-medium truncate">{test.name}</span>
            {test.disabled && (
              <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-yellow-500 text-white leading-none">
                Only from worker
              </span>
            )}
            {test.warning && (
              <span className="relative group">
                <TriangleAlert className="h-3 w-3 shrink-0 text-yellow-500" />
                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 text-xs rounded bg-zinc-900 text-zinc-100 border border-zinc-700 shadow-md whitespace-nowrap invisible group-hover:visible pointer-events-none transition-opacity z-50">
                  {test.warning}
                </span>
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground truncate w-full">
            {test.description}
          </span>
          <code className="font-mono text-[10px] text-muted-foreground/50 truncate w-full">
            {test.api}
          </code>
        </div>
      </Button>
      {hasArgs && (
        <div className="px-3 pb-2 space-y-1.5">
          {test.args!.map((arg) => (
            <div key={arg.name} className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground shrink-0 w-24 text-right">
                {arg.label}
              </label>
              <input
                type="text"
                disabled={!!test.disabled}
                data-testid={`arg-${test.id}-${arg.name}`}
                value={argValues[arg.name] ?? (typeof arg.defaultValue === "string" ? arg.defaultValue : "")}
                onChange={(e) =>
                  setArgValues((prev) => ({
                    ...prev,
                    [arg.name]: e.target.value,
                  }))
                }
                className="text-xs border-b border-border bg-transparent text-foreground flex-1 min-w-0 px-1 py-0.5 outline-none focus:border-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
