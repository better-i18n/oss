import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import {
  FrameworkHero,
  FeatureList,
  SetupGuide,
  CodeExample,
  LibraryIntegration,
  FrameworkCTA,
  OtherFrameworks,
} from "@/components/FrameworkComparison";
import { CoreSdkFlow } from "@/components/framework/SdkFlow";
import { ComparisonRelatedTopics } from "@/components/ComparisonTable";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";

/**
 * Nuxt i18n.
 *
 * This page used to show `modules: ['@better-i18n/nuxt']` with a `betterI18n`
 * config block. There is no such Nuxt module — `oss/packages/` ships core,
 * use-intl, next, expo, server, remix, vite, cli, sdk, mcp and flutter — so the
 * config it documented would fail at `nuxi dev`.
 *
 * The honest replacement, verified against the source:
 *   - `@better-i18n/core` has zero dependencies (packages/core/package.json
 *     `dependencies: {}`), so the same client runs in a Nuxt plugin, in a Nitro
 *     server route, and in the browser.
 *   - `@nuxtjs/i18n` keeps what it is good at — locale routing, prefixes,
 *     hreflang — and `vue-i18n` stays the formatter.
 *   - `getMessages(locale)` / `getLanguages()` are the real methods
 *     (packages/core/src/cdn.ts:796-799).
 *
 * The old sample is replaced rather than preserved: it documented a module that
 * does not exist, so keeping it would keep shipping the bug.
 */

export const Route = createFileRoute("/$locale/i18n/nuxt")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "i18nNuxt",
      pathname: "/i18n/nuxt",
      pageType: "framework",
      structuredDataOptions: {
        framework: "Nuxt",
        frameworkDescription:
          "Nuxt 3 internationalization with @nuxtjs/i18n routing, vue-i18n formatting, and Better I18N translation delivery via @better-i18n/core — SSR and Nitro included.",
        dependencies: ["nuxt", "vue", "vue-i18n", "@better-i18n/core"],
      },
    });
  },
  component: NuxtI18nPage,
});

const INSTALL_CODE = `npm install @better-i18n/core vue-i18n

# Optional — only if you want @nuxtjs/i18n to own
# locale routing, prefixes and hreflang:
npm install @nuxtjs/i18n`;

const CLIENT_CODE = `import { createI18nCore } from '@better-i18n/core'

// Module scope, not inside a composable: the TTL cache lives on the
// instance, so a per-request client would refetch on every render.
export const betterI18n = createI18nCore({
  projectId: 'your-org/your-project', // Settings → General → Project ID
  defaultLocale: 'en',
})`;

const PLUGIN_CODE = `import { createI18n } from 'vue-i18n'
import { betterI18n } from '~/lib/better-i18n'

export default defineNuxtPlugin(async (nuxtApp) => {
  const locale = useRoute().params.locale?.toString() ?? 'en'

  // Runs on the server during SSR, and in the browser on a cold client
  // navigation. The CDN shape is the shape vue-i18n expects.
  const messages = await betterI18n.getMessages(locale)

  nuxtApp.vueApp.use(
    createI18n({
      legacy: false,
      locale,
      fallbackLocale: 'en',
      messages: { [locale]: messages },
    })
  )
})`;

const COMPONENT_CODE = `<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { betterI18n } from '~/lib/better-i18n'

const { t, locale, setLocaleMessage } = useI18n()

// Locales come from the project manifest, not a hardcoded array
const { data: languages } = await useAsyncData('locales', () =>
  betterI18n.getLanguages()
)

async function switchTo(next: string) {
  setLocaleMessage(next, await betterI18n.getMessages(next))
  locale.value = next
}
</script>

<template>
  <h1>{{ t('home.title') }}</h1>
  <p>{{ t('home.greeting', { name: 'World' }) }}</p>
</template>`;

const NITRO_CODE = `// server/api/greeting.get.ts — Nitro route, same client
import { betterI18n } from '~/lib/better-i18n'

export default defineEventHandler(async (event) => {
  const locale = getQuery(event).locale?.toString() ?? 'en'

  // Shares the in-memory cache with the rest of the server process.
  const messages = await betterI18n.getMessages(locale)

  return { text: messages.api?.greeting ?? '', locale }
})`;

