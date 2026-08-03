"use client";

import { SpriteIcon } from "@/components/SpriteIcon";
import { trackCtaClick } from "@/lib/analytics-events";

/**
 * The ask inside an article.
 *
 * Two things changed and both are about volume. The panel was
 * `overflow-hidden rounded-xl bg-mist-950` — a dark slab dropped into a white
 * page, which the motto rules out outright; it is now the page's own hairline
 * frame with the article's own type sizes, so it reads as a paragraph with a
 * border rather than an advertisement.
 *
 * And the copy no longer rotates. A 5s `setInterval` swapping the headline
 * behind a 300ms fade is motion competing with prose the reader is in the middle
 * of — the loudest thing on the page was the CTA moving. The five messages are
 * still all in use; the article picks one deterministically from its slug, so a
 * given post always shows the same line (no timer, no fade, no server/client
 * mismatch, and no `prefers-reduced-motion` special case to get wrong).
 */

interface InlineCTAProps {
  readonly title: string;
  readonly description: string;
  readonly ctaText: string;
  readonly ctaUrl: string;
  readonly variant?: "default" | "subtle";
  readonly slug?: string;
}

const ROTATING_MESSAGES = [
  {
    title: "Ship multilingual products faster",
    description:
      "Better I18N automates translation workflows so you can focus on building.",
  },
  {
    title: "Translate with AI. Ship with confidence.",
    description:
      "Context-aware AI translations, Git-native sync, and instant CDN delivery.",
  },
  {
    title: "Free to get started — no credit card required",
    description:
      "Add localization to your app in minutes and go global from day one.",
  },
  {
    title: "Already trusted by 66+ teams worldwide",
    description:
      "Join growing teams who ship faster and reach more users with Better I18N.",
  },
  {
    title: "From code to global in under 5 minutes",
    description:
      "One SDK, instant CDN delivery, zero build step — localization that scales.",
  },
] as const;

export default function InlineCTA({
  ctaUrl,
  variant = "default",
  slug,
}: InlineCTAProps) {
  /* Stable per article: sum of the slug's char codes, so the same post always
     shows the same message and SSR and hydration agree. */
  const seed = (slug ?? "").split("").reduce((n, c) => n + c.charCodeAt(0), 0);
  const { title, description } = ROTATING_MESSAGES[seed % ROTATING_MESSAGES.length]!;
  const ctaText = "Get started free";

  const handleCtaClick = () => {
    trackCtaClick({
      cta_id: variant === "subtle" ? "blog_inline_cta_subtle" : "blog_inline_cta",
      cta_text: ctaText,
      page_type: "blog",
      content_id: slug,
    });
  };

  if (variant === "subtle") {
    return (
      <aside
        className="my-8 flex items-center gap-3 py-3 not-prose"
        aria-label={title}
      >
        <span className="text-sm text-mist-600">
          <span className="font-medium text-mist-800">{title}</span>
          {" — "}
          {description}
        </span>
        <a
          href={ctaUrl}
          onClick={handleCtaClick}
          className="inline-flex shrink-0 items-center gap-0.5 text-sm font-medium text-mist-950 hover:text-mist-700 transition-colors"
        >
          {ctaText}
          <SpriteIcon name="chevron-right" className="w-3.5 h-3.5" />
        </a>
      </aside>
    );
  }

  return (
    /* One frame, one padding step. `p-6` matches the article's own left gutter,
       so the panel sits on the prose measure instead of indenting inside it. */
    <aside
      className="my-10 not-prose rounded-xl border border-black/[0.07] bg-white p-6"
      aria-label={title}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-[15px] font-medium leading-snug tracking-[-0.015em] text-mist-900">
            {title}
          </p>
          <p className="mt-1.5 max-w-[52ch] text-[13px] leading-relaxed text-mist-600">
            {description}
          </p>
        </div>

        <a
          href={ctaUrl}
          onClick={handleCtaClick}
          className="btn btn-dark btn-sm shrink-0"
        >
          {ctaText}
          <SpriteIcon name="arrow-right" className="size-4" />
        </a>
      </div>
    </aside>
  );
}
