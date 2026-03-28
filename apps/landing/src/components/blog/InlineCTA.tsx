"use client";

import { useState, useEffect } from "react";
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

const ROTATING_MESSAGES = [
  {
    title: "Ship multilingual products faster",
    description:
      "Better i18n automates translation workflows so you can focus on building.",
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
      "Join growing teams who ship faster and reach more users with Better i18n.",
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
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % ROTATING_MESSAGES.length);
        setFading(false);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const { title, description } = ROTATING_MESSAGES[index];
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
          {/* Rotating text */}
          <div
            className="min-w-0 transition-opacity duration-300"
            style={{ opacity: fading ? 0 : 1 }}
          >
            <p className="text-[15px] font-semibold leading-snug text-white">
              {title}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-white/60">
              {description}
            </p>
          </div>

          {/* Shimmer CTA button */}
          <a
            href={ctaUrl}
            onClick={handleCtaClick}
            className="relative inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-mist-950 transition-all hover:bg-white/90 hover:shadow-lg"
          >
            {/* Shimmer sweep */}
            <span
              className="pointer-events-none absolute inset-0 -translate-x-full"
              aria-hidden="true"
              style={{
                background:
                  "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.6) 50%, transparent 60%)",
                animation: "shimmer-sweep 2.5s ease-in-out infinite",
                animationDelay: "1s",
              }}
            />
            <span className="relative">{ctaText}</span>
            <SpriteIcon name="arrow-right" className="relative w-4 h-4" />
          </a>
        </div>
      </div>
    </aside>
  );
}
