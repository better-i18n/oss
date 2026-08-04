import { createFileRoute, Link } from "@tanstack/react-router";
import { SpriteIcon, type SpriteIconName } from "@/components/SpriteIcon";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import { SeeAlso } from "@/components/SeeAlso";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import { ClosingCta, Divider } from "@/components/ui/page";

export const Route = createFileRoute("/$locale/i18n/translation-solutions")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "translationSolutions",
      pathname: "/i18n/translation-solutions",
      pageType: "educational",
      structuredDataOptions: {
        title: "Website Translation Solutions Guide",
        description:
          "Compare website translation solutions: SaaS platforms, APIs, plugins, and AI tools for translating English to Hindi, Mandarin Chinese, and more.",
      },
    });
  },
  component: TranslationSolutionsPage,
});

const solutionTypes = [
  { icon: "rocket", titleKey: "i18n.translationSolutions.types.saas.title", descKey: "i18n.translationSolutions.types.saas.description" },
  { icon: "code-brackets", titleKey: "i18n.translationSolutions.types.api.title", descKey: "i18n.translationSolutions.types.api.description" },
  { icon: "api-connection", titleKey: "i18n.translationSolutions.types.plugins.title", descKey: "i18n.translationSolutions.types.plugins.description" },
  { icon: "sparkles-soft", titleKey: "i18n.translationSolutions.types.aiNative.title", descKey: "i18n.translationSolutions.types.aiNative.description" },
];

