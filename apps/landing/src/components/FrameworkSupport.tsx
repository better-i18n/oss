import { Link, useParams } from "@tanstack/react-router";
import { useTranslations } from "@better-i18n/use-intl";
import { IconArrowRight } from "@central-icons-react/round-outlined-radius-2-stroke-2";

const frameworks = [
  { key: "react", name: "React", href: "/$locale/i18n/react", tagline: "React i18n library", highlight: "Hooks-based API with automatic re-rendering" },
  { key: "nextjs", name: "Next.js", href: "/$locale/i18n/nextjs", tagline: "App Router ready", highlight: "Server Components & static generation support" },
  { key: "vue", name: "Vue", href: "/$locale/i18n/vue", tagline: "Vue i18n", highlight: "Composition API with reactive translations" },
  { key: "nuxt", name: "Nuxt", href: "/$locale/i18n/nuxt", tagline: "Nuxt i18n", highlight: "Auto-import and SSR-optimized translations" },
  { key: "angular", name: "Angular", href: "/$locale/i18n/angular", tagline: "Angular i18n", highlight: "Pipe-based translations with lazy loading" },
  { key: "svelte", name: "Svelte", href: "/$locale/i18n/svelte", tagline: "Svelte i18n", highlight: "Store-based reactivity with zero boilerplate" },
];

export default function FrameworkSupport() {
  const t = useTranslations("frameworkSupport");
  const { locale } = useParams({ strict: false });
  const currentLocale = locale || "en";

  return (
    <section id="frameworks" className="py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1]">
            {t("title", { defaultValue: "Framework Support" })}
          </h2>
          <p className="mt-4 text-lg text-mist-700 max-w-2xl mx-auto">
            {t("subtitle", { defaultValue: "First-class integrations for every major framework. Drop in and start translating." })}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {frameworks.map((framework) => (
            <Link
              key={framework.key}
              to={
                framework.href as
                  | "/$locale/i18n/react"
                  | "/$locale/i18n/nextjs"
                  | "/$locale/i18n/vue"
                  | "/$locale/i18n/nuxt"
                  | "/$locale/i18n/angular"
                  | "/$locale/i18n/svelte"
              }
              params={{ locale: currentLocale }}
              className="group flex flex-col items-center justify-center p-6 rounded-xl border border-mist-200 bg-mist-50/50 hover:border-mist-300 hover:bg-white hover:shadow-md transition-all"
            >
              <span className="text-base font-medium text-mist-950 group-hover:text-mist-700">
                {framework.name}
              </span>
              <span className="mt-1 text-xs text-mist-500">
                {t(`${framework.key}.tagline`, { defaultValue: framework.tagline })}
              </span>
              <span className="mt-2 text-xs text-mist-400 text-center line-clamp-2">
                {t(`${framework.key}.highlight`, { defaultValue: framework.highlight })}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/$locale/for-developers"
            params={{ locale: currentLocale }}
            className="inline-flex items-center gap-2 text-sm font-medium text-mist-700 hover:text-mist-950"
          >
            {t("viewAllIntegrations", { defaultValue: "View all integrations" })}
            <IconArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
