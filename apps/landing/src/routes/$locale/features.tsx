import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import Features from "@/components/Features";
import { RelatedPages } from "@/components/RelatedPages";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useTranslations } from "@better-i18n/use-intl";

export const Route = createFileRoute("/$locale/features")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "features",
      pathname: "/features",
    });
  },
  component: FeaturesPage,
});

function FeaturesPage() {
  const t = useTranslations("featuresPage");
  const { locale } = Route.useParams();

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

      {/* Features Grid from homepage */}
      <Features />

      {/* Additional Features Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureItem
              title={t("additionalFeatures.glossary.title")}
              description={t("additionalFeatures.glossary.description")}
            />
            <FeatureItem
              title={t("additionalFeatures.memory.title")}
              description={t("additionalFeatures.memory.description")}
            />
            <FeatureItem
              title={t("additionalFeatures.collaboration.title")}
              description={t("additionalFeatures.collaboration.description")}
            />
            <FeatureItem
              title={t("additionalFeatures.versionControl.title")}
              description={t("additionalFeatures.versionControl.description")}
            />
            <FeatureItem
              title={t("additionalFeatures.qa.title")}
              description={t("additionalFeatures.qa.description")}
            />
            <FeatureItem
              title={t("additionalFeatures.analytics.title")}
              description={t("additionalFeatures.analytics.description")}
            />
          </div>
        </div>
      </section>

      {/* Related Pages */}
      <RelatedPages currentPage="features" locale={locale} variant="for" />
    </MarketingLayout>
  );
}

function FeatureItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
      <h3 className="text-base font-medium text-mist-950">{title}</h3>
      <p className="mt-2 text-sm text-mist-700 leading-relaxed">{description}</p>
    </div>
  );
}
