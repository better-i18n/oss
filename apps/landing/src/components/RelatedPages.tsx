import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { SpriteIcon } from "@/components/SpriteIcon";

type PageLink = {
  href: string;
  titleKey: string;
  descKey: string;
};

const forPages: PageLink[] = [
  { href: "/$locale/for-developers/", titleKey: "forDevelopers", descKey: "forDevelopersDesc" },
  { href: "/$locale/for-translators/", titleKey: "forTranslators", descKey: "forTranslatorsDesc" },
  { href: "/$locale/for-product-teams/", titleKey: "forProductTeams", descKey: "forProductTeamsDesc" },
];

const resourcePages: PageLink[] = [
  { href: "/$locale/features/", titleKey: "features", descKey: "featuresDesc" },
  { href: "/$locale/pricing/", titleKey: "pricing", descKey: "pricingDesc" },
  { href: "/$locale/i18n/best-tms/", titleKey: "bestTms", descKey: "bestTmsDesc" },
];

const frameworkPages: PageLink[] = [
  { href: "/$locale/i18n/react/", titleKey: "react", descKey: "reactDesc" },
  { href: "/$locale/i18n/nextjs/", titleKey: "nextjs", descKey: "nextjsDesc" },
  { href: "/$locale/i18n/vue/", titleKey: "vue", descKey: "vueDesc" },
];

const comparePages: PageLink[] = [
  { href: "/$locale/compare/crowdin/", titleKey: "compareCrowdin", descKey: "compareCrowdinDesc" },
  { href: "/$locale/compare/lokalise/", titleKey: "compareLokalise", descKey: "compareLokaliseDesc" },
  { href: "/$locale/compare/phrase/", titleKey: "comparePhrase", descKey: "comparePhraseDesc" },
];

const educationalPages: PageLink[] = [
  { href: "/$locale/what-is-internationalization/", titleKey: "whatIsI18n", descKey: "whatIsI18nDesc" },
  { href: "/$locale/what-is-localization/", titleKey: "whatIsL10n", descKey: "whatIsL10nDesc" },
  { href: "/$locale/i18n/best-library/", titleKey: "bestLibrary", descKey: "bestLibraryDesc" },
];

const contentPages: PageLink[] = [
  { href: "/$locale/i18n/localization-software/", titleKey: "localizationSoftware", descKey: "localizationSoftwareDesc" },
  { href: "/$locale/i18n/translation-management-system/", titleKey: "translationManagement", descKey: "translationManagementDesc" },
  { href: "/$locale/i18n/multilingual-seo/", titleKey: "multilingualSeo", descKey: "multilingualSeoDesc" },
  { href: "/$locale/i18n/international-seo/", titleKey: "internationalSeo", descKey: "internationalSeoDesc" },
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
  /* All 39 labels this component needs are published keys in the
     `relatedPages` namespace, verified against
     cdn.better-i18n.com/better-i18n/landing/en/relatedPages.json, and that
     namespace is loaded on every page that renders this block. The
     `defaultValue` fallbacks that used to sit on these three calls were dead:
     they never rendered, and where they differed from the published copy (14 of
     them did) they were a second, stale version of the same string in the
     codebase. The CDN source_text is the only source of truth. */
  const t = useT("relatedPages");

  const pool = variant === "mixed"
    ? [...forPages, ...resourcePages, ...contentPages]
    : (PAGE_POOL[variant] ?? []);

  const filtered = pool.filter((p) => !p.href.includes(currentPage));
  const pages = variant === "mixed" ? filtered.slice(0, 4) : filtered;

  if (pages.length === 0) return null;

  return (
    <section className="border-t border-mist-200/50">
      <div className="section">
        <h2 className="section-h2 mb-8">
          {t("title")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-mist-200/50">
          {pages.map((page) => (
            <Link
              key={page.href}
              to={page.href as AllowedRoute}
              params={{ locale }}
              className="group flex flex-col gap-2 py-5 sm:px-5 first:sm:pl-0 last:sm:pr-0"
            >
              <h3 className="text-[15px] font-medium leading-snug tracking-[-0.015em] text-mist-900 transition-colors group-hover:text-mist-600">
                {t(page.titleKey)}
              </h3>
              <p className="text-[13px] leading-relaxed text-mist-500 line-clamp-2">
                {t(page.descKey)}
              </p>
              <span className="mt-auto flex items-center gap-1 text-[11px] text-mist-400 transition-colors group-hover:text-mist-600">
                <SpriteIcon name="arrow-right" className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
