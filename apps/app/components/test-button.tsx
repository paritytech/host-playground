"use client";

import { useEffect, useMemo, useState } from "react";
import { Play, TriangleAlert } from "lucide-react";
import { Button } from "@/components/button";
import type { TestArg, TestDefinition } from "@/lib/types";

interface TestButtonProps {
  test: TestDefinition;
  isRunning: boolean;
  onRun: (args?: Record<string, string>) => void;
  disabled?: boolean;
}

/** Args whose default is a plain string are known before the first render. */
function staticDefaults(args: TestArg[]): Record<string, string> {
  return Object.fromEntries(
    args
      .filter((arg) => typeof arg.defaultValue === "string")
      .map((arg) => [arg.name, arg.defaultValue as string]),
  );
}

export function TestButton({
  test,
  isRunning,
  onRun,
  disabled,
}: TestButtonProps) {
  const isDisabled = disabled || isRunning || !!test.disabled;

  const args = useMemo(() => test.args ?? [], [test.args]);
  const [argValues, setArgValues] = useState<Record<string, string>>(() =>
    staticDefaults(args),
  );

  // The rest resolve asynchronously (e.g. an address read from the host), so
  // they land in a second pass without blocking the card.
  useEffect(() => {
    const dynamic = args.filter((a) => typeof a.defaultValue === "function");
    if (dynamic.length === 0) return;

    void Promise.all(
      dynamic.map(async (arg) => {
        const value = await (arg.defaultValue as () => Promise<string>)();
        return [arg.name, value] as [string, string];
      }),
    ).then((resolved) => {
      setArgValues((prev) => ({
        ...prev,
        ...Object.fromEntries(resolved.filter(([, v]) => v)),
      }));
    });
  }, [args]);

  return (
    <div
      id={`test-${test.id}`}
      data-testid={`test-${test.id}`}
      className="scroll-mt-[calc(var(--header-height)+1rem)] border border-border rounded-md overflow-hidden"
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRun(args.length > 0 ? argValues : undefined)}
        disabled={isDisabled}
        loading={isRunning}
        data-testid={`run-${test.id}`}
        className="justify-start text-left h-auto py-2 px-3 w-full rounded-none hover:bg-accent"
      >
        {!isRunning && <Play className="h-3 w-3 shrink-0" />}
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
      {args.length > 0 && (
        <div className="px-3 pb-2 space-y-1.5">
          {args.map((arg) => (
            <div key={arg.name} className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground shrink-0 w-24 text-right">
                {arg.label}
              </label>
              <input
                type="text"
                disabled={!!test.disabled}
                data-testid={`arg-${test.id}-${arg.name}`}
                value={argValues[arg.name] ?? ""}
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
