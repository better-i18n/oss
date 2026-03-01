import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import {
  IconCheckmark1,
  IconArrowRight,
  IconCodeBrackets,
  IconSettingsGear1,
  IconGlobe,
  IconZap,
  IconScript,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/i18n/formatting-utilities")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "formattingUtilities",
      pathname: "/i18n/formatting-utilities",
      pageType: "educational",
      structuredDataOptions: {
        title: "i18n Formatting Utilities — Numbers, Dates, Lists",
        description:
          "Locale-aware formatting hooks for numbers, dates, currency, and lists. Built-in components for language switching, zero flash, and automatic locale detection.",
      },
    });
  },
  component: FormattingUtilitiesPage,
});

const coreHooks = [
  { icon: IconSettingsGear1, titleKey: "hooks.useFormatter.title", descKey: "hooks.useFormatter.description" },
  { icon: IconZap, titleKey: "hooks.useNow.title", descKey: "hooks.useNow.description" },
  { icon: IconGlobe, titleKey: "hooks.useLanguages.title", descKey: "hooks.useLanguages.description" },
  { icon: IconGlobe, titleKey: "hooks.useLocale.title", descKey: "hooks.useLocale.description" },
  { icon: IconCodeBrackets, titleKey: "hooks.useTranslations.title", descKey: "hooks.useTranslations.description" },
];

