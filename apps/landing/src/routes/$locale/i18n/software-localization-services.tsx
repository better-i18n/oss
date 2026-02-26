import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useTranslations } from "@better-i18n/use-intl";
import {
  IconCheckmark1,
  IconArrowRight,
  IconRobot,
  IconGroup1,
  IconGlobe,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute(
  "/$locale/i18n/software-localization-services",
)({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "softwareLocalizationServices",
      pathname: "/i18n/software-localization-services",
      pageType: "educational",
      structuredDataOptions: {
        title: "Software Localization Services Guide",
        description:
          "Compare software localization services: platforms vs agencies, mobile app localization, and how to choose the right approach for your team.",
      },
    });
  },
  component: SoftwareLocalizationServicesPage,
});

function SoftwareLocalizationServicesPage() {
  const t = useTranslations("marketing.i18n.softwareLocalizationServices");
  const tCommon = useTranslations("marketing");
  const { locale } = Route.useParams();

  const serviceTypes = [
    { titleKey: "types.platform.title", descKey: "types.platform.description", icon: IconRobot },
    { titleKey: "types.agency.title", descKey: "types.agency.description", icon: IconGroup1 },
    { titleKey: "types.hybrid.title", descKey: "types.hybrid.description", icon: IconGlobe },
  ];

  const platformBenefits = [
    "platformBenefits.list.speed",
    "platformBenefits.list.cost",
    "platformBenefits.list.control",
    "platformBenefits.list.integration",
    "platformBenefits.list.scalability",
    "platformBenefits.list.consistency",
  ];

  const mobileFeatures = [
    { titleKey: "mobile.features.stringExtraction.title", descKey: "mobile.features.stringExtraction.description" },
    { titleKey: "mobile.features.pluralization.title", descKey: "mobile.features.pluralization.description" },
    { titleKey: "mobile.features.screenshots.title", descKey: "mobile.features.screenshots.description" },
    { titleKey: "mobile.features.otaUpdates.title", descKey: "mobile.features.otaUpdates.description" },
  ];

  const relatedPages = [
    { name: "Software Localization", href: "/$locale/i18n/software-localization", description: t("related.softwareLocalization", { defaultValue: "The complete software localization process" }) },
    { name: "Translation Management System", href: "/$locale/i18n/translation-management-system", description: t("related.tms", { defaultValue: "How TMS platforms work" }) },
    { name: "Best TMS Platforms", href: "/$locale/i18n/best-tms", description: t("related.bestTms", { defaultValue: "Compare top localization platforms" }) },
    { name: "Website Localization", href: "/$locale/i18n/website-localization", description: t("related.websiteLocalization", { defaultValue: "Guide to web app localization" }) },
  ];

  return (
    <MarketingLayout showCTA={false}>
      {/* Hero */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <span>{t("badge", { defaultValue: "Localization Services" })}</span>
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("hero.title", { defaultValue: "Software Localization Services: Platforms, Agencies, and How to Choose" })}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle", { defaultValue: "Explore software localization services for web and mobile applications. Compare platform-based software localisation services with traditional agencies, and find the right approach for your mobile app localization needs." })}
            </p>
          </div>
        </div>
      </section>

      {/* Service Types */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("types.title", { defaultValue: "Types of Software Localization Services" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("types.subtitle", { defaultValue: "Choose the right approach based on your team size, budget, and localization volume." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {serviceTypes.map((type) => (
              <div key={type.titleKey} className="p-8 rounded-2xl bg-mist-50 border border-mist-100">
                <div className="size-12 rounded-xl bg-white border border-mist-200 flex items-center justify-center text-mist-700 mb-5">
                  <type.icon className="size-6" />
                </div>
                <h3 className="text-lg font-medium text-mist-950 mb-3">
                  {t(type.titleKey, { defaultValue: type.titleKey.split(".").pop() })}
                </h3>
                <p className="text-mist-700 leading-relaxed">
                  {t(type.descKey, { defaultValue: "" })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Benefits */}
      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("platformBenefits.title", { defaultValue: "Why Use a Localization Platform?" })}
              </h2>
              <p className="text-mist-700 leading-relaxed">
                {t("platformBenefits.subtitle", { defaultValue: "Platform-based software localization services offer developer teams the speed, control, and scalability that traditional agencies cannot match." })}
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <ul className="space-y-4">
                {platformBenefits.map((benefitKey) => (
                  <li key={benefitKey} className="flex items-start gap-3">
                    <IconCheckmark1 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-mist-700">{t(benefitKey, { defaultValue: benefitKey.split(".").pop() })}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Localization */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("mobile.title", { defaultValue: "Mobile App Localization Services" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("mobile.subtitle", { defaultValue: "Mobile application localization services require specialized tooling for iOS and Android string formats, app store listings, and over-the-air translation updates." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {mobileFeatures.map((feature) => (
              <div key={feature.titleKey} className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(feature.titleKey, { defaultValue: feature.titleKey.split(".").pop() })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(feature.descKey, { defaultValue: "" })}
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
            {t("cta.title", { defaultValue: "The Developer-First Localization Platform" })}
          </h2>
          <p className="mt-4 text-lg text-mist-300">
            {t("cta.subtitle", { defaultValue: "Better i18n combines AI translation with developer-friendly SDKs. Localize your software in minutes, not months." })}
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
              {t("cta.secondary", { defaultValue: "View Documentation" })}
            </a>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
