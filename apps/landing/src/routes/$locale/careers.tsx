import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { RelatedPages } from "@/components/RelatedPages";
import { getPageHead, createPageLoader, getCareersPageStructuredData } from "@/lib/page-seo";
import { useTranslations } from "@better-i18n/use-intl";
import { IconArrowRight } from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/careers")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "careers",
      pathname: "/careers",
      customStructuredData: getCareersPageStructuredData([
        {
          title: "Full Stack Engineer",
          description: "Build developer-first translation management tools with TypeScript, React, and Node.js.",
          employmentType: "FULL_TIME",
          location: "Remote",
          remote: true,
        },
        {
          title: "AI/ML Engineer",
          description: "Work on AI-powered translation and localization systems using large language models.",
          employmentType: "FULL_TIME",
          location: "Remote",
          remote: true,
        },
      ]),
    });
  },
  component: CareersPage,
});

function CareersPage() {
  const t = useTranslations("careersPage");
  const { locale } = Route.useParams();

  const openPositions = [
    {
      titleKey: "positions.fullstack.title",
      locationKey: "positions.fullstack.location",
      typeKey: "positions.fullstack.type",
      descKey: "positions.fullstack.description",
    },
    {
      titleKey: "positions.aiml.title",
      locationKey: "positions.fullstack.location",
      typeKey: "positions.fullstack.type",
      descKey: "positions.aiml.description",
    },
  ];

  const perks = [
    "perks.remote",
    "perks.salary",
    "perks.pto",
    "perks.homeOffice",
    "perks.conference",
    "perks.health",
  ];

  return (
    <MarketingLayout showCTA={false}>
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

      {/* Open Positions */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <h2 className="font-display text-2xl font-medium text-mist-950 mb-8">
            {t("openPositions.title")}
          </h2>
          <div className="space-y-4">
            {openPositions.map((job) => (
              <a
                key={job.titleKey}
                href="mailto:careers@better-i18n.com"
                className="block p-6 rounded-xl bg-mist-50 border border-mist-100 hover:border-mist-300 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-medium text-mist-950 group-hover:text-mist-700">
                      {t(job.titleKey)}
                    </h3>
                    <p className="mt-1 text-sm text-mist-600">
                      {t(job.locationKey)} · {t(job.typeKey)}
                    </p>
                    <p className="mt-2 text-sm text-mist-700">{t(job.descKey)}</p>
                  </div>
                  <IconArrowRight className="size-5 text-mist-400 group-hover:text-mist-600 shrink-0 mt-1" />
                </div>
              </a>
            ))}
          </div>
          <p className="mt-8 text-sm text-mist-600">
            {t("noFit")}{" "}
            <a href="mailto:careers@better-i18n.com" className="font-medium text-mist-950 hover:underline">
              {t("sendResume")}
            </a>
            . {t("alwaysLooking")}
          </p>
        </div>
      </section>

      {/* Perks */}
      <section className="py-16 bg-mist-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="font-display text-2xl font-medium text-mist-950 mb-8 text-center">
            {t("perks.title")}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
            {perks.map((perkKey) => (
              <div key={perkKey} className="p-4 rounded-lg bg-white border border-mist-200 text-center">
                <span className="text-sm text-mist-700">{t(perkKey)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-3xl px-6 lg:px-10 text-center">
          <h2 className="font-display text-2xl font-medium text-mist-950 mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-mist-700 mb-8">
            {t("cta.subtitle")}{" "}
            <a href="mailto:careers@better-i18n.com" className="font-medium text-mist-950 hover:underline">
              careers@better-i18n.com
            </a>
          </p>
          <a
            href="mailto:careers@better-i18n.com"
            className="inline-flex items-center justify-center rounded-full bg-mist-950 px-6 py-3 text-sm font-medium text-white hover:bg-mist-800"
          >
            {t("cta.applyNow")}
          </a>
        </div>
      </section>

      {/* Related Pages */}
      <RelatedPages currentPage="careers" locale={locale} variant="for" />
    </MarketingLayout>
  );
}