function TranslationSolutionsPage() {
  const t = useT("marketing");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  const evaluationCriteria = [
    { key: "i18n.translationSolutions.criteria.list.languageCoverage" },
    { key: "i18n.translationSolutions.criteria.list.integrationOptions" },
    { key: "i18n.translationSolutions.criteria.list.translationMemory" },
    { key: "i18n.translationSolutions.criteria.list.documentSupport" },
    { key: "i18n.translationSolutions.criteria.list.aiQuality" },
    { key: "i18n.translationSolutions.criteria.list.pricingModel" },
  ];

  const processSteps = [
    { number: "1", titleKey: "i18n.translationSolutions.process.step1.title", descKey: "i18n.translationSolutions.process.step1.description" },
    { number: "2", titleKey: "i18n.translationSolutions.process.step2.title", descKey: "i18n.translationSolutions.process.step2.description" },
    { number: "3", titleKey: "i18n.translationSolutions.process.step3.title", descKey: "i18n.translationSolutions.process.step3.description" },
    { number: "4", titleKey: "i18n.translationSolutions.process.step4.title", descKey: "i18n.translationSolutions.process.step4.description" },
  ];

  const relatedPages = [
    { name: "Website Translation", href: "/$locale/i18n/website-translation", description: t("i18n.translationSolutions.related.websiteTranslation") },
    { name: "Translation Management System", href: "/$locale/i18n/translation-management-system", description: t("i18n.translationSolutions.related.tms") },
    { name: "Localization Software", href: "/$locale/i18n/localization-software", description: t("i18n.translationSolutions.related.localizationSoftware") },
    { name: "Content Localization", href: "/$locale/i18n/content-localization", description: t("i18n.translationSolutions.related.contentLocalization") },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />
      <section>
        <div className="section">
          <div className="max-w-3xl">
            <div className="eyebrow mb-5 flex items-center gap-2">
              <SpriteIcon name="settings-gear" className="size-4" />
              <span>{t("i18n.translationSolutions.badge")}</span>
            </div>
            <h1 className="section-h2">
              {t("i18n.translationSolutions.hero.title")}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("i18n.translationSolutions.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="section">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="section-h2 mb-6">
                {t("i18n.translationSolutions.definition.title")}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("i18n.translationSolutions.definition.paragraph1")}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("i18n.translationSolutions.definition.paragraph2")}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("i18n.translationSolutions.definition.paragraph3")}
              </p>
            </div>
            <div className="mt-10 lg:mt-0">
              <h3 className="text-lg font-medium text-mist-950 mb-4">
                {t("i18n.translationSolutions.useCases.title")}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-mist-700">
                  <SpriteIcon name="checkmark" className="mt-0.5 size-3.5 shrink-0 text-mist-400" />
                  {t("i18n.translationSolutions.useCases.hindi")}
                </li>
                <li className="flex items-start gap-2 text-sm text-mist-700">
                  <SpriteIcon name="checkmark" className="mt-0.5 size-3.5 shrink-0 text-mist-400" />
                  {t("i18n.translationSolutions.useCases.mandarin")}
                </li>
                <li className="flex items-start gap-2 text-sm text-mist-700">
                  <SpriteIcon name="checkmark" className="mt-0.5 size-3.5 shrink-0 text-mist-400" />
                  {t("i18n.translationSolutions.useCases.documents")}
                </li>
                <li className="flex items-start gap-2 text-sm text-mist-700">
                  <SpriteIcon name="checkmark" className="mt-0.5 size-3.5 shrink-0 text-mist-400" />
                  {t("i18n.translationSolutions.useCases.images")}
                </li>
                <li className="flex items-start gap-2 text-sm text-mist-700">
                  <SpriteIcon name="checkmark" className="mt-0.5 size-3.5 shrink-0 text-mist-400" />
                  {t("i18n.translationSolutions.useCases.mexicanSpanish")}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="section">
          <div className="text-center mb-12">
            <h2 className="section-h2">
              {t("i18n.translationSolutions.types.title")}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("i18n.translationSolutions.types.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {solutionTypes.map((type) => (
              <div key={type.titleKey}>
                <div className="mb-3 flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-600">
                  <SpriteIcon name={type.icon as SpriteIconName} className="size-5" />
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

      <section>
        <div className="section">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="section-h2 mb-6">
                {t("i18n.translationSolutions.criteria.title")}
              </h2>
              <p className="text-mist-700 leading-relaxed">
                {t("i18n.translationSolutions.criteria.subtitle")}
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <ul className="space-y-4">
                {evaluationCriteria.map((criterion) => (
                  <li key={criterion.key} className="flex items-start gap-3">
                    <SpriteIcon name="checkmark" className="mt-0.5 size-3.5 shrink-0 text-mist-400" />
                    <span className="text-mist-700">{t(criterion.key)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="section">
          <div className="text-center mb-12">
            <h2 className="section-h2">
              {t("i18n.translationSolutions.multimedia.title")}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("i18n.translationSolutions.multimedia.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <SpriteIcon name="group" className="size-6 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("i18n.translationSolutions.multimedia.documents.title")}
              </h3>
              <p className="text-sm text-mist-700 leading-relaxed">
                {t("i18n.translationSolutions.multimedia.documents.description")}
              </p>
            </div>
            <div>
              <SpriteIcon name="sparkles-soft" className="size-6 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("i18n.translationSolutions.multimedia.images.title")}
              </h3>
              <p className="text-sm text-mist-700 leading-relaxed">
                {t("i18n.translationSolutions.multimedia.images.description")}
              </p>
            </div>
            <div>
              <SpriteIcon name="rocket" className="size-6 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("i18n.translationSolutions.multimedia.ai.title")}
              </h3>
              <p className="text-sm text-mist-700 leading-relaxed">
                {t("i18n.translationSolutions.multimedia.ai.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="section">
          <div className="text-center mb-12">
            <h2 className="section-h2">
              {t("i18n.translationSolutions.process.title")}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("i18n.translationSolutions.process.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step) => (
              <div key={step.number} className="text-center p-6">
                <div className="mb-3 block text-[11px] font-medium tabular-nums text-mist-400">
                  {step.number}
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(step.titleKey)}
                </h3>
                <p className="text-sm text-mist-600">
                  {t(step.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="section">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-h2 mb-6">
              {t("i18n.translationSolutions.solution.title")}
            </h2>
            <p className="text-mist-700 leading-relaxed mb-8">
              {t("i18n.translationSolutions.solution.content")}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-left">
              <div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("i18n.translationSolutions.solution.feature1.title")}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("i18n.translationSolutions.solution.feature1.description")}
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("i18n.translationSolutions.solution.feature2.title")}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("i18n.translationSolutions.solution.feature2.description")}
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("i18n.translationSolutions.solution.feature3.title")}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("i18n.translationSolutions.solution.feature3.description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      <SeeAlso currentSlug="translation-solutions" locale={locale} />
      <section className="border-t border-mist-200">
        <div className="section">
          <h2 className="text-lg font-medium text-mist-950 mb-6">{tCommon("whatIs.relatedTopics")}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedPages.map((page) => (
              <Link
                key={page.href}
                to={page.href}
                params={{ locale }}
                className="group flex items-start justify-between gap-3"
              >
                <div>
                  <h3 className="text-sm font-medium text-mist-950">{page.name}</h3>
                  <p className="text-xs text-mist-500 mt-1">{page.description}</p>
                </div>
                <SpriteIcon name="arrow-right" className="size-3.5 shrink-0 text-mist-300 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-mist-600" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* The ask closes the page. Was a `bg-mist-950` band with `rounded-xl
          mx-6` — a floating dark card on a white document, carrying its own
          container and its own button scale. <ClosingCta /> is the one closing
          shape in the grammar. */}
      <ClosingCta
        title={t("i18n.translationSolutions.cta.title")}
        subtitle={t("i18n.translationSolutions.cta.subtitle")}
        primary={{ label: t("i18n.translationSolutions.cta.primary"), href: "https://dash.better-i18n.com" }}
        secondary={{ label: t("i18n.translationSolutions.cta.secondary"), href: "https://docs.better-i18n.com" }}
      />
    </MarketingLayout>
  );
}
