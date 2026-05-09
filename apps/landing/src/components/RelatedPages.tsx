import { Link } from "@tanstack/react-router";
import { useTranslations } from "@better-i18n/use-intl";
import { SpriteIcon } from "@/components/SpriteIcon";

type PageLink = {
  href: string;
  titleKey: string;
  descKey: string;
  titleFallback: string;
  descFallback: string;
};

const forPages: PageLink[] = [
  { href: "/$locale/for-developers/", titleKey: "forDevelopers", descKey: "forDevelopersDesc", titleFallback: "For Developers", descFallback: "Type-safe SDKs, Git integration, and CLI tools" },
  { href: "/$locale/for-translators/", titleKey: "forTranslators", descKey: "forTranslatorsDesc", titleFallback: "For Translators", descFallback: "AI-powered translation with contextual review" },
  { href: "/$locale/for-product-teams/", titleKey: "forProductTeams", descKey: "forProductTeamsDesc", titleFallback: "For Product Teams", descFallback: "Ship globally without the localization headaches" },
];

const resourcePages: PageLink[] = [
  { href: "/$locale/features/", titleKey: "features", descKey: "featuresDesc", titleFallback: "Features", descFallback: "Everything you need to ship globally" },
  { href: "/$locale/pricing/", titleKey: "pricing", descKey: "pricingDesc", titleFallback: "Pricing", descFallback: "Simple, transparent pricing for every team" },
  { href: "/$locale/i18n/best-tms/", titleKey: "bestTms", descKey: "bestTmsDesc", titleFallback: "Best TMS", descFallback: "Compare translation management systems" },
];

const frameworkPages: PageLink[] = [
  { href: "/$locale/i18n/react/", titleKey: "react", descKey: "reactDesc", titleFallback: "React i18n", descFallback: "Internationalize your React application" },
  { href: "/$locale/i18n/nextjs/", titleKey: "nextjs", descKey: "nextjsDesc", titleFallback: "Next.js i18n", descFallback: "Full-stack i18n for Next.js apps" },
  { href: "/$locale/i18n/vue/", titleKey: "vue", descKey: "vueDesc", titleFallback: "Vue i18n", descFallback: "Localize your Vue.js application" },
];

const comparePages: PageLink[] = [
  { href: "/$locale/compare/crowdin/", titleKey: "compareCrowdin", descKey: "compareCrowdinDesc", titleFallback: "vs Crowdin", descFallback: "How Better I18N compares to Crowdin" },
  { href: "/$locale/compare/lokalise/", titleKey: "compareLokalise", descKey: "compareLokaliseDesc", titleFallback: "vs Lokalise", descFallback: "How Better I18N compares to Lokalise" },
  { href: "/$locale/compare/phrase/", titleKey: "comparePhrase", descKey: "comparePhraseDesc", titleFallback: "vs Phrase", descFallback: "How Better I18N compares to Phrase" },
];

const educationalPages: PageLink[] = [
  { href: "/$locale/what-is-internationalization/", titleKey: "whatIsI18n", descKey: "whatIsI18nDesc", titleFallback: "What is i18n?", descFallback: "A complete guide to internationalization" },
  { href: "/$locale/what-is-localization/", titleKey: "whatIsL10n", descKey: "whatIsL10nDesc", titleFallback: "What is Localization?", descFallback: "Understanding localization and its processes" },
  { href: "/$locale/i18n/best-library/", titleKey: "bestLibrary", descKey: "bestLibraryDesc", titleFallback: "Best i18n Library", descFallback: "Compare the top i18n libraries" },
];

const contentPages: PageLink[] = [
  { href: "/$locale/i18n/localization-software/", titleKey: "localizationSoftware", descKey: "localizationSoftwareDesc", titleFallback: "Localization Software", descFallback: "Top localization software platforms compared" },
  { href: "/$locale/i18n/translation-management-system/", titleKey: "translationManagement", descKey: "translationManagementDesc", titleFallback: "Translation Management", descFallback: "Modern translation management systems" },
  { href: "/$locale/i18n/multilingual-seo/", titleKey: "multilingualSeo", descKey: "multilingualSeoDesc", titleFallback: "Multilingual SEO", descFallback: "Optimize your site for multiple languages" },
  { href: "/$locale/i18n/international-seo/", titleKey: "internationalSeo", descKey: "internationalSeoDesc", titleFallback: "International SEO", descFallback: "Reach global audiences with SEO" },
];

type AllowedRoute =
  | "/$locale/for-developers/"
  | "/$locale/for-translators/"
  | "/$locale/for-product-teams/"
  | "/$locale/features/"
  | "/$locale/pricing/"
  | "/$locale/i18n/best-tms/"
  | "/$locale/i18n/react/"
  | "/$locale/i18n/nextjs/"
  | "/$locale/i18n/vue/"
  | "/$locale/compare/crowdin/"
  | "/$locale/compare/lokalise/"
  | "/$locale/compare/phrase/"
  | "/$locale/what-is-internationalization/"
  | "/$locale/what-is-localization/"
  | "/$locale/i18n/best-library/"
  | "/$locale/i18n/localization-software/"
  | "/$locale/i18n/translation-management-system/"
  | "/$locale/i18n/multilingual-seo/"
  | "/$locale/i18n/international-seo/";

type RelatedPagesProps = {
  currentPage: string;
  locale: string;
  variant?: "for" | "resources" | "frameworks" | "compare" | "educational" | "content" | "mixed";
};

const PAGE_POOL: Record<string, PageLink[]> = {
  for: forPages,
  resources: resourcePages,
  frameworks: frameworkPages,
  compare: comparePages,
  educational: educationalPages,
  content: contentPages,
};

export function RelatedPages({ currentPage, locale, variant = "mixed" }: RelatedPagesProps) {
  const t = useTranslations("relatedPages");

  const pool = variant === "mixed"
    ? [...forPages, ...resourcePages, ...contentPages]
    : (PAGE_POOL[variant] ?? []);

  const filtered = pool.filter((p) => !p.href.includes(currentPage));
  const pages = variant === "mixed" ? filtered.slice(0, 4) : filtered;

  if (pages.length === 0) return null;

  return (
    <section className="border-t border-mist-200/50 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="text-[14px] font-semibold text-mist-950 mb-6">
          {t("title", { defaultValue: "Explore More" })}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-mist-200/50">
          {pages.map((page) => (
            <Link
              key={page.href}
              to={page.href as AllowedRoute}
              params={{ locale }}
              className="group flex flex-col gap-2 py-5 sm:px-5 first:sm:pl-0 last:sm:pr-0"
            >
              <h3 className="text-[14px]/[1.4] font-medium text-mist-950 group-hover:text-mist-600 transition-colors">
                {t(page.titleKey, { defaultValue: page.titleFallback })}
              </h3>
              <p className="text-[13px] leading-relaxed text-mist-500 line-clamp-2">
                {t(page.descKey, { defaultValue: page.descFallback })}
              </p>
              <span className="mt-auto flex items-center gap-1 text-[12px] text-mist-400 group-hover:text-mist-600 transition-colors">
                <SpriteIcon name="arrow-right" className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
