"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Bell,
  Compass,
  CreditCard,
  Database,
  FileCode,
  KeyRound,
  Link2,
  Lock,
  LogIn,
  Package,
  Palette,
  PenLine,
  Plug,
  ScrollText,
  Search,
  User,
  type LucideIcon,
} from "lucide-react";
import { isInsideContainer, isInsideContainerSync } from "@parity/product-sdk";
import { Card, CardContent } from "@/src/components/card";
import { LogViewer } from "@/src/components/log-viewer";
import { TestCategoryCard } from "@/src/components/test-category";
import { SidebarNav } from "@/src/components/sidebar-nav";
import { testsByCategory } from "@/src/lib/tests";
import {
  ACTIVE_CHAIN,
  type TestDefinition,
  type TestCategory,
} from "@/src/lib/types";
import { useLogs } from "@/src/lib/use-logs";
import { stringify } from "@/src/lib/utils";
import pkg from "@/package.json";

const SDK_VERSION_LABEL = `@parity/product-sdk ${pkg.dependencies["@parity/product-sdk"].replace(/^[\^~]/, "")}`;

const categoryIcons: Record<TestCategory, LucideIcon> = {
  extension: Plug,
  accounts: User,
  signing: PenLine,
  storage: Database,
  permissions: Lock,
  statements: ScrollText,
  preimage: Search,
  notifications: Bell,
  navigation: Compass,
  chain: Link2,
  contract: FileCode,
  theme: Palette,
  entropy: KeyRound,
  auth: LogIn,
  payments: CreditCard,
  allowances: Package,
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
    description:
      "Read and write operations on the HostApiDemo Solidity contract",
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

// Sidebar/content grouping: "Local" = host/webview-side APIs, "Network" =
// APIs that reach the chain. Also drives the order the category sections
// render in, so the active-section highlight in the sidebar tracks coherently.
const CATEGORY_GROUPS: { label: string; categories: TestCategory[] }[] = [
  {
    label: "Network",
    categories: [
      "statements",
      "preimage",
      "chain",
      "contract",
      "payments",
      "allowances",
    ],
  },
  {
    label: "Local",
    categories: [
      "extension",
      "accounts",
      "signing",
      "storage",
      "permissions",
      "notifications",
      "navigation",
      "theme",
      "entropy",
      "auth",
    ],
  },
];

// Drop any category with no tests, then flatten to the render order.
const SIDEBAR_GROUPS = CATEGORY_GROUPS.map((group) => ({
  label: group.label,
  items: group.categories
    .filter((category) => testsByCategory[category]?.length)
    .map((category) => ({
      id: category,
      title: categoryInfo[category].title,
      icon: categoryIcons[category],
      count: testsByCategory[category].length,
    })),
})).filter((group) => group.items.length > 0);

const ORDERED_CATEGORIES = SIDEBAR_GROUPS.flatMap((group) =>
  group.items.map((item) => item.id),
);

// Free-text search over a test name, description, api, and id.
function testMatchesQuery(test: TestDefinition, q: string): boolean {
  return (
    test.name.toLowerCase().includes(q) ||
    test.description.toLowerCase().includes(q) ||
    test.api.toLowerCase().includes(q) ||
    test.id.toLowerCase().includes(q)
  );
}

// Sibling chains reachable in the active network, surfaced as PAPI explorer
// links in the sidebar. People/Bulletin only appear where the network has them.
const CONNECTIONS = [
  {
    label: "AssetHub",
    wsUrl: ACTIVE_CHAIN.wsUrl,
    papiNetworkId: ACTIVE_CHAIN.papiNetworkId,
  },
  ...(ACTIVE_CHAIN.peopleWsUrl || ACTIVE_CHAIN.peopleNetworkId
    ? [
        {
          label: "People",
          wsUrl: ACTIVE_CHAIN.peopleWsUrl,
          papiNetworkId: ACTIVE_CHAIN.peopleNetworkId,
        },
      ]
    : []),
  ...(ACTIVE_CHAIN.bulletinWsUrl
    ? [{ label: "Bulletin", wsUrl: ACTIVE_CHAIN.bulletinWsUrl }]
    : []),
];

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
  const [search, setSearch] = useState("");

  const currentChain = ACTIVE_CHAIN;

  const q = search.trim().toLowerCase();
  const visibleCategories = ORDERED_CATEGORIES.map((category) => {
    const all = testsByCategory[category];
    if (!q) return { category, tests: all };
    const titleMatch = categoryInfo[category].title.toLowerCase().includes(q);
    const tests = titleMatch
      ? all
      : all.filter((test) => testMatchesQuery(test, q));
    return { category, tests };
  }).filter((entry) => entry.tests.length > 0);
  const visibleIds = new Set(visibleCategories.map((entry) => entry.category));

  // Synchronous heuristic first, then confirm asynchronously through
  // @parity/product-sdk so we converge on the SDK-backed answer.
  // Detection runs in the effect (not the initial-state lambda) to keep the
  // SSR/CSR initial render identical and avoid hydration mismatch.
  const [isInWebview, setIsInWebview] = useState<boolean | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
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
    <div className="min-h-screen bg-background lg:flex">
      {/* Left: full-height sidebar spanning the whole viewport */}
      <aside className="hidden shrink-0 lg:block lg:w-64">
        <div className="sticky top-0 h-screen">
          <SidebarNav
            version={SDK_VERSION_LABEL}
            connections={CONNECTIONS}
            groups={SIDEBAR_GROUPS}
            query={search}
            onQueryChange={setSearch}
            visibleIds={visibleIds}
          />
        </div>
      </aside>

      {/* Right: content only, no top bar, just the sidebar */}
      <div className="min-w-0 flex-1">
        <main className="px-8 py-8 lg:pr-131">
          {/* Tests, filtered live by the sidebar search */}
          <div className="space-y-6">
            {visibleCategories.length === 0 ? (
              <p className="py-16 text-center text-sm text-muted-foreground">
                No tests match &ldquo;{search.trim()}&rdquo;
              </p>
            ) : (
              visibleCategories.map(({ category, tests }) => (
                <div
                  key={category}
                  id={`section-${category}`}
                  className="scroll-mt-8"
                >
                  <TestCategoryCard
                    title={categoryInfo[category].title}
                    description={categoryInfo[category].description}
                    icon={categoryIcons[category]}
                    tests={tests}
                    runningTest={runningTest}
                    onRunTest={runTest}
                  />
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <footer className="mt-16 border-t border-border/40 py-8 text-center text-sm text-muted-foreground">
            Host Playground
          </footer>
        </main>

        {/* Logs, fixed to the right of the viewport, always on screen */}
        <div className="mt-8 px-8 lg:fixed lg:right-8 lg:top-8 lg:z-40 lg:mt-0 lg:w-115 lg:px-0">
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
    </div>
  );
}
