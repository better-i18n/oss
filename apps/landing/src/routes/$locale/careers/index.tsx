import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { SpriteIcon } from "@/components/SpriteIcon";
import { MarketingLayout } from "@/components/MarketingLayout";
import { RelatedPages } from "@/components/RelatedPages";
import { getPageHead, getCareersPageStructuredData } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import { getJobPositions, type JobPosition } from "@/lib/content";

const loadPositions = createServerFn({ method: "GET" })
  .inputValidator((data: { locale: string }) => data)
  .handler(async ({ data }) => getJobPositions(data.locale));

export const Route = createFileRoute("/$locale/careers/")({
  loader: async ({ params, context }) => {
    const { getMessages } = await import("@better-i18n/use-intl/server");
    const { i18nConfig } = await import("@/i18n.config");
    const { filterMessages } = await import("@/lib/page-namespaces");
    const [positions, allMessages] = await Promise.all([
      loadPositions({ data: { locale: params.locale } }),
      getMessages({ project: i18nConfig.project, locale: context.locale }),
    ]);
    const messages = filterMessages(allMessages, ["careersPage", "page-titles", "page-descriptions", "meta", "breadcrumbs"]);
    return { positions, messages, locale: params.locale };
  },
  head: ({ loaderData }) => {
    const positions = loaderData?.positions ?? [];
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "careers",
      pathname: "/careers",
      customStructuredData: getCareersPageStructuredData(
        positions.map((p: JobPosition) => ({
          title: p.title,
          description: p.summary,
          employmentType: "FULL_TIME",
          location: "Remote",
          remote: true,
          baseSalary: {
            minValue: p.salaryMin,
            maxValue: p.salaryMax,
            currency: "USD",
            unitText: "YEAR",
          },
        })),
      ),
    });
  },
  component: CareersPage,
});

function CareersPage() {
  const { positions, locale } = Route.useLoaderData();
  const t = useT("careersPage");

  return (
    <MarketingLayout showCTA={false}>
      {/* Hero */}
      <section className="pt-16 pb-10 sm:pt-20 sm:pb-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("hero.title", "Work on infrastructure that ships language to every user.")}
            </h1>
            <p className="mt-5 text-base/7 text-mist-600">
              {t("hero.subtitle", "AI-powered localization for developers.")}
            </p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-mist-500">
              <span>{t("hero.fact.remote", "Remote-first")}</span>
              <span className="text-mist-300">·</span>
              <span>{t("hero.fact.async", "Async by default")}</span>
              <span className="text-mist-300">·</span>
              <span>{t("hero.fact.bootstrapped", "Bootstrapped & profitable")}</span>
              <span className="text-mist-300">·</span>
              <span>{t("hero.fact.market", "$60B market")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-12" id="positions">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="font-display text-2xl font-medium text-mist-950 mb-2">
            {t("openPositions.title", "Open positions")}
          </h2>
          <p className="text-sm text-mist-500 mb-8">
            {t("openPositions.subtitle", "All positions are remote. We hire globally and pay competitively.")}
          </p>

          <div className="space-y-3">
            {positions.map((job: JobPosition) => (
              <a
                key={job.slug}
                href={`/${locale}/careers/${job.slug}/`}
                className="block rounded-xl border border-mist-200 bg-white p-5 hover:border-mist-300 transition-colors group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-mist-400 uppercase tracking-wider">
                      {t(`department.${job.department}`, job.department)}
                    </span>
                    <h3 className="mt-1 text-base font-medium text-mist-950 group-hover:text-mist-700 transition-colors">
                      {job.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-mist-500">
                      {job.location} · {job.type}
                      {job.salaryMin > 0 && ` · $${(job.salaryMin / 1000).toFixed(0)}K–$${(job.salaryMax / 1000).toFixed(0)}K`}
                    </p>
                    {job.summary && <p className="mt-2 text-sm text-mist-600 line-clamp-2">{job.summary}</p>}
                  </div>
                  <SpriteIcon name="arrow-right" className="size-4 text-mist-300 group-hover:text-mist-600 shrink-0 mt-2 transition-colors" />
                </div>
              </a>
            ))}
          </div>

          <p className="mt-6 text-sm text-mist-500">
            {t("openPositions.noFit", "Don't see a perfect fit?")}{" "}
            <a href={`/${locale}/careers/general/`} className="font-medium text-mist-950 hover:underline">
              {t("openPositions.sendGeneral", "Send a general application")}
            </a>
          </p>
        </div>
      </section>

      <RelatedPages currentPage="careers" locale={locale} variant="for" />
    </MarketingLayout>
  );
}
