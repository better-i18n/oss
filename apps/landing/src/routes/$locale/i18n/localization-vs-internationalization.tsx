import { createFileRoute, Link } from "@tanstack/react-router";
import { SpriteIcon } from "@/components/SpriteIcon";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import { ClosingCta, Divider } from "@/components/ui/page";

export const Route = createFileRoute(
  "/$locale/i18n/localization-vs-internationalization",
)({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "l10nVsI18n",
      pathname: "/i18n/localization-vs-internationalization",
      pageType: "educational",
      structuredDataOptions: {
        title: "Localization vs Internationalization: What's the Difference?",
        description:
          "Understand the difference between localization and internationalization (i18n vs l10n), when to use each, and how they work together.",
      },
    });
  },
  component: L10nVsI18nPage,
});

function L10nVsI18nPage() {
  const t = useT("marketing");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  const i18nActivities = [
    { key: "i18n.l10nVsI18n.comparison.i18n.activities.externalizeStrings" },
    { key: "i18n.l10nVsI18n.comparison.i18n.activities.unicodeSupport" },
    { key: "i18n.l10nVsI18n.comparison.i18n.activities.dateTimeFormatting" },
    { key: "i18n.l10nVsI18n.comparison.i18n.activities.layoutFlexibility" },
    { key: "i18n.l10nVsI18n.comparison.i18n.activities.pluralizationRules" },
  ];

  const l10nActivities = [
    { key: "i18n.l10nVsI18n.comparison.l10n.activities.translatingContent" },
    { key: "i18n.l10nVsI18n.comparison.l10n.activities.culturalAdaptation" },
    { key: "i18n.l10nVsI18n.comparison.l10n.activities.localFormats" },
    { key: "i18n.l10nVsI18n.comparison.l10n.activities.legalCompliance" },
    { key: "i18n.l10nVsI18n.comparison.l10n.activities.marketingAdaptation" },
  ];

  const keyDifferences = [
    { titleKey: "i18n.l10nVsI18n.differences.timing.title", descKey: "i18n.l10nVsI18n.differences.timing.description" },
    { titleKey: "i18n.l10nVsI18n.differences.scope.title", descKey: "i18n.l10nVsI18n.differences.scope.description" },
    { titleKey: "i18n.l10nVsI18n.differences.team.title", descKey: "i18n.l10nVsI18n.differences.team.description" },
    { titleKey: "i18n.l10nVsI18n.differences.frequency.title", descKey: "i18n.l10nVsI18n.differences.frequency.description" },
  ];

  const relatedPages = [
    { name: "What is Internationalization?", href: "/$locale/what-is-internationalization", description: t("i18n.l10nVsI18n.related.whatIsI18n") },
    { name: "What is Localization?", href: "/$locale/what-is-localization", description: t("i18n.l10nVsI18n.related.whatIsL10n") },
    { name: "Software Localization", href: "/$locale/i18n/software-localization", description: t("i18n.l10nVsI18n.related.softwareLocalization") },
    { name: "React i18n Guide", href: "/$locale/i18n/react", description: t("i18n.l10nVsI18n.related.react") },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />
      {/* Hero */}
      <section>
        <div className="section">
          <div className="max-w-3xl">
            <div className="eyebrow mb-5 flex items-center gap-2">
              <span>{t("i18n.l10nVsI18n.badge")}</span>
            </div>
            <h1 className="section-h2">
              {t("i18n.l10nVsI18n.hero.title")}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("i18n.l10nVsI18n.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Definitions */}
      <section>
        <div className="section">
          <h2 className="section-h2 mb-8 text-center">
            {t("i18n.l10nVsI18n.quickDefs.title")}
          </h2>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="p-8 rounded-xl bg-violet-50 border border-violet-100">
              <div className="flex items-center gap-3 mb-4">
                <SpriteIcon name="code-brackets" className="size-6 text-violet-600" />
                <h3 className="text-xl font-medium text-mist-950">
                  {t("i18n.l10nVsI18n.quickDefs.i18n.title")}
                </h3>
              </div>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("i18n.l10nVsI18n.quickDefs.i18n.definition")}
              </p>
              <div className="p-4 rounded-xl bg-white border border-violet-100">
                <code className="text-sm text-mist-900 font-mono">i18n = i + (18 letters) + n</code>
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="flex items-center gap-3 mb-4">
                <SpriteIcon name="globe" className="size-6 text-mist-600" />
                <h3 className="text-xl font-medium text-mist-950">
                  {t("i18n.l10nVsI18n.quickDefs.l10n.title")}
                </h3>
              </div>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("i18n.l10nVsI18n.quickDefs.l10n.definition")}
              </p>
              <div className="mt-4 rounded-md border border-black/[0.07] bg-mist-50 p-4">
                <code className="text-sm text-mist-900 font-mono">l10n = l + (10 letters) + n</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Side-by-Side Comparison */}
      <section>
        <div className="section">
          <h2 className="section-h2 mb-8 text-center">
            {t("i18n.l10nVsI18n.comparison.title")}
          </h2>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium text-mist-950 mb-4 flex items-center gap-2">
                <SpriteIcon name="code-brackets" className="size-5 text-violet-600" />
                {t("i18n.l10nVsI18n.comparison.i18n.title")}
              </h3>
              <ul className="space-y-3">
                {i18nActivities.map((activity) => (
                  <li key={activity.key} className="flex items-start gap-2">
                    <SpriteIcon name="checkmark" className="size-4 text-violet-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-mist-700">{t(activity.key)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-mist-950 mb-4 flex items-center gap-2">
                <SpriteIcon name="globe" className="size-5 text-mist-600" />
                {t("i18n.l10nVsI18n.comparison.l10n.title")}
              </h3>
              <ul className="space-y-3">
                {l10nActivities.map((activity) => (
                  <li key={activity.key} className="flex items-start gap-2">
                    <SpriteIcon name="checkmark" className="size-4 text-mist-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-mist-700">{t(activity.key)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Key Differences */}
      <section>
        <div className="section">
          <div className="text-center mb-12">
            <h2 className="section-h2">
              {t("i18n.l10nVsI18n.differences.title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {keyDifferences.map((diff) => (
              <div key={diff.titleKey}>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(diff.titleKey)}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(diff.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How They Work Together */}
      <section>
        <div className="section">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-h2 mb-6">
              {t("i18n.l10nVsI18n.together.title")}
            </h2>
            <p className="text-mist-700 leading-relaxed mb-4">
              {t("i18n.l10nVsI18n.together.paragraph1")}
            </p>
            <p className="text-mist-700 leading-relaxed">
              {t("i18n.l10nVsI18n.together.paragraph2")}
            </p>
          </div>
        </div>
      </section>

      {/* Related Pages */}
      <section className="border-t border-mist-200">
        <div className="section">
          <h2 className="text-lg font-medium text-mist-950 mb-6">
            {tCommon("whatIs.relatedTopics")}
          </h2>
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
        title={t("i18n.l10nVsI18n.cta.title")}
        subtitle={t("i18n.l10nVsI18n.cta.subtitle")}
        primary={{ label: t("i18n.l10nVsI18n.cta.primary"), href: "https://dash.better-i18n.com" }}
        secondary={{ label: t("i18n.l10nVsI18n.cta.secondary"), href: "https://docs.better-i18n.com" }}
      />
    </MarketingLayout>
  );
}
