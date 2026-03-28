import { createFileRoute, Link } from "@tanstack/react-router";
import { SpriteIcon } from "@/components/SpriteIcon";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useTranslations } from "@better-i18n/use-intl";

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
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <span>{t("i18n.bestLibrary.badge")}</span>
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("i18n.bestLibrary.hero.title")}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("i18n.bestLibrary.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Libraries Grid */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {libraries.map((library) => (
              <div
                key={library.name}
                className={`rounded-2xl border p-6 ${
                  library.highlight
                    ? "border-emerald-200 bg-emerald-50/50"
                    : "border-mist-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-mist-500 bg-mist-100 px-2 py-0.5 rounded">
                    {library.framework}
                  </span>
                  {library.highlight && (
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      {t("i18n.bestLibrary.recommended")}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-medium text-mist-950 font-mono">
                  {library.name}
                </h3>
                <p className="mt-2 text-sm text-mist-600">{library.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {library.features.map((feature) => (
                    <span
                      key={feature}
                      className="inline-flex items-center gap-1 text-xs text-mist-500"
                    >
                      <SpriteIcon name="checkmark" className="w-3 h-3 text-emerald-600" />
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
      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1] mb-8">
            {t("i18n.bestLibrary.frameworks.title")}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {["react", "nextjs", "vue", "nuxt", "angular", "svelte"].map((fw) => (
              <Link
                key={fw}
                to={`/$locale/i18n/${fw}`}
                params={{ locale }}
                className="flex items-center justify-center gap-2 p-4 bg-white rounded-xl border border-mist-100 hover:border-mist-300 hover:shadow transition-all"
              >
                <span className="text-sm font-medium text-mist-950 capitalize">{fw}</span>
                <SpriteIcon name="arrow-right" className="w-4 h-4 text-mist-400" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Related Topics */}
      <section className="py-12 border-t border-mist-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="text-lg font-medium text-mist-950 mb-6">{t("whatIs.relatedTopics")}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/$locale/i18n/best-tms"
              params={{ locale }}
              className="group flex items-center justify-between p-4 rounded-xl border border-mist-200 bg-white hover:border-mist-300 hover:shadow-md transition-all"
            >
              <div>
                <h3 className="text-sm font-medium text-mist-950">{t("whatIs.links.bestTms")}</h3>
                <p className="text-xs text-mist-500 mt-1">{t("whatIs.links.bestTmsDesc")}</p>
              </div>
              <SpriteIcon name="arrow-right" className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
            </Link>
            <Link
              to="/$locale/what-is-internationalization"
              params={{ locale }}
              className="group flex items-center justify-between p-4 rounded-xl border border-mist-200 bg-white hover:border-mist-300 hover:shadow-md transition-all"
            >
              <div>
                <h3 className="text-sm font-medium text-mist-950">{t("whatIs.links.i18n")}</h3>
                <p className="text-xs text-mist-500 mt-1">{t("whatIs.links.i18nDesc")}</p>
              </div>
              <SpriteIcon name="arrow-right" className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
            </Link>
            <Link
              to="/$locale/for-developers"
              params={{ locale }}
              className="group flex items-center justify-between p-4 rounded-xl border border-mist-200 bg-white hover:border-mist-300 hover:shadow-md transition-all"
            >
              <div>
                <h3 className="text-sm font-medium text-mist-950">{t("i18n.relatedLinks.forDevelopers")}</h3>
                <p className="text-xs text-mist-500 mt-1">{t("i18n.relatedLinks.forDevelopersDesc")}</p>
              </div>
              <SpriteIcon name="arrow-right" className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
            </Link>
            <Link
              to="/$locale/compare"
              params={{ locale }}
              className="group flex items-center justify-between p-4 rounded-xl border border-mist-200 bg-white hover:border-mist-300 hover:shadow-md transition-all"
            >
              <div>
                <h3 className="text-sm font-medium text-mist-950">{t("whatIs.links.compare")}</h3>
                <p className="text-xs text-mist-500 mt-1">{t("whatIs.links.compareDesc")}</p>
              </div>
              <SpriteIcon name="arrow-right" className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </section>

      {/* How to Choose */}
      <section className="py-16 border-t border-mist-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1] mb-8">
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
                description: "Lightweight matters for client-side apps. svelte-i18n and basic i18next configurations are small. next-intl with RSC only loads translations for the current locale. Better i18n CDN delivery means zero translation data in your JS bundle.",
              },
              {
                criterion: "Pluralization needs",
                description: "If you target languages with complex plural rules (Arabic, Polish, Russian), use a library with full ICU MessageFormat support: i18next with the ICU plugin, next-intl, or @better-i18n/use-intl. All support CLDR-compliant plural forms.",
              },
              {
                criterion: "Translation management",
                description: "Libraries only handle runtime rendering. For managing translations at scale — AI translation, team review, CDN delivery — you need a TMS alongside the library. Better i18n integrates with all major i18n libraries via the CLI.",
              },
              {
                criterion: "OTA updates",
                description: "If you need to push translation corrections without a new deployment, choose a library with runtime loading support. Better i18n delivers translations via CDN with 60-second cache max-age, enabling near-instant updates for web and mobile apps.",
              },
            ].map((item) => (
              <div key={item.criterion} className="p-6 rounded-2xl border border-mist-100 bg-white">
                <h3 className="text-sm font-semibold text-mist-950 mb-2">{item.criterion}</h3>
                <p className="text-sm/6 text-mist-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 border-t border-mist-200">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1] mb-10">
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
                answer: "An i18n library handles runtime translation — it takes a key like 'welcome.title' and returns the translated string for the active locale. A Translation Management System (TMS) like Better i18n handles the workflow: storing translations, AI-assisted translation, team review, CDN delivery, and CI/CD sync. You need both: the library for rendering and the TMS for managing translation content.",
              },
              {
                question: "Does Better i18n work with react-i18next?",
                answer: "Yes. Better i18n integrates with react-i18next via the @better-i18n/expo package for React Native, or by configuring react-i18next's backend to load from the Better i18n CDN. The Better i18n CLI syncs your i18next JSON translation files with the dashboard. This gives you react-i18next's mature runtime with Better i18n's managed translation workflow.",
              },
              {
                question: "How do i18n libraries handle missing translations?",
                answer: "Most libraries fall back to a specified fallback locale (usually the source language) when a translation is missing. react-i18next and i18next log missing keys in development mode. next-intl throws errors for missing keys in development and silently falls back in production. Better i18n's dashboard shows translation coverage per language, so you can ensure 100% coverage before deploying.",
              },
            ].map((item, i) => (
              <div key={i} className="border-b border-mist-100 pb-8 last:border-0 last:pb-0">
                <h3 className="text-base font-medium text-mist-950 mb-3">{item.question}</h3>
                <p className="text-sm/6 text-mist-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-mist-950 rounded-3xl mx-6 lg:mx-10 mb-16">
        <div className="mx-auto max-w-2xl text-center px-6">
          <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-white sm:text-4xl/[1.1]">
            {t("i18n.bestLibrary.cta.title")}
          </h2>
          <p className="mt-4 text-lg text-mist-300">{t("i18n.bestLibrary.cta.subtitle")}</p>
          <div className="mt-8">
            <a
              href="https://dash.better-i18n.com"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-mist-950 hover:bg-mist-100 transition-colors"
            >
              {t("i18n.bestLibrary.cta.button")}
            </a>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
