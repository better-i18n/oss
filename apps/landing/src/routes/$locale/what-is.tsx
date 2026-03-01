import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader, getEducationalPageStructuredData, formatStructuredData } from "@/lib/page-seo";
import { getHowToSchema } from "@/lib/structured-data";
import { useTranslations } from "@better-i18n/use-intl";
import { RelatedPages } from "@/components/RelatedPages";
import {
  IconGlobe,
  IconTranslate,
  IconCodeBrackets,
  IconRocket,
  IconSparklesSoft,
  IconGithub,
  IconArrowRight,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/what-is")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    const messages = loaderData?.messages || {};
    const locale = loaderData?.locale || "en";

    const howItWorksNs = (messages as Record<string, unknown>)?.marketing as
      | Record<string, unknown>
      | undefined;
    const whatIsPageNs = howItWorksNs?.whatIsPage as Record<string, unknown> | undefined;
    const howItWorks = whatIsPageNs?.howItWorks as Record<string, Record<string, string>> | undefined;

    const stepKeys = ["step1", "step2", "step3", "step4"];
    const howToSteps = howItWorks
      ? stepKeys
          .filter((key) => howItWorks[key]?.title && howItWorks[key]?.description)
          .map((key) => ({
            name: howItWorks[key].title,
            text: howItWorks[key].description,
          }))
      : [];

    const educationalScripts = getEducationalPageStructuredData({
      title: "What is i18n and l10n? Internationalization & Localization Guide",
      description: "Understand the differences between internationalization (i18n) and localization (l10n), and learn how Better i18n streamlines both processes.",
      url: `https://better-i18n.com/${locale}/what-is`,
    });

    const howToScript = howToSteps.length > 0
      ? formatStructuredData(getHowToSchema({
          name: "How to Internationalize Your Application with Better i18n",
          description: "Step-by-step guide to setting up internationalization using Better i18n.",
          steps: howToSteps,
          totalTime: "PT15M",
        }))
      : [];

    return getPageHead({
      messages,
      locale,
      pageKey: "whatIs",
      pathname: "/what-is",
      customStructuredData: [...educationalScripts, ...howToScript],
    });
  },
  component: WhatIsPage,
});

function WhatIsPage() {
  const t = useTranslations("marketing.whatIsPage");
  const { locale } = useParams({ strict: false });
  const currentLocale = locale || "en";

  const concepts = [
    {
      icon: IconGlobe,
      titleKey: "concepts.i18n.title",
      descKey: "concepts.i18n.description",
      href: "/$locale/what-is-internationalization" as const,
    },
    {
      icon: IconTranslate,
      titleKey: "concepts.l10n.title",
      descKey: "concepts.l10n.description",
      href: "/$locale/what-is-localization" as const,
    },
    {
      icon: IconCodeBrackets,
      titleKey: "concepts.difference.title",
      descKey: "concepts.difference.description",
      href: null,
    },
  ];

  const benefits = [
    {
      icon: IconRocket,
      titleKey: "benefits.speed.title",
      descKey: "benefits.speed.description",
    },
    {
      icon: IconSparklesSoft,
      titleKey: "benefits.ai.title",
      descKey: "benefits.ai.description",
    },
    {
      icon: IconGithub,
      titleKey: "benefits.git.title",
      descKey: "benefits.git.description",
    },
  ];

  return (
    <MarketingLayout showCTA={true}>
      {/* Hero Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1] lg:text-6xl/[1.1]">
              {t("hero.title")}
              <span className="block text-mist-600">{t("hero.titleHighlight")}</span>
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* What is i18n & l10n */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-12 text-center">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("concepts.title")}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("concepts.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {concepts.map((concept) => {
              const content = (
                <>
                  <div className="size-12 rounded-xl bg-mist-100 flex items-center justify-center text-mist-700 mb-5 group-hover:bg-mist-200 transition-colors">
                    <concept.icon className="size-6" />
                  </div>
                  <h3 className="text-lg font-medium text-mist-950 mb-3">
                    {t(concept.titleKey)}
                  </h3>
                  <p className="text-mist-700 leading-relaxed mb-4">
                    {t(concept.descKey)}
                  </p>
                  {concept.href && (
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-mist-600 group-hover:text-mist-950">
                      {t("learnMore")}
                      <IconArrowRight className="size-4" />
                    </span>
                  )}
                </>
              );

              if (concept.href) {
                return (
                  <Link
                    key={concept.titleKey}
                    to={concept.href}
                    params={{ locale: currentLocale }}
                    className="group p-8 rounded-2xl bg-mist-50 border border-mist-100 hover:border-mist-300 transition-colors block"
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <div
                  key={concept.titleKey}
                  className="p-8 rounded-2xl bg-mist-50 border border-mist-100"
                >
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What is Better i18n */}
      <section className="py-16 bg-mist-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("about.title")}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("about.paragraph1")}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("about.paragraph2")}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("about.paragraph3")}
              </p>
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="grid grid-cols-1 gap-4">
                {benefits.map((benefit) => (
                  <div
                    key={benefit.titleKey}
                    className="p-5 rounded-xl bg-white border border-mist-200 flex items-start gap-4"
                  >
                    <div className="size-10 rounded-lg bg-mist-100 flex items-center justify-center text-mist-700 shrink-0">
                      <benefit.icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-mist-950">
                        {t(benefit.titleKey)}
                      </h3>
                      <p className="mt-1 text-sm text-mist-600">
                        {t(benefit.descKey)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("howItWorks.title")}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("howItWorks.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StepCard number="1" title={t("howItWorks.step1.title")} description={t("howItWorks.step1.description")} />
            <StepCard number="2" title={t("howItWorks.step2.title")} description={t("howItWorks.step2.description")} />
            <StepCard number="3" title={t("howItWorks.step3.title")} description={t("howItWorks.step3.description")} />
            <StepCard number="4" title={t("howItWorks.step4.title")} description={t("howItWorks.step4.description")} />
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("useCases.title")}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("useCases.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <UseCaseCard title={t("useCases.saas.title")} description={t("useCases.saas.description")} />
            <UseCaseCard title={t("useCases.mobile.title")} description={t("useCases.mobile.description")} />
            <UseCaseCard title={t("useCases.ecommerce.title")} description={t("useCases.ecommerce.description")} />
          </div>
        </div>
      </section>

      {/* Related Pages */}
      <RelatedPages currentPage="what-is" locale={currentLocale} variant="mixed" />
    </MarketingLayout>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
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

function UseCaseCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 rounded-xl bg-white border border-mist-200">
      <h3 className="text-base font-medium text-mist-950 mb-2">{title}</h3>
      <p className="text-sm text-mist-700 leading-relaxed">{description}</p>
    </div>
  );
}
