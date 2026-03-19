"use client";

import type { TestCategory } from "@/src/lib/types";
import { useActiveSection } from "@/src/lib/use-active-section";
import { cn } from "@/src/lib/utils";

interface CategoryItem {
  id: TestCategory;
  title: string;
  icon: string;
  count: number;
}

interface SidebarNavProps {
  categories: CategoryItem[];
}

export function SidebarNav({ categories }: SidebarNavProps) {
  const sectionIds = categories.map((c) => `section-${c.id}`);
  const activeId = useActiveSection(sectionIds);

  return (
    <nav className="space-y-1">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
        Categories
      </div>
      {categories.map((cat) => {
        const isActive = activeId === `section-${cat.id}`;
        return (
          <button
            key={cat.id}
            onClick={() => {
              const el = document.getElementById(`section-${cat.id}`);
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors text-left cursor-pointer",
              isActive
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
            )}
          >
            <span className="text-base shrink-0">{cat.icon}</span>
            <span className="truncate flex-1">{cat.title}</span>
            <span
              className={cn(
                "text-xs tabular-nums shrink-0 rounded-full px-1.5 py-0.5",
                isActive
                  ? "bg-foreground/10 text-foreground"
                  : "text-muted-foreground/60",
              )}
            >
              {cat.count}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
