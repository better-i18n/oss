import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useTranslations } from "@better-i18n/use-intl";

export const Route = createFileRoute("/$locale/about")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "about",
      pathname: "/about",
    });
  },
  component: AboutPage,
});

function AboutPage() {
  const t = useTranslations("aboutPage");

  const values = [
    { titleKey: "values.developerFirst.title", descKey: "values.developerFirst.description" },
    { titleKey: "values.qualityMatters.title", descKey: "values.qualityMatters.description" },
    { titleKey: "values.globalByDefault.title", descKey: "values.globalByDefault.description" },
    { titleKey: "values.openTransparent.title", descKey: "values.openTransparent.description" },
    { titleKey: "values.speedReliability.title", descKey: "values.speedReliability.description" },
    { titleKey: "values.privacyFirst.title", descKey: "values.privacyFirst.description" },
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

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <h2 className="font-display text-2xl font-medium text-mist-950 mb-8">
            {t("story.title")}
          </h2>
          <div className="prose prose-mist max-w-none text-mist-700">
            <p>{t("story.paragraph1")}</p>
            <p className="mt-4">{t("story.paragraph2")}</p>
            <p className="mt-4">{t("story.paragraph3")}</p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-mist-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="font-display text-2xl font-medium text-mist-950 mb-12 text-center">
            {t("values.title")}
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <ValueCard
                key={value.titleKey}
                title={t(value.titleKey)}
                description={t(value.descKey)}
              />
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}

function ValueCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 rounded-xl bg-white border border-mist-200">
      <h3 className="text-base font-medium text-mist-950">{title}</h3>
      <p className="mt-2 text-sm text-mist-700 leading-relaxed">{description}</p>
    </div>
  );
}
