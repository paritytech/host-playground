"use client";

import { Fragment } from "react";
import { type LucideIcon } from "lucide-react";
import { SearchField } from "@/components/search-field";
import type { TestCategory } from "@/lib/types";
import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/utils/logs";

interface CategoryItem {
  id: TestCategory;
  title: string;
  icon: LucideIcon;
  count: number;
}

interface Connection {
  label: string;
  wsUrl?: string;
  papiNetworkId?: string;
}

interface CategoryGroup {
  label: string;
  items: CategoryItem[];
}

interface SidebarNavProps {
  groups: CategoryGroup[];
  connections: Connection[];
  version: string;
  query: string;
  onQueryChange: (query: string) => void;
  /** Categories that currently have matching tests. Others are dimmed. */
  visibleIds: Set<TestCategory>;
  /** Hide the in-sidebar search field. The mobile top bar owns search there. */
  showSearch?: boolean;
  /** Called after a category tap so the mobile drawer can close itself. */
  onNavigate?: () => void;
}

// Prefer the PAPI light-client entry for chains it ships a spec for. Otherwise
// point the explorer at the raw RPC via the `custom` networkId. Either way the
// endpoint lives in the hash, so it never hits a server.
function explorerUrl({ wsUrl, papiNetworkId }: Connection): string {
  const query = papiNetworkId
    ? `networkId=${papiNetworkId}&endpoint=light-client`
    : `networkId=custom&endpoint=${encodeURIComponent(wsUrl ?? "")}`;
  return `https://dev.papi.how/explorer#${query}`;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </span>
  );
}

function scrollToSection(id: TestCategory) {
  document
    .getElementById(`section-${id}`)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function SidebarNav({
  groups,
  connections,
  version,
  query,
  onQueryChange,
  visibleIds,
  showSearch = true,
  onNavigate,
}: SidebarNavProps) {
  const activeId = useActiveSection(
    groups.flatMap((g) => g.items.map((c) => `section-${c.id}`)),
  );
  const isSearching = query.trim().length > 0;

  return (
    <nav className="flex h-full flex-col overflow-hidden border-r border-border/60 bg-background">
      {/* Brand */}
      <div className="shrink-0 px-5 pb-4 pt-6">
        <h1 className="whitespace-nowrap text-lg font-semibold tracking-tight text-foreground">
          Host Playground
        </h1>
        <div className="mt-1 truncate text-xs text-muted-foreground">
          {version}
        </div>
      </div>

      {showSearch && (
        <div className="px-4 pb-1 pt-2">
          <SearchField value={query} onChange={onQueryChange} />
        </div>
      )}

      {/* Categories, grouped */}
      <div className="flex-1 overflow-hidden px-2.5 pb-3 pt-4">
        {groups.map((group, groupIndex) => (
          <div key={group.label} className={cn(groupIndex > 0 && "mt-6")}>
            <div className="px-2.5 pb-2">
              <SectionLabel>{group.label}</SectionLabel>
            </div>
            <div className="space-y-0.5">
              {group.items.map((cat) => {
                const isActive = activeId === `section-${cat.id}`;
                const isDimmed = isSearching && !visibleIds.has(cat.id);
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      scrollToSection(cat.id);
                      onNavigate?.();
                    }}
                    disabled={isDimmed}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-1.5 text-left text-sm transition-colors",
                      isDimmed ? "cursor-default opacity-40" : "cursor-pointer",
                      isActive
                        ? "bg-muted font-semibold text-foreground"
                        : "font-medium text-foreground/90",
                      !isDimmed && !isActive && "hover:bg-muted/60",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        isActive ? "text-foreground" : "text-muted-foreground",
                      )}
                      strokeWidth={2}
                    />
                    <span className="flex-1 truncate">{cat.title}</span>
                    <span className="shrink-0 text-xs tabular-nums text-muted-foreground/60">
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Connections, a faint inline row of PAPI explorer links */}
      <div className="flex flex-wrap items-center justify-center border-t border-border/60 px-5 py-3 text-xs text-muted-foreground/70">
        {connections.map((conn, i) => (
          <Fragment key={conn.label}>
            {i > 0 && (
              <span
                aria-hidden
                style={{ marginInline: "0.9rem" }}
                className="text-muted-foreground/30"
              >
                &bull;
              </span>
            )}
            <a
              href={explorerUrl(conn)}
              target="_blank"
              rel="noopener noreferrer"
              title={`Open ${conn.label} in the PAPI explorer`}
              className="transition-colors hover:text-foreground"
            >
              {conn.label}
            </a>
          </Fragment>
        ))}
      </div>
    </nav>
  );
}
