import { createFileRoute, Link } from "@tanstack/react-router";
import { SpriteIcon } from "@/components/SpriteIcon";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useTranslations } from "@better-i18n/use-intl";
import { i18nGuideRoute } from "@/lib/i18n-guide-routes";
import {
  ClosingCta,
  Divider,
  FeatureGrid,
  SectionHeader,
} from "@/components/ui/page";
import { GuideMark } from "@/lib/i18n-guide-icons";

export const Route = createFileRoute("/$locale/i18n/best-library")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "bestLibrary",
      pathname: "/i18n/best-library",
    });
  },
  component: BestLibraryPage,
});

/** Framework label → `/i18n/{slug}`, so `GuideMark` resolves the real brand
    mark (rule/name-a-thing-with-its-mark). Explicit rather than lowercasing the
    label: "Next.js" lowercases to "next.js", which matches no slug. */
const FRAMEWORK_SLUG: Record<string, string> = {
  React: "react",
  "Next.js": "nextjs",
  Vue: "vue",
  Svelte: "svelte",
  Angular: "angular",
  Nuxt: "nuxt",
};

const libraries = [
  {
    name: "@better-i18n/use-intl",
    framework: "React",
    highlight: true,
    features: ["Type-safe", "CDN delivery", "MCP integration", "Hooks-based"],
    description: "Modern React i18n with built-in platform integration",
  },
  {
    name: "react-i18next",
    framework: "React",
    features: ["Large ecosystem", "Plugins", "Namespace support"],
    description: "Most popular React i18n library with extensive features",
  },
  {
    name: "next-intl",
    framework: "Next.js",
    features: ["App Router", "RSC support", "Type-safe"],
    description: "Next.js-specific i18n with excellent DX",
  },
  {
    name: "vue-i18n",
    framework: "Vue",
    features: ["Composition API", "SFC support", "Nuxt module"],
    description: "Official Vue.js internationalization plugin",
  },
  {
    name: "svelte-i18n",
    framework: "Svelte",
    features: ["Stores-based", "Minimal", "SvelteKit support"],
    description: "Lightweight i18n for Svelte applications",
  },
  {
    name: "ngx-translate",
    framework: "Angular",
    features: ["Pipes", "Directives", "Lazy loading"],
    description: "Popular Angular internationalization library",
  },
];

