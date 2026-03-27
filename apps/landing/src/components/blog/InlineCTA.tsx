import { SpriteIcon } from "@/components/SpriteIcon";
import { trackCtaClick } from "@/lib/analytics-events";

interface InlineCTAProps {
  readonly title: string;
  readonly description: string;
  readonly ctaText: string;
  readonly ctaUrl: string;
  readonly variant?: "default" | "subtle";
  readonly slug?: string;
}

/**
 * A contextual CTA component designed to sit within blog body content.
 *
 * - "default" variant: light background card with border and a button.
 * - "subtle" variant: minimal inline text with an arrow link.
 *
 * Both variants are capped at ~80px height on mobile to stay non-intrusive.
 */
export default function InlineCTA({
  title,
  description,
  ctaText,
  ctaUrl,
  variant = "default",
  slug,
}: InlineCTAProps) {
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
    <aside
      className="my-8 flex flex-col gap-2 rounded-xl border border-mist-150 bg-mist-50/60 px-5 py-4 not-prose sm:flex-row sm:items-center sm:justify-between"
      aria-label={title}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-mist-900 leading-snug">
          {title}
        </p>
        <p className="mt-0.5 text-sm text-mist-600 leading-snug truncate">
          {description}
        </p>
      </div>
      <a
        href={ctaUrl}
        onClick={handleCtaClick}
        className="inline-flex shrink-0 items-center justify-center rounded-full bg-mist-950 px-4 py-2 text-sm font-medium text-white hover:bg-mist-800 transition-colors"
      >
        {ctaText}
      </a>
    </aside>
  );
}
