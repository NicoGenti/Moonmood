"use client";

import { useEffect, useState } from "react";
import { isMatchMediaAvailable } from "@/lib/matchMedia";

/**
 * Returns `true` when the viewport width is ≤ 768 px, `false` otherwise.
 * Handles SSR safely (returns `false` on the server) and updates reactively
 * when the viewport crosses the breakpoint.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (!isMatchMediaAvailable()) return false;
    return window.matchMedia("(max-width: 768px)").matches;
  });

  useEffect(() => {
    if (!isMatchMediaAvailable()) return;

    const mq = window.matchMedia("(max-width: 768px)");

    const handler = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    // Keep initial value in sync (handles hydration edge cases)
    setIsMobile(mq.matches);

    mq.addEventListener("change", handler);
    return () => {
      mq.removeEventListener("change", handler);
    };
  }, []);

  return isMobile;
}
