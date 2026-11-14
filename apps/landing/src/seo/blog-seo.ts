/**
 * SEO decisions for a single blog post page. Pure, so the route head and the
 * tests share one answer.
 */

const SOURCE_LOCALE = "en";

/**
 * Which locale's URL is the canonical one for this post, seen from `locale`.
 *
 * The Content API answers `/nl/blog/<slug>` with the English entry when there
 * is no Dutch translation. Those pages were self-canonical, so Google saw
 * ~1,474 near-identical English copies under locale paths (SEO audit
 * 2026-11-13, fix F3). They now name the English post as canonical, and the
 * hreflang (built from the same `availableLanguages`) already leaves them out.
 *
 * An empty or missing list means "unknown", not "untranslated": the page keeps
 * its own URL rather than guessing.
 */
export function blogCanonicalLocale(
  locale: string,
  availableLanguages: readonly string[] | null | undefined,
): string {
  if (!availableLanguages || availableLanguages.length === 0) return locale;
  return availableLanguages.includes(locale) ? locale : SOURCE_LOCALE;
}

/**
 * Off-topic posts: kept online, but `noindex`, out of the sitemap and out of
 * llms.txt (SEO audit 2026-11-13, fix F4).
 *
 * They are generic SEO/marketing advice or consumer "best translator app"
 * listicles. They do not sell a localization platform and they dilute what
 * Google and AI tools think better-i18n.com is about. Nothing is deleted: the
 * pages still render, so links to them keep working, and taking a slug off
 * this list undoes it on the next build.
 *
 * Classified by slug + title on 2026-11-14 from the 256 published EN posts.
 * International / multilingual SEO posts (hreflang, international-seo-*,
 * multilingual-keyword-research, …) are on-topic and NOT listed here.
 */
export const OFF_TOPIC_SEO_SLUGS: readonly string[] = [
  "ai-content-creators",
  "ai-content-marketing",
  "ai-search-optimization-tools",
  "analytics-seo",
  "app-store-optimization-checklist",
  "app-store-optimization-keywords",
  "best-seo-practices",
  "blogging-seo",
  "check-location-on-android",
  "content-optimization-strategy",
  "copywriting-seo",
  "digital-search-engine-marketing",
  "digital-seo",
  "ecom-seo",
  "effective-seo-solutions",
  "google-seo-insights",
  "how-does-seo-work",
  "how-to-add-keywords-to-website-for-seo",
  "how-to-do-link-building",
  "how-to-do-seo-yourself",
  "how-to-get-keyword-ranking",
  "how-to-get-your-website-on-google-search-first-page",
  "how-to-make-your-website-show-up-on-google-search",
  "how-to-rank-in-ai-overviews",
  "how-to-search-keywords-on-a-webpage",
  "improve-brand-visibility-ai-search",
  "increase-website-traffic",
  "local-seo-tips",
  "mobile-seo-marketing",
  "off-page-factors",
  "on-site-search-engine-optimization",
  "optimize-organic-search",
  "organic-optimisation",
  "search-engine-optimization-for-youtube",
  "search-engine-optimization-site-audit",
  "search-engine-optimization-techniques-tutorial",
  "search-engine-optimization-title",
  "search-engine-results",
  "seo-activities",
  "seo-algorithm",
  "seo-based-website",
  "seo-branding",
  "seo-charts",
  "seo-company-with-worldwide-presence",
  "seo-components",
  "seo-content-creation",
  "seo-content-marketing-techniques",
  "seo-content-strategy",
  "seo-examples",
  "seo-findability-resources",
  "seo-for-products-pages",
  "seo-friendly",
  "seo-html",
  "seo-in-web-development",
  "seo-marketing-adwords",
  "seo-marketing-campaign",
  "seo-marketing-keywords",
  "seo-marketing-site",
  "seo-methodologies",
  "seo-parameters-list",
  "seo-related-words",
  "seo-requirements-for-new-website",
  "seo-rules",
  "seo-scoring",
  "seo-search-position",
  "seo-targets",
  "seo-traffic",
  "seo-types",
  "seo-ux",
  "seo-value",
  "seo-vs-geo",
  "site-structure-seo",
  "social-media-seo-strategy",
  "the-future-of-seo",
  "url-seo",
  "web-page-optimization",
  "web-search-engine-ranking",
  "what-is-seo-visibility",
  "what-to-look-for-in-seo-report",
  "why-is-search-engine-optimization-important",
  "writing-for-search-engine-optimization",
];

export const CONSUMER_LISTICLE_SLUGS: readonly string[] = [
  "automatic-translation-guide",
  "best-document-translation-software",
  "best-live-translation-apps-2026",
  "best-translation-software-2026",
  "best-translator-software-2026",
  "best-translator-websites-2026",
  "free-translation-software-2026",
  "french-translation-tools",
  "google-translate-alternatives",
  "indian-language-translation-tools",
  "language-translation-tools-guide",
  "online-translation-tools-2026",
  "spanish-english-translation-accuracy",
  "translate-help",
  "translation-software-vs-apps",
];

const OFF_TOPIC = new Set([...OFF_TOPIC_SEO_SLUGS, ...CONSUMER_LISTICLE_SLUGS]);

export function isOffTopicBlogSlug(slug: string): boolean {
  return OFF_TOPIC.has(slug);
}
