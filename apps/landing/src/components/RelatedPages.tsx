import { Link } from "@tanstack/react-router";
import { useTranslations } from "@better-i18n/use-intl";
import { IconArrowRight } from "@central-icons-react/round-outlined-radius-2-stroke-2";

type PageLink = {
  href: string;
  titleKey: string;
  descKey: string;
};

const forPages: PageLink[] = [
  { href: "/$locale/for-developers", titleKey: "forDevelopers", descKey: "forDevelopersDesc" },
  { href: "/$locale/for-translators", titleKey: "forTranslators", descKey: "forTranslatorsDesc" },
  { href: "/$locale/for-product-teams", titleKey: "forProductTeams", descKey: "forProductTeamsDesc" },
];

const resourcePages: PageLink[] = [
  { href: "/$locale/features", titleKey: "features", descKey: "featuresDesc" },
  { href: "/$locale/pricing", titleKey: "pricing", descKey: "pricingDesc" },
  { href: "/$locale/i18n/best-tms", titleKey: "bestTms", descKey: "bestTmsDesc" },
];

const frameworkPages: PageLink[] = [
  { href: "/$locale/i18n/react", titleKey: "react", descKey: "reactDesc" },
  { href: "/$locale/i18n/nextjs", titleKey: "nextjs", descKey: "nextjsDesc" },
  { href: "/$locale/i18n/vue", titleKey: "vue", descKey: "vueDesc" },
];

const comparePages: PageLink[] = [
  { href: "/$locale/compare/crowdin", titleKey: "compareCrowdin", descKey: "compareCrowdinDesc" },
  { href: "/$locale/compare/lokalise", titleKey: "compareLokalise", descKey: "compareLokaliseDesc" },
  { href: "/$locale/compare/phrase", titleKey: "comparePhrase", descKey: "comparePhraseDesc" },
];

const educationalPages: PageLink[] = [
  { href: "/$locale/what-is-internationalization", titleKey: "whatIsI18n", descKey: "whatIsI18nDesc" },
  { href: "/$locale/what-is-localization", titleKey: "whatIsL10n", descKey: "whatIsL10nDesc" },
  { href: "/$locale/i18n/best-library", titleKey: "bestLibrary", descKey: "bestLibraryDesc" },
];

const contentPages: PageLink[] = [
  { href: "/$locale/i18n/localization-software", titleKey: "localizationSoftware", descKey: "localizationSoftwareDesc" },
  { href: "/$locale/i18n/translation-management-system", titleKey: "translationManagement", descKey: "translationManagementDesc" },
  { href: "/$locale/i18n/multilingual-seo", titleKey: "multilingualSeo", descKey: "multilingualSeoDesc" },
  { href: "/$locale/i18n/international-seo", titleKey: "internationalSeo", descKey: "internationalSeoDesc" },
];

type AllowedRoute =
  | "/$locale/for-developers"
  | "/$locale/for-translators"
  | "/$locale/for-product-teams"
  | "/$locale/features"
  | "/$locale/pricing"
  | "/$locale/i18n/best-tms"
  | "/$locale/i18n/react"
  | "/$locale/i18n/nextjs"
  | "/$locale/i18n/vue"
  | "/$locale/compare/crowdin"
  | "/$locale/compare/lokalise"
  | "/$locale/compare/phrase"
  | "/$locale/what-is-internationalization"
  | "/$locale/what-is-localization"
  | "/$locale/i18n/best-library"
  | "/$locale/i18n/localization-software"
  | "/$locale/i18n/translation-management-system"
  | "/$locale/i18n/multilingual-seo"
  | "/$locale/i18n/international-seo";

type RelatedPagesProps = {
  currentPage: string;
  locale: string;
  variant?: "for" | "resources" | "frameworks" | "compare" | "educational" | "content" | "mixed";
};

export function RelatedPages({ currentPage, locale, variant = "mixed" }: RelatedPagesProps) {
  const t = useTranslations("relatedPages");

  let pages: PageLink[] = [];

  if (variant === "for") {
    pages = forPages.filter(p => !p.href.includes(currentPage));
  } else if (variant === "resources") {
    pages = resourcePages.filter(p => !p.href.includes(currentPage));
  } else if (variant === "frameworks") {
    pages = frameworkPages.filter(p => !p.href.includes(currentPage));
  } else if (variant === "compare") {
    pages = comparePages.filter(p => !p.href.includes(currentPage));
  } else if (variant === "educational") {
    pages = educationalPages.filter(p => !p.href.includes(currentPage));
  } else {
    // mixed: combine for pages and resources
    pages = [...forPages, ...resourcePages].filter(p => !p.href.includes(currentPage)).slice(0, 4);
  }

  if (pages.length === 0) return null;

  return (
    <section className="py-12 border-t border-mist-200">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="text-lg font-medium text-mist-950 mb-6">{t("title")}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <Link
              key={page.href}
              to={page.href as AllowedRoute}
              params={{ locale }}
              className="group flex items-center justify-between p-4 rounded-xl border border-mist-200 bg-white hover:border-mist-300 hover:shadow-md transition-all"
            >
              <div>
                <h3 className="text-sm font-medium text-mist-950">{t(page.titleKey)}</h3>
                <p className="text-xs text-mist-500 mt-1">{t(page.descKey)}</p>
              </div>
              <IconArrowRight className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
