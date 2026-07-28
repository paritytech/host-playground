"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "host-playground:active-section";

export function useActiveSection(sectionIds: string[]): string {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? "");
  // This effect re-runs on every render because sectionIds is a fresh array
  // each time, so guard the one-time scroll restore. Otherwise it re-fires on
  // the re-render a sidebar click causes and fights the scroll from that click.
  const restored = useRef(false);

  useEffect(() => {
    const headerHeight =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--header-height",
        ),
        10,
      ) || 80;

    let lastSaved = "";
    const update = () => {
      const offset = headerHeight + 8;
      let bestId = sectionIds[0] ?? "";

      for (const id of sectionIds) {
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
      if (saved && sectionIds.includes(saved)) {
        document
          .getElementById(saved)
          ?.scrollIntoView({ behavior: "auto", block: "start" });
      }
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [sectionIds]);

  return activeId;
}
