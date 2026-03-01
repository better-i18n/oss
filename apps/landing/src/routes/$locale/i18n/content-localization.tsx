import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import {
  IconGlobe,
  IconCheckmark1,
  IconArrowRight,
  IconGroup1,
  IconRocket,
  IconSparklesSoft,
  IconAiTranslate,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/i18n/content-localization")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "contentLocalization",
      pathname: "/i18n/content-localization",
      pageType: "educational",
      structuredDataOptions: {
        title: "Content Localization Guide",
        description:
          "Complete guide to content localization: what it means, how the localization process works, best practices for adapting content to different cultures, and measuring ROI.",
      },
    });
  },
  component: ContentLocalizationPage,
});

const challenges = [
  { icon: IconGroup1, titleKey: "challenges.contentVolume.title", descKey: "challenges.contentVolume.description", defaultTitle: "Content Volume", defaultDesc: "Marketing pages, help docs, product UI, and legal content multiply with every new locale. Without automation, teams drown in spreadsheets and stale translations." },
  { icon: IconRocket, titleKey: "challenges.culturalNuance.title", descKey: "challenges.culturalNuance.description", defaultTitle: "Cultural Nuance", defaultDesc: "Humor, idioms, color associations, and imagery that resonate in one market can confuse or offend in another. True localization requires cultural expertise, not just language skills." },
  { icon: IconAiTranslate, titleKey: "challenges.consistency.title", descKey: "challenges.consistency.description", defaultTitle: "Terminology Consistency", defaultDesc: "Brand terms, feature names, and product vocabulary must stay consistent across dozens of languages. A single inconsistency erodes user trust and confuses support teams." },
  { icon: IconGlobe, titleKey: "challenges.scalability.title", descKey: "challenges.scalability.description", defaultTitle: "Scalability", defaultDesc: "Adding a new locale should not require re-engineering your content pipeline. Scalable localization demands structured workflows, reusable glossaries, and automated syncing." },
];

