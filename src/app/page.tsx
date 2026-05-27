"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { isInsideContainer, isInsideContainerSync } from "@parity/product-sdk-host";
import { Card, CardContent } from "@/src/components/card";
import { LogViewer } from "@/src/components/log-viewer";
import { TestCategoryCard } from "@/src/components/test-category";
import { SidebarNav } from "@/src/components/sidebar-nav";
import { ChainSelector } from "@/src/components/chain-selector";
import { testsByCategory } from "@/src/lib/tests";
import {
  CHAINS,
  type ChainConfig,
  type ChainId,
  type TestDefinition,
  type TestCategory,
} from "@/src/lib/types";
import { useLogs } from "@/src/lib/use-logs";
import { useAccounts } from "@/src/lib/use-accounts";
import { stringify } from "@/src/lib/utils";

// Hardcoded because @parity/product-sdk-host's `exports` map doesn't surface
// package.json. Bump alongside the dep range in package.json.
const SDK_VERSION_LABEL = "@parity/product-sdk-host ^0.5.0";

const categoryIcons: Record<TestCategory, string> = {
  extension: "🔌",
  accounts: "👤",
  signing: "✍️",
  storage: "💾",
  permissions: "🔐",
  chat: "💬",
  statements: "📜",
  preimage: "🔎",
  notifications: "🔔",
  navigation: "🧭",
  chain: "⛓️",
  contract: "📄",
  theme: "🎨",
  entropy: "🔑",
  auth: "🔓",
  payments: "💳",
  allowances: "📦",
};

const categoryInfo: Record<
  TestCategory,
  { title: string; description: string }
> = {
  extension: {
    title: "Extension & Providers",
    description: "Test extension injection and provider creation",
  },
  accounts: {
    title: "Accounts",
    description: "Retrieve account information",
  },
  signing: {
    title: "Signing",
    description: "Sign messages and transaction payloads",
  },
  storage: {
    title: "Storage",
    description: "Read, write, and clear storage",
  },
  permissions: {
    title: "Permissions",
    description: "Request permissions and check features",
  },
  chat: {
    title: "Chat",
    description: "Register rooms, bots, and send messages",
  },
  statements: {
    title: "Statement Store",
    description: "Create proofs and subscribe to statements",
  },
  preimage: {
    title: "Preimage",
    description: "Submit and lookup preimages",
  },
  notifications: {
    title: "Notifications",
    description: "Send push notifications to the host",
  },
  navigation: {
    title: "Navigation",
    description: "Test deeplinks with paths, query params, and fragments",
  },
  chain: {
    title: "Chain Interaction",
    description: "Typed chain spec and chain head protocol",
  },
  contract: {
    title: "Contract",
    description: "Read and write operations on the HostApiDemo Solidity contract",
  },
  theme: {
    title: "Theme",
    description: "Subscribe to host theme (light/dark) changes",
  },
  entropy: {
    title: "Entropy",
    description: "Derive deterministic entropy from keys (RFC-0007)",
  },
  auth: {
    title: "Auth & Login",
    description: "Login flow and root account access (RFC-0009, RFC-0010)",
  },
  payments: {
    title: "Payments",
    description: "Balance, top-ups, and payment requests (RFC-0006)",
  },
  allowances: {
    title: "Allowances",
    description:
      "Request statement-store, bulletin, smart-contract, and auto-signing allocations (RFC-0010)",
  },
};

function NotInHostScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center mx-8">
      <Card className="max-w-lg w-full border-warning/30 bg-warning/5">
        <CardContent className="p-10">
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-warning/20 p-5 mb-8">
              <AlertTriangle className="h-10 w-10 text-warning" />
            </div>
            <h1 className="text-3xl font-semibold text-foreground mb-4 tracking-tight">
              Not Running Inside Host
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              This application must be run inside a Host webview to function
              properly. The SDK requires the host environment to communicate
              with the Polakdot App.
            </p>
            <p className="text-base text-muted-foreground mt-5 leading-relaxed">
              Please open this application through the Host interface.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SdkTestPage() {
  const { push: navigate } = useRouter();
  const { logs, log, updateLog, clearLogs, exportLogs } = useLogs();
  const [runningTest, setRunningTest] = useState<string | null>(null);
  const [selectedChain, setSelectedChain] =
    useState<ChainId>("PASEO_NEXT_V2_ASSET_HUB");

  const currentChain: ChainConfig = CHAINS[selectedChain];

  useAccounts();

  // Synchronous heuristic first, then confirm asynchronously through
  // @parity/product-sdk-host so we converge on the SDK-backed answer.
  // Local-dev escape hatch: `?dev=1` bypasses the host gate so the UI can
  // be exercised without an actual Polkadot host webview. Host calls will
  // still fail without a real port; this only unblocks rendering. The
  // bypass is applied in the effect (not the initial-state lambda) to keep
  // the SSR/CSR initial render identical and avoid hydration mismatch.
  const [isInWebview, setIsInWebview] = useState<boolean | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const devBypass =
      new URLSearchParams(window.location.search).get("dev") === "1";
    if (devBypass) {
      setIsInWebview(true);
      return;
    }
    setIsInWebview(isInsideContainerSync());
    let cancelled = false;
    void isInsideContainer().then((inside) => {
      if (!cancelled) setIsInWebview(inside);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const runTest = useCallback(
    async (test: TestDefinition, args?: Record<string, string>) => {
      setRunningTest(test.id);
      const logId = log(test.name, "pending", "Running...");

      // Create a logger that updates the pending log entry
      const testLogger = (message: string) => {
        updateLog(logId, "pending", message);
      };

      try {
        const result = await test.run(currentChain, testLogger, args, navigate);
        updateLog(
          logId,
          result.success ? "success" : "error",
          result.message,
          result.details ? stringify(result.details) : undefined,
        );
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : JSON.stringify(e);
        updateLog(logId, "error", message);
      } finally {
        setRunningTest(null);
      }
    },
    [log, updateLog, currentChain, navigate],
  );

  // Show loading state while checking webview status
  if (isInWebview === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Show not in host screen if not in webview
  if (!isInWebview) {
    return <NotInHostScreen />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-400 mx-auto px-8 h-(--header-height) flex items-center">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-baseline gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Host Playground
              </h1>
              <span className="text-sm text-muted-foreground">
                {SDK_VERSION_LABEL}
              </span>
            </div>
            <ChainSelector
              selectedChain={selectedChain}
              onChainChange={setSelectedChain}
            />
          </div>
        </div>
      </header>

      {/* Main Content - Three Column Layout */}
      <main className="max-w-400 mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_500px] gap-8">
          {/* Left Column: Sidebar Nav */}
          <div className="hidden lg:block">
            <div className="sticky top-(--header-height)">
              <SidebarNav
                categories={(
                  Object.keys(testsByCategory) as TestCategory[]
                ).map((category) => ({
                  id: category,
                  title: categoryInfo[category].title,
                  icon: categoryIcons[category],
                  count: testsByCategory[category].length,
                }))}
              />
            </div>
          </div>

          {/* Center Column: Tests */}
          <div className="space-y-6">
            {/* Test Categories */}
            <div className="space-y-6">
              {(Object.keys(testsByCategory) as TestCategory[]).map(
                (category) => (
                  <div
                    key={category}
                    id={`section-${category}`}
                    className="scroll-mt-(--header-height)"
                  >
                    <TestCategoryCard
                      title={categoryInfo[category].title}
                      description={categoryInfo[category].description}
                      icon={categoryIcons[category]}
                      tests={testsByCategory[category]}
                      runningTest={runningTest}
                      onRunTest={runTest}
                    />
                  </div>
                ),
              )}
            </div>
            <div className="h-[calc(100vh+300px)]" aria-hidden />
          </div>

          {/* Right Column: Logs (Sticky) */}
          <div className="lg:sticky lg:top-(--header-height) lg:self-start">
            <LogViewer
              logs={logs}
              onClear={clearLogs}
              onExport={exportLogs}
              onReset={() => {
                clearLogs();
                setRunningTest(null);
              }}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-8 text-center text-sm text-muted-foreground">
          Host Playground
        </div>
      </footer>
    </div>
  );
}
