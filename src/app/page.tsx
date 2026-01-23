"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { EnvironmentInfo } from "@/src/components/sdk-test/environment-info";
import { LogViewer } from "@/src/components/sdk-test/log-viewer";
import { TestCategoryCard } from "@/src/components/sdk-test/test-category";
import { ChainSelector } from "@/src/components/sdk-test/chain-selector";
import { testsByCategory } from "@/src/lib/sdk/tests";
import {
  CHAINS,
  type ChainConfig,
  type ChainId,
  type TestDefinition,
  type TestCategory,
} from "@/src/lib/sdk/types";
import { useLogs } from "@/src/lib/sdk/use-logs";
import { stringify } from "@/src/lib/utils";

const SDK_VERSION = "0.5.2";

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
    title: "Permissions & Features",
    description: "Request permissions and check features",
  },
  chat: {
    title: "Chat",
    description: "Create contacts and send messages",
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
              This application must be run inside a Spektr iframe to function
              properly. The SDK requires the host environment to communicate
              with the Spektr wallet.
            </p>
            <p className="text-base text-muted-foreground mt-5 leading-relaxed">
              Please open this application through the Spektr wallet interface.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SdkTestPage() {
  const { logs, log, updateLog, clearLogs, exportLogs } = useLogs();
  const [runningTest, setRunningTest] = useState<string | null>(null);
  const [selectedChain, setSelectedChain] = useState<ChainId>("PASSET_HUB");
  const [isInIframe, setIsInIframe] = useState<boolean | null>(null);

  useEffect(() => {
    setIsInIframe(window !== window.top);
  }, []);

  const currentChain: ChainConfig = CHAINS[selectedChain];

  const runTest = useCallback(
    async (test: TestDefinition) => {
      setRunningTest(test.id);
      const logId = log(test.name, "pending", "Running...");

      try {
        const result = await test.run(currentChain);
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
    [log, updateLog, currentChain],
  );

  // Show loading state while checking iframe status
  if (isInIframe === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Show not in host screen if not in iframe
  if (!isInIframe) {
    return <NotInHostScreen />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                Product SDK Test
              </h1>
              <p className="text-base text-muted-foreground mt-2">
                @novasamatech/product-sdk v{SDK_VERSION}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <ChainSelector
                selectedChain={selectedChain}
                onChainChange={setSelectedChain}
              />
              <Button
                variant="ghost"
                size="default"
                onClick={() => window.location.reload()}
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Two Column Layout */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-8">
          {/* Left Column: Tests */}
          <div className="space-y-6">
            {/* Environment Info */}
            <EnvironmentInfo selectedChain={currentChain} />

            {/* Test Categories */}
            <div className="space-y-6">
              {(Object.keys(testsByCategory) as TestCategory[]).map(
                (category) => (
                  <TestCategoryCard
                    key={category}
                    title={categoryInfo[category].title}
                    description={categoryInfo[category].description}
                    category={category}
                    tests={testsByCategory[category]}
                    runningTest={runningTest}
                    onRunTest={runTest}
                  />
                ),
              )}
            </div>
          </div>

          {/* Right Column: Logs (Sticky) */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <LogViewer logs={logs} onClear={clearLogs} onExport={exportLogs} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-8 text-center text-sm text-muted-foreground">
          Built for testing the Polkadot Product SDK
        </div>
      </footer>
    </div>
  );
}
