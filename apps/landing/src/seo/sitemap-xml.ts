/**
 * Post-processing for the sitemap XML that the TanStack Start plugin writes.
 *
 * Pure string → string, so `scripts/fix-sitemap.ts` stays a thin file-system
 * wrapper and the rules here can be tested without a build.
 *
 * No runtime imports: this runs from a build script, outside Vite.
 */

/**
 * The sitemap protocol namespace. It is `http://`, not `https://` — the
 * namespace is an identifier, not a URL anyone fetches, and parsers compare it
 * byte for byte. The plugin emits the `https://` form, and Search Console
 * reports that as a namespace error (SEO audit 2026-11-13, fix F5).
 */
export const SITEMAP_NS = "http://www.sitemaps.org/schemas/sitemap/0.9";
export const XHTML_NS = "http://www.w3.org/1999/xhtml";

const SITE_ORIGIN = "https://better-i18n.com";

/**
 * The `<url>` block for one already-locale-prefixed path (e.g. `/en/about/`).
 *
 * Anchored on the exact `<loc>` so `/en/about/` cannot also match a longer path
 * that merely starts with it, and the `(?!</url>)` guard keeps the match inside
 * a single block instead of swallowing everything up to the last `</url>` in
 * the file.
 */
export function urlBlockPattern(path: string, origin = SITE_ORIGIN): RegExp {
  const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(
    `\\s*<url>(?:(?!</url>)[\\s\\S])*?<loc>${escape(origin)}${escape(path)}</loc>(?:(?!</url>)[\\s\\S])*?</url>`,
    "g",
  );
}

export interface FixSitemapResult {
  readonly xml: string;
  /** How many `<url>` blocks were removed (bare root + excluded paths). */
  readonly droppedUrls: number;
}

/**
 * - Rewrites the `<urlset>` opening tag to the correct sitemap namespace and
 *   declares `xmlns:xhtml` (the hreflang `<xhtml:link>` children need it).
 *   Matches any existing `<urlset …>` attributes, so it does not depend on
 *   the exact string the plugin happens to emit.
 * - Drops stray `xmlns=""` attributes.
 * - Removes the bare root URL: it 302-redirects to `/{locale}/`, so listing it
 *   asks Google to index a redirect.
 * - Removes every path in `excludedPaths` (built, but not advertised).
 */
export function fixSitemapXml(
  input: string,
  excludedPaths: readonly string[] = [],
): FixSitemapResult {
  let xml = input
    .replace(/<urlset\b[^>]*>/g, `<urlset xmlns="${SITEMAP_NS}" xmlns:xhtml="${XHTML_NS}">`)
    .replace(/<sitemapindex\b[^>]*>/g, `<sitemapindex xmlns="${SITEMAP_NS}">`)
    .replaceAll(/ xmlns=""/g, "");

  let droppedUrls = 0;
  const drop = (path: string) => {
    const before = xml;
    xml = xml.replace(urlBlockPattern(path), "");
    if (xml !== before) droppedUrls++;
  };

  drop("/");
  for (const p of excludedPaths) {
    if (!p || p === "/") continue; // bare root is handled above
    drop(p);
  }

  return { xml, droppedUrls };
}
