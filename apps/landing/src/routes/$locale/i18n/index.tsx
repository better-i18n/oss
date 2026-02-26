import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useTranslations } from "@better-i18n/use-intl";
import { IconArrowRight } from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/i18n/")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "i18n",
      pathname: "/i18n",
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

function I18nIndexPage() {
  const t = useTranslations("marketing");
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
    </MarketingLayout>
  );
}
