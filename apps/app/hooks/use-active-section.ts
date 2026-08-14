"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "host-playground:active-section";

/** Falls back to this when the CSS variable is missing, e.g. before hydration. */
const DEFAULT_HEADER_HEIGHT = 80;

export function useActiveSection(sectionIds: string[]): string {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? "");
  const restored = useRef(false);

  // Callers pass a freshly-built array each render, so key the effect on the
  // contents. Otherwise it re-subscribes on every render and the scroll a
  // sidebar click starts fights the one the effect restores.
  const key = sectionIds.join(",");
  const ids = useMemo(() => key.split(",").filter(Boolean), [key]);

  useEffect(() => {
    const headerHeight =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--header-height",
        ),
        10,
      ) || DEFAULT_HEADER_HEIGHT;

    let lastSaved = "";
    const update = () => {
      const offset = headerHeight + 8;
      let bestId = ids[0] ?? "";

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= offset) {
          bestId = id;
        }
      }
      setActiveId(bestId);
      if (bestId && bestId !== lastSaved) {
        lastSaved = bestId;
        localStorage.setItem(STORAGE_KEY, bestId);
      }
    };

    // Restore the last-viewed section on load by scrolling to it, then let
    // `update` derive the active id from the restored scroll position.
    if (!restored.current) {
      restored.current = true;
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && ids.includes(saved)) {
        document
          .getElementById(saved)
          ?.scrollIntoView({ behavior: "auto", block: "start" });
      }
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [ids]);

  return activeId;
}
