"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Menu, ScrollText } from "lucide-react";
import { Card, CardContent } from "@/components/card";
import { LogViewer } from "@/components/log-viewer";
import { SearchField } from "@/components/search-field";
import { TestCategoryCard } from "@/components/test-category";
import { SidebarNav } from "@/components/sidebar-nav";
import { useInsideHost } from "@/hooks/use-inside-host";
import { useLogs } from "@/hooks/use-logs";
import { useSheetDrag } from "@/hooks/use-sheet-drag";
import {
  CATEGORY_ICONS,
  CATEGORY_INFO,
  ORDERED_CATEGORIES,
  SIDEBAR_GROUPS,
} from "@/lib/categories";
import { resolveTestArgs, testsByCategory } from "@/lib/tests";
import { ACTIVE_CHAIN, type TestDefinition } from "@/lib/types";
import { cn, stringify } from "@/utils/logs";
import { withTimeout } from "@/utils/with-timeout";
import pkg from "@root/package.json";

const SDK_VERSION_LABEL = `@parity/product-sdk ${pkg.dependencies["@parity/product-sdk"].replace(/^[\^~]/, "")}`;

const TEST_TIMEOUT_MS = 30_000;

const DESKTOP_QUERY = "(min-width: 1024px)";
const MOBILE_QUERY = "(max-width: 1023px)";

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

export default function Home() {
  const { push: navigate } = useRouter();
  const { logs, log, updateLog, clearLogs, exportLogs } = useLogs();
  const [runningTest, setRunningTest] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [navOpen, setNavOpen] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);
  const insideHost = useInsideHost();

  const logSheetRef = useRef<HTMLDivElement>(null);
  const logDrag = useSheetDrag(logSheetRef, () => setLogsOpen(false));

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
      if (window.matchMedia(DESKTOP_QUERY).matches) {
        setNavOpen(false);
        setLogsOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const query = search.trim().toLowerCase();
  const isSearching = query.length > 0;
  const visibleCategories = ORDERED_CATEGORIES.map((category) => {
    const all = testsByCategory[category];
    if (!isSearching) return { category, tests: all };
    const titleMatch = CATEGORY_INFO[category].title
      .toLowerCase()
      .includes(query);
    const tests = titleMatch
      ? all
      : all.filter((test) => testMatchesQuery(test, query));
    return { category, tests };
  }).filter((entry) => entry.tests.length > 0);
  const visibleIds = new Set(visibleCategories.map((entry) => entry.category));

  const runTest = useCallback(
    async (test: TestDefinition, args?: Record<string, string>) => {
      setRunningTest(test.id);
      // On mobile the logs live in a sheet, so surface it when a test starts.
      if (window.matchMedia(MOBILE_QUERY).matches) setLogsOpen(true);
      const logId = log(test.name, "pending", "Running...");

      try {
        const result = await withTimeout(
          test.run({
            chain: ACTIVE_CHAIN,
            log: (message) => updateLog(logId, "pending", message),
            args: await resolveTestArgs(test, args),
            navigate,
          }),
          test.timeoutMs ?? TEST_TIMEOUT_MS,
          test.name,
        );
        const outcome =
          result.outcome ?? (result.success ? "supported" : "failed");
        updateLog(
          logId,
          result.success ? "success" : "error",
          result.message,
          result.details ? stringify(result.details) : undefined,
          outcome,
        );
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : JSON.stringify(e);
        updateLog(logId, "error", message, undefined, "failed");
      } finally {
        setRunningTest(null);
      }
    },
    [log, updateLog, navigate],
  );

  if (insideHost === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!insideHost) {
    return <NotInHostScreen />;
  }

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
          <SearchField
            value={search}
            onChange={setSearch}
            placeholder="Search tests"
            size="lg"
          />
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
                    title={CATEGORY_INFO[category].title}
                    description={CATEGORY_INFO[category].description}
                    icon={CATEGORY_ICONS[category]}
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
            logDrag.dragging
              ? {
                  opacity: Math.max(
                    0,
                    1 - logDrag.offset / (logDrag.height || 1),
                  ),
                  transition: "none",
                }
              : undefined
          }
        />
        <div
          ref={logSheetRef}
          className="absolute inset-x-0 bottom-0 flex h-[60vh] flex-col rounded-t-2xl bg-background pb-[env(safe-area-inset-bottom)] shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
          style={{
            transform: logDrag.dragging
              ? `translateY(${logDrag.offset}px)`
              : logsOpen
                ? "translateY(0)"
                : "translateY(100%)",
            transition: logDrag.dragging ? "none" : undefined,
          }}
        >
          <div
            {...logDrag.handlers}
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
