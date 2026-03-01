import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import {
  IconCheckmark1,
  IconArrowRight,
  IconGlobe,
  IconCodeBrackets,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

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
  const t = useT("marketing.i18n.l10nVsI18n");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  const i18nActivities = [
    "comparison.i18n.activities.externalizeStrings",
    "comparison.i18n.activities.unicodeSupport",
    "comparison.i18n.activities.dateTimeFormatting",
    "comparison.i18n.activities.layoutFlexibility",
    "comparison.i18n.activities.pluralizationRules",
  ];

  const l10nActivities = [
    "comparison.l10n.activities.translatingContent",
    "comparison.l10n.activities.culturalAdaptation",
    "comparison.l10n.activities.localFormats",
    "comparison.l10n.activities.legalCompliance",
    "comparison.l10n.activities.marketingAdaptation",
  ];

  const keyDifferences = [
    { titleKey: "differences.timing.title", descKey: "differences.timing.description" },
    { titleKey: "differences.scope.title", descKey: "differences.scope.description" },
    { titleKey: "differences.team.title", descKey: "differences.team.description" },
    { titleKey: "differences.frequency.title", descKey: "differences.frequency.description" },
  ];

  const relatedPages = [
    { name: "What is Internationalization?", href: "/$locale/what-is-internationalization", description: t("related.whatIsI18n", { defaultValue: "Deep dive into i18n concepts" }) },
    { name: "What is Localization?", href: "/$locale/what-is-localization", description: t("related.whatIsL10n", { defaultValue: "Deep dive into l10n concepts" }) },
    { name: "Software Localization", href: "/$locale/i18n/software-localization", description: t("related.softwareLocalization", { defaultValue: "The complete localization process" }) },
    { name: "React i18n Guide", href: "/$locale/i18n/react", description: t("related.react", { defaultValue: "Implementing i18n in React apps" }) },
  ];

  return (
    <MarketingLayout showCTA={false}>
      {/* Hero */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <span>{t("badge", { defaultValue: "i18n vs l10n" })}</span>
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("hero.title", { defaultValue: "Localization vs Internationalization: Understanding the Difference" })}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle", { defaultValue: "Localization vs internationalization (also known as i18n vs l10n) are two complementary but distinct processes. Understanding the difference between localization and internationalization is essential for building software that works globally." })}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Definitions */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-8 text-center">
            {t("quickDefs.title", { defaultValue: "Quick Definitions" })}
          </h2>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="p-8 rounded-2xl bg-violet-50 border border-violet-100">
              <div className="flex items-center gap-3 mb-4">
                <IconCodeBrackets className="size-6 text-violet-600" />
                <h3 className="text-xl font-medium text-mist-950">
                  {t("quickDefs.i18n.title", { defaultValue: "Internationalization (i18n)" })}
                </h3>
              </div>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("quickDefs.i18n.definition", { defaultValue: "Software internationalization is the process of designing and building your application so it can be adapted for different languages and regions without engineering changes. It's the foundation that makes localization possible." })}
              </p>
              <div className="p-4 rounded-xl bg-white border border-violet-100">
                <code className="text-sm text-mist-900 font-mono">i18n = i + (18 letters) + n</code>
              </div>
            </div>
            <div className="p-8 rounded-2xl bg-blue-50 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <IconGlobe className="size-6 text-blue-600" />
                <h3 className="text-xl font-medium text-mist-950">
                  {t("quickDefs.l10n.title", { defaultValue: "Localization (l10n)" })}
                </h3>
              </div>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("quickDefs.l10n.definition", { defaultValue: "Localization and internationalization work together, but localization is the actual adaptation of content for a specific locale - translating text, formatting numbers and dates, and adjusting cultural elements for each target market." })}
              </p>
              <div className="p-4 rounded-xl bg-white border border-blue-100">
                <code className="text-sm text-mist-900 font-mono">l10n = l + (10 letters) + n</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Side-by-Side Comparison */}
      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-8 text-center">
            {t("comparison.title", { defaultValue: "Localisation vs Internationalisation: What Each Involves" })}
          </h2>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="p-6 rounded-xl bg-white border border-mist-200">
              <h3 className="text-lg font-medium text-mist-950 mb-4 flex items-center gap-2">
                <IconCodeBrackets className="size-5 text-violet-600" />
                {t("comparison.i18n.title", { defaultValue: "Internationalization Activities" })}
              </h3>
              <ul className="space-y-3">
                {i18nActivities.map((activityKey) => (
                  <li key={activityKey} className="flex items-start gap-2">
                    <IconCheckmark1 className="size-4 text-violet-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-mist-700">{t(activityKey, { defaultValue: activityKey.split(".").pop() })}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 rounded-xl bg-white border border-mist-200">
              <h3 className="text-lg font-medium text-mist-950 mb-4 flex items-center gap-2">
                <IconGlobe className="size-5 text-blue-600" />
                {t("comparison.l10n.title", { defaultValue: "Localization Activities" })}
              </h3>
              <ul className="space-y-3">
                {l10nActivities.map((activityKey) => (
                  <li key={activityKey} className="flex items-start gap-2">
                    <IconCheckmark1 className="size-4 text-blue-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-mist-700">{t(activityKey, { defaultValue: activityKey.split(".").pop() })}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Key Differences */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("differences.title", { defaultValue: "Key Differences Between i18n and l10n" })}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {keyDifferences.map((diff) => (
              <div key={diff.titleKey} className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(diff.titleKey, { defaultValue: diff.titleKey.split(".").pop() })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(diff.descKey, { defaultValue: "" })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How They Work Together */}
      <section className="py-16 bg-mist-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
              {t("together.title", { defaultValue: "How Internationalization and Localization Work Together" })}
            </h2>
            <p className="text-mist-700 leading-relaxed mb-4">
              {t("together.paragraph1", { defaultValue: "Software internationalization and localization are two sides of the same coin. Internationalization prepares your codebase to support multiple locales, while localization fills in the locale-specific content. You internationalize once, then localize for each market." })}
            </p>
            <p className="text-mist-700 leading-relaxed">
              {t("together.paragraph2", { defaultValue: "Better i18n bridges both processes: it handles internationalization through type-safe SDKs and automatic key discovery, and streamlines localization with AI-powered translations, glossary management, and instant CDN deployment." })}
            </p>
          </div>
        </div>
      </section>

      {/* Related Pages */}
      <section className="py-12 border-t border-mist-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="text-lg font-medium text-mist-950 mb-6">
            {tCommon("whatIs.relatedTopics", { defaultValue: "Related Topics" })}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedPages.map((page) => (
              <Link
                key={page.href}
                to={page.href}
                params={{ locale }}
                className="group flex items-center justify-between p-4 rounded-xl border border-mist-200 bg-white hover:border-mist-300 hover:shadow-md transition-all"
              >
                <div>
                  <h3 className="text-sm font-medium text-mist-950">{page.name}</h3>
                  <p className="text-xs text-mist-500 mt-1">{page.description}</p>
                </div>
                <IconArrowRight className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-mist-950 rounded-3xl mx-6 lg:mx-10 mb-16">
        <div className="mx-auto max-w-2xl text-center px-6">
          <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-white sm:text-4xl/[1.1]">
            {t("cta.title", { defaultValue: "Handle Both i18n and l10n in One Platform" })}
          </h2>
          <p className="mt-4 text-lg text-mist-300">
            {t("cta.subtitle", { defaultValue: "Better i18n covers the full internationalization and localization pipeline. From code to translation to deployment." })}
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <a
              href="https://dash.better-i18n.com"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-mist-950 hover:bg-mist-100 transition-colors"
            >
              {t("cta.primary", { defaultValue: "Start Free" })}
            </a>
            <a
              href="https://docs.better-i18n.com"
              className="rounded-full border border-mist-600 px-6 py-3 text-sm font-medium text-white hover:bg-mist-800 transition-colors"
            >
              {t("cta.secondary", { defaultValue: "Read the Docs" })}
            </a>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
