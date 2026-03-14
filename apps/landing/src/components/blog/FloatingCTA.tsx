import { useState, useEffect, useCallback } from "react";
import { IconCrossMedium } from "@central-icons-react/round-outlined-radius-2-stroke-2";

interface FloatingCTAProps {
  readonly ctaText: string;
  readonly ctaUrl: string;
}

const SCROLL_THRESHOLD = 0.4;

/**
 * A sticky bottom CTA that appears after the reader scrolls 40% of the page.
 *
 * - Mobile: full-width bottom bar (~50px).
 * - Desktop: bottom-right floating card (max 400px wide).
 * - Dismiss button hides it for the current page view (no persistence).
 */
export default function FloatingCTA({ ctaText, ctaUrl }: FloatingCTAProps) {
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
    <div
      role="complementary"
      aria-label="Call to action"
      className="fixed bottom-0 inset-x-0 z-50 flex justify-end pointer-events-none md:bottom-4 md:right-4 md:left-auto"
    >
      <div className="pointer-events-auto flex w-full items-center justify-between gap-3 border-t border-mist-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm md:w-auto md:max-w-[400px] md:rounded-xl md:border md:border-mist-200">
        <a
          href={ctaUrl}
          className="inline-flex items-center justify-center rounded-full bg-mist-950 px-4 py-1.5 text-sm font-medium text-white hover:bg-mist-800 transition-colors"
        >
          {ctaText}
        </a>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss call to action"
          className="inline-flex items-center justify-center rounded-full p-1.5 text-mist-400 hover:text-mist-700 hover:bg-mist-100 transition-colors"
        >
          <IconCrossMedium className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
