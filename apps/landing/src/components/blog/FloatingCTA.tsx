import { useState, useEffect, useCallback } from "react";
import { IconCrossMedium } from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { trackCtaClick } from "@/lib/analytics-events";
import { useT } from "@/lib/i18n";

interface FloatingCTAProps {
  readonly ctaText: string;
  readonly ctaUrl: string;
  readonly slug?: string;
}

const SCROLL_THRESHOLD = 0.4;
const DISMISS_KEY = "blog-cta-dismissed";

/**
 * The reading-progress CTA: one hairline bar across the foot of the window,
 * appearing once the reader is 40% down the article.
 *
 * Rebuilt rather than adjusted. The previous version was a floating card —
 * `md:rounded-xl md:border` pinned to `bottom-4 right-4` — and its own comment
 * claimed "no shadow and no backdrop blur: the page grammar has exactly one
 * elevation (flat) and one edge (hairline)" while the rounded, detached card
 * was itself a second elevation. A panel hovering over the page is the one
 * shape this site does not have anywhere else.
 *
 * Three things the card got wrong beyond the style:
 *
 *   - It sat exactly where the Helpway chat launcher sits, so on a real page
 *     the two overlapped in the bottom-right corner.
 *   - Dismissing it lasted until the next navigation, so it reappeared on every
 *     article. It now writes to `sessionStorage`, which is the right lifetime:
 *     forgotten when the visit ends, respected for the whole of it.
 *   - Its `aria-label`s were hardcoded English on a site that ships 22 locales.
 *
 * As a full-width bar it also stops competing for the corner: the chat bubble
 * floats above it instead of beside it, and the bar's content aligns to the
 * same container as the article rather than to the viewport edge.
 */
export default function FloatingCTA({ ctaText, ctaUrl, slug }: FloatingCTAProps) {
  const t = useT("blog");
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  /* Read the stored dismissal in an effect, not in `useState`'s initialiser:
     `sessionStorage` does not exist during SSR, and seeding state from it would
     make the server and the first client render disagree. */
  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === "1") setDismissed(true);
    } catch {
      /* Private-mode storage denial is not a reason to hide the CTA. */
    }
  }, []);

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
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* Not persisting is a smaller failure than throwing on click. */
    }
  }, []);

  if (dismissed || !visible) {
    return null;
  }

  return (
    <aside
      aria-label={t("floatingCta.label")}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-black/[0.07] bg-white"
    >
      {/*
        `pr-20` on the right: the chat launcher occupies that corner, and text
        running underneath it is unreadable. The bar owns the full width and
        simply keeps its content clear of the bubble.

        z-40, under the chat launcher rather than over it — a support widget a
        reader has opened must not be covered by marketing.
      */}
      {/* Only the button and the dismiss — `ctaText` is the single string this
          component is given, so there is no second line to write without
          inventing copy. I had it rendered twice for a moment; a bar that says
          the same sentence as its own button reads like a mistake. */}
      <div className="mx-auto flex max-w-[1160px] items-center justify-end gap-1 px-6 py-3 pr-20 sm:px-10">
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
            aria-label={t("floatingCta.dismiss")}
            className="inline-flex items-center justify-center rounded-md p-1.5 text-mist-400 transition-colors hover:bg-black/[0.03] hover:text-mist-700"
          >
            <IconCrossMedium className="size-4" />
          </button>
      </div>
    </aside>
  );
}
