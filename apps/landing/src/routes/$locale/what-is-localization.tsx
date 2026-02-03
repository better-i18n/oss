import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useTranslations } from "@better-i18n/use-intl";
import {
  IconTranslate,
  IconGlobe,
  IconImage,
  IconCurrency,
  IconCheckmark1,
  IconDocument,
  IconArrowRight,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/what-is-localization")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "whatIsLocalization",
      pathname: "/what-is-localization",
    });
  },
  component: WhatIsLocalizationPage,
});

function WhatIsLocalizationPage() {
  const t = useTranslations("marketing.whatIsLocalization");
  const tCommon = useTranslations("marketing");
  const { locale } = Route.useParams();

  const elements = [
    { icon: IconTranslate, titleKey: "elements.translation.title", descKey: "elements.translation.description" },
    { icon: IconCurrency, titleKey: "elements.formatting.title", descKey: "elements.formatting.description" },
    { icon: IconImage, titleKey: "elements.cultural.title", descKey: "elements.cultural.description" },
    { icon: IconDocument, titleKey: "elements.legal.title", descKey: "elements.legal.description" },
  ];

  const types = [
    { titleKey: "types.software.title", descKey: "types.software.description" },
    { titleKey: "types.website.title", descKey: "types.website.description" },
    { titleKey: "types.mobile.title", descKey: "types.mobile.description" },
    { titleKey: "types.game.title", descKey: "types.game.description" },
    { titleKey: "types.marketing.title", descKey: "types.marketing.description" },
    { titleKey: "types.ecommerce.title", descKey: "types.ecommerce.description" },
  ];

  const benefits = [
    "benefits.list.marketExpansion",
    "benefits.list.userEngagement",
    "benefits.list.brandTrust",
    "benefits.list.seo",
    "benefits.list.competitive",
    "benefits.list.revenue",
  ];

  return (
    <MarketingLayout showCTA={true}>
      {/* Hero Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mist-100 text-mist-700 text-sm font-medium mb-6">
              <IconTranslate className="size-4" />
              {t("badge")}
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1] lg:text-6xl/[1.1]">
              {t("hero.title")}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Definition Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("definition.title")}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph1")}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("definition.paragraph2")}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("definition.paragraph3")}
              </p>
            </div>
            <div className="mt-10 lg:mt-0 p-8 rounded-2xl bg-mist-50 border border-mist-100">
              <h3 className="text-lg font-medium text-mist-950 mb-4">{t("etymology.title")}</h3>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("etymology.content")}
              </p>
              <div className="p-4 rounded-xl bg-white border border-mist-200">
                <code className="text-sm text-mist-900">l10n = l + (10 letters) + n</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Elements of Localization */}
      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("elements.title")}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("elements.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {elements.map((element) => (
              <div key={element.titleKey} className="p-6 rounded-xl bg-white border border-mist-200">
                <div className="size-10 rounded-lg bg-mist-100 flex items-center justify-center text-mist-700 mb-4">
                  <element.icon className="size-5" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">{t(element.titleKey)}</h3>
                <p className="text-sm text-mist-700 leading-relaxed">{t(element.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Types of Localization */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("types.title")}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("types.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {types.map((type) => (
              <div key={type.titleKey} className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">{t(type.titleKey)}</h3>
                <p className="text-sm text-mist-700 leading-relaxed">{t(type.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-mist-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("benefits.title")}
              </h2>
              <p className="text-mist-700 leading-relaxed">
                {t("benefits.subtitle")}
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <ul className="space-y-4">
                {benefits.map((benefitKey) => (
                  <li key={benefitKey} className="flex items-start gap-3">
                    <IconCheckmark1 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-mist-700">{t(benefitKey)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Localization Process */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("process.title")}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("process.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ProcessStep number="1" title={t("process.step1.title")} description={t("process.step1.description")} />
            <ProcessStep number="2" title={t("process.step2.title")} description={t("process.step2.description")} />
            <ProcessStep number="3" title={t("process.step3.title")} description={t("process.step3.description")} />
            <ProcessStep number="4" title={t("process.step4.title")} description={t("process.step4.description")} />
          </div>
        </div>
      </section>

      {/* Related Topics */}
      <section className="py-12 border-t border-mist-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="text-lg font-medium text-mist-950 mb-6">{tCommon("whatIs.relatedTopics")}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/$locale/what-is-internationalization"
              params={{ locale }}
              className="group flex items-center justify-between p-4 rounded-xl border border-mist-200 bg-white hover:border-mist-300 hover:shadow-md transition-all"
            >
              <div>
                <h3 className="text-sm font-medium text-mist-950">{tCommon("whatIs.links.i18n")}</h3>
                <p className="text-xs text-mist-500 mt-1">{tCommon("whatIs.links.i18nDesc")}</p>
              </div>
              <IconArrowRight className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
            </Link>
            <Link
              to="/$locale/what-is"
              params={{ locale }}
              className="group flex items-center justify-between p-4 rounded-xl border border-mist-200 bg-white hover:border-mist-300 hover:shadow-md transition-all"
            >
              <div>
                <h3 className="text-sm font-medium text-mist-950">{tCommon("whatIs.links.overview")}</h3>
                <p className="text-xs text-mist-500 mt-1">{tCommon("whatIs.links.overviewDesc")}</p>
              </div>
              <IconArrowRight className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
            </Link>
            <Link
              to="/$locale/i18n"
              params={{ locale }}
              className="group flex items-center justify-between p-4 rounded-xl border border-mist-200 bg-white hover:border-mist-300 hover:shadow-md transition-all"
            >
              <div>
                <h3 className="text-sm font-medium text-mist-950">{tCommon("whatIs.links.frameworks")}</h3>
                <p className="text-xs text-mist-500 mt-1">{tCommon("whatIs.links.frameworksDesc")}</p>
              </div>
              <IconArrowRight className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
            </Link>
            <Link
              to="/$locale/compare"
              params={{ locale }}
              className="group flex items-center justify-between p-4 rounded-xl border border-mist-200 bg-white hover:border-mist-300 hover:shadow-md transition-all"
            >
              <div>
                <h3 className="text-sm font-medium text-mist-950">{tCommon("whatIs.links.compare")}</h3>
                <p className="text-xs text-mist-500 mt-1">{tCommon("whatIs.links.compareDesc")}</p>
              </div>
              <IconArrowRight className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}

function ProcessStep({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center p-6">
      <div className="size-10 rounded-full bg-mist-950 text-white flex items-center justify-center text-sm font-medium mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-base font-medium text-mist-950 mb-2">{title}</h3>
      <p className="text-sm text-mist-600">{description}</p>
    </div>
  );
}
