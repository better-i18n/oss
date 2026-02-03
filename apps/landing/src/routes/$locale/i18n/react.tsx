import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import {
  FrameworkHero,
  FeatureList,
  CodeExample,
  RelatedPages,
  FrameworkCTA,
  LibraryIntegration,
  OtherFrameworks,
} from "@/components/FrameworkComparison";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useTranslations } from "@better-i18n/use-intl";

export const Route = createFileRoute("/$locale/i18n/react")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "i18nReact",
      pathname: "/i18n/react",
      pageType: "framework",
      structuredDataOptions: {
        framework: "React",
        frameworkDescription: "Type-safe React internationalization with hooks, lazy loading, and seamless integration.",
      },
    });
  },
  component: ReactI18nPage,
});

function ReactI18nPage() {
  const t = useTranslations("marketing");
  const { locale } = Route.useParams();

  const features = [
    t("i18n.react.features.hooks"),
    t("i18n.react.features.typesafe"),
    t("i18n.react.features.lazyLoading"),
    t("i18n.react.features.pluralization"),
    t("i18n.react.features.interpolation"),
    t("i18n.react.features.contextApi"),
    t("i18n.react.features.ssr"),
    t("i18n.react.features.hotReload"),
    t("i18n.react.features.devtools"),
  ];

  const codeExample = `import { useTranslations } from '@better-i18n/use-intl';

function MyComponent() {
  const t = useTranslations('common');

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('greeting', { name: 'World' })}</p>
    </div>
  );
}`;

  const libraries = [
    {
      name: "react-intl",
      description: t("i18n.react.libraries.reactIntl.description"),
      integrationText: t("i18n.react.libraries.reactIntl.integration"),
    },
    {
      name: "react-i18next",
      description: t("i18n.react.libraries.reactI18next.description"),
      integrationText: t("i18n.react.libraries.reactI18next.integration"),
    },
    {
      name: "FormatJS",
      description: t("i18n.react.libraries.formatjs.description"),
      integrationText: t("i18n.react.libraries.formatjs.integration"),
    },
    {
      name: "Lingui",
      description: t("i18n.react.libraries.lingui.description"),
      integrationText: t("i18n.react.libraries.lingui.integration"),
    },
  ];

  const relatedPages = [
    { name: "Next.js i18n", href: "/$locale/i18n/nextjs", description: t("i18n.react.related.nextjs") },
    { name: "Vue i18n", href: "/$locale/i18n/vue", description: t("i18n.react.related.vue") },
    { name: t("i18n.react.related.comparisons"), href: "/$locale/compare", description: t("i18n.react.related.comparisonsDesc") },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <FrameworkHero
        framework="React"
        title={t("i18n.react.hero.title")}
        subtitle={t("i18n.react.hero.subtitle")}
        badgeText="React i18n"
      />

      <FeatureList title={t("i18n.react.featuresTitle")} features={features} />

      <LibraryIntegration
        title={t("i18n.react.librariesTitle")}
        subtitle={t("i18n.react.librariesSubtitle")}
        libraries={libraries}
      />

      <CodeExample
        title={t("i18n.react.codeExample.title")}
        description={t("i18n.react.codeExample.description")}
        code={codeExample}
      />

      <RelatedPages title={t("i18n.react.relatedTitle")} pages={relatedPages} locale={locale} />

      <OtherFrameworks
        title={t("i18n.react.otherFrameworks")}
        currentFramework="react"
        locale={locale}
      />

      <FrameworkCTA
        title={t("i18n.react.cta.title")}
        subtitle={t("i18n.react.cta.subtitle")}
        primaryCTA={t("i18n.react.cta.primary")}
        primaryHref="https://dash.better-i18n.com"
        secondaryCTA={t("i18n.react.cta.secondary")}
        secondaryHref="https://docs.better-i18n.com"
      />
    </MarketingLayout>
  );
}
