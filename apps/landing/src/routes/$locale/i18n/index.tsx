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
  { key: "react", name: "React", slug: "react", defaultDesc: "Type-safe React internationalization with hooks and context" },
  { key: "nextjs", name: "Next.js", slug: "nextjs", defaultDesc: "Server-side i18n for Next.js apps with App Router support" },
  { key: "vue", name: "Vue", slug: "vue", defaultDesc: "Vue.js internationalization with Composition API integration" },
  { key: "nuxt", name: "Nuxt", slug: "nuxt", defaultDesc: "Nuxt.js localization module with automatic routing" },
  { key: "angular", name: "Angular", slug: "angular", defaultDesc: "Angular internationalization with built-in i18n support" },
  { key: "svelte", name: "Svelte", slug: "svelte", defaultDesc: "Lightweight Svelte internationalization integration" },
];

const topics = [
  { key: "bestTms", slug: "best-tms", defaultName: "Best TMS", defaultDesc: "Compare top translation management systems" },
  { key: "bestLibrary", slug: "best-library", defaultName: "Best Library", defaultDesc: "Find the best i18n library for your framework" },
  { key: "forDevelopers", slug: "for-developers", defaultName: "For Developers", defaultDesc: "Developer-focused internationalization guide" },
  { key: "translationManagement", slug: "translation-management-system", defaultName: "Translation Management", defaultDesc: "Centralize your translation workflow with a TMS" },
  { key: "softwareLocalization", slug: "software-localization", defaultName: "Software Localization", defaultDesc: "Adapt your software for global markets" },
  { key: "websiteLocalization", slug: "website-localization", defaultName: "Website Localization", defaultDesc: "Localize your website for international users" },
  { key: "softwareLocalizationServices", slug: "software-localization-services", defaultName: "Software Localization Services", defaultDesc: "Compare platform and agency localization approaches" },
  { key: "localizationManagement", slug: "localization-management", defaultName: "Localization Management", defaultDesc: "Manage localization workflows at scale" },
  { key: "l10nVsI18n", slug: "localization-vs-internationalization", defaultName: "Localization vs Internationalization", defaultDesc: "Understand the difference between l10n and i18n" },
  { key: "reactIntl", slug: "react-intl", defaultName: "React Intl", defaultDesc: "Internationalization with the react-intl library" },
];

const localizationGuides = [
  { key: "contentLocalization", slug: "content-localization", defaultName: "Content Localization", defaultDesc: "Adapt your content for different cultures and markets" },
  { key: "contentLocalizationServices", slug: "content-localization-services", defaultName: "Content Localization Services", defaultDesc: "Professional services for content localization at scale" },
  { key: "culturalAdaptation", slug: "cultural-adaptation", defaultName: "Cultural Adaptation", defaultDesc: "Go beyond translation with culturally aware content" },
  { key: "websiteTranslation", slug: "website-translation", defaultName: "Website Translation", defaultDesc: "Translate your website content for global audiences" },
  { key: "translationSolutions", slug: "translation-solutions", defaultName: "Translation Solutions", defaultDesc: "Explore tools and services for translation workflows" },
  { key: "localizationSoftware", slug: "localization-software", defaultName: "Localization Software", defaultDesc: "Platforms and tools that power multilingual products" },
  { key: "localizationPlatforms", slug: "localization-platforms", defaultName: "Localization Platforms", defaultDesc: "Compare cloud-based localization management platforms" },
  { key: "localizationTools", slug: "localization-tools", defaultName: "Localization Tools", defaultDesc: "Developer-facing tools for managing translations" },
];

const seoGuides = [
  { key: "multilingualSeo", slug: "multilingual-seo", defaultName: "Multilingual SEO", defaultDesc: "Optimize your site to rank in every language" },
  { key: "internationalSeo", slug: "international-seo", defaultName: "International SEO", defaultDesc: "Strategy guide for ranking globally across markets" },
  { key: "internationalSeoConsulting", slug: "international-seo-consulting", defaultName: "International SEO Consulting", defaultDesc: "Expert guidance for global search strategies" },
  { key: "technicalMultilingualSeo", slug: "technical-multilingual-seo", defaultName: "Technical Multilingual SEO", defaultDesc: "Hreflang, canonicals, and technical implementation" },
  { key: "technicalInternationalSeo", slug: "technical-international-seo", defaultName: "Technical International SEO", defaultDesc: "Deep-dive into international SEO infrastructure" },
  { key: "multilingualWebsiteSeo", slug: "multilingual-website-seo", defaultName: "Multilingual Website SEO", defaultDesc: "Practical guide to multilingual website optimization" },
  { key: "globalMarketSeo", slug: "global-market-seo", defaultName: "Global Market SEO", defaultDesc: "SEO strategies for entering global markets" },
  { key: "seoInternationalAudiences", slug: "seo-international-audiences", defaultName: "SEO for International Audiences", defaultDesc: "Target international audiences effectively" },
  { key: "localSeoInternational", slug: "local-seo-international", defaultName: "Local SEO International", defaultDesc: "Local SEO strategies across multiple countries" },
  { key: "ecommerceGlobalSeo", slug: "ecommerce-global-seo", defaultName: "E-commerce Global SEO", defaultDesc: "SEO for international online stores" },
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
              {t("i18n.index.hero.title", { defaultValue: "Internationalization & Localization Hub" })}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("i18n.index.hero.subtitle", { defaultValue: "Comprehensive guides for internationalization, localization, and multilingual SEO. From framework-specific i18n setup to global SEO strategy." })}
            </p>
          </div>
        </div>
      </section>

      {/* Frameworks Grid */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1] mb-8">
            {t("i18n.index.frameworks.title", { defaultValue: "Framework Guides" })}
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
                      {t(`i18n.index.frameworks.${framework.key}.description`, { defaultValue: framework.defaultDesc })}
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
            {t("i18n.index.topics.title", { defaultValue: "Popular Topics" })}
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
                      {t(`i18n.index.topics.${topic.key}.name`, { defaultValue: topic.defaultName })}
                    </h3>
                    <p className="mt-1 text-sm text-mist-600">
                      {t(`i18n.index.topics.${topic.key}.description`, { defaultValue: topic.defaultDesc })}
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
                      {t(`i18n.index.localizationGuides.${guide.key}.name`, { defaultValue: guide.defaultName })}
                    </h3>
                    <p className="mt-1 text-sm text-mist-600">
                      {t(`i18n.index.localizationGuides.${guide.key}.description`, { defaultValue: guide.defaultDesc })}
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
                      {t(`i18n.index.seoGuides.${guide.key}.name`, { defaultValue: guide.defaultName })}
                    </h3>
                    <p className="mt-1 text-sm text-mist-600">
                      {t(`i18n.index.seoGuides.${guide.key}.description`, { defaultValue: guide.defaultDesc })}
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
