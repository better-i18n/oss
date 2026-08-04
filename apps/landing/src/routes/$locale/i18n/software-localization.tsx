import { createFileRoute, Link } from "@tanstack/react-router";
import { SpriteIcon, type SpriteIconName } from "@/components/SpriteIcon";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import { SeeAlso } from "@/components/SeeAlso";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import { ClosingCta, Divider } from "@/components/ui/page";

export const Route = createFileRoute("/$locale/i18n/software-localization")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "softwareLocalization",
      pathname: "/i18n/software-localization",
      pageType: "educational",
      structuredDataOptions: {
        title: "Software Localization Guide",
        description:
          "Learn the software localization process: how to adapt your application for global markets with best practices and modern tools.",
      },
    });
  },
  component: SoftwareLocalizationPage,
});

const localizationTypes = [
  { icon: "globe", titleKey: "i18n.softwareLocalization.types.web.title", descKey: "i18n.softwareLocalization.types.web.description" },
  { icon: "rocket", titleKey: "i18n.softwareLocalization.types.mobile.title", descKey: "i18n.softwareLocalization.types.mobile.description" },
  { icon: "code-brackets", titleKey: "i18n.softwareLocalization.types.desktop.title", descKey: "i18n.softwareLocalization.types.desktop.description" },
  { icon: "settings-gear", titleKey: "i18n.softwareLocalization.types.saas.title", descKey: "i18n.softwareLocalization.types.saas.description" },
];

const toolCategories = [
  { icon: "group", titleKey: "i18n.softwareLocalization.tools.tms.title", descKey: "i18n.softwareLocalization.tools.tms.description" },
  { icon: "sparkles-soft", titleKey: "i18n.softwareLocalization.tools.cat.title", descKey: "i18n.softwareLocalization.tools.cat.description" },
  { icon: "zap", titleKey: "i18n.softwareLocalization.tools.continuous.title", descKey: "i18n.softwareLocalization.tools.continuous.description" },
];

const localizationMetrics = [
  { labelKey: "i18n.softwareLocalization.metrics.coverage.label", descKey: "i18n.softwareLocalization.metrics.coverage.description" },
  { labelKey: "i18n.softwareLocalization.metrics.timeToMarket.label", descKey: "i18n.softwareLocalization.metrics.timeToMarket.description" },
  { labelKey: "i18n.softwareLocalization.metrics.lqa.label", descKey: "i18n.softwareLocalization.metrics.lqa.description" },
  { labelKey: "i18n.softwareLocalization.metrics.pseudoLoc.label", descKey: "i18n.softwareLocalization.metrics.pseudoLoc.description" },
  { labelKey: "i18n.softwareLocalization.metrics.untranslated.label", descKey: "i18n.softwareLocalization.metrics.untranslated.description" },
];

const processSteps = [
  { icon: "code-brackets", titleKey: "i18n.softwareLocalization.process.internationalization.title", descKey: "i18n.softwareLocalization.process.internationalization.description" },
  { icon: "globe", titleKey: "i18n.softwareLocalization.process.translation.title", descKey: "i18n.softwareLocalization.process.translation.description" },
  { icon: "settings-gear", titleKey: "i18n.softwareLocalization.process.adaptation.title", descKey: "i18n.softwareLocalization.process.adaptation.description" },
  { icon: "group", titleKey: "i18n.softwareLocalization.process.testing.title", descKey: "i18n.softwareLocalization.process.testing.description" },
];