function NuxtI18nPage() {
  const t = useT("marketing");
  const { locale } = Route.useParams();

  /* Built here rather than at module scope: the copy comes from t(), which
     only exists inside the component. */
  const libraries = [
    {
      name: "@nuxtjs/i18n",
      description: t("i18n.nuxt.libraries.nuxtI18n.description"),
      integrationText: t("i18n.nuxt.libraries.nuxtI18n.integration"),
    },
    {
      name: "vue-i18n",
      description: t("i18n.nuxt.libraries.vueI18n.description"),
      integrationText: t("i18n.nuxt.libraries.vueI18n.integration"),
    },
    {
      name: "Nitro",
      description: t("i18n.nuxt.libraries.nitro.description"),
      integrationText: t("i18n.nuxt.libraries.nitro.integration"),
    },
  ];


  const features = [
    t("i18n.nuxt.features.nuxt3"),
    t("i18n.nuxt.features.autoImport"),
    t("i18n.nuxt.features.seo"),
    t("i18n.nuxt.features.routing"),
    t("i18n.nuxt.features.lazyLoading"),
    t("i18n.nuxt.features.ssr"),
    t("i18n.nuxt.features.devtools"),
    t("i18n.nuxt.features.nitro"),
    t("i18n.nuxt.features.hybrid"),
  ];

  const relatedLinks = [
    { title: "Vue i18n", to: "/$locale/i18n/vue", description: t("i18n.nuxt.related.vue") },
    { title: "Next.js i18n", to: "/$locale/i18n/nextjs", description: t("i18n.nuxt.related.nextjs") },
    { title: t("i18n.nuxt.related.comparisons"), to: "/$locale/compare", description: t("i18n.nuxt.related.comparisonsDesc") },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />
      <FrameworkHero
        title={t("i18n.nuxt.hero.title")}
        subtitle={t("i18n.nuxt.hero.subtitle")}
        badgeText="Nuxt i18n"
      />

      <SetupGuide
        icon="rocket"
        eyebrow="Setup"
        title={t("i18n.nuxt.setup.title")}
        subtitle={t("i18n.nuxt.setup.subtitle")}
        steps={[
          {
            step: 1,
            title: t("i18n.nuxt.setup.step1.title"),
            description: t("i18n.nuxt.setup.step1.description"),
            code: INSTALL_CODE,
            fileName: "terminal",
            language: "bash",
          },
          {
            step: 2,
            title: t("i18n.nuxt.setup.step2.title"),
            description: t("i18n.nuxt.setup.step2.description"),
            code: CLIENT_CODE,
            fileName: "lib/better-i18n.ts",
            language: "ts",
          },
          {
            step: 3,
            title: t("i18n.nuxt.setup.step3.title"),
            description: t("i18n.nuxt.setup.step3.description"),
            code: PLUGIN_CODE,
            fileName: "plugins/better-i18n.ts",
            language: "ts",
          },
        ]}
      />

      <CoreSdkFlow
        title={t("i18n.nuxt.flow.title")}
        subtitle={t("i18n.nuxt.flow.subtitle")}
        appTitle="Your Nuxt app"
        appMeta="useI18n() reads the messages the plugin registered before mount."
        clientMeta="getMessages(locale) from the plugin — server-side during SSR."
      />

      <CodeExample
        icon="code-brackets"
        eyebrow="In a page"
        title={t("i18n.nuxt.codeExample.title")}
        description={t("i18n.nuxt.codeExample.description")}
        code={COMPONENT_CODE}
        fileName="pages/[locale]/index.vue"
        language="vue"
      />

      <CodeExample
        icon="api-connection"
        eyebrow="On the server"
        title={t("i18n.nuxt.nitro.title")}
        description={t("i18n.nuxt.nitro.subtitle")}
        code={NITRO_CODE}
        fileName="server/api/greeting.get.ts"
        language="ts"
      />

      <FeatureList
        icon="zap"
        eyebrow="Capabilities"
        title={t("i18n.nuxt.featuresTitle")}
        features={features}
      />

      <LibraryIntegration
        icon="api-connection"
        eyebrow="Works with"
        title={t("i18n.nuxt.libraries.title")}
        subtitle={t("i18n.nuxt.libraries.subtitle")}
        libraries={libraries}
      />

      <ComparisonRelatedTopics heading={t("i18n.nuxt.relatedTitle")} links={relatedLinks} locale={locale} />

      <OtherFrameworks
        title={t("i18n.nuxt.otherFrameworks")}
        currentFramework="nuxt"
        locale={locale}
      />

      <FrameworkCTA
        title={t("i18n.nuxt.cta.title")}
        subtitle={t("i18n.nuxt.cta.subtitle")}
        primaryCTA={t("i18n.nuxt.cta.primary")}
        primaryHref="https://dash.better-i18n.com"
        secondaryCTA={t("i18n.nuxt.cta.secondary")}
        secondaryHref="https://docs.better-i18n.com/frameworks/quick-start"
      />
    </MarketingLayout>
  );
}
