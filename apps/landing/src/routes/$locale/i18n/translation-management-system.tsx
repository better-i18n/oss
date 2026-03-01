import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import {
  IconCheckmark1,
  IconArrowRight,
  IconGlobe,
  IconGithub,
  IconRobot,
  IconZap,
  IconCodeBrackets,
  IconGroup1,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

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
  { icon: IconRobot, titleKey: "features.ai.title", descKey: "features.ai.description", defaultTitle: "AI-Powered Translation", defaultDesc: "Leverage AI translation engines for instant first drafts that human translators can review and refine." },
  { icon: IconGithub, titleKey: "features.git.title", descKey: "features.git.description", defaultTitle: "Git Integration", defaultDesc: "Sync translation files directly with your Git repository so translations stay in lockstep with code changes." },
  { icon: IconGlobe, titleKey: "features.cdn.title", descKey: "features.cdn.description", defaultTitle: "CDN Delivery", defaultDesc: "Serve translated content from a global CDN for fast load times in every locale without redeploying your app." },
  { icon: IconZap, titleKey: "features.automation.title", descKey: "features.automation.description", defaultTitle: "Workflow Automation", defaultDesc: "Automate assignment, review, and publishing workflows to eliminate manual steps in the localization process." },
  { icon: IconCodeBrackets, titleKey: "features.sdk.title", descKey: "features.sdk.description", defaultTitle: "Developer SDKs", defaultDesc: "Use client and server SDKs to load translations at runtime or build time with framework-native integrations." },
  { icon: IconGroup1, titleKey: "features.collaboration.title", descKey: "features.collaboration.description", defaultTitle: "Real-Time Collaboration", defaultDesc: "Enable translators, reviewers, and project managers to collaborate simultaneously on translation projects." },
];

