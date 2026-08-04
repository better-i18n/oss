import { createFileRoute } from "@tanstack/react-router";
import { getPageHead, createPageLoader, formatStructuredData } from "@/lib/page-seo";
import { getFAQSchema, getOrganizationSchema } from "@/lib/structured-data";
import { MarketingLayout } from "@/components/MarketingLayout";
import { ToolCard } from "@/components/tools/ToolCard";
import {
  Divider,
  FaqSection,
  PageHero,
  Section,
  SectionHeader,
} from "@/components/ui/page";
import { TOOL_REGISTRY } from "@/lib/tools/registry";
import { useT } from "@/lib/i18n";

/**
 * /tools/ — the hub for the five free tools.
 *
 * This page hand-rolled its own shell: a `bg-mist-50` canvas with a
 * `border-b bg-white` hero band, three bare `<section>` blocks, and its own
 * closing CTA with hand-written button classes. It is a marketing page around
 * the tools, not a tool itself, so `rule/tools-grammar-stops-at-the-tool` puts
 * all of it under the page grammar with no exemption: PageHero → Divider →
 * Section(SectionHeader) → FaqSection → the shared CTA band.
 *
 * The FAQ moves to the shared `<FaqSection>` — `FaqList`'s own contract says
 * there must be exactly one FAQ archetype in this codebase, and `ToolFAQ` was a
 * second one. Its FAQPage JSON-LD is not lost: it moves into `head()` via
 * `getFAQSchema`, which is where structured data belongs anyway.
 *
 * The tool cards keep `<ToolCard>` as-is. It is shared with `<RelatedTools />`
 * on every tool page, so restyling it here would change five pages this route
 * does not own — and it carries its own padding, which is exactly the shape
 * that must not be dropped into `<FeatureGrid>` (a cell without `.feat-cell`
 * shifts the grid and clips the first column).
 *
 * i18n: this route rendered ZERO translated strings before this change — every
 * word was an English literal and `page-namespaces.ts` loaded no namespace for
 * `/tools/` at all. The strings authored HERE (the hero lede and the three
 * section labels) are keys under `tools.hub.*`, translated into all 21 target
 * locales. The copy that already existed — the h1, the five FAQ answers and the
 * closing CTA — is still literal, because moving 4,000 characters of published
 * English onto the CDN is a key-creation job, not a layout one. That gap is
 * real and it is the same one DESIGN-DECISIONS lists under Coverage gaps.
 */

/**
 * Five answers, and the FAQPage schema is generated from this same array — so
 * the questions Google reads and the questions a reader opens cannot drift.
 */
const FAQ_ITEMS = [
  {
    id: "free",
    question: "Are these tools really free?",
    answer:
      "Yes — all tools are completely free with no usage limits. There is no signup required, no credit card, and no trial period. The tools are funded by Better I18N's paid plans, which you can explore if you need a full translation management platform.",
  },
  {
    id: "browser",
    question: "Do these tools run in my browser?",
    answer:
      "Yes. Every tool on this page runs entirely in your browser. No files, locale data, or ICU messages are sent to any server. Your data stays on your machine.",
  },
  {
    id: "account",
    question: "Do I need to create an account to use these tools?",
    answer:
      "No account or signup is required. Open any tool and start using it immediately. If you later decide to manage your translations at scale, you can sign up for Better I18N — but that is entirely optional.",
  },
  {
    id: "which",
    question: "What tools are available?",
    answer:
      "There are five tools: Locale Explorer for browsing 250+ locales with Intl API examples and plural rules; ICU Playground for testing ICU message syntax with live preview; Translation File Converter for converting between JSON, PO, XLIFF, ARB, YAML, CSV, and more; Cost Calculator for estimating localization costs; and Hreflang Generator for creating correct hreflang tags for multilingual SEO.",
  },
  {
    id: "offline",
    question: "Can I use these tools offline?",
    answer:
      "Once the page has loaded, the Locale Explorer, ICU Playground, and Hreflang Generator work fully offline because all computation happens in the browser. The File Converter and Cost Calculator also run entirely client-side, so they too work without an internet connection after the initial page load.",
  },
] as const;

export const Route = createFileRoute("/$locale/tools/")({
  loader: createPageLoader(),
  head: ({ loaderData }) =>
    getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "tools",
      pathname: "/tools",
      pageType: "tool",
      metaFallback: {
        title: "Free i18n & Localization Developer Tools",
        description:
          "Free browser-based tools for i18n developers — locale reference, ICU message testing, file format conversion, cost estimation, and hreflang generation.",
      },
      // The FAQ schema used to be emitted by <ToolFAQ /> inside the body. Head
      // is where it belongs, and it now reads the same array the section does.
      customStructuredData: formatStructuredData([
        getOrganizationSchema({ locale: loaderData?.locale }),
        getFAQSchema(
          FAQ_ITEMS.map((item) => ({ question: item.question, answer: item.answer })),
          loaderData?.locale,
        ),
      ]),
    }),
  component: ToolsHubPage,
});

function ToolsHubPage() {
  const { locale } = Route.useParams();
  const t = useT("tools");

  const breadcrumbs = [
    { label: "Home", href: `/${locale}` },
    { label: "Free Tools" },
  ];

  return (
    <MarketingLayout breadcrumbs={breadcrumbs}>
      <PageHero
        titleId="tools-hero-title"
        // The h1 is the page's existing indexed copy and stays a literal like
        // the rest of this route's pre-existing English (see the i18n note at
        // the end of this file). The lede is newly authored, so it is a key.
        title={t("hub.heroTitle")}
        subtitle={t("hub.heroSubtitle")}
      />

      <Divider />

      <Section labelledBy="tools-grid-title">
        <SectionHeader
          id="tools-grid-title"
          eyebrow={t("hub.eyebrow")}
          title={t("hub.title")}
          subtitle={t("hub.subtitle")}
        />
        {/* A plain gap grid, not the `-mt-px -ml-px` hairline pattern and not
            <FeatureGrid>: each <ToolCard> already carries its own padding and
            border, so it is a figure rather than a cell. */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TOOL_REGISTRY.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} locale={locale} headingLevel={3} />
          ))}
        </div>
      </Section>

      <Divider />

      <FaqSection
        eyebrow={t("hub.faqEyebrow")}
        title={t("hub.faqTitle")}
        items={FAQ_ITEMS}
      />

      {/* The hub closes with the shared <CTA /> band from MarketingLayout, not
          its own <ClosingCta>. The hand-written one had four English literals in
          the JSX — title, subtitle, and both button labels — so 21 locales were
          served English. The shared band's copy lives in the `cta` namespace and
          is already translated everywhere. */}
    </MarketingLayout>
  );
}
