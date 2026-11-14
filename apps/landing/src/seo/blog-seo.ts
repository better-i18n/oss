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
