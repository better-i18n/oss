import { createFileRoute, Link } from "@tanstack/react-router";
import { SpriteIcon, type SpriteIconName } from "@/components/SpriteIcon";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useTranslations } from "@better-i18n/use-intl";
import { IconCalendar1 } from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/what-is-internationalization")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "whatIsInternationalization",
      pathname: "/what-is-internationalization",
      pageType: "educational",
      structuredDataOptions: {
        title: "What is Internationalization (i18n)?",
        description: "Learn about software internationalization — the process of designing applications to support multiple languages, regions, and cultures.",
      },
    });
  },
  component: WhatIsInternationalizationPage,
});

function WhatIsInternationalizationPage() {
  const t = useTranslations("marketing.whatIsInternationalization");
  const tCommon = useTranslations("marketing");
  const { locale } = Route.useParams();

  const keyPrinciples = [
    { icon: "code-brackets", titleKey: "principles.separation.title", descKey: "principles.separation.description" },
    { icon: IconCalendar1, titleKey: "principles.formatting.title", descKey: "principles.formatting.description" },
    { icon: "settings-gear", titleKey: "principles.configuration.title", descKey: "principles.configuration.description" },
  ];

  const benefits = [
    "benefits.list.scalability",
    "benefits.list.maintainability",
    "benefits.list.marketReach",
    "benefits.list.userExperience",
    "benefits.list.compliance",
    "benefits.list.costEfficiency",
  ];

  const bestPractices = [
    { titleKey: "bestPractices.unicode.title", descKey: "bestPractices.unicode.description" },
    { titleKey: "bestPractices.externalize.title", descKey: "bestPractices.externalize.description" },
    { titleKey: "bestPractices.noHardcode.title", descKey: "bestPractices.noHardcode.description" },
    { titleKey: "bestPractices.rtl.title", descKey: "bestPractices.rtl.description" },
  ];

  return (
    <MarketingLayout showCTA={true}>
      {/* Hero Section */}
      <section>
        <div className="section">
          <div className="max-w-3xl">
            <div className="eyebrow mb-5 flex items-center gap-2">
              <SpriteIcon name="globe" className="size-4" />
              {t("badge")}
            </div>
            <h1 className="section-h2">
              {t("hero.title")}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Definition Section */}
      <section>
        <div className="section">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="section-h2 mb-6">
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
            <div className="mt-10 lg:mt-0">
              <h3 className="text-lg font-medium text-mist-950 mb-4">{t("etymology.title")}</h3>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("etymology.content")}
              </p>
              {/* Notation on the sanctioned inline-code surface, not a card. */}
              <p className="mt-4 w-fit rounded-md border border-black/[0.07] bg-mist-50 px-2.5 py-1.5 font-mono text-[12px] text-mist-900">
                i18n = i + (18 letters) + n
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Principles */}
      <section>
        <div className="section">
          <div className="text-center mb-12">
            <h2 className="section-h2">
              {t("principles.title")}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("principles.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {keyPrinciples.map((principle) => (
              <div key={principle.titleKey}>
                <div className="mb-3 flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-600">
                  {typeof principle.icon === "string" ? <SpriteIcon name={principle.icon as SpriteIconName} className="size-6" /> : <principle.icon className="size-6" />}
                </div>
                <h3 className="text-lg font-medium text-mist-950 mb-3">{t(principle.titleKey)}</h3>
                <p className="text-mist-700 leading-relaxed">{t(principle.descKey)}</p>
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
                {t("benefits.title")}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-6">
                {t("benefits.subtitle")}
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <ul className="space-y-4">
                {benefits.map((benefitKey) => (
                  <li key={benefitKey} className="flex items-start gap-3">
                    <SpriteIcon name="checkmark" className="mt-0.5 size-3.5 shrink-0 text-mist-400" />
                    <span className="text-mist-700">{t(benefitKey)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section>
        <div className="section">
          <div className="text-center mb-12">
            <h2 className="section-h2">
              {t("bestPractices.title")}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("bestPractices.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {bestPractices.map((practice) => (
              <div key={practice.titleKey}>
                <h3 className="text-base font-medium text-mist-950 mb-2">{t(practice.titleKey)}</h3>
                <p className="text-sm text-mist-700 leading-relaxed">{t(practice.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* i18n vs l10n */}
      <section>
        <div className="section">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-h2 mb-6">
              {t("comparison.title")}
            </h2>
            <p className="text-mist-700 leading-relaxed mb-8">
              {t("comparison.content")}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 text-left">
              <div>
                <h3 className="text-base font-medium text-mist-950 mb-2">{t("comparison.i18n.title")}</h3>
                <p className="text-sm text-mist-700">{t("comparison.i18n.description")}</p>
              </div>
              <div>
                <h3 className="text-base font-medium text-mist-950 mb-2">{t("comparison.l10n.title")}</h3>
                <p className="text-sm text-mist-700">{t("comparison.l10n.description")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Topics */}
      <section className="border-t border-mist-200">
        <div className="section">
          <h2 className="text-lg font-medium text-mist-950 mb-6">{tCommon("whatIs.relatedTopics")}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/$locale/what-is-localization/"
              params={{ locale }}
              className="group flex items-start justify-between gap-3"
            >
              <div>
                <h3 className="text-sm font-medium text-mist-950">{tCommon("whatIs.links.l10n")}</h3>
                <p className="text-xs text-mist-500 mt-1">{tCommon("whatIs.links.l10nDesc")}</p>
              </div>
              <SpriteIcon name="arrow-right" className="size-3.5 shrink-0 text-mist-300 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-mist-600" />
            </Link>
            <Link
              to="/$locale/what-is/"
              params={{ locale }}
              className="group flex items-start justify-between gap-3"
            >
              <div>
                <h3 className="text-sm font-medium text-mist-950">{tCommon("whatIs.links.overview")}</h3>
                <p className="text-xs text-mist-500 mt-1">{tCommon("whatIs.links.overviewDesc")}</p>
              </div>
              <SpriteIcon name="arrow-right" className="size-3.5 shrink-0 text-mist-300 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-mist-600" />
            </Link>
            <Link
              to="/$locale/i18n/"
              params={{ locale }}
              className="group flex items-start justify-between gap-3"
            >
              <div>
                <h3 className="text-sm font-medium text-mist-950">{tCommon("whatIs.links.frameworks")}</h3>
                <p className="text-xs text-mist-500 mt-1">{tCommon("whatIs.links.frameworksDesc")}</p>
              </div>
              <SpriteIcon name="arrow-right" className="size-3.5 shrink-0 text-mist-300 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-mist-600" />
            </Link>
            <Link
              to="/$locale/compare/"
              params={{ locale }}
              className="group flex items-start justify-between gap-3"
            >
              <div>
                <h3 className="text-sm font-medium text-mist-950">{tCommon("whatIs.links.compare")}</h3>
                <p className="text-xs text-mist-500 mt-1">{tCommon("whatIs.links.compareDesc")}</p>
              </div>
              <SpriteIcon name="arrow-right" className="size-3.5 shrink-0 text-mist-300 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-mist-600" />
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