function ContentLocalizationPage() {
  const t = useT("marketing.i18n.contentLocalization");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  const benefits = [
    { key: "benefits.list.deeperEngagement", defaultValue: "Deeper audience engagement with culturally relevant content" },
    { key: "benefits.list.higherConversion", defaultValue: "Higher conversion rates when users interact in their native language" },
    { key: "benefits.list.brandTrust", defaultValue: "Stronger brand trust through locally adapted messaging" },
    { key: "benefits.list.seoVisibility", defaultValue: "Improved SEO visibility in regional search engines" },
    { key: "benefits.list.reducedBounce", defaultValue: "Reduced bounce rates on localized landing pages" },
    { key: "benefits.list.globalRevenue", defaultValue: "Increased global revenue from new international markets" },
  ];

  const processSteps = [
    { number: "1", titleKey: "process.step1.title", descKey: "process.step1.description", defaultTitle: "Content Audit", defaultDesc: "Inventory all content assets, prioritize by traffic and business impact, and identify what needs full localization versus simple translation." },
    { number: "2", titleKey: "process.step2.title", descKey: "process.step2.description", defaultTitle: "Locale Strategy", defaultDesc: "Define target markets, establish style guides and glossaries per locale, and set quality benchmarks for each content type." },
    { number: "3", titleKey: "process.step3.title", descKey: "process.step3.description", defaultTitle: "Translation & Adaptation", defaultDesc: "Translate and culturally adapt content using AI-powered tools, professional linguists, or a hybrid workflow for optimal speed and quality." },
    { number: "4", titleKey: "process.step4.title", descKey: "process.step4.description", defaultTitle: "Review & QA", defaultDesc: "Run in-context review with native speakers, check formatting and layout across locales, and validate all links and media references." },
    { number: "5", titleKey: "process.step5.title", descKey: "process.step5.description", defaultTitle: "Publish & Iterate", defaultDesc: "Deploy localized content, monitor engagement metrics per locale, and feed learnings back into the next localization cycle." },
  ];

  const relatedPages = [
    { name: "Content Localization Services", href: "/$locale/i18n/content-localization-services", description: t("related.contentLocalizationServices", { defaultValue: "How to choose the right localization service provider" }) },
    { name: "Cultural Adaptation", href: "/$locale/i18n/cultural-adaptation", description: t("related.culturalAdaptation", { defaultValue: "Adapting your content for different cultural contexts" }) },
    { name: "What is Localization?", href: "/$locale/what-is-localization", description: t("related.whatIsLocalization", { defaultValue: "Localization fundamentals and definitions explained" }) },
    { name: "Website Localization", href: "/$locale/i18n/website-localization", description: t("related.websiteLocalization", { defaultValue: "Localizing your web application for global markets" }) },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <IconGroup1 className="size-4" />
              <span>{t("badge", { defaultValue: "Content Localization" })}</span>
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("hero.title", { defaultValue: "Content Localization: Adapt Every Word for Every Market" })}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle", { defaultValue: "Content localization means adapting your text, images, tone, and messaging so they resonate authentically with local audiences. Discover what content localization means, how the localization process works, and the proven best practices that turn global visitors into loyal customers." })}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("definition.title", { defaultValue: "What Is Content Localization?" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph1", { defaultValue: "Content localization is the process of adapting written, visual, and multimedia content so it feels native to a specific locale. Where translation converts words from one language to another, localisation means reshaping messaging, imagery, humor, and formatting to match the cultural expectations of the target market." })}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph2", { defaultValue: "The localization meaning extends beyond linguistics. It covers date and number formatting, currency symbols, color associations, idiomatic expressions, and even content length — languages like German or Finnish can expand text by 30–40% compared to English, requiring flexible layouts." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("definition.paragraph3", { defaultValue: "Game localization is a prime example of the depth required: voice acting, cultural references, character names, and in-game UI all need careful adaptation. The same thoroughness applies to marketing content, help documentation, and SaaS product copy." })}
              </p>
            </div>
            <div className="mt-10 lg:mt-0 p-8 rounded-2xl bg-mist-50 border border-mist-100">
              <h3 className="text-lg font-medium text-mist-950 mb-4">
                {t("translationVsLocalization.title", { defaultValue: "Translation vs. Localization" })}
              </h3>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("translationVsLocalization.paragraph1", { defaultValue: "Translation is a subset of localization. A translator converts the source text word-for-word; a localizer adapts the entire experience. Localization meaning encompasses cultural context, regional regulations, local idioms, and market-specific preferences that translation alone cannot capture." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("translationVsLocalization.paragraph2", { defaultValue: "Companies that invest in true content localization — not just translation — see measurably higher engagement, lower churn, and stronger brand loyalty in international markets." })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("challenges.title", { defaultValue: "Common Content Localization Challenges" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("challenges.subtitle", { defaultValue: "Understanding what makes the localization process hard helps you choose tools and workflows that solve the right problems." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {challenges.map((challenge) => (
              <div key={challenge.titleKey} className="p-6 rounded-xl bg-white border border-mist-200">
                <div className="size-10 rounded-lg bg-mist-100 flex items-center justify-center text-mist-700 mb-4">
                  <challenge.icon className="size-5" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(challenge.titleKey, { defaultValue: challenge.defaultTitle })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(challenge.descKey, { defaultValue: challenge.defaultDesc })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("benefits.title", { defaultValue: "Benefits of Content Localization" })}
              </h2>
              <p className="text-mist-700 leading-relaxed">
                {t("benefits.subtitle", { defaultValue: "Well-executed content localization delivers compounding returns: audiences engage more deeply, convert at higher rates, and remain loyal to brands that speak their language — literally and culturally." })}
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <ul className="space-y-4">
                {benefits.map((item) => (
                  <li key={item.key} className="flex items-start gap-3">
                    <IconCheckmark1 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-mist-700">{t(item.key, { defaultValue: item.defaultValue })}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("process.title", { defaultValue: "The Content Localization Process" })}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("process.subtitle", { defaultValue: "A repeatable five-step localization process that scales from a single page to an entire product suite." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {processSteps.map((step) => (
              <div key={step.number} className="text-center p-6">
                <div className="size-10 rounded-full bg-mist-950 text-white flex items-center justify-center text-sm font-medium mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(step.titleKey, { defaultValue: step.defaultTitle })}
                </h3>
                <p className="text-sm text-mist-600">
                  {t(step.descKey, { defaultValue: step.defaultDesc })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("quality.title", { defaultValue: "Measuring Localization Quality and ROI" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("quality.subtitle", { defaultValue: "Effective content localization is measurable. Track these signals to quantify your investment." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="p-6 rounded-xl bg-white border border-mist-200">
              <IconRocket className="size-6 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("quality.engagement.title", { defaultValue: "Engagement Metrics" })}
              </h3>
              <p className="text-sm text-mist-700 leading-relaxed">
                {t("quality.engagement.description", { defaultValue: "Monitor time on page, scroll depth, and pages per session for localized content versus machine-translated or English-only content. Localized pages consistently outperform generic translations by 40–60% on engagement." })}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-mist-200">
              <IconSparklesSoft className="size-6 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("quality.conversion.title", { defaultValue: "Conversion Rate by Locale" })}
              </h3>
              <p className="text-sm text-mist-700 leading-relaxed">
                {t("quality.conversion.description", { defaultValue: "Break down conversion funnels per locale. Markets with culturally adapted content — including localized payment methods, local currency, and region-specific testimonials — see conversion rates that rival your primary market." })}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-mist-200">
              <IconRocket className="size-6 text-mist-700 mb-3" />
              <h3 className="text-base font-medium text-mist-950 mb-2">
                {t("quality.roi.title", { defaultValue: "Revenue Attribution" })}
              </h3>
              <p className="text-sm text-mist-700 leading-relaxed">
                {t("quality.roi.description", { defaultValue: "Track revenue generated from each localized market against the cost of content localization. Teams using AI-powered workflows typically recover localization costs within the first 90 days of launch in a new market." })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
              {t("solution.title", { defaultValue: "How Better i18n Powers Your Content Localization" })}
            </h2>
            <p className="text-mist-700 leading-relaxed mb-8">
              {t("solution.content", { defaultValue: "Better i18n makes the localization process fast and reliable for engineering teams. Automatically extract translation keys from your React, Next.js, or Vue codebase, apply context-aware AI translations, and ship to production without a redeploy." })}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-left">
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature1.title", { defaultValue: "Automatic Key Extraction" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature1.description", { defaultValue: "Scan your entire codebase and surface every untranslated string instantly — no manual spreadsheets." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature2.title", { defaultValue: "Context-Aware AI" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature2.description", { defaultValue: "AI trained on your glossary and brand tone delivers translations that match your voice across all locales." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature3.title", { defaultValue: "Live CDN Delivery" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature3.description", { defaultValue: "Push updated translations to a global edge network in seconds — audiences see new content without waiting for a release cycle." })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 border-t border-mist-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="text-lg font-medium text-mist-950 mb-6">{tCommon("whatIs.relatedTopics", { defaultValue: "Related Topics" })}</h2>
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

      <section className="py-16 sm:py-24 bg-mist-950 rounded-3xl mx-6 lg:mx-10 mb-16">
        <div className="mx-auto max-w-2xl text-center px-6">
          <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-white sm:text-4xl/[1.1]">
            {t("cta.title", { defaultValue: "Start Your Content Localization Journey" })}
          </h2>
          <p className="mt-4 text-lg text-mist-300">
            {t("cta.subtitle", { defaultValue: "Set up AI-powered content localization in minutes and reach global audiences with content that truly resonates." })}
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <a
              href="https://dash.better-i18n.com"
              aria-label="Start localizing your content for free with Better i18n"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-mist-950 hover:bg-mist-100 transition-colors"
            >
              {t("cta.primary", { defaultValue: "Get Started Free" })}
            </a>
            <a
              href="https://docs.better-i18n.com"
              aria-label="Read the Better i18n documentation"
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