function FormattingUtilitiesPage() {
  const t = useT("marketing.i18n.formattingUtilities");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  const numberFormattingItems = [
    "numberFormatting.list.currency",
    "numberFormatting.list.percentage",
    "numberFormatting.list.compact",
    "numberFormatting.list.customSeparators",
  ];

  const dateTimeItems = [
    "dateTime.list.dateStyles",
    "dateTime.list.timeFormatting",
    "dateTime.list.relativeTime",
    "dateTime.list.useNowHook",
    "dateTime.list.timezone",
  ];

  const listFormattingItems = [
    "listFormatting.list.conjunction",
    "listFormatting.list.disjunction",
    "listFormatting.list.unit",
  ];

  const componentItems = [
    "components.list.languageSwitcher",
    "components.list.zeroFlash",
    "components.list.localeCookie",
    "components.list.acceptLanguage",
    "components.list.fallbackLocale",
  ];

  const relatedPages = [
    { name: "For Developers", href: "/$locale/i18n/for-developers", description: t("related.forDevelopers", { defaultValue: "Developer-first i18n with type-safe SDKs and CLI tools" }) },
    { name: "React", href: "/$locale/i18n/react", description: t("related.react", { defaultValue: "React i18n integration with hooks, context, and SSR support" }) },
    { name: "Localization Tools", href: "/$locale/i18n/localization-tools", description: t("related.localizationTools", { defaultValue: "Developer tools and integrations for localization workflows" }) },
    { name: "Localization Software", href: "/$locale/i18n/localization-software", description: t("related.localizationSoftware", { defaultValue: "TMS and CAT tools for managing translations at scale" }) },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <IconScript className="size-4" />
              <span>{t("badge", { defaultValue: "Formatting & Utilities" })}</span>
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("hero.title", { defaultValue: "Formatting & Utilities: Locale-Aware Numbers, Dates, and Lists Out of the Box" })}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle", { defaultValue: "Stop hand-rolling locale logic. Better i18n ships formatting hooks that wrap the Intl API with automatic locale resolution, SSR safety, and type-safe access — so every number, date, and list renders correctly for every user." })}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("hooks.title", { defaultValue: "Core Hooks" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("hooks.subtitle", { defaultValue: "Five hooks cover every formatting and locale operation you need in a React application." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coreHooks.map((hook) => (
              <div key={hook.titleKey} className="p-6 rounded-xl bg-white border border-mist-200">
                <div className="size-10 rounded-lg bg-mist-100 flex items-center justify-center text-mist-700 mb-4">
                  <hook.icon className="size-5" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(hook.titleKey, { defaultValue: hook.titleKey.split(".").pop() })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(hook.descKey, { defaultValue: "" })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("numberFormatting.title", { defaultValue: "Number Formatting" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-6">
                {t("numberFormatting.subtitle", { defaultValue: "Format currency, percentages, and large numbers with locale-specific separators, symbols, and notation — all through a single useFormatter hook." })}
              </p>
              <ul className="space-y-4">
                {numberFormattingItems.map((itemKey) => (
                  <li key={itemKey} className="flex items-start gap-3">
                    <IconCheckmark1 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-mist-700">{t(itemKey, { defaultValue: itemKey.split(".").pop() })}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-10 lg:mt-0">
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("dateTime.title", { defaultValue: "Date & Time" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-6">
                {t("dateTime.subtitle", { defaultValue: "Localized date styles, relative time formatting, and a real-time clock hook handle every temporal display your app needs." })}
              </p>
              <ul className="space-y-4">
                {dateTimeItems.map((itemKey) => (
                  <li key={itemKey} className="flex items-start gap-3">
                    <IconCheckmark1 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-mist-700">{t(itemKey, { defaultValue: itemKey.split(".").pop() })}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("listFormatting.title", { defaultValue: "List Formatting" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-6">
                {t("listFormatting.subtitle", { defaultValue: "Render grammatically correct lists in every locale with conjunction, disjunction, and unit formatting via the Intl.ListFormat API." })}
              </p>
              <ul className="space-y-4">
                {listFormattingItems.map((itemKey) => (
                  <li key={itemKey} className="flex items-start gap-3">
                    <IconCheckmark1 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-mist-700">{t(itemKey, { defaultValue: itemKey.split(".").pop() })}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 lg:mt-0 p-8 rounded-2xl bg-mist-50 border border-mist-100">
              <h3 className="text-lg font-medium text-mist-950 mb-4">
                {t("listFormatting.example.title", { defaultValue: "List Formatting Examples" })}
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-mist-950 mb-1">{t("listFormatting.example.conjunction.title", { defaultValue: "Conjunction (\"and\")" })}</h4>
                  <p className="text-sm text-mist-700">{t("listFormatting.example.conjunction.description", { defaultValue: "English: \"React, Vue, and Svelte\" — Japanese: \"React\u3001Vue\u3001Svelte\"" })}</p>
                </div>
                <div className="border-t border-mist-200 pt-4">
                  <h4 className="text-sm font-semibold text-mist-950 mb-1">{t("listFormatting.example.disjunction.title", { defaultValue: "Disjunction (\"or\")" })}</h4>
                  <p className="text-sm text-mist-700">{t("listFormatting.example.disjunction.description", { defaultValue: "English: \"USD, EUR, or GBP\" — German: \"USD, EUR oder GBP\"" })}</p>
                </div>
                <div className="border-t border-mist-200 pt-4">
                  <h4 className="text-sm font-semibold text-mist-950 mb-1">{t("listFormatting.example.unit.title", { defaultValue: "Unit" })}</h4>
                  <p className="text-sm text-mist-700">{t("listFormatting.example.unit.description", { defaultValue: "English: \"3 feet, 7 inches\" — French: \"3 pieds et 7 pouces\"" })}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("components.title", { defaultValue: "Ready-to-Use Components" })}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("components.subtitle", { defaultValue: "Drop-in components and utilities that handle the common locale management tasks every multilingual app needs." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {componentItems.map((itemKey) => (
              <div key={itemKey} className="flex items-start gap-3 p-6 rounded-xl bg-white border border-mist-200">
                <IconCheckmark1 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-mist-700">{t(itemKey, { defaultValue: itemKey.split(".").pop() })}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
              {t("solution.title", { defaultValue: "Better i18n: Formatting That Just Works" })}
            </h2>
            <p className="text-mist-700 leading-relaxed mb-8">
              {t("solution.content", { defaultValue: "Every formatting hook in Better i18n wraps the Intl API with automatic locale resolution, SSR hydration safety, and full TypeScript support. No manual locale threading, no hydration mismatches, no missing Intl polyfills." })}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-left">
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature1.title", { defaultValue: "SSR-Safe Formatting" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature1.description", { defaultValue: "All hooks resolve the locale from the provider context, ensuring server and client render identical output with zero hydration mismatches." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature2.title", { defaultValue: "Type-Safe Access" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature2.description", { defaultValue: "TypeScript generics on useTranslations ensure that every translation key is validated at compile time — no more missing keys discovered in production." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature3.title", { defaultValue: "Zero Configuration" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature3.description", { defaultValue: "Wrap your app in the provider, point to your CDN, and every hook works immediately. No polyfills, no Intl shims, no manual locale wiring." })}
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
            {t("cta.title", { defaultValue: "Format Every Number, Date, and List for Every Locale" })}
          </h2>
          <p className="mt-4 text-lg text-mist-300">
            {t("cta.subtitle", { defaultValue: "Better i18n ships formatting hooks that wrap the Intl API with automatic locale resolution, SSR safety, and full TypeScript support — so you never hand-roll locale logic again." })}
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <a
              href="https://dash.better-i18n.com"
              aria-label="Start using Better i18n formatting utilities for free"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-mist-950 hover:bg-mist-100 transition-colors"
            >
              {t("cta.primary", { defaultValue: "Get Started Free" })}
            </a>
            <a
              href="https://docs.better-i18n.com"
              aria-label="Read the Better i18n formatting utilities documentation"
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
