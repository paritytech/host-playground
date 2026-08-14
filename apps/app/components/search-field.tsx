"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/utils/logs";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Touch targets are taller in the mobile top bar than in the sidebar. */
  size?: "sm" | "lg";
}

export function SearchField({
  value,
  onChange,
  placeholder = "Search",
  size = "sm",
}: SearchFieldProps) {
  const isSearching = value.trim().length > 0;
  const large = size === "lg";

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search tests"
        className={cn(
          "w-full appearance-none rounded-lg border border-border/70 bg-card pl-9 pr-9 leading-none text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground/30 focus:ring-2 focus:ring-foreground/10",
          large ? "h-11 text-base" : "h-9 text-sm",
        )}
      />
      {isSearching && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className={cn(
            "absolute right-2 top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
            large ? "h-6 w-6" : "h-5 w-5",
          )}
        >
          <X className={large ? "h-4 w-4" : "h-3.5 w-3.5"} />
        </button>
      )}
    </div>
  );
}
