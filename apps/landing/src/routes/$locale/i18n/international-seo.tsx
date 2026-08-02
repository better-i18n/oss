import { createFileRoute, Link } from "@tanstack/react-router";
import { SpriteIcon, type SpriteIconName } from "@/components/SpriteIcon";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import { SeeAlso } from "@/components/SeeAlso";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import {
  ClosingCta,
  Divider,
  PageHero,
  Section,
  SectionHeader,
} from "@/components/ui/page";

/** Three solution features, keyed by suffix under `solution.*`. */
const SOLUTION_FEATURES = ["feature1", "feature2", "feature3"] as const;

export const Route = createFileRoute("/$locale/i18n/international-seo")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "internationalSeo",
      pathname: "/i18n/international-seo",
      pageType: "educational",
      structuredDataOptions: {
        title: "International SEO Strategy Guide",
        description:
          "Comprehensive international SEO strategy: market research, keyword localization, technical SEO, and content strategy for global markets.",
      },
    });
  },
  component: InternationalSeoPage,
});

const pillars = [
  { icon: "magnifying-glass", titleKey: "i18n.internationalSeo.pillars.keywordResearch.title", descKey: "i18n.internationalSeo.pillars.keywordResearch.description" },
  { icon: "rocket", titleKey: "i18n.internationalSeo.pillars.contentLocalization.title", descKey: "i18n.internationalSeo.pillars.contentLocalization.description" },
  { icon: "chart", titleKey: "i18n.internationalSeo.pillars.technicalSeo.title", descKey: "i18n.internationalSeo.pillars.technicalSeo.description" },
  { icon: "group", titleKey: "i18n.internationalSeo.pillars.linkBuilding.title", descKey: "i18n.internationalSeo.pillars.linkBuilding.description" },
];

