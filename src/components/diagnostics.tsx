"use client";

import { useMemo, useState } from "react";
import { Play, Copy, Check } from "lucide-react";
import { Button } from "@/src/components/button";
import { Card, CardContent } from "@/src/components/card";
import { testsByCategory } from "@/src/lib/tests";
import type { ChainConfig, TestDefinition } from "@/src/lib/types";

type DiagStatus = "pending" | "running" | "success" | "error" | "skipped";

interface DiagRow {
  category: string;
  name: string;
  status: DiagStatus;
  details?: string;
}

// Per-test budget so a hung host call can't stall the whole sweep.
// Interactive categories trigger a host approval popup the user has to tap, so
// they get a generous budget — we run sequentially and await each, so popups
// arrive one at a time and fully resolve (approve/reject) before the next test,
// instead of piling up. Passive categories (reads / subscriptions) stay snappy.
const PASSIVE_TIMEOUT_MS = 12_000;
const INTERACTIVE_TIMEOUT_MS = 120_000;
const INTERACTIVE_CATEGORIES = new Set([
  "signing",
  "permissions",
  "payments",
  "allowances",
  "auth",
  "contract",
]);

const ICON: Record<DiagStatus, string> = {
  pending: "·",
  running: "…",
  success: "✅",
  error: "❌",
  skipped: "⏭",
};

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`timed out after ${ms / 1000}s`)),
      ms,
    );
    p.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      },
    );
  });
}

async function resolveArgs(
  test: TestDefinition,
): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  for (const arg of test.args ?? []) {
    out[arg.name] =
      typeof arg.defaultValue === "function"
        ? await arg.defaultValue()
        : arg.defaultValue;
  }
  return out;
}

function detailString(message: string, details?: unknown): string {
  let s = message || "";
  if (details !== undefined && details !== null) {
    const d = typeof details === "string" ? details : JSON.stringify(details);
    if (d && d !== "{}" && d !== '""') s = s ? `${s} — ${d}` : d;
  }
  return s.replace(/\s+/g, " ").trim();
}

export function Diagnostics({
  chain,
  navigate,
}: {
  chain: ChainConfig;
  navigate: (path: string) => void;
}) {
  // Flat list of every registered test. Run the `navigation` category last:
  // a host-side navigateTo can move the webview and abort the sweep, so we
  // keep it until the other results are already collected.
  const allTests = useMemo(() => {
    const flat = Object.entries(testsByCategory).flatMap(([category, tests]) =>
      tests.map((test) => ({ category, test })),
    );
    return flat.sort((a, b) =>
      a.category === b.category
        ? 0
        : a.category === "navigation"
          ? 1
          : b.category === "navigation"
            ? -1
            : 0,
    );
  }, []);

  const [rows, setRows] = useState<DiagRow[]>([]);
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const pass = rows.filter((r) => r.status === "success").length;
  const fail = rows.filter((r) => r.status === "error").length;
  const skip = rows.filter((r) => r.status === "skipped").length;
  const done = rows.filter(
    (r) => r.status !== "pending" && r.status !== "running",
  ).length;

  const runAll = async () => {
    setRunning(true);
    setCopied(false);
    const results: DiagRow[] = allTests.map(({ category, test }) => ({
      category,
      name: test.name,
      status: "pending",
    }));
    setRows([...results]);

    for (let i = 0; i < allTests.length; i++) {
      const { category, test } = allTests[i];
      results[i] = { ...results[i], status: "running" };
      setRows([...results]);

      if (test.disabled) {
        results[i] = {
          category,
          name: test.name,
          status: "skipped",
          details: test.disabled,
        };
      } else {
        try {
          const args = await resolveArgs(test);
          // No-op navigate during the sweep so the in-app router doesn't
          // change routes mid-run; host navigateTo still exercises the host.
          const timeoutMs = INTERACTIVE_CATEGORIES.has(category)
            ? INTERACTIVE_TIMEOUT_MS
            : PASSIVE_TIMEOUT_MS;
          const res = await withTimeout(
            test.run(chain, () => {}, args, navigate),
            timeoutMs,
          );
          results[i] = {
            category,
            name: test.name,
            status: res.success ? "success" : "error",
            details: res.success
              ? undefined
              : detailString(res.message, res.details),
          };
        } catch (e) {
          results[i] = {
            category,
            name: test.name,
            status: "error",
            details: e instanceof Error ? e.message : String(e),
          };
        }
      }
      setRows([...results]);
    }
    setRunning(false);
  };

  const toMarkdown = () => {
    const lines = [
      "## Host Playground Diagnosis",
      `_Generated: ${new Date().toISOString()}_ · _Network: ${chain.name}_`,
      "",
      "| Method | Status | Details |",
      "| --- | --- | --- |",
      ...rows.map((r) => {
        const d = (r.details ?? "").replace(/\|/g, "\\|").slice(0, 300);
        return `| \`${r.category}/${r.name}\` | ${ICON[r.status]} | ${d} |`;
      }),
      "",
      `**${pass} passed · ${fail} failed · ${skip} skipped** (of ${rows.length})`,
    ];
    return lines.join("\n");
  };

  const copyReport = async () => {
    try {
      await navigator.clipboard.writeText(toMarkdown());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard may be unavailable inside the host webview — ignore
    }
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Diagnostics</h2>
            <p className="text-sm text-muted-foreground">
              Run every host-API method and report pass / fail for this host.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {rows.length > 0 && (
              <span className="text-sm text-muted-foreground tabular-nums">
                {done}/{rows.length} &nbsp;·&nbsp; ✅ {pass} &nbsp; ❌ {fail}{" "}
                &nbsp; ⏭ {skip}
              </span>
            )}
            {rows.length > 0 && !running && (
              <Button variant="outline" size="sm" onClick={copyReport}>
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? "Copied" : "Copy report"}
              </Button>
            )}
            <Button size="sm" onClick={runAll} disabled={running}>
              <Play className="h-4 w-4" />
              {running ? "Running…" : "Run all"}
            </Button>
          </div>
        </div>

        {rows.length > 0 && (
          <div className="mt-4 max-h-96 overflow-auto rounded-md border border-border/40">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted/50 text-left">
                <tr>
                  <th className="px-3 py-2 font-medium">Method</th>
                  <th className="w-16 px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t border-border/30">
                    <td className="whitespace-nowrap px-3 py-1.5 font-mono text-xs">
                      {r.category}/{r.name}
                    </td>
                    <td className="px-3 py-1.5">{ICON[r.status]}</td>
                    <td className="break-all px-3 py-1.5 text-xs text-muted-foreground">
                      {r.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
