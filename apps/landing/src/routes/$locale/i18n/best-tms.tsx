import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useTranslations } from "@better-i18n/use-intl";
import {
  IconCheckmark1,
  IconArrowRight,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/i18n/best-tms")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "bestTms",
      pathname: "/i18n/best-tms",
    });
  },
  component: BestTmsPage,
});

const platforms = [
  {
    name: "Better i18n",
    highlight: true,
    features: ["MCP Support", "AST Key Discovery", "Git-First", "Free Tier"],
    pricing: "From $0/mo",
    bestFor: "Developer teams wanting AI-native localization",
  },
  {
    name: "Crowdin",
    features: ["Large ecosystem", "Open source friendly", "Many integrations"],
    pricing: "From $40/mo",
    bestFor: "Open source projects with community translators",
  },
  {
    name: "Lokalise",
    features: ["Figma plugin", "Screenshots", "Enterprise features"],
    pricing: "From $140/mo",
    bestFor: "Design-heavy teams needing visual context",
  },
  {
    name: "Phrase",
    features: ["Enterprise scale", "TMS + CAT", "Compliance"],
    pricing: "From $385/mo",
    bestFor: "Large enterprises with complex workflows",
  },
  {
    name: "Transifex",
    features: ["Live translation", "Established platform", "API-first"],
    pricing: "From $150/mo",
    bestFor: "Teams needing real-time translation updates",
  },
];

function BestTmsPage() {
  const t = useTranslations("marketing");
  const { locale } = Route.useParams();

  return (
    <MarketingLayout showCTA={false}>
      {/* Hero */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <span>{t("i18n.bestTms.badge")}</span>
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("i18n.bestTms.hero.title")}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("i18n.bestTms.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Platforms Comparison */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="space-y-4">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className={`rounded-2xl border p-6 ${
                  platform.highlight
                    ? "border-emerald-200 bg-emerald-50/50"
                    : "border-mist-200 bg-white"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-medium text-mist-950">
                        {platform.name}
                      </h3>
                      {platform.highlight && (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                          {t("i18n.bestTms.recommended")}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-mist-600">{platform.bestFor}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {platform.features.map((feature) => (
                        <span
                          key={feature}
                          className="inline-flex items-center gap-1 text-xs text-mist-600"
                        >
                          <IconCheckmark1 className="w-3 h-3 text-emerald-600" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-mist-950">
                      {platform.pricing}
                    </span>
                    {platform.name !== "Better i18n" && (
                      <Link
                        to={`/$locale/compare/${platform.name.toLowerCase().replace(" ", "-")}`}
                        params={{ locale }}
                        className="inline-flex items-center gap-1 text-sm text-mist-600 hover:text-mist-950"
                      >
                        {t("i18n.bestTms.compare")}
                        <IconArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Topics */}
      <section className="py-12 border-t border-mist-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="text-lg font-medium text-mist-950 mb-6">{t("whatIs.relatedTopics")}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/$locale/i18n/best-library"
              params={{ locale }}
              className="group flex items-center justify-between p-4 rounded-xl border border-mist-200 bg-white hover:border-mist-300 hover:shadow-md transition-all"
            >
              <div>
                <h3 className="text-sm font-medium text-mist-950">{t("i18n.relatedLinks.bestLibrary")}</h3>
                <p className="text-xs text-mist-500 mt-1">{t("i18n.relatedLinks.bestLibraryDesc")}</p>
              </div>
              <IconArrowRight className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
            </Link>
            <Link
              to="/$locale/what-is-localization"
              params={{ locale }}
              className="group flex items-center justify-between p-4 rounded-xl border border-mist-200 bg-white hover:border-mist-300 hover:shadow-md transition-all"
            >
              <div>
                <h3 className="text-sm font-medium text-mist-950">{t("whatIs.links.l10n")}</h3>
                <p className="text-xs text-mist-500 mt-1">{t("whatIs.links.l10nDesc")}</p>
              </div>
              <IconArrowRight className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
            </Link>
            <Link
              to="/$locale/for-translators"
              params={{ locale }}
              className="group flex items-center justify-between p-4 rounded-xl border border-mist-200 bg-white hover:border-mist-300 hover:shadow-md transition-all"
            >
              <div>
                <h3 className="text-sm font-medium text-mist-950">{t("whatIs.links.forTranslators")}</h3>
                <p className="text-xs text-mist-500 mt-1">{t("whatIs.links.forTranslatorsDesc")}</p>
              </div>
              <IconArrowRight className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
            </Link>
            <Link
              to="/$locale/i18n"
              params={{ locale }}
              className="group flex items-center justify-between p-4 rounded-xl border border-mist-200 bg-white hover:border-mist-300 hover:shadow-md transition-all"
            >
              <div>
                <h3 className="text-sm font-medium text-mist-950">{t("whatIs.links.frameworks")}</h3>
                <p className="text-xs text-mist-500 mt-1">{t("whatIs.links.frameworksDesc")}</p>
              </div>
              <IconArrowRight className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-mist-950 rounded-3xl mx-6 lg:mx-10 mb-16">
        <div className="mx-auto max-w-2xl text-center px-6">
          <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-white sm:text-4xl/[1.1]">
            {t("i18n.bestTms.cta.title")}
          </h2>
          <p className="mt-4 text-lg text-mist-300">{t("i18n.bestTms.cta.subtitle")}</p>
          <div className="mt-8">
            <a
              href="https://dash.better-i18n.com"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-mist-950 hover:bg-mist-100 transition-colors"
            >
              {t("i18n.bestTms.cta.button")}
            </a>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