function InternationalSeoPage() {
  const t = useT("marketing");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  const checklist = [
    { key: "i18n.internationalSeo.checklist.marketResearch" },
    { key: "i18n.internationalSeo.checklist.competitorAnalysis" },
    { key: "i18n.internationalSeo.checklist.keywordLocalization" },
    { key: "i18n.internationalSeo.checklist.hreflangTags" },
    { key: "i18n.internationalSeo.checklist.localizedContent" },
    { key: "i18n.internationalSeo.checklist.technicalAudit" },
    { key: "i18n.internationalSeo.checklist.linkBuilding" },
    { key: "i18n.internationalSeo.checklist.analyticsTracking" },
  ];

  const processSteps = [
    { number: "1", titleKey: "i18n.internationalSeo.process.step1.title", descKey: "i18n.internationalSeo.process.step1.description" },
    { number: "2", titleKey: "i18n.internationalSeo.process.step2.title", descKey: "i18n.internationalSeo.process.step2.description" },
    { number: "3", titleKey: "i18n.internationalSeo.process.step3.title", descKey: "i18n.internationalSeo.process.step3.description" },
    { number: "4", titleKey: "i18n.internationalSeo.process.step4.title", descKey: "i18n.internationalSeo.process.step4.description" },
  ];

  const relatedPages = [
    { name: "Multilingual SEO", href: "/$locale/i18n/multilingual-seo", description: t("i18n.internationalSeo.related.multilingualSeo") },
    { name: "Website Localization", href: "/$locale/i18n/website-localization", description: t("i18n.internationalSeo.related.websiteLocalization") },
    { name: "Translation Solutions", href: "/$locale/i18n/translation-solutions", description: t("i18n.internationalSeo.related.translationSolutions") },
    { name: "Cultural Adaptation", href: "/$locale/i18n/cultural-adaptation", description: t("i18n.internationalSeo.related.culturalAdaptation") },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />
      <PageHero
        titleId="intl-seo-hero"
        title={t("i18n.internationalSeo.hero.title")}
        subtitle={t("i18n.internationalSeo.hero.subtitle")}
      />

      <Divider />

      {/* Definition + opportunity. Two prose blocks that alternated white /
          mist-50 to fake a boundary; the aside was a tinted card. Now two
          columns split by the gap, every paragraph kept. */}
      <Section labelledBy="intl-seo-definition">
        <SectionHeader
          id="intl-seo-definition"
          eyebrow={t("i18n.internationalSeo.eyebrow.definition")}
          title={t("i18n.internationalSeo.definition.title")}
        />
        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-4">
            <p className="text-[14px] leading-relaxed text-mist-600">
              {t("i18n.internationalSeo.definition.paragraph1")}
            </p>
            <p className="text-[14px] leading-relaxed text-mist-600">
              {t("i18n.internationalSeo.definition.paragraph2")}
            </p>
            <p className="text-[14px] leading-relaxed text-mist-600">
              {t("i18n.internationalSeo.definition.paragraph3")}
            </p>
          </div>
          <div>
            <h3 className="text-[15px] font-medium tracking-[-0.015em] text-mist-900">
              {t("i18n.internationalSeo.opportunity.title")}
            </h3>
            <p className="mt-3 text-[13px] leading-relaxed text-mist-600">
              {t("i18n.internationalSeo.opportunity.content")}
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-mist-600">
              {t("i18n.internationalSeo.opportunity.content2")}
            </p>
          </div>
        </div>
      </Section>

      <Divider />

      {/* Four pillars — bare columns with the shared 22px mark tile. */}
      <Section labelledBy="intl-seo-pillars">
        <SectionHeader
          id="intl-seo-pillars"
          eyebrow={t("i18n.internationalSeo.eyebrow.pillars")}
          title={t("i18n.internationalSeo.pillars.title")}
          subtitle={t("i18n.internationalSeo.pillars.subtitle")}
        />
        <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <div key={pillar.titleKey}>
              <span className="flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-600">
                <SpriteIcon name={pillar.icon as SpriteIconName} className="size-3.5" />
              </span>
              <h3 className="mt-3 text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                {t(pillar.titleKey)}
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-mist-600">
                {t(pillar.descKey)}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Divider />

      {/* Checklist + tips. The checkmarks were emerald — a hue carrying no
          information; the list is already a list. */}
      <Section labelledBy="intl-seo-checklist">
        <SectionHeader
          id="intl-seo-checklist"
          eyebrow={t("i18n.internationalSeo.eyebrow.checklist")}
          title={t("i18n.internationalSeo.checklist.title")}
          subtitle={t("i18n.internationalSeo.checklist.subtitle")}
        />
        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ul className="flex flex-col">
            {checklist.map((item) => (
              <li
                key={item.key}
                className="flex items-start gap-3 border-t border-black/[0.05] py-3 first:border-t-0 first:pt-0"
              >
                <SpriteIcon name="checkmark" className="mt-0.5 size-3.5 shrink-0 text-mist-400" />
                <span className="text-[13px] leading-relaxed text-mist-700">{t(item.key)}</span>
              </li>
            ))}
          </ul>
          <div>
            <h3 className="text-[15px] font-medium tracking-[-0.015em] text-mist-900">
              {t("i18n.internationalSeo.seoTips.title")}
            </h3>
            <p className="mt-3 text-[13px] leading-relaxed text-mist-600">
              {t("i18n.internationalSeo.seoTips.content")}
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-mist-600">
              {t("i18n.internationalSeo.seoTips.content2")}
            </p>
          </div>
        </div>
      </Section>

      <Divider />

      {/* Process — four numbered beats, no centring and no filled discs. */}
      <Section labelledBy="intl-seo-process">
        <SectionHeader
          id="intl-seo-process"
          eyebrow={t("i18n.internationalSeo.eyebrow.process")}
          title={t("i18n.internationalSeo.process.title")}
          subtitle={t("i18n.internationalSeo.process.subtitle")}
        />
        <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step) => (
            <div key={step.number}>
              <span className="text-[11px] font-medium tabular-nums text-mist-400">
                {`0${step.number}`}
              </span>
              <h3 className="mt-2 text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                {t(step.titleKey)}
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-mist-600">
                {t(step.descKey)}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Divider />

      {/* Solution — three tinted cards became three bare columns. */}
      <Section labelledBy="intl-seo-solution">
        <SectionHeader
          id="intl-seo-solution"
          eyebrow={t("i18n.internationalSeo.eyebrow.solution")}
          title={t("i18n.internationalSeo.solution.title")}
          subtitle={t("i18n.internationalSeo.solution.content")}
        />
        <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-3">
          {SOLUTION_FEATURES.map((id) => (
            <div key={id}>
              <h3 className="text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                {t(`i18n.internationalSeo.solution.${id}.title`)}
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-mist-600">
                {t(`i18n.internationalSeo.solution.${id}.description`)}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Divider />

      <SeeAlso currentSlug="international-seo" locale={locale} />

      <Divider />

      {/* Related topics — bare columns, no per-item box. */}
      <Section labelledBy="intl-seo-related">
        <h2 id="intl-seo-related" className="text-[11px] font-medium text-mist-400">
          {tCommon("whatIs.relatedTopics")}
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {relatedPages.map((page) => (
            <Link
              key={page.href}
              to={page.href}
              params={{ locale }}
              className="group flex flex-col gap-1"
            >
              <span className="flex items-center gap-1.5">
                <span className="text-[15px] font-medium tracking-[-0.015em] text-mist-900 transition-colors group-hover:text-mist-600">
                  {page.name}
                </span>
                <SpriteIcon
                  name="arrow-right"
                  className="size-3.5 shrink-0 text-mist-300 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-mist-600"
                />
              </span>
              <span className="text-[13px] leading-relaxed text-mist-600">
                {page.description}
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Divider />

      {/* The ask closes the page, before RelatedPages — the dark slab band is
          gone; ClosingCta is the one closing shape in the grammar. */}
      <ClosingCta
        title={t("i18n.internationalSeo.cta.title")}
        subtitle={t("i18n.internationalSeo.cta.subtitle")}
        primary={{ label: t("i18n.internationalSeo.cta.primary"), href: "https://dash.better-i18n.com" }}
        secondary={{ label: t("i18n.internationalSeo.cta.secondary"), href: "https://docs.better-i18n.com" }}
      />
    </MarketingLayout>
  );
}
