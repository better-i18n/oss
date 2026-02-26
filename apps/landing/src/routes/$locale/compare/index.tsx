import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useTranslations } from "@better-i18n/use-intl";
import { IconArrowRight } from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/compare/")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "compare",
      pathname: "/compare",
    });
  },
  component: ComparePage,
});

const competitors = [
  { key: "crowdin", name: "Crowdin", slug: "crowdin" },
  { key: "lokalise", name: "Lokalise", slug: "lokalise" },
  { key: "phrase", name: "Phrase", slug: "phrase" },
  { key: "transifex", name: "Transifex", slug: "transifex" },
];

function ComparePage() {
  const t = useTranslations("marketing");
  const { locale } = Route.useParams();

  return (
    <MarketingLayout showCTA={true}>
      {/* Hero */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("compare.index.hero.title")}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("compare.index.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Competitors Grid */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {competitors.map((competitor) => (
              <Link
                key={competitor.slug}
                to={`/$locale/compare/${competitor.slug}`}
                params={{ locale }}
                className="group relative flex flex-col rounded-2xl border border-mist-200 bg-white p-6 hover:border-mist-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-mist-950">
                      Better i18n vs {competitor.name}
                    </h3>
                    <p className="mt-1 text-sm text-mist-600">
                      {t(`compare.index.competitors.${competitor.key}.description`)}
                    </p>
                  </div>
                  <IconArrowRight className="w-5 h-5 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="mt-4 pt-4 border-t border-mist-100">
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    {t(`compare.index.competitors.${competitor.key}.highlight`)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
