/**
 * Full-page wrapper for the seven tool pages.
 *
 * This composes the page grammar (`ui/page.tsx`) rather than a parallel one of
 * its own, which is the point of the rewrite: the tool pages were not
 * "forgotten" in the redesign — they had their own layout system, so converting
 * them one by one would have been seven edits to fix what is one component.
 *
 * What was wrong, in the order it mattered:
 *
 *   1. `bgClassName="bg-mist-50"` put every tool page on a tinted canvas, the
 *      one thing `rule/white-page-hairline-separation` exists to remove. It is
 *      why these pages read as belonging to a different site.
 *
 *   2. `<ToolHero>` rendered `{title}` and `{titleHighlight}` side by side
 *      inside one `<h1>`. When both keys resolve to nothing, `useT` humanises
 *      them and the heading becomes the literal string "TitleTitle Highlight" —
 *      which is what Google has indexed as our sitelink text for this site. A
 *      key named `titleHighlight` describes its COLOUR, not its role, and a
 *      heading assembled from two such keys has no single source of truth. The
 *      h1 is now one string; see the note on the prop.
 *
 *   3. The closing band was hand-rolled — `bg-mist-50 rounded-xl p-10
 *      text-center` — with an English `<h2>` ("Ready to scale your i18n?") and
 *      an English link label ("Get started free") baked into the JSX. Both
 *      shipped untranslated to all 22 locales. The page now closes with the
 *      shared `<CTA />` band that MarketingLayout renders on the other 104
 *      pages, whose copy lives in the already-translated `cta` namespace.
 *
 *   4. Sections were `<div className="section">` with no dividers, so the page
 *      had no boundaries. `<Section>` + `<Divider />` now.
 *
 * `ToolHero` is deleted rather than left unused. It was the only place that
 * centred a two-tone heading, and keeping a component whose whole shape is the
 * defect above is an invitation to reuse it.
 */

import { MarketingLayout } from "@/components/MarketingLayout";
import { Divider, PageHero, Section } from "@/components/ui/page";
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
  /**
   * Optional continuation of the heading.
   *
   * Kept for the pages that genuinely have a two-part title, but it is now
   * concatenated into ONE `<h1>` string rather than being a second element
   * inside it. The difference shows when a key is missing: the old markup
   * produced a visible "TitleTitle Highlight", and Google indexed it.
   */
  readonly titleHighlight?: string;
  readonly description: string;
  readonly subtitle?: string;
  readonly eyebrow?: string;
  readonly currentSlug: string;
  readonly locale: string;
  readonly faqItems?: readonly FAQItem[];
  readonly breadcrumbs?: readonly BreadcrumbItem[];
}

export function ToolLayout({
  children,
  title,
  titleHighlight,
  description,
  subtitle,
  eyebrow,
  currentSlug,
  locale,
  faqItems,
  breadcrumbs,
}: ToolLayoutProps) {
  return (
    /* White, like every other page. The dividers below do the separating that
       `bg-mist-50` used to attempt.

       `showCTA` is left at its default, so these pages close with the same
       <CTA /> band MarketingLayout renders on the other 104 — which is the
       point. The hand-rolled band this replaces took its copy from a `ctaText`
       prop that every caller filled with an English literal ("Manage all your
       ICU messages in Better I18N" and four others), so 22 locales were served
       English. The shared band's copy lives in the `cta` namespace and is
       already translated everywhere. A generic line that a reader can actually
       read beats a specific one they cannot. */
    <MarketingLayout breadcrumbs={breadcrumbs}>
      <PageHero
        pillarLabel={eyebrow}
        titleId="tool-hero-title"
        /* One string, not two nodes — see `titleHighlight` above. */
        title={titleHighlight ? `${title} ${titleHighlight}` : title}
        subtitle={description}
      />

      <Divider />

      <Section labelledBy="tool-hero-title">
        {/* `subtitle` is a qualifier on the tool, not a second lede: it sits
            above the tool at meta size rather than competing with the h1's
            subtitle in the hero. */}
        {subtitle && (
          <p className="mb-8 max-w-[68ch] text-[13px] leading-relaxed text-mist-500">
            {subtitle}
          </p>
        )}
        {children}
      </Section>

      {faqItems && faqItems.length > 0 && (
        <>
          <Divider />
          <ToolFAQ items={faqItems} />
        </>
      )}

      <Divider />
      <RelatedTools currentSlug={currentSlug} locale={locale} />
    </MarketingLayout>
  );
}
