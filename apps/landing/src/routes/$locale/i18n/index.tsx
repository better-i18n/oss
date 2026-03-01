import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader, formatStructuredData } from "@/lib/page-seo";
import { getOrganizationSchema, getComparisonSchema } from "@/lib/structured-data";
import { SITE_URL } from "@/lib/meta";
import { useT } from "@/lib/i18n";
import { IconArrowRight } from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/i18n/")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    const frameworkListSchema = getComparisonSchema({
      title: "i18n Framework Guides",
      description: "Internationalization guides for popular JavaScript frameworks.",
      items: [
        { name: "React i18n", description: "Type-safe React internationalization with hooks", url: `${SITE_URL}/en/i18n/react` },
        { name: "Next.js i18n", description: "Server-side i18n for Next.js apps", url: `${SITE_URL}/en/i18n/nextjs` },
        { name: "Vue i18n", description: "Vue.js internationalization integration", url: `${SITE_URL}/en/i18n/vue` },
        { name: "Nuxt i18n", description: "Nuxt.js localization module", url: `${SITE_URL}/en/i18n/nuxt` },
        { name: "Angular i18n", description: "Angular internationalization support", url: `${SITE_URL}/en/i18n/angular` },
        { name: "Svelte i18n", description: "Svelte internationalization integration", url: `${SITE_URL}/en/i18n/svelte` },
      ],
    });

    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "i18n",
      pathname: "/i18n",
      customStructuredData: formatStructuredData([getOrganizationSchema(), frameworkListSchema]),
    });
  },
  component: I18nIndexPage,
});

const frameworks = [
  { key: "react", name: "React", slug: "react" },
  { key: "nextjs", name: "Next.js", slug: "nextjs" },
  { key: "vue", name: "Vue", slug: "vue" },
  { key: "nuxt", name: "Nuxt", slug: "nuxt" },
  { key: "angular", name: "Angular", slug: "angular" },
  { key: "svelte", name: "Svelte", slug: "svelte" },
];

const topics = [
  { key: "bestTms", slug: "best-tms" },
  { key: "bestLibrary", slug: "best-library" },
  { key: "forDevelopers", slug: "for-developers" },
  { key: "translationManagement", slug: "translation-management-system" },
  { key: "softwareLocalization", slug: "software-localization" },
  { key: "websiteLocalization", slug: "website-localization" },
  { key: "softwareLocalizationServices", slug: "software-localization-services" },
  { key: "localizationManagement", slug: "localization-management" },
  { key: "l10nVsI18n", slug: "localization-vs-internationalization" },
  { key: "reactIntl", slug: "react-intl" },
];

const localizationGuides = [
  { key: "contentLocalization", slug: "content-localization" },
  { key: "contentLocalizationServices", slug: "content-localization-services" },
  { key: "culturalAdaptation", slug: "cultural-adaptation" },
  { key: "websiteTranslation", slug: "website-translation" },
  { key: "translationSolutions", slug: "translation-solutions" },
  { key: "localizationSoftware", slug: "localization-software" },
  { key: "localizationPlatforms", slug: "localization-platforms" },
  { key: "localizationTools", slug: "localization-tools" },
];

const seoGuides = [
  { key: "multilingualSeo", slug: "multilingual-seo" },
  { key: "internationalSeo", slug: "international-seo" },
  { key: "internationalSeoConsulting", slug: "international-seo-consulting" },
  { key: "technicalMultilingualSeo", slug: "technical-multilingual-seo" },
  { key: "technicalInternationalSeo", slug: "technical-international-seo" },
  { key: "multilingualWebsiteSeo", slug: "multilingual-website-seo" },
  { key: "globalMarketSeo", slug: "global-market-seo" },
  { key: "seoInternationalAudiences", slug: "seo-international-audiences" },
  { key: "localSeoInternational", slug: "local-seo-international" },
  { key: "ecommerceGlobalSeo", slug: "ecommerce-global-seo" },
];

function I18nIndexPage() {
  const t = useT("marketing");
  const { locale } = Route.useParams();

  return (
    <MarketingLayout showCTA={true}>
      {/* Hero */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("i18n.index.hero.title")}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("i18n.index.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Frameworks Grid */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1] mb-8">
            {t("i18n.index.frameworks.title")}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {frameworks.map((framework) => (
              <Link
                key={framework.slug}
                to={`/$locale/i18n/${framework.slug}`}
                params={{ locale }}
                className="group relative flex flex-col rounded-2xl border border-mist-200 bg-white p-6 hover:border-mist-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-mist-950">
                      {framework.name} i18n
                    </h3>
                    <p className="mt-1 text-sm text-mist-600">
                      {t(`i18n.index.frameworks.${framework.key}.description`)}
                    </p>
                  </div>
                  <IconArrowRight className="w-5 h-5 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Topics Grid */}
      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1] mb-8">
            {t("i18n.index.topics.title")}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic) => (
              <Link
                key={topic.slug}
                to={`/$locale/i18n/${topic.slug}`}
                params={{ locale }}
                className="group relative flex flex-col rounded-2xl border border-mist-200 bg-white p-6 hover:border-mist-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-medium text-mist-950">
                      {t(`i18n.index.topics.${topic.key}.name`)}
                    </h3>
                    <p className="mt-1 text-sm text-mist-600">
                      {t(`i18n.index.topics.${topic.key}.description`)}
                    </p>
                  </div>
                  <IconArrowRight className="w-5 h-5 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Localization Guides */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1] mb-8">
            {t("i18n.index.localizationGuides.title", { defaultValue: "Localization Guides" })}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {localizationGuides.map((guide) => (
              <Link
                key={guide.slug}
                to={`/$locale/i18n/${guide.slug}`}
                params={{ locale }}
                className="group relative flex flex-col rounded-2xl border border-mist-200 bg-white p-6 hover:border-mist-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-medium text-mist-950">
                      {t(`i18n.index.localizationGuides.${guide.key}.name`, { defaultValue: guide.key })}
                    </h3>
                    <p className="mt-1 text-sm text-mist-600">
                      {t(`i18n.index.localizationGuides.${guide.key}.description`, { defaultValue: "" })}
                    </p>
                  </div>
                  <IconArrowRight className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Multilingual SEO Guides */}
      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1] mb-8">
            {t("i18n.index.seoGuides.title", { defaultValue: "Multilingual SEO Guides" })}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {seoGuides.map((guide) => (
              <Link
                key={guide.slug}
                to={`/$locale/i18n/${guide.slug}`}
                params={{ locale }}
                className="group relative flex flex-col rounded-2xl border border-mist-200 bg-white p-6 hover:border-mist-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-medium text-mist-950">
                      {t(`i18n.index.seoGuides.${guide.key}.name`, { defaultValue: guide.key })}
                    </h3>
                    <p className="mt-1 text-sm text-mist-600">
                      {t(`i18n.index.seoGuides.${guide.key}.description`, { defaultValue: "" })}
                    </p>
                  </div>
                  <IconArrowRight className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
