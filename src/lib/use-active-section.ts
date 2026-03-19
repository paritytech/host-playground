"use client";

import { useEffect, useRef, useState } from "react";

export function useActiveSection(sectionIds: string[]) {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? "");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const ratioMap = new Map<string, number>();

    const headerHeight = parseInt(
      getComputedStyle(document.documentElement)
        .getPropertyValue("--header-height"),
      10,
    ) || 80;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratioMap.set(entry.target.id, entry.intersectionRatio);
        }

        let best = "";
        let bestRatio = 0;
        for (const id of sectionIds) {
          const ratio = ratioMap.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }
        if (best) setActiveId(best);
      },
      {
        rootMargin: `-${headerHeight}px 0px -40% 0px`,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observerRef.current.observe(el);
    }

    return () => observerRef.current?.disconnect();
  }, [sectionIds]);

  return activeId;
}
