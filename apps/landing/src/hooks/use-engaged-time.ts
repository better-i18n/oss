import { useEffect } from "react";
import { trackTimeOnPage } from "@/lib/analytics-events";

const THRESHOLDS = [30, 60, 120, 300] as const;

/**
 * Tracks engaged time on a page, firing analytics events at
 * 30s, 60s, 120s, and 300s thresholds.
 *
 * Pauses counting when the tab is hidden (document.hidden).
 * Each threshold fires only once per mount.
 */
export function useEngagedTime(pageType: string, contentId?: string) {
  useEffect(() => {
    const fired = new Set<number>();
    let elapsed = 0;

    const interval = setInterval(() => {
      if (document.hidden) return; // don't count hidden tabs
      elapsed++;
      for (const t of THRESHOLDS) {
        if (elapsed >= t && !fired.has(t)) {
          fired.add(t);
          trackTimeOnPage({ page_type: pageType, content_id: contentId, seconds: t });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [pageType, contentId]);
}