function SoftwareLocalizationPage() {
  const t = useT("marketing");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  const benefits = [
    { key: "i18n.softwareLocalization.benefits.list.marketExpansion" },
    { key: "i18n.softwareLocalization.benefits.list.userRetention" },
    { key: "i18n.softwareLocalization.benefits.list.competitiveAdvantage" },
    { key: "i18n.softwareLocalization.benefits.list.revenue" },
    { key: "i18n.softwareLocalization.benefits.list.compliance" },
    { key: "i18n.softwareLocalization.benefits.list.brandPerception" },
  ];

  const bestPractices = [
    { titleKey: "i18n.softwareLocalization.bestPractices.planEarly.title", descKey: "i18n.softwareLocalization.bestPractices.planEarly.description" },
    { titleKey: "i18n.softwareLocalization.bestPractices.externalizeStrings.title", descKey: "i18n.softwareLocalization.bestPractices.externalizeStrings.description" },
    { titleKey: "i18n.softwareLocalization.bestPractices.useIcu.title", descKey: "i18n.softwareLocalization.bestPractices.useIcu.description" },
    { titleKey: "i18n.softwareLocalization.bestPractices.automate.title", descKey: "i18n.softwareLocalization.bestPractices.automate.description" },
    { titleKey: "i18n.softwareLocalization.bestPractices.testContinuously.title", descKey: "i18n.softwareLocalization.bestPractices.testContinuously.description" },
    { titleKey: "i18n.softwareLocalization.bestPractices.contextForTranslators.title", descKey: "i18n.softwareLocalization.bestPractices.contextForTranslators.description" },
  ];

  const relatedPages = [
    { name: "Website Localization", href: "/$locale/i18n/website-localization", description: t("i18n.softwareLocalization.related.websiteLocalization") },
    { name: "Localization Software", href: "/$locale/i18n/localization-software", description: t("i18n.softwareLocalization.related.localizationSoftware") },
    { name: "Localization vs Internationalization", href: "/$locale/i18n/localization-vs-internationalization", description: t("i18n.softwareLocalization.related.l10nVsI18n") },
    { name: "What is Localization?", href: "/$locale/what-is-localization", description: t("i18n.softwareLocalization.related.whatIsL10n") },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />
      {/* Hero */}
      <section>
        <div className="section">
          <div className="max-w-3xl">
            <div className="eyebrow mb-5 flex items-center gap-2">
              <SpriteIcon name="code-brackets" className="size-4" />
              <span>{t("i18n.softwareLocalization.badge")}</span>
            </div>
            <h1 className="section-h2">
              {t("i18n.softwareLocalization.hero.title")}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("i18n.softwareLocalization.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Definition */}
      <section>
        <div className="section">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="section-h2 mb-6">
                {t("i18n.softwareLocalization.definition.title")}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("i18n.softwareLocalization.definition.paragraph1")}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("i18n.softwareLocalization.definition.paragraph2")}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("i18n.softwareLocalization.definition.paragraph3")}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("i18n.softwareLocalization.definition.paragraph4")}
              </p>
            </div>
            <div className="mt-10 lg:mt-0">
              <h3 className="text-lg font-medium text-mist-950 mb-4">
                {t("i18n.softwareLocalization.scope.title")}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-mist-700 text-sm">
                  <SpriteIcon name="checkmark" className="mt-0.5 size-3.5 shrink-0 text-mist-400" />
                  {t("i18n.softwareLocalization.scope.uiStrings")}
                </li>
                <li className="flex items-start gap-2 text-mist-700 text-sm">
                  <SpriteIcon name="checkmark" className="mt-0.5 size-3.5 shrink-0 text-mist-400" />
                  {t("i18n.softwareLocalization.scope.dateTime")}
                </li>
                <li className="flex items-start gap-2 text-mist-700 text-sm">
                  <SpriteIcon name="checkmark" className="mt-0.5 size-3.5 shrink-0 text-mist-400" />
                  {t("i18n.softwareLocalization.scope.layout")}
                </li>
                <li className="flex items-start gap-2 text-mist-700 text-sm">
                  <SpriteIcon name="checkmark" className="mt-0.5 size-3.5 shrink-0 text-mist-400" />
                  {t("i18n.softwareLocalization.scope.media")}
                </li>
                <li className="flex items-start gap-2 text-mist-700 text-sm">
                  <SpriteIcon name="checkmark" className="mt-0.5 size-3.5 shrink-0 text-mist-400" />
                  {t("i18n.softwareLocalization.scope.legal")}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Types of Software Localization */}
      <section>
        <div className="section">
          <div className="text-center mb-12">
            <h2 className="section-h2">
              {t("i18n.softwareLocalization.types.title")}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("i18n.softwareLocalization.types.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {localizationTypes.map((type) => (
              <div key={type.titleKey} >
                <div className="mb-3 flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-600">
                  <SpriteIcon name={type.icon as SpriteIconName} className="size-5 text-mist-700" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(type.titleKey)}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(type.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section>
        <div className="section">
          <div className="text-center mb-12">
            <h2 className="section-h2">
              {t("i18n.softwareLocalization.process.title")}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("i18n.softwareLocalization.process.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <div key={step.titleKey} >
                <div className="flex items-center gap-3 mb-4">
                  <div className="mb-3 block text-[11px] font-medium tabular-nums text-mist-400">
                    {index + 1}
                  </div>
                  <SpriteIcon name={step.icon as SpriteIconName} className="size-5 text-mist-600" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(step.titleKey)}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(step.descKey)}
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
                {t("i18n.softwareLocalization.benefits.title")}
              </h2>
              <p className="text-mist-700 leading-relaxed">
                {t("i18n.softwareLocalization.benefits.subtitle")}
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <ul className="space-y-4">
                {benefits.map((item) => (
                  <li key={item.key} className="flex items-start gap-3">
                    <SpriteIcon name="checkmark" className="mt-0.5 size-3.5 shrink-0 text-mist-400" />
                    <span className="text-mist-700">{t(item.key)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section>
        <div className="section">
          <div className="text-center mb-12">
            <h2 className="section-h2">
              {t("i18n.softwareLocalization.bestPractices.title")}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("i18n.softwareLocalization.bestPractices.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bestPractices.map((practice) => (
              <div key={practice.titleKey} >
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(practice.titleKey)}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(practice.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools and Platforms */}
      <section>
        <div className="section">
          <div className="text-center mb-12">
            <h2 className="section-h2">
              {t("i18n.softwareLocalization.tools.title")}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("i18n.softwareLocalization.tools.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {toolCategories.map((tool) => (
              <div key={tool.titleKey} >
                <div className="mb-3 flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-600">
                  <SpriteIcon name={tool.icon as SpriteIconName} className="size-5 text-mist-700" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(tool.titleKey)}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(tool.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section>
        <div className="section">
          <div className="text-center mb-12">
            <h2 className="section-h2">
              {t("i18n.softwareLocalization.metrics.title")}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("i18n.softwareLocalization.metrics.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {/* Bare columns — five repeated metrics, no per-item box, and no
                tinted disc holding the icon inside it. */}
            {localizationMetrics.map((metric) => (
              <div key={metric.labelKey}>
                <span className="flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-600">
                  <SpriteIcon name="chart" className="size-3.5" />
                </span>
                <h3 className="mt-3 text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                  {t(metric.labelKey)}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-mist-600">
                  {t(metric.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <div className="section">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-h2 mb-8 text-center">
              {t("i18n.softwareLocalization.faq.title")}
            </h2>
            <div className="space-y-6">
              <div >
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("i18n.softwareLocalization.faq.q1.question")}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t("i18n.softwareLocalization.faq.q1.answer")}
                </p>
              </div>
              <div >
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("i18n.softwareLocalization.faq.q2.question")}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t("i18n.softwareLocalization.faq.q2.answer")}
                </p>
              </div>
              <div >
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("i18n.softwareLocalization.faq.q3.question")}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t("i18n.softwareLocalization.faq.q3.answer")}
                </p>
              </div>
              <div >
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("i18n.softwareLocalization.faq.q4.question")}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t("i18n.softwareLocalization.faq.q4.answer")}
                </p>
              </div>
              <div >
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("i18n.softwareLocalization.faq.q5.question")}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t("i18n.softwareLocalization.faq.q5.answer")}
                </p>
              </div>
              <div >
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("i18n.softwareLocalization.faq.q6.question")}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t("i18n.softwareLocalization.faq.q6.answer")}
                </p>
              </div>
              <div >
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("i18n.softwareLocalization.faq.q7.question")}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t("i18n.softwareLocalization.faq.q7.answer")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Pages */}

      <SeeAlso currentSlug="software-localization" locale={locale} />
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
        title={t("i18n.softwareLocalization.cta.title")}
        subtitle={t("i18n.softwareLocalization.cta.subtitle")}
        primary={{ label: t("i18n.softwareLocalization.cta.primary"), href: "https://dash.better-i18n.com" }}
        secondary={{ label: t("i18n.softwareLocalization.cta.secondary"), href: "https://docs.better-i18n.com" }}
      />
    </MarketingLayout>
  );
}
