/**
 * Where an internal link written in a CMS body should really go.
 *
 * CMS bodies (persona pages, blog posts) were written with docs-style paths:
 * `/mcp`, `/frameworks/expo`, `/sdk/api-reference`, `/security`, `/demo`.
 * BlogContent prefixed every internal path with the reader's locale, so these
 * became `/en/mcp/` etc. — pages that exist only on the docs site, and 404 on
 * better-i18n.com (SEO audit 2026-11-13, fix F3: 5×404 in a 260-link sample,
 * all from the for-* pages).
 *
 * Docs-only sections now go to docs.better-i18n.com (every target checked to
 * return 200 on 2026-11-14), `/demo` goes to the booking link the persona
 * pages already use, and everything else keeps the old locale rewrite.
 */

const DOCS_ORIGIN = "https://docs.better-i18n.com";
const DOCS_PREFIX = "/en/docs";

/** First path segments that exist on the docs site and not on the landing. */
export const DOCS_ONLY_SECTIONS: ReadonlySet<string> = new Set([
  "mcp",
  "frameworks",
  "sdk",
  "cli",
  "security",
]);

export const DEMO_BOOKING_URL = "https://cal.com/better-i18n/30min?overlayCalendar=true";

/** `/en/…`, `/zh-hans/…` — same rule BlogContent always used (slash required). */
const LOCALE_PREFIX_REGEX = /^\/[a-z]{2}(-[a-z]+)?(?=\/)/;

/**
 * Resolve a site-relative path (`/mcp`, `/en/frameworks/expo/`, `/pricing`)
 * for a reader in `locale`. Query and hash are kept.
 */
export function resolveCmsPath(path: string, locale: string): string {
  const match = path.match(/^([^?#]*)(.*)$/)!;
  const pathname = match[1] || "/";
  const suffix = match[2] ?? "";

  const withoutLocale = pathname.replace(LOCALE_PREFIX_REGEX, "") || "/";
  const firstSegment = withoutLocale.split("/").filter(Boolean)[0];

  if (firstSegment && DOCS_ONLY_SECTIONS.has(firstSegment)) {
    const docsPath = withoutLocale.replace(/\/+$/, "");
    return `${DOCS_ORIGIN}${DOCS_PREFIX}${docsPath}${suffix}`;
  }
  if (firstSegment === "demo" && withoutLocale.replace(/\/+$/, "") === "/demo") {
    return DEMO_BOOKING_URL;
  }

  const rest = withoutLocale === "/" ? "/" : withoutLocale;
  return `/${locale}${rest}${suffix}`;
}
