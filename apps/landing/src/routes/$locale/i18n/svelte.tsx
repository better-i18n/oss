import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import {
  FrameworkHero,
  FeatureList,
  SetupGuide,
  CodeExample,
  FrameworkCTA,
  OtherFrameworks,
} from "@/components/FrameworkComparison";
import { CoreSdkFlow } from "@/components/framework/SdkFlow";
import { ComparisonRelatedTopics } from "@/components/ComparisonTable";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";

/**
 * Svelte / SvelteKit i18n.
 *
 * This page used to import `t` from `@better-i18n/svelte`. That package does not
 * exist — `oss/packages/` ships core, use-intl, next, expo, server, remix, vite,
 * cli, sdk, mcp and flutter — so the sample it showed could never have run.
 *
 * The honest replacement, verified against the source:
 *   - `@better-i18n/core` has zero dependencies (packages/core/package.json
 *     `dependencies: {}`) and no framework import on the main path, so
 *     `createI18nCore()` runs in a SvelteKit `load()` and in the browser alike.
 *   - `svelte-i18n` stays the runtime: `addMessages` / `init` / the `$_` store.
 *   - `getMessages(locale)` and `getLanguages()` are the real methods
 *     (packages/core/src/cdn.ts:796-799).
 *
 * The old code sample is replaced rather than preserved: it referenced an import
 * that 404s, so keeping it would keep shipping the bug.
 */

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
        frameworkDescription:
          "Svelte and SvelteKit internationalization with svelte-i18n and Better I18N: CDN-delivered translations, SSR-safe loading, and runtime locale switching via @better-i18n/core.",
        dependencies: ["svelte", "svelte-i18n", "@better-i18n/core"],
      },
    });
  },
  component: SvelteI18nPage,
});

const INSTALL_CODE = `npm install @better-i18n/core svelte-i18n

# @better-i18n/core ships zero dependencies —
# it is the same client our React SDKs are built on.`;

const LOAD_CODE = `import { createI18nCore } from '@better-i18n/core'

// Module scope: the 60s in-memory cache is shared across requests
// instead of being rebuilt on every navigation.
export const betterI18n = createI18nCore({
  projectId: 'your-org/your-project', // Settings → General → Project ID
  defaultLocale: 'en',
})

/** @type {import('./$types').LayoutLoad} */
export async function load({ params }) {
  const locale = params.locale ?? 'en'

  return {
    locale,
    messages: await betterI18n.getMessages(locale),
    languages: await betterI18n.getLanguages(),
  }
}`;

const REGISTER_CODE = `<script>
  import { addMessages, init, _ } from 'svelte-i18n'

  export let data // from +layout.js

  // The CDN returns { namespace: { key: value } } — the shape
  // svelte-i18n already expects.
  addMessages(data.locale, data.messages)
  init({ fallbackLocale: 'en', initialLocale: data.locale })
</script>

<h1>{$_('home.title')}</h1>
<p>{$_('home.greeting', { values: { name: 'World' } })}</p>

<slot />`;

const SWITCH_CODE = `<script>
  import { addMessages, locale } from 'svelte-i18n'
  import { betterI18n } from '../routes/+layout.js'

  export let languages = [] // from load()

  async function switchTo(next) {
    // Fetch on demand, register, then flip the store.
    addMessages(next, await betterI18n.getMessages(next))
    locale.set(next)
  }
</script>

<select on:change={(e) => switchTo(e.currentTarget.value)}>
  {#each languages as language}
    <option value={language.code}>{language.name}</option>
  {/each}
</select>`;

function SvelteI18nPage() {
  const t = useT("marketing");
  const { locale } = Route.useParams();

  const features = [
    t("i18n.svelte.features.stores"),
    t("i18n.svelte.features.sveltekit"),
    t("i18n.svelte.features.runes"),
    t("i18n.svelte.features.ssr"),
    t("i18n.svelte.features.prerendering"),
    t("i18n.svelte.features.lazyLoading"),
    t("i18n.svelte.features.typescript"),
    t("i18n.svelte.features.minimal"),
    t("i18n.svelte.features.devtools"),
  ];

  const relatedLinks = [
    { title: "React i18n", to: "/$locale/i18n/react", description: t("i18n.svelte.related.react") },
    { title: "Vue i18n", to: "/$locale/i18n/vue", description: t("i18n.svelte.related.vue") },
    { title: t("i18n.svelte.related.comparisons"), to: "/$locale/compare", description: t("i18n.svelte.related.comparisonsDesc") },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />
      <FrameworkHero
        title={t("i18n.svelte.hero.title")}
        subtitle={t("i18n.svelte.hero.subtitle")}
        badgeText="Svelte i18n"
      />

      <SetupGuide
        icon="rocket"
        eyebrow="Setup"
        title={t("i18n.svelte.setup.title")}
        subtitle={t("i18n.svelte.setup.subtitle")}
        steps={[
          {
            step: 1,
            title: t("i18n.svelte.setup.step1.title"),
            description: t("i18n.svelte.setup.step1.description"),
            code: INSTALL_CODE,
            fileName: "terminal",
            language: "bash",
          },
          {
            step: 2,
            title: t("i18n.svelte.setup.step2.title"),
            description: t("i18n.svelte.setup.step2.description"),
            code: LOAD_CODE,
            fileName: "src/routes/+layout.js",
            language: "js",
          },
          {
            step: 3,
            title: t("i18n.svelte.setup.step3.title"),
            description: t("i18n.svelte.setup.step3.description"),
            code: REGISTER_CODE,
            fileName: "src/routes/+layout.svelte",
            language: "svelte",
          },
        ]}
      />

      <CoreSdkFlow
        title={t("i18n.svelte.flow.title")}
        subtitle={t("i18n.svelte.flow.subtitle")}
        appTitle="Your Svelte app"
        appMeta="The $_ store reads the messages svelte-i18n already holds."
        clientMeta="getMessages(locale) inside load() — server-side on the first render."
      />

      <CodeExample
        icon="code-brackets"
        eyebrow="In a component"
        title={t("i18n.svelte.codeExample.title")}
        description={t("i18n.svelte.codeExample.description")}
        code={SWITCH_CODE}
        fileName="src/lib/LocaleSwitcher.svelte"
        language="svelte"
      />

      <FeatureList
        icon="zap"
        eyebrow="Capabilities"
        title={t("i18n.svelte.featuresTitle")}
        features={features}
      />

      <ComparisonRelatedTopics heading={t("i18n.svelte.relatedTitle")} links={relatedLinks} locale={locale} />

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
        secondaryHref="https://docs.better-i18n.com/frameworks/quick-start"
      />
    </MarketingLayout>
  );
}
