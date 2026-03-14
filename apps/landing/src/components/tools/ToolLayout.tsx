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
  readonly titleHighlight?: string;
  readonly description: string;
  readonly eyebrow?: string;
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
  titleHighlight,
  description,
  eyebrow,
  currentSlug,
  locale,
  faqItems,
  breadcrumbs,
  ctaText,
  ctaHref = "https://dash.better-i18n.com",
}: ToolLayoutProps) {
  return (
    <MarketingLayout
      bgClassName="bg-mist-50"
      showCTA={false}
      breadcrumbs={breadcrumbs}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <ToolHero
          title={title}
          titleHighlight={titleHighlight}
          description={description}
          eyebrow={eyebrow}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">{children}</div>

      {faqItems && faqItems.length > 0 && <ToolFAQ items={faqItems} />}

      <RelatedTools currentSlug={currentSlug} locale={locale} />

      {ctaText && (
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="py-16 sm:py-20">
            <div className="bg-mist-50 rounded-2xl p-10 sm:p-14 text-center">
              <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 mb-4">
                Ready to scale your i18n?
              </h2>
              <p className="text-mist-700 mb-6 max-w-lg mx-auto">{ctaText}</p>
              <a
                href={ctaHref}
                className="inline-flex items-center gap-2 rounded-full bg-mist-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-mist-800 transition-colors"
              >
                Get started free →
              </a>
            </div>
          </div>
        </div>
      )}
    </MarketingLayout>
  );
}
