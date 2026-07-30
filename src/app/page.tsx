"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  Menu,
  Package,
  Palette,
  PenLine,
  Plug,
  ScrollText,
  Search,
  User,
  X,
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
import { cn, stringify } from "@/src/lib/utils";
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
      "signing",
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
  const [navOpen, setNavOpen] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);

  // Drag-to-dismiss for the mobile log sheet: the top follows the finger and
  // the sheet closes once pulled past a third of its height, else springs back.
  const [logDragY, setLogDragY] = useState(0);
  const [logDragging, setLogDragging] = useState(false);
  const logSheetRef = useRef<HTMLDivElement>(null);
  const logDrag = useRef({ startY: 0, height: 0, dy: 0, active: false });

  const onLogHandleDown = (e: React.PointerEvent<HTMLDivElement>) => {
    logDrag.current = {
      startY: e.clientY,
      height: logSheetRef.current?.offsetHeight ?? window.innerHeight,
      dy: 0,
      active: true,
    };
    setLogDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onLogHandleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!logDrag.current.active) return;
    const dy = Math.max(0, e.clientY - logDrag.current.startY);
    logDrag.current.dy = dy;
    setLogDragY(dy);
  };
  const onLogHandleUp = () => {
    if (!logDrag.current.active) return;
    logDrag.current.active = false;
    setLogDragging(false);
    const shouldClose = logDrag.current.dy > logDrag.current.height * 0.3;
    setLogDragY(0);
    if (shouldClose) setLogsOpen(false);
  };

  const currentChain = ACTIVE_CHAIN;

  // Lock body scroll while a mobile overlay is open so the page behind it does
  // not scroll under the drawer or the log sheet.
  useEffect(() => {
    document.body.style.overflow = navOpen || logsOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [navOpen, logsOpen]);

  // The overlays are hidden at the lg breakpoint, so close them when the
  // viewport grows into the desktop layout. Otherwise a sheet left open on a
  // narrow width keeps the body scroll locked after the sheet disappears.
  useEffect(() => {
    const onResize = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setNavOpen(false);
        setLogsOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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
      // On mobile the logs live in a sheet, so surface it when a test starts.
      if (window.matchMedia("(max-width: 1023px)").matches) setLogsOpen(true);
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

  const isSearching = search.trim().length > 0;

  return (
    <div className="min-h-screen bg-background lg:flex">
      {/* Mobile top bar: brand + menu trigger, with a persistent search field
          that owns the live filter (the drawer nav hides its own search). */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl lg:hidden">
        <div className="flex h-14 items-center gap-1 px-4">
          <button
            type="button"
            onClick={() => setNavOpen(true)}
            aria-label="Open navigation"
            className="-ml-2 flex h-11 w-11 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-base font-semibold tracking-tight text-foreground">
            Host Playground
          </span>
        </div>
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tests"
              aria-label="Search tests"
              className="h-11 w-full appearance-none rounded-lg border border-border/70 bg-card pl-9 pr-9 text-base leading-none text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground/30 focus:ring-2 focus:ring-foreground/10"
            />
            {isSearching && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </header>

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
        <main className="px-4 py-6 lg:py-8 lg:pl-8 lg:pr-131">
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

        </main>

        {/* Logs, fixed to the right of the viewport, spanning full height.
            Hidden below lg where the mobile log sheet takes over. */}
        <div className="hidden lg:fixed lg:bottom-8 lg:right-8 lg:top-8 lg:z-40 lg:block lg:w-115">
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

      {/* Mobile navigation drawer: reuses the desktop sidebar, sliding in from
          the left over a tap-to-dismiss scrim. */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          !navOpen && "pointer-events-none",
        )}
        aria-hidden={!navOpen}
      >
        <div
          onClick={() => setNavOpen(false)}
          className={cn(
            "absolute inset-0 bg-foreground/20 backdrop-blur-sm transition-opacity duration-200",
            navOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-72 max-w-[80vw] bg-background shadow-xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
            navOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <SidebarNav
            version={SDK_VERSION_LABEL}
            connections={CONNECTIONS}
            groups={SIDEBAR_GROUPS}
            query={search}
            onQueryChange={setSearch}
            visibleIds={visibleIds}
            showSearch={false}
            onNavigate={() => setNavOpen(false)}
          />
        </div>
      </div>

      {/* Mobile logs: a floating button with a live count opens a bottom sheet
          that gives LogViewer the bounded height its h-full needs. */}
      <button
        type="button"
        onClick={() => setLogsOpen(true)}
        aria-label="Open logs"
        className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-transform active:scale-95 lg:hidden"
      >
        <ScrollText className="h-6 w-6" />
        {logs.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold tabular-nums text-primary-foreground">
            {logs.length}
          </span>
        )}
      </button>

      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          !logsOpen && "pointer-events-none",
        )}
        aria-hidden={!logsOpen}
      >
        <div
          onClick={() => setLogsOpen(false)}
          className={cn(
            "absolute inset-0 bg-foreground/20 backdrop-blur-sm transition-opacity duration-200",
            logsOpen ? "opacity-100" : "opacity-0",
          )}
          style={
            logDragging
              ? {
                  opacity: Math.max(0, 1 - logDragY / (logDrag.current.height || 1)),
                  transition: "none",
                }
              : undefined
          }
        />
        <div
          ref={logSheetRef}
          className="absolute inset-x-0 bottom-0 flex h-[60vh] flex-col rounded-t-2xl bg-background pb-[env(safe-area-inset-bottom)] shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
          style={{
            transform: logDragging
              ? `translateY(${logDragY}px)`
              : logsOpen
                ? "translateY(0)"
                : "translateY(100%)",
            transition: logDragging ? "none" : undefined,
          }}
        >
          <div
            onPointerDown={onLogHandleDown}
            onPointerMove={onLogHandleMove}
            onPointerUp={onLogHandleUp}
            onPointerCancel={onLogHandleUp}
            className="flex shrink-0 cursor-grab touch-none select-none justify-center pb-2 pt-3 active:cursor-grabbing"
          >
            <span className="h-1 w-9 rounded-full bg-border" />
          </div>
          <div className="min-h-0 flex-1 overflow-hidden px-3 pb-3">
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
    </div>
  );
}
