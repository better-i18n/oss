import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useTranslations } from "@better-i18n/use-intl";
import {
  IconCheckmark1,
  IconArrowRight,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/i18n/best-library")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "bestLibrary",
      pathname: "/i18n/best-library",
    });
  },
  component: BestLibraryPage,
});

const libraries = [
  {
    name: "@better-i18n/use-intl",
    framework: "React",
    highlight: true,
    features: ["Type-safe", "CDN delivery", "MCP integration", "Hooks-based"],
    description: "Modern React i18n with built-in platform integration",
  },
  {
    name: "react-i18next",
    framework: "React",
    features: ["Large ecosystem", "Plugins", "Namespace support"],
    description: "Most popular React i18n library with extensive features",
  },
  {
    name: "next-intl",
    framework: "Next.js",
    features: ["App Router", "RSC support", "Type-safe"],
    description: "Next.js-specific i18n with excellent DX",
  },
  {
    name: "vue-i18n",
    framework: "Vue",
    features: ["Composition API", "SFC support", "Nuxt module"],
    description: "Official Vue.js internationalization plugin",
  },
  {
    name: "svelte-i18n",
    framework: "Svelte",
    features: ["Stores-based", "Minimal", "SvelteKit support"],
    description: "Lightweight i18n for Svelte applications",
  },
  {
    name: "ngx-translate",
    framework: "Angular",
    features: ["Pipes", "Directives", "Lazy loading"],
    description: "Popular Angular internationalization library",
  },
];

function BestLibraryPage() {
  const t = useTranslations("marketing");
  const { locale } = Route.useParams();

  return (
    <MarketingLayout showCTA={false}>
      {/* Hero */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <span>{t("i18n.bestLibrary.badge")}</span>
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("i18n.bestLibrary.hero.title")}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("i18n.bestLibrary.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Libraries Grid */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {libraries.map((library) => (
              <div
                key={library.name}
                className={`rounded-2xl border p-6 ${
                  library.highlight
                    ? "border-emerald-200 bg-emerald-50/50"
                    : "border-mist-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-mist-500 bg-mist-100 px-2 py-0.5 rounded">
                    {library.framework}
                  </span>
                  {library.highlight && (
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      {t("i18n.bestLibrary.recommended")}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-medium text-mist-950 font-mono">
                  {library.name}
                </h3>
                <p className="mt-2 text-sm text-mist-600">{library.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {library.features.map((feature) => (
                    <span
                      key={feature}
                      className="inline-flex items-center gap-1 text-xs text-mist-500"
                    >
                      <IconCheckmark1 className="w-3 h-3 text-emerald-600" />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Framework Links */}
      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1] mb-8">
            {t("i18n.bestLibrary.frameworks.title")}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {["react", "nextjs", "vue", "nuxt", "angular", "svelte"].map((fw) => (
              <Link
                key={fw}
                to={`/$locale/i18n/${fw}`}
                params={{ locale }}
                className="flex items-center justify-center gap-2 p-4 bg-white rounded-xl border border-mist-100 hover:border-mist-300 hover:shadow transition-all"
              >
                <span className="text-sm font-medium text-mist-950 capitalize">{fw}</span>
                <IconArrowRight className="w-4 h-4 text-mist-400" />
              </Link>
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
              to="/$locale/i18n/best-tms"
              params={{ locale }}
              className="group flex items-center justify-between p-4 rounded-xl border border-mist-200 bg-white hover:border-mist-300 hover:shadow-md transition-all"
            >
              <div>
                <h3 className="text-sm font-medium text-mist-950">{t("whatIs.links.bestTms")}</h3>
                <p className="text-xs text-mist-500 mt-1">{t("whatIs.links.bestTmsDesc")}</p>
              </div>
              <IconArrowRight className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
            </Link>
            <Link
              to="/$locale/what-is-internationalization"
              params={{ locale }}
              className="group flex items-center justify-between p-4 rounded-xl border border-mist-200 bg-white hover:border-mist-300 hover:shadow-md transition-all"
            >
              <div>
                <h3 className="text-sm font-medium text-mist-950">{t("whatIs.links.i18n")}</h3>
                <p className="text-xs text-mist-500 mt-1">{t("whatIs.links.i18nDesc")}</p>
              </div>
              <IconArrowRight className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
            </Link>
            <Link
              to="/$locale/for-developers"
              params={{ locale }}
              className="group flex items-center justify-between p-4 rounded-xl border border-mist-200 bg-white hover:border-mist-300 hover:shadow-md transition-all"
            >
              <div>
                <h3 className="text-sm font-medium text-mist-950">{t("i18n.relatedLinks.forDevelopers")}</h3>
                <p className="text-xs text-mist-500 mt-1">{t("i18n.relatedLinks.forDevelopersDesc")}</p>
              </div>
              <IconArrowRight className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
            </Link>
            <Link
              to="/$locale/compare"
              params={{ locale }}
              className="group flex items-center justify-between p-4 rounded-xl border border-mist-200 bg-white hover:border-mist-300 hover:shadow-md transition-all"
            >
              <div>
                <h3 className="text-sm font-medium text-mist-950">{t("whatIs.links.compare")}</h3>
                <p className="text-xs text-mist-500 mt-1">{t("whatIs.links.compareDesc")}</p>
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
            {t("i18n.bestLibrary.cta.title")}
          </h2>
          <p className="mt-4 text-lg text-mist-300">{t("i18n.bestLibrary.cta.subtitle")}</p>
          <div className="mt-8">
            <a
              href="https://dash.better-i18n.com"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-mist-950 hover:bg-mist-100 transition-colors"
            >
              {t("i18n.bestLibrary.cta.button")}
            </a>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
