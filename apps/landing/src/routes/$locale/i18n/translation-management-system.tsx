import { createFileRoute, Link } from "@tanstack/react-router";
import { SpriteIcon, type SpriteIconName } from "@/components/SpriteIcon";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import { SeeAlso } from "@/components/SeeAlso";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import { ClosingCta, Divider } from "@/components/ui/page";

export const Route = createFileRoute(
  "/$locale/i18n/translation-management-system",
)({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "translationManagementSystem",
      pathname: "/i18n/translation-management-system",
      pageType: "educational",
      structuredDataOptions: {
        title: "Translation Management System (TMS) Guide",
        description:
          "Learn what a translation management system is, key features to look for, and how to choose the best TMS for your team.",
      },
    });
  },
  component: TranslationManagementSystemPage,
});

const coreFeatures = [
  { icon: "robot", titleKey: "i18n.translationManagementSystem.features.ai.title", descKey: "i18n.translationManagementSystem.features.ai.description" },
  { icon: "github", titleKey: "i18n.translationManagementSystem.features.git.title", descKey: "i18n.translationManagementSystem.features.git.description" },
  { icon: "globe", titleKey: "i18n.translationManagementSystem.features.cdn.title", descKey: "i18n.translationManagementSystem.features.cdn.description" },
  { icon: "zap", titleKey: "i18n.translationManagementSystem.features.automation.title", descKey: "i18n.translationManagementSystem.features.automation.description" },
  { icon: "code-brackets", titleKey: "i18n.translationManagementSystem.features.sdk.title", descKey: "i18n.translationManagementSystem.features.sdk.description" },
  { icon: "group", titleKey: "i18n.translationManagementSystem.features.collaboration.title", descKey: "i18n.translationManagementSystem.features.collaboration.description" },
];

function TranslationManagementSystemPage() {
  const t = useT("marketing");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  const benefits = [
    { key: "i18n.translationManagementSystem.benefits.list.efficiency" },
    { key: "i18n.translationManagementSystem.benefits.list.consistency" },
    { key: "i18n.translationManagementSystem.benefits.list.collaboration" },
    { key: "i18n.translationManagementSystem.benefits.list.costReduction" },
    { key: "i18n.translationManagementSystem.benefits.list.scalability" },
    { key: "i18n.translationManagementSystem.benefits.list.quality" },
  ];

  const useCases = [
    { titleKey: "i18n.translationManagementSystem.useCases.saas.title", descKey: "i18n.translationManagementSystem.useCases.saas.description" },
    { titleKey: "i18n.translationManagementSystem.useCases.ecommerce.title", descKey: "i18n.translationManagementSystem.useCases.ecommerce.description" },
    { titleKey: "i18n.translationManagementSystem.useCases.enterprise.title", descKey: "i18n.translationManagementSystem.useCases.enterprise.description" },
    { titleKey: "i18n.translationManagementSystem.useCases.mobile.title", descKey: "i18n.translationManagementSystem.useCases.mobile.description" },
  ];

  const relatedPages = [
    { name: "Best TMS Platforms", href: "/$locale/i18n/best-tms", description: t("i18n.translationManagementSystem.related.bestTms") },
    { name: "Website Localization", href: "/$locale/i18n/website-localization", description: t("i18n.translationManagementSystem.related.websiteLocalization") },
    { name: "Software Localization", href: "/$locale/i18n/software-localization", description: t("i18n.translationManagementSystem.related.softwareLocalization") },
    { name: "Translation Solutions", href: "/$locale/i18n/translation-solutions", description: t("i18n.translationManagementSystem.related.translationSolutions") },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />
      {/* Hero */}
      <section>
        <div className="section">
          <div className="max-w-3xl">
            <div className="eyebrow mb-5 flex items-center gap-2">
              <span>{t("i18n.translationManagementSystem.badge")}</span>
            </div>
            <h1 className="section-h2">
              {t("i18n.translationManagementSystem.hero.title")}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("i18n.translationManagementSystem.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* What is a TMS */}
      <section>
        <div className="section">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="section-h2 mb-6">
                {t("i18n.translationManagementSystem.definition.title")}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("i18n.translationManagementSystem.definition.paragraph1")}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("i18n.translationManagementSystem.definition.paragraph2")}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("i18n.translationManagementSystem.definition.paragraph3")}
              </p>
            </div>
            <div className="mt-10 lg:mt-0">
              <h3 className="text-lg font-medium text-mist-950 mb-4">
                {t("i18n.translationManagementSystem.tmsVsManual.title")}
              </h3>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("i18n.translationManagementSystem.tmsVsManual.content")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section>
        <div className="section">
          <div className="text-center mb-12">
            <h2 className="section-h2">
              {t("i18n.translationManagementSystem.features.title")}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("i18n.translationManagementSystem.features.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coreFeatures.map((feature) => (
              <div key={feature.titleKey} >
                <div className="mb-3 flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-600">
                  <SpriteIcon name={feature.icon as SpriteIconName} className="size-5" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(feature.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section>
        <div className="section">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="section-h2 mb-6">
                {t("i18n.translationManagementSystem.benefits.title")}
              </h2>
              <p className="text-mist-700 leading-relaxed">
                {t("i18n.translationManagementSystem.benefits.subtitle")}
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit.key} className="flex items-start gap-3">
                    <SpriteIcon name="checkmark" className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-mist-700">{t(benefit.key)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section>
        <div className="section">
          <div className="text-center mb-12">
            <h2 className="section-h2">
              {t("i18n.translationManagementSystem.useCases.title")}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("i18n.translationManagementSystem.useCases.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {useCases.map((useCase) => (
              <div key={useCase.titleKey} >
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(useCase.titleKey)}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(useCase.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Pages */}

      <SeeAlso currentSlug="translation-management-system" locale={locale} />
      <section className="border-t border-mist-200">
        <div className="section">
          <h2 className="text-lg font-medium text-mist-950 mb-6">
            {tCommon("whatIs.relatedTopics")}
          </h2>
          {/* Bare columns: a link list's items carry no border, fill or padding
              of their own — the section already frames them. */}
          <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
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
        </div>
      </section>
      <Divider />

      {/* The ask closes the page. Was a `bg-mist-950` band with `rounded-xl
          mx-6` — a floating dark card on a white document, with its own
          container and its own button scale. <ClosingCta /> is the one closing
          shape in the grammar. */}
      <ClosingCta
        title={t("i18n.translationManagementSystem.cta.title")}
        subtitle={t("i18n.translationManagementSystem.cta.subtitle")}
        primary={{ label: t("i18n.translationManagementSystem.cta.primary"), href: "https://dash.better-i18n.com" }}
        secondary={{ label: t("i18n.translationManagementSystem.cta.secondary"), href: "https://docs.better-i18n.com" }}
      />
    </MarketingLayout>
  );
}
