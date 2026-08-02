import { useState, useEffect, useCallback } from "react";
import { IconCrossMedium } from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { trackCtaClick } from "@/lib/analytics-events";

interface FloatingCTAProps {
  readonly ctaText: string;
  readonly ctaUrl: string;
  readonly slug?: string;
}

const SCROLL_THRESHOLD = 0.4;

/**
 * A sticky bottom CTA that appears after the reader scrolls 40% of the page.
 *
 * - Mobile: full-width bottom bar (~50px).
 * - Desktop: bottom-right floating card (max 400px wide).
 * - Dismiss button hides it for the current page view (no persistence).
 */
export default function FloatingCTA({ ctaText, ctaUrl, slug }: FloatingCTAProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const ratio = docHeight > 0 ? scrollTop / docHeight : 0;
      setVisible(ratio >= SCROLL_THRESHOLD);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
  }, []);

  if (dismissed || !visible) {
    return null;
  }

  return (
    <aside
      aria-label="Call to action"
      className="fixed bottom-0 inset-x-0 z-50 flex justify-end pointer-events-none md:bottom-4 md:right-4 md:left-auto"
    >
      {/* Opaque white on a hairline, no shadow and no backdrop blur: the page
          grammar has exactly one elevation (flat) and one edge (hairline). */}
      <div className="pointer-events-auto flex w-full items-center justify-between gap-3 border-t border-black/[0.07] bg-white px-4 py-3 md:w-auto md:max-w-[400px] md:rounded-xl md:border md:border-black/[0.07]">
        <a
          href={ctaUrl}
          onClick={() =>
            trackCtaClick({
              cta_id: "blog_floating_cta",
              cta_text: ctaText,
              page_type: "blog",
              content_id: slug,
            })
          }
          className="btn btn-dark btn-sm"
        >
          {ctaText}
        </a>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss call to action"
          className="inline-flex items-center justify-center rounded-md p-1.5 text-mist-400 transition-colors hover:bg-black/[0.03] hover:text-mist-700"
        >
          <IconCrossMedium className="size-4" />
        </button>
      </div>
    </aside>
  );
}