function TranslationManagementSystemPage() {
  const t = useT("marketing.i18n.translationManagementSystem");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  const benefits = [
    { key: "benefits.list.efficiency", defaultValue: "Reduce translation turnaround time by up to 60% with automated workflows" },
    { key: "benefits.list.consistency", defaultValue: "Maintain brand voice consistency across all languages with shared glossaries" },
    { key: "benefits.list.collaboration", defaultValue: "Enable seamless collaboration between developers, translators, and reviewers" },
    { key: "benefits.list.costReduction", defaultValue: "Lower per-word translation costs with translation memory and AI assistance" },
    { key: "benefits.list.scalability", defaultValue: "Scale to dozens of languages without adding proportional headcount" },
    { key: "benefits.list.quality", defaultValue: "Improve translation quality with built-in QA checks and review workflows" },
  ];

  const useCases = [
    { titleKey: "useCases.saas.title", descKey: "useCases.saas.description", defaultTitle: "SaaS Applications", defaultDesc: "Continuously localize product interfaces, emails, and documentation as features ship every sprint." },
    { titleKey: "useCases.ecommerce.title", descKey: "useCases.ecommerce.description", defaultTitle: "E-commerce Platforms", defaultDesc: "Localize product catalogs, checkout flows, and marketing content for international storefronts." },
    { titleKey: "useCases.enterprise.title", descKey: "useCases.enterprise.description", defaultTitle: "Enterprise Software", defaultDesc: "Manage large-scale localization across multiple products, business units, and compliance requirements." },
    { titleKey: "useCases.mobile.title", descKey: "useCases.mobile.description", defaultTitle: "Mobile Applications", defaultDesc: "Deliver over-the-air translation updates to iOS and Android apps without requiring app store releases." },
  ];

  const relatedPages = [
    { name: "Best TMS Platforms", href: "/$locale/i18n/best-tms", description: t("related.bestTms", { defaultValue: "Compare top TMS solutions side by side" }) },
    { name: "Website Localization", href: "/$locale/i18n/website-localization", description: t("related.websiteLocalization", { defaultValue: "Localize your web application for global users" }) },
    { name: "Software Localization Services", href: "/$locale/i18n/software-localization-services", description: t("related.services", { defaultValue: "Platform vs agency localization approaches" }) },
    { name: "Localization Management", href: "/$locale/i18n/localization-management", description: t("related.management", { defaultValue: "Managing translation workflows at scale" }) },
  ];

  return (
    <MarketingLayout showCTA={false}>
      {/* Hero */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <span>{t("badge", { defaultValue: "Translation Management" })}</span>
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("hero.title", { defaultValue: "Translation Management System: The Complete Guide" })}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle", { defaultValue: "A translation management system (TMS) centralizes your localization workflow - from translation management software to automated deployment. Learn what to look for in a TMS and how to choose the right translation management solution for your team." })}
            </p>
          </div>
        </div>
      </section>

      {/* What is a TMS */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("definition.title", { defaultValue: "What Is a Translation Management System?" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph1", { defaultValue: "A translation management system (TMS) is a software platform that helps organizations manage the translation and localization of their digital content. It serves as a central hub where developers, translators, and project managers collaborate to deliver multilingual products." })}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph2", { defaultValue: "Modern translation management software goes beyond simple file-based workflows. Today's best platforms offer automated translation integration, AI-powered suggestions, real-time collaboration, and seamless deployment through CDN or Git-based publishing." })}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("definition.paragraph3", { defaultValue: "Whether you need a translation management portal for a single application or an enterprise translation software solution managing hundreds of projects, a TMS eliminates manual processes and reduces time-to-market for localized content." })}
              </p>
            </div>
            <div className="mt-10 lg:mt-0 p-8 rounded-2xl bg-mist-50 border border-mist-100">
              <h3 className="text-lg font-medium text-mist-950 mb-4">
                {t("tmsVsManual.title", { defaultValue: "TMS vs Manual Translation" })}
              </h3>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("tmsVsManual.content", { defaultValue: "Manual translation workflows using spreadsheets and email are error-prone, slow, and impossible to scale. A translation management system automates key management, provides translation memory, and ensures consistency across all your localization tools." })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("features.title", { defaultValue: "Essential Translation Management Features" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("features.subtitle", { defaultValue: "The best translation management software includes these core capabilities for efficient localization workflows." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coreFeatures.map((feature) => (
              <div key={feature.titleKey} className="p-6 rounded-xl bg-white border border-mist-200">
                <div className="size-10 rounded-lg bg-mist-100 flex items-center justify-center text-mist-700 mb-4">
                  <feature.icon className="size-5" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(feature.titleKey, { defaultValue: feature.defaultTitle })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(feature.descKey, { defaultValue: feature.defaultDesc })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("benefits.title", { defaultValue: "Benefits of Using a Translation Management System" })}
              </h2>
              <p className="text-mist-700 leading-relaxed">
                {t("benefits.subtitle", { defaultValue: "Organizations using translation management tools report significant improvements in localization speed, quality, and cost efficiency." })}
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit.key} className="flex items-start gap-3">
                    <IconCheckmark1 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-mist-700">{t(benefit.key, { defaultValue: benefit.defaultValue })}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-mist-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("useCases.title", { defaultValue: "Translation Management System Use Cases" })}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("useCases.subtitle", { defaultValue: "From startups to enterprises, here's how teams use translation management technology." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {useCases.map((useCase) => (
              <div key={useCase.titleKey} className="p-6 rounded-xl bg-white border border-mist-200">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(useCase.titleKey, { defaultValue: useCase.defaultTitle })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(useCase.descKey, { defaultValue: useCase.defaultDesc })}
                </p>
              </div>
            ))}
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
            {t("cta.title", { defaultValue: "Try the AI-Native Translation Management System" })}
          </h2>
          <p className="mt-4 text-lg text-mist-300">
            {t("cta.subtitle", { defaultValue: "Better i18n combines AI translation, developer tools, and team collaboration in one platform." })}
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <a
              href="https://dash.better-i18n.com"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-mist-950 hover:bg-mist-100 transition-colors"
            >
              {t("cta.primary", { defaultValue: "Start Free" })}
            </a>
            <Link
              to="/$locale/i18n/best-tms"
              params={{ locale }}
              className="rounded-full border border-mist-600 px-6 py-3 text-sm font-medium text-white hover:bg-mist-800 transition-colors"
            >
              {t("cta.secondary", { defaultValue: "Compare TMS Platforms" })}
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
