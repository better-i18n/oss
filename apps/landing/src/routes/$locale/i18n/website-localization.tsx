import { createFileRoute, Link } from "@tanstack/react-router";
import { SpriteIcon, type SpriteIconName } from "@/components/SpriteIcon";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import { SeeAlso } from "@/components/SeeAlso";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import { ClosingCta, Divider } from "@/components/ui/page";

export const Route = createFileRoute("/$locale/i18n/website-localization")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "websiteLocalization",
      pathname: "/i18n/website-localization",
      pageType: "educational",
      structuredDataOptions: {
        title: "Website Localization Guide",
        description:
          "Complete guide to website localization: translate and adapt your web application for global audiences with Better I18N.",
      },
    });
  },
  component: WebsiteLocalizationPage,
});

const challenges = [
  { icon: "code-brackets", titleKey: "i18n.websiteLocalization.challenges.contentManagement.title", descKey: "i18n.websiteLocalization.challenges.contentManagement.description" },
  { icon: "globe", titleKey: "i18n.websiteLocalization.challenges.culturalAdaptation.title", descKey: "i18n.websiteLocalization.challenges.culturalAdaptation.description" },
  { icon: "group", titleKey: "i18n.websiteLocalization.challenges.teamCoordination.title", descKey: "i18n.websiteLocalization.challenges.teamCoordination.description" },
  { icon: "zap", titleKey: "i18n.websiteLocalization.challenges.performance.title", descKey: "i18n.websiteLocalization.challenges.performance.description" },
];

function WebsiteLocalizationPage() {
  const t = useT("marketing");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  const benefits = [
    { key: "i18n.websiteLocalization.benefits.list.globalReach" },
    { key: "i18n.websiteLocalization.benefits.list.userExperience" },
    { key: "i18n.websiteLocalization.benefits.list.seo" },
    { key: "i18n.websiteLocalization.benefits.list.revenue" },
    { key: "i18n.websiteLocalization.benefits.list.brandTrust" },
    { key: "i18n.websiteLocalization.benefits.list.compliance" },
  ];

  const processSteps = [
    { number: "1", titleKey: "i18n.websiteLocalization.process.step1.title", descKey: "i18n.websiteLocalization.process.step1.description" },
    { number: "2", titleKey: "i18n.websiteLocalization.process.step2.title", descKey: "i18n.websiteLocalization.process.step2.description" },
    { number: "3", titleKey: "i18n.websiteLocalization.process.step3.title", descKey: "i18n.websiteLocalization.process.step3.description" },
    { number: "4", titleKey: "i18n.websiteLocalization.process.step4.title", descKey: "i18n.websiteLocalization.process.step4.description" },
  ];

  const relatedPages = [
    { name: "Software Localization", href: "/$locale/i18n/software-localization", description: t("i18n.websiteLocalization.related.softwareLocalization") },
    { name: "Translation Management System", href: "/$locale/i18n/translation-management-system", description: t("i18n.websiteLocalization.related.tms") },
    { name: "Localization vs Internationalization", href: "/$locale/i18n/localization-vs-internationalization", description: t("i18n.websiteLocalization.related.l10nVsI18n") },
    { name: "What is Localization?", href: "/$locale/what-is-localization", description: t("i18n.websiteLocalization.related.whatIsL10n") },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />
      {/* Hero */}
      <section>
        <div className="section">
          <div className="max-w-3xl">
            <div className="eyebrow mb-5 flex items-center gap-2">
              <SpriteIcon name="globe" className="size-4" />
              <span>{t("i18n.websiteLocalization.badge")}</span>
            </div>
            <h1 className="section-h2">
              {t("i18n.websiteLocalization.hero.title")}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("i18n.websiteLocalization.hero.subtitle")}
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
                {t("i18n.websiteLocalization.definition.title")}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("i18n.websiteLocalization.definition.paragraph1")}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("i18n.websiteLocalization.definition.paragraph2")}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("i18n.websiteLocalization.definition.paragraph3")}
              </p>
            </div>
            <div className="mt-10 lg:mt-0">
              <h3 className="text-lg font-medium text-mist-950 mb-4">
                {t("i18n.websiteLocalization.whyItMatters.title")}
              </h3>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("i18n.websiteLocalization.whyItMatters.content")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges */}
      <section>
        <div className="section">
          <div className="text-center mb-12">
            <h2 className="section-h2">
              {t("i18n.websiteLocalization.challenges.title")}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("i18n.websiteLocalization.challenges.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {challenges.map((challenge) => (
              <div key={challenge.titleKey}>
                <div className="mb-3 flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-600">
                  <SpriteIcon name={challenge.icon as SpriteIconName} className="size-5" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(challenge.titleKey)}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(challenge.descKey)}
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
                {t("i18n.websiteLocalization.benefits.title")}
              </h2>
              <p className="text-mist-700 leading-relaxed">
                {t("i18n.websiteLocalization.benefits.subtitle")}
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit.key} className="flex items-start gap-3">
                    <SpriteIcon name="checkmark" className="mt-0.5 size-3.5 shrink-0 text-mist-400" />
                    <span className="text-mist-700">{t(benefit.key)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section>
        <div className="section">
          <div className="text-center mb-12">
            <h2 className="section-h2">
              {t("i18n.websiteLocalization.process.title")}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("i18n.websiteLocalization.process.subtitle")}
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

      {/* How Better I18N Helps */}
      <section>
        <div className="section">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-h2 mb-6">
              {t("i18n.websiteLocalization.solution.title")}
            </h2>
            <p className="text-mist-700 leading-relaxed mb-8">
              {t("i18n.websiteLocalization.solution.content")}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-left">
              <div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("i18n.websiteLocalization.solution.feature1.title")}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("i18n.websiteLocalization.solution.feature1.description")}
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("i18n.websiteLocalization.solution.feature2.title")}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("i18n.websiteLocalization.solution.feature2.description")}
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("i18n.websiteLocalization.solution.feature3.title")}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("i18n.websiteLocalization.solution.feature3.description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Pages */}

      <SeeAlso currentSlug="website-localization" locale={locale} />
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
          mx-6` — a floating dark card on a white document, with its own
          container and its own button scale. <ClosingCta /> is the one closing
          shape in the grammar. */}
      <ClosingCta
        title={t("i18n.websiteLocalization.cta.title")}
        subtitle={t("i18n.websiteLocalization.cta.subtitle")}
        primary={{ label: t("i18n.websiteLocalization.cta.primary"), href: "https://dash.better-i18n.com" }}
        secondary={{ label: t("i18n.websiteLocalization.cta.secondary"), href: "https://docs.better-i18n.com" }}
      />
    </MarketingLayout>
  );
}
