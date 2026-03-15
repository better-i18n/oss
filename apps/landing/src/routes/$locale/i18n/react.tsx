import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import {
  FrameworkHero,
  FeatureList,
  CodeExample,
  SetupGuide,
  FrameworkCTA,
  LibraryIntegration,
  OtherFrameworks,
} from "@/components/FrameworkComparison";
import { ComparisonRelatedTopics } from "@/components/ComparisonTable";
import { PillarBlogPosts } from "@/components/PillarBlogPosts";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { loadPillarBlogPosts } from "@/lib/pillar-blog-loader";
import { useT } from "@/lib/i18n";

const PILLAR_KEYWORDS = ["react", "i18n", "internationalization"] as const;

const baseLoader = createPageLoader();

export const Route = createFileRoute("/$locale/i18n/react")({
  loader: async (args: Parameters<typeof baseLoader>[0]) => {
    const [base, pillarPosts] = await Promise.all([
      baseLoader(args),
      loadPillarBlogPosts({
        data: { locale: args.context.locale, keywords: PILLAR_KEYWORDS },
      }),
    ]);
    return { ...base, pillarPosts };
  },
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
        dependencies: ["react", "@better-i18n/use-intl"],
      },
    });
  },
  component: ReactI18nPage,
});

function ReactI18nPage() {
  const t = useT("marketing");
  const { locale } = Route.useParams();
  const { pillarPosts } = Route.useLoaderData();

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

  const reactSetupSteps = [
    {
      step: 1,
      title: "Install",
      description: "Add @better-i18n/use-intl and use-intl to your project.",
      code: "npm install @better-i18n/use-intl use-intl",
      fileName: "terminal",
    },
    {
      step: 2,
      title: "Wrap your app with BetterI18nProvider",
      description:
        "Place the provider at the root of your component tree. It fetches messages from the CDN and makes them available via hooks.",
      code: `import { BetterI18nProvider } from '@better-i18n/use-intl';

function App() {
  return (
    <BetterI18nProvider project="your-org/your-project" locale="en">
      <YourApp />
    </BetterI18nProvider>
  );
}`,
      fileName: "App.tsx",
    },
    {
      step: 3,
      title: "Use translations",
      description:
        "Call useTranslations() in any component to access your translation keys with full TypeScript support.",
      code: `import { useTranslations } from '@better-i18n/use-intl';

function MyComponent() {
  const t = useTranslations('common');
  return <h1>{t('welcome')}</h1>;
}`,
      fileName: "MyComponent.tsx",
    },
  ];

  const setupCode = `# 1. Install
npm install @better-i18n/use-intl

# 2. Wrap your app
import { BetterI18nProvider } from '@better-i18n/use-intl'

function App() {
  return (
    <BetterI18nProvider project="org/project" locale="en">
      <YourApp />
    </BetterI18nProvider>
  )
}

# 3. Use translations
import { useTranslations } from '@better-i18n/use-intl'

function MyComponent() {
  const t = useTranslations('common')
  return <h1>{t('welcome')}</h1>
}`;

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

  const relatedLinks = [
    { title: "Next.js i18n", to: "/$locale/i18n/nextjs", description: t("i18n.react.related.nextjs") },
    { title: "Vue i18n", to: "/$locale/i18n/vue", description: t("i18n.react.related.vue") },
    { title: t("i18n.react.related.comparisons"), to: "/$locale/compare", description: t("i18n.react.related.comparisonsDesc") },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />
      <FrameworkHero
        title={t("i18n.react.hero.title")}
        subtitle={t("i18n.react.hero.subtitle")}
        badgeText="React i18n"
      />

      <SetupGuide title="Get started in 3 steps" steps={reactSetupSteps} />

      <FeatureList title={t("i18n.react.featuresTitle")} features={features} />

      <CodeExample
        title="Installation & Setup"
        description="Get started with @better-i18n/use-intl in three steps — install, wrap your app with the provider, and start translating."
        code={setupCode}
      />

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

      <PillarBlogPosts posts={pillarPosts} locale={locale} />

      <ComparisonRelatedTopics heading={t("i18n.react.relatedTitle")} links={relatedLinks} locale={locale} />

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
