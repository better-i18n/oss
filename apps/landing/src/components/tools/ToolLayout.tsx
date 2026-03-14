/**
 * Full-page wrapper for tool pages.
 * Composes MarketingLayout + ToolHero + tool content + ToolFAQ + RelatedTools + CTA.
 */

import { MarketingLayout } from "@/components/MarketingLayout";
import { ToolHero } from "./ToolHero";
import { ToolFAQ } from "./ToolFAQ";
import { RelatedTools } from "./RelatedTools";
import type { ReactNode } from "react";

interface BreadcrumbItem {
  readonly label: string;
  readonly href?: string;
}

interface FAQItem {
  readonly question: string;
  readonly answer: string;
}

interface ToolLayoutProps {
  readonly children: ReactNode;
  readonly title: string;
  readonly description: string;
  readonly subtitle?: string;
  readonly currentSlug: string;
  readonly locale: string;
  readonly faqItems?: readonly FAQItem[];
  readonly breadcrumbs?: readonly BreadcrumbItem[];
  readonly ctaText?: string;
  readonly ctaHref?: string;
}

export function ToolLayout({
  children,
  title,
  description,
  subtitle,
  currentSlug,
  locale,
  faqItems,
  breadcrumbs,
  ctaText = "Start free trial",
  ctaHref = "https://dash.better-i18n.com",
}: ToolLayoutProps) {
  return (
    <MarketingLayout
      bgClassName="bg-mist-50"
      showCTA={false}
      breadcrumbs={breadcrumbs}
    >
      <ToolHero title={title} description={description} subtitle={subtitle} />

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">{children}</div>

      {faqItems && faqItems.length > 0 && <ToolFAQ items={faqItems} />}

      <RelatedTools currentSlug={currentSlug} locale={locale} />

      <section className="border-t border-mist-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1]">
              Ready to go global?
            </h2>
            <p className="max-w-2xl text-base/7 text-mist-700">
              Manage all your translations in one place. Type-safe SDKs,
              AI-powered translations, and real-time collaboration.
            </p>
            <div className="flex items-center gap-4">
              <a
                href={ctaHref}
                className="inline-flex items-center justify-center rounded-xl bg-mist-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-mist-800"
              >
                {ctaText}
              </a>
              <a
                href="https://cal.com/better-i18n/30min?overlayCalendar=true"
                className="text-sm font-medium text-mist-700 hover:text-mist-950"
              >
                Book a demo
              </a>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
