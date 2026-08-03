import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { SpriteIcon } from "@/components/SpriteIcon";
import { GuideMark, guideIcon } from "@/lib/i18n-guide-icons";
import { CompetitorMark, type CompetitorKey } from "@/components/icons/CompetitorMarks";

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

/**
 * The mark for a related-page link, derived from its href.
 *
 * `/i18n/{slug}/` is a guide (framework marks live in the shared guide-icon map);
 * `/compare/{vendor}/` is a competitor. Anything else — personas, pricing,
 * features — names no third party and correctly gets nothing, so the caller can
 * render this unconditionally.
 */
function PageMark({ href }: { href: string }) {
  const guide = /\/i18n\/([a-z0-9-]+)\/$/.exec(href);
  if (guide) return <GuideMark slug={guide[1]} />;

  const vendor = /\/compare\/([a-z0-9-]+)\/$/.exec(href);
  if (vendor && (COMPETITOR_KEYS as readonly string[]).includes(vendor[1])) {
    return (
      <span className="flex size-[22px] shrink-0 items-center justify-center">
        <CompetitorMark competitor={vendor[1] as CompetitorKey} size={22} />
      </span>
    );
  }
  return null;
}

/**
 * Does this link have a mark at all?
 *
 * Whether a card shows a mark is a per-link fact, but whether the ROW leaves
 * room for one has to be a per-group decision. When only some links in a row
 * had a mark, the ones without started their title 22px higher and the row read
 * as broken — visible on `/content/`, where two of four "Explore more" links
 * name a framework and two name an SEO topic.
 *
 * So the group asks this once: if any link in it carries a mark, every card
 * reserves the same slot. If none do, nobody reserves anything and no empty
 * boxes appear. Aligning by reserving space unconditionally would have traded
 * one visual defect for another.
 */
function hasMark(href: string): boolean {
  const guide = /\/i18n\/([a-z0-9-]+)\/$/.exec(href);
  if (guide) return guideIcon(guide[1]) !== null;

  const vendor = /\/compare\/([a-z0-9-]+)\/$/.exec(href);
  return Boolean(vendor && (COMPETITOR_KEYS as readonly string[]).includes(vendor[1]));
}

const COMPETITOR_KEYS = [
  "crowdin",
  "lokalise",
  "phrase",
  "transifex",
  "smartling",
  "xtm",
] as const;

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

  // One decision for the whole row — see hasMark.
  const marksInRow = pages.some((page) => hasMark(page.href));

  return (
    <section className="border-t border-mist-200/50">
      <div className="section">
        <h2 className="section-h2 mb-8">
          {t("title")}
        </h2>

        {/* Bare columns split by gap: a link list's items do not carry their own
            rules (rule/listed-items-are-not-cards). The `divide-x` this replaces
            drew three vertical lines through four links. */}
        <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 xl:grid-cols-4">
          {pages.map((page) => (
            <Link
              key={page.href}
              to={page.href as AllowedRoute}
              params={{ locale }}
              className="group flex flex-col gap-2"
            >
              {/* rule/name-a-thing-with-its-mark — a framework or vendor named
                  here gets the same mark it has in the matrix and the hub. The
                  slot is reserved for the whole row or for none of it, so the
                  titles sit on one line either way (see hasMark). */}
              {marksInRow && (
                <span className="flex h-[22px] items-center">
                  <PageMark href={page.href} />
                </span>
              )}
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
