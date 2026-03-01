import { Link } from "@tanstack/react-router";
import { useTranslations } from "@better-i18n/use-intl";
import { IconArrowRight } from "@central-icons-react/round-outlined-radius-2-stroke-2";

type PageLink = {
  href: string;
  titleKey: string;
  descKey: string;
  titleFallback: string;
  descFallback: string;
};

const forPages: PageLink[] = [
  { href: "/$locale/for-developers", titleKey: "forDevelopers", descKey: "forDevelopersDesc", titleFallback: "For Developers", descFallback: "Type-safe SDKs, Git integration, and CLI tools" },
  { href: "/$locale/for-translators", titleKey: "forTranslators", descKey: "forTranslatorsDesc", titleFallback: "For Translators", descFallback: "AI-powered translation with contextual review" },
  { href: "/$locale/for-product-teams", titleKey: "forProductTeams", descKey: "forProductTeamsDesc", titleFallback: "For Product Teams", descFallback: "Ship globally without the localization headaches" },
];

const resourcePages: PageLink[] = [
  { href: "/$locale/features", titleKey: "features", descKey: "featuresDesc", titleFallback: "Features", descFallback: "Everything you need to ship globally" },
  { href: "/$locale/pricing", titleKey: "pricing", descKey: "pricingDesc", titleFallback: "Pricing", descFallback: "Simple, transparent pricing for every team" },
  { href: "/$locale/i18n/best-tms", titleKey: "bestTms", descKey: "bestTmsDesc", titleFallback: "Best TMS", descFallback: "Compare translation management systems" },
];

const frameworkPages: PageLink[] = [
  { href: "/$locale/i18n/react", titleKey: "react", descKey: "reactDesc", titleFallback: "React i18n", descFallback: "Internationalize your React application" },
  { href: "/$locale/i18n/nextjs", titleKey: "nextjs", descKey: "nextjsDesc", titleFallback: "Next.js i18n", descFallback: "Full-stack i18n for Next.js apps" },
  { href: "/$locale/i18n/vue", titleKey: "vue", descKey: "vueDesc", titleFallback: "Vue i18n", descFallback: "Localize your Vue.js application" },
];

const comparePages: PageLink[] = [
  { href: "/$locale/compare/crowdin", titleKey: "compareCrowdin", descKey: "compareCrowdinDesc", titleFallback: "vs Crowdin", descFallback: "How Better i18n compares to Crowdin" },
  { href: "/$locale/compare/lokalise", titleKey: "compareLokalise", descKey: "compareLokaliseDesc", titleFallback: "vs Lokalise", descFallback: "How Better i18n compares to Lokalise" },
  { href: "/$locale/compare/phrase", titleKey: "comparePhrase", descKey: "comparePhraseDesc", titleFallback: "vs Phrase", descFallback: "How Better i18n compares to Phrase" },
];

const educationalPages: PageLink[] = [
  { href: "/$locale/what-is-internationalization", titleKey: "whatIsI18n", descKey: "whatIsI18nDesc", titleFallback: "What is i18n?", descFallback: "A complete guide to internationalization" },
  { href: "/$locale/what-is-localization", titleKey: "whatIsL10n", descKey: "whatIsL10nDesc", titleFallback: "What is Localization?", descFallback: "Understanding localization and its processes" },
  { href: "/$locale/i18n/best-library", titleKey: "bestLibrary", descKey: "bestLibraryDesc", titleFallback: "Best i18n Library", descFallback: "Compare the top i18n libraries" },
];

const contentPages: PageLink[] = [
  { href: "/$locale/i18n/localization-software", titleKey: "localizationSoftware", descKey: "localizationSoftwareDesc", titleFallback: "Localization Software", descFallback: "Top localization software platforms compared" },
  { href: "/$locale/i18n/translation-management-system", titleKey: "translationManagement", descKey: "translationManagementDesc", titleFallback: "Translation Management", descFallback: "Modern translation management systems" },
  { href: "/$locale/i18n/multilingual-seo", titleKey: "multilingualSeo", descKey: "multilingualSeoDesc", titleFallback: "Multilingual SEO", descFallback: "Optimize your site for multiple languages" },
  { href: "/$locale/i18n/international-seo", titleKey: "internationalSeo", descKey: "internationalSeoDesc", titleFallback: "International SEO", descFallback: "Reach global audiences with SEO" },
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
  } else if (variant === "content") {
    pages = contentPages.filter(p => !p.href.includes(currentPage));
  } else {
    // mixed: combine for pages, resources, and top content pages
    pages = [...forPages, ...resourcePages, ...contentPages].filter(p => !p.href.includes(currentPage)).slice(0, 4);
  }

  if (pages.length === 0) return null;

  return (
    <section className="py-12 border-t border-mist-200">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="text-lg font-medium text-mist-950 mb-6">{t.has("title") ? t("title") : "Explore More"}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <Link
              key={page.href}
              to={page.href as AllowedRoute}
              params={{ locale }}
              className="group flex items-center justify-between p-4 rounded-xl border border-mist-200 bg-white hover:border-mist-300 hover:shadow-md transition-all"
            >
              <div>
                <h3 className="text-sm font-medium text-mist-950">{t.has(page.titleKey) ? t(page.titleKey) : page.titleFallback}</h3>
                <p className="text-xs text-mist-500 mt-1">{t.has(page.descKey) ? t(page.descKey) : page.descFallback}</p>
              </div>
              <IconArrowRight className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
