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
      className="my-10 not-prose overflow-hidden rounded-2xl bg-mist-950"
      aria-label={title}
    >
      <div className="relative px-7 py-7 sm:px-8 sm:py-8">
        {/* Decorative radial glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 100% 110%, rgba(255,255,255,0.12) 0%, transparent 70%)",
          }}
        />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-[15px] font-semibold leading-snug text-white">
              {title}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-white/60">
              {description}
            </p>
          </div>
          <a
            href={ctaUrl}
            onClick={handleCtaClick}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-mist-950 transition-all hover:bg-white/90 hover:shadow-lg"
          >
            {ctaText}
            <SpriteIcon name="arrow-right" className="w-4 h-4" />
          </a>
        </div>
      </div>
    </aside>
  );
}
