import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import {
  FrameworkHero,
  FeatureList,
  CodeExample,
  RelatedPages,
  FrameworkCTA,
  OtherFrameworks,
} from "@/components/FrameworkComparison";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useTranslations } from "@better-i18n/use-intl";

export const Route = createFileRoute("/$locale/i18n/svelte")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "i18nSvelte",
      pathname: "/i18n/svelte",
      pageType: "framework",
      structuredDataOptions: {
        framework: "Svelte",
        frameworkDescription: "Lightweight Svelte internationalization with reactive stores and SvelteKit integration.",
        dependencies: ["svelte", "@better-i18n/svelte"],
      },
    });
  },
  component: SvelteI18nPage,
});

function SvelteI18nPage() {
  const t = useTranslations("marketing");
  const { locale } = Route.useParams();

  const features = [
    t("i18n.svelte.features.stores"),
    t("i18n.svelte.features.sveltekit"),
    t("i18n.svelte.features.ssr"),
    t("i18n.svelte.features.prerendering"),
    t("i18n.svelte.features.lazyLoading"),
    t("i18n.svelte.features.runes"),
    t("i18n.svelte.features.minimal"),
    t("i18n.svelte.features.typescript"),
    t("i18n.svelte.features.devtools"),
  ];

  const codeExample = `<!-- +page.svelte -->
<script>
  import { t } from '@better-i18n/svelte';
</script>

<h1>{$t('welcome')}</h1>
<p>{$t('greeting', { name: 'World' })}</p>

<!-- With SvelteKit load function -->
<script context="module">
  export async function load({ params }) {
    const messages = await loadMessages(params.locale);
    return { messages };
  }
</script>`;

  const relatedPages = [
    { name: "React i18n", href: "/$locale/i18n/react", description: t("i18n.svelte.related.react") },
    { name: "Vue i18n", href: "/$locale/i18n/vue", description: t("i18n.svelte.related.vue") },
    { name: t("i18n.svelte.related.comparisons"), href: "/$locale/compare", description: t("i18n.svelte.related.comparisonsDesc") },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <FrameworkHero
        title={t("i18n.svelte.hero.title")}
        subtitle={t("i18n.svelte.hero.subtitle")}
        badgeText="Svelte i18n"
      />

      <FeatureList title={t("i18n.svelte.featuresTitle")} features={features} />

      <CodeExample
        title={t("i18n.svelte.codeExample.title")}
        description={t("i18n.svelte.codeExample.description")}
        code={codeExample}
      />

      <RelatedPages title={t("i18n.svelte.relatedTitle")} pages={relatedPages} locale={locale} />

      <OtherFrameworks
        title={t("i18n.svelte.otherFrameworks")}
        currentFramework="svelte"
        locale={locale}
      />

      <FrameworkCTA
        title={t("i18n.svelte.cta.title")}
        subtitle={t("i18n.svelte.cta.subtitle")}
        primaryCTA={t("i18n.svelte.cta.primary")}
        primaryHref="https://dash.better-i18n.com"
        secondaryCTA={t("i18n.svelte.cta.secondary")}
        secondaryHref="https://docs.better-i18n.com"
      />
    </MarketingLayout>
  );
}