function BestLibraryPage() {
  const t = useTranslations("marketing");
  const { locale } = Route.useParams();

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />
      {/* Hero */}
      <section>
        <div className="section">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex w-fit items-center rounded-md border border-black/[0.07] bg-white px-2.5 py-1 text-[11px] font-medium text-mist-600">
              <span>{t("i18n.bestLibrary.badge")}</span>
            </div>
            <h1 className="section-h2">
              {t("i18n.bestLibrary.hero.title")}
            </h1>
            <p className="section-p mt-5">
              {t("i18n.bestLibrary.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Libraries Grid */}
      <section>
        <div className="section">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {libraries.map((library) => (
              /* No per-item border or padding (rule/listed-items-are-not-cards).
                 The recommended library is marked by ink weight on its name, not
                 by a tinted box — the box was the third one on the page. */
              <div key={library.name}>
                <div className="mb-2 flex items-center gap-2">
                  <GuideMark slug={FRAMEWORK_SLUG[library.framework] ?? ""} />
                  <span className="text-[11px] font-medium text-mist-500">
                    {library.framework}
                  </span>
                  {library.highlight && (
                    <span className="rounded-sm bg-mist-900 px-1.5 py-0.5 text-[11px] font-medium text-white">
                      {t("i18n.bestLibrary.recommended")}
                    </span>
                  )}
                </div>
                {/* h2, not h3: this grid is the page's first content block and
                    the section above it has no heading of its own, so an h3 here
                    skipped a level straight after the h1. Each library is a
                    top-level item on a "best library" page, so h2 is also the
                    honest level for it. */}
                <h2 className="text-base font-medium text-mist-950 font-mono">
                  {library.name}
                </h2>
                <p className="mt-2 text-sm text-mist-600">{library.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {library.features.map((feature) => (
                    <span
                      key={feature}
                      className="inline-flex items-center gap-1 text-xs text-mist-500"
                    >
                      <SpriteIcon name="checkmark" className="size-3 shrink-0 text-mist-900" aria-hidden="true" />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Framework Links */}
      <Divider />
      <section>
        <div className="section">
          <h2 className="section-h2">
            {t("i18n.bestLibrary.frameworks.title")}
          </h2>
          {/* Equal-unit framework grid — the rule's stated exception, so the
              hairline cells stay. They had `gap-4` as well, which floated every
              rule instead of letting neighbours share one; the -1px shift plus a
              clip box is what makes a matrix out of them. */}
          <div className="mt-8">
          <FeatureGrid cols="grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" inset={16} padY={16}>
            {["react", "nextjs", "vue", "nuxt", "angular", "svelte"].map((fw) => (
              <Link
                key={fw}
                to={i18nGuideRoute(fw)}
                params={{ locale }}
                className="feat-cell group flex items-center justify-center gap-2 transition-colors hover:bg-black/[0.02]"
              >
                <GuideMark slug={fw} />
                <span className="text-[13px] font-medium capitalize text-mist-900">{fw}</span>
              </Link>
            ))}
          </FeatureGrid>
          </div>
        </div>
      </section>

      {/* Related Topics */}
      <Divider />
      <section>
        <div className="section">
          <SectionHeader
            eyebrow={t("i18n.relatedLinks.eyebrow")}
            title={t("whatIs.relatedTopics")}
            subtitle={t("i18n.relatedLinks.subtitle")}
          />
          {/* Four bare columns (rule/listed-items-are-not-cards). These were
              hairline cells in a rounded container one revision ago; a list of
              four links is text, and the frame plus .section padding already
              separate it from everything else. */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-4">
            <Link
              to="/$locale/i18n/best-tms/"
              params={{ locale }}
              className="group flex items-start justify-between gap-3"
            >
              <div>
                <h3 className="text-[13px] font-medium text-mist-700 transition-colors group-hover:text-mist-950">{t("whatIs.links.bestTms")}</h3>
                <p className="mt-1 text-[12px] leading-[1.45] text-mist-500">{t("whatIs.links.bestTmsDesc")}</p>
              </div>
              <SpriteIcon
                name="chevron-right"
                className="size-3.5 shrink-0 text-mist-300 transition-transform duration-150 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link
              to="/$locale/what-is-internationalization/"
              params={{ locale }}
              className="group flex items-start justify-between gap-3"
            >
              <div>
                <h3 className="text-[13px] font-medium text-mist-700 transition-colors group-hover:text-mist-950">{t("whatIs.links.i18n")}</h3>
                <p className="mt-1 text-[12px] leading-[1.45] text-mist-500">{t("whatIs.links.i18nDesc")}</p>
              </div>
              <SpriteIcon
                name="chevron-right"
                className="size-3.5 shrink-0 text-mist-300 transition-transform duration-150 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link
              to="/$locale/for-developers/"
              params={{ locale }}
              className="group flex items-start justify-between gap-3"
            >
              <div>
                <h3 className="text-[13px] font-medium text-mist-700 transition-colors group-hover:text-mist-950">{t("i18n.relatedLinks.forDevelopers")}</h3>
                <p className="mt-1 text-[12px] leading-[1.45] text-mist-500">{t("i18n.relatedLinks.forDevelopersDesc")}</p>
              </div>
              <SpriteIcon
                name="chevron-right"
                className="size-3.5 shrink-0 text-mist-300 transition-transform duration-150 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link
              to="/$locale/compare/"
              params={{ locale }}
              className="group flex items-start justify-between gap-3"
            >
              <div>
                <h3 className="text-[13px] font-medium text-mist-700 transition-colors group-hover:text-mist-950">{t("whatIs.links.compare")}</h3>
                <p className="mt-1 text-[12px] leading-[1.45] text-mist-500">{t("whatIs.links.compareDesc")}</p>
              </div>
              <SpriteIcon
                name="chevron-right"
                className="size-3.5 shrink-0 text-mist-300 transition-transform duration-150 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* How to Choose */}
      <Divider />
      <section>
        <div className="section">
          <h2 className="section-h2 mb-8">
            How to choose the right i18n library
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                criterion: "Framework fit",
                description: "Use the library built for your framework. react-i18next for React, next-intl for Next.js App Router, vue-i18n for Vue, ngx-translate for Angular. Framework-native libraries integrate best with server components, SSR, and hydration patterns.",
              },
              {
                criterion: "Type safety",
                description: "For TypeScript projects, prefer libraries with first-class type support. next-intl and @better-i18n/use-intl generate types from your translation files, giving you autocomplete and compile-time safety for translation keys.",
              },
              {
                criterion: "Bundle size",
                description: "Lightweight matters for client-side apps. svelte-i18n and basic i18next configurations are small. next-intl with RSC only loads translations for the current locale. Better I18N CDN delivery means zero translation data in your JS bundle.",
              },
              {
                criterion: "Pluralization needs",
                description: "If you target languages with complex plural rules (Arabic, Polish, Russian), use a library with full ICU MessageFormat support: i18next with the ICU plugin, next-intl, or @better-i18n/use-intl. All support CLDR-compliant plural forms.",
              },
              {
                criterion: "Translation management",
                description: "Libraries only handle runtime rendering. For managing translations at scale — AI translation, team review, CDN delivery — you need a TMS alongside the library. Better I18N integrates with all major i18n libraries via the CLI.",
              },
              {
                criterion: "OTA updates",
                description: "If you need to push translation corrections without a new deployment, choose a library with runtime loading support. Better I18N delivers translations via CDN with 60-second cache max-age, enabling near-instant updates for web and mobile apps.",
              },
            ].map((item) => (
              <div key={item.criterion}>
                <h3 className="text-sm font-medium text-mist-950 mb-2">{item.criterion}</h3>
                <p className="text-sm/6 text-mist-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <Divider />
      <section>
        <div className="section">
          <h2 className="section-h2 mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            {[
              {
                question: "What is the most popular i18n library for React?",
                answer: "react-i18next is the most widely used React i18n library, with over 9 million weekly npm downloads. It's built on i18next and supports namespaces, pluralization, interpolation, and lazy loading. For Next.js specifically, next-intl has become the leading choice due to its first-class App Router and Server Components support.",
              },
              {
                question: "Should I use an i18n library or build my own?",
                answer: "Almost always use an established library. Building your own i18n solution seems simple but quickly becomes complex: you need pluralization rules for every language (Arabic has 6 plural forms), ICU message parsing, number and date formatting, RTL support, and SSR hydration. Established libraries like i18next have millions of hours of testing across edge cases you haven't thought of yet.",
              },
              {
                question: "What is the difference between i18n libraries and a TMS?",
                answer: "An i18n library handles runtime translation — it takes a key like 'welcome.title' and returns the translated string for the active locale. A Translation Management System (TMS) like Better I18N handles the workflow: storing translations, AI-assisted translation, team review, CDN delivery, and CI/CD sync. You need both: the library for rendering and the TMS for managing translation content.",
              },
              {
                question: "Does Better I18N work with react-i18next?",
                answer: "Yes. Better I18N integrates with react-i18next via the @better-i18n/expo package for React Native, or by configuring react-i18next's backend to load from the Better I18N CDN. The Better I18N CLI syncs your i18next JSON translation files with the dashboard. This gives you react-i18next's mature runtime with Better I18N's managed translation workflow.",
              },
              {
                question: "How do i18n libraries handle missing translations?",
                answer: "Most libraries fall back to a specified fallback locale (usually the source language) when a translation is missing. react-i18next and i18next log missing keys in development mode. next-intl throws errors for missing keys in development and silently falls back in production. Better I18N's dashboard shows translation coverage per language, so you can ensure 100% coverage before deploying.",
              },
            ].map((item) => (
              /* The question text is the stable identity here; the array index
                 is not (react-doctor: no-array-index-as-key). */
              <div
                key={item.question}
                className="border-b border-mist-100 pb-8 last:border-0 last:pb-0"
              >
                <h3 className="text-base font-medium text-mist-950 mb-3">{item.question}</h3>
                <p className="text-sm/6 text-mist-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <Divider />

      {/* The ask closes the page. Was a floating dark band with its own
          container; <ClosingCta /> is the grammar's one closing shape. This
          page offers a single action, so no secondary. */}
      <ClosingCta
        title={t("i18n.bestLibrary.cta.title")}
        subtitle={t("i18n.bestLibrary.cta.subtitle")}
        primary={{ label: t("i18n.bestLibrary.cta.button"), href: "https://dash.better-i18n.com" }}
      />
    </MarketingLayout>
  );
}
