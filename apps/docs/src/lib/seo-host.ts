/**
 * Which host is allowed to be indexed, and where the docs really live.
 *
 * This Cloudflare Pages project (`better-i18n-docs`) is no longer the docs
 * origin: docs.better-i18n.com is served by Helpway and its canonical URLs
 * carry an `/en/docs` prefix (`/cli` -> `/en/docs/cli`). What is left on
 * `better-i18n-docs.pages.dev` is a duplicate that Google indexed and showed
 * in brand searches (SEO audit 2026-11-13, finding 6).
 *
 * Shared by `functions/_middleware.ts` (redirect + X-Robots-Tag) and the page
 * metadata (canonical link), so both always point at the same URL.
 */

export const DOCS_ORIGIN = "https://docs.better-i18n.com";
export const DOCS_PATH_PREFIX = "/en/docs";

/** The production alias of this Pages project. */
export const PAGES_PRODUCTION_HOST = "better-i18n-docs.pages.dev";

/** `/cli/` -> `https://docs.better-i18n.com/en/docs/cli`; `/` -> `.../en/docs`. */
export function canonicalDocsUrl(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, "");
  const path = trimmed === "" ? "" : trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${DOCS_ORIGIN}${DOCS_PATH_PREFIX}${path}`;
}

/** Any `*.pages.dev` host: the production alias and every preview/branch alias. */
export function isPagesDevHost(host: string): boolean {
  const h = host.toLowerCase().replace(/:\d+$/, "");
  return h === "pages.dev" || h.endsWith(".pages.dev");
}

/**
 * Only real documents get a 301. Build assets (`/_next/*`) and files with an
 * extension (`.js`, `.txt`, `.json`, `.mdx`) have no counterpart on the
 * Helpway docs, so they keep being served, with `X-Robots-Tag: noindex`.
 */
export function isDocumentPath(pathname: string): boolean {
  if (pathname.startsWith("/_next/")) return false;
  const last = pathname.split("/").pop() ?? "";
  return !last.includes(".");
}

export type HostDecision =
  | { action: "pass" }
  | { action: "noindex" }
  | { action: "redirect"; location: string };

/**
 * - non-pages.dev host           -> pass (custom domains are not ours to judge)
 * - production alias + document  -> 301 to the canonical docs URL
 * - any other pages.dev response -> serve, with `X-Robots-Tag: noindex`
 *
 * Preview deployments (`<hash>.better-i18n-docs.pages.dev`) are never
 * redirected: people open them to check a build before it ships.
 */
export function decideForHost(url: URL): HostDecision {
  if (!isPagesDevHost(url.host)) return { action: "pass" };
  if (url.hostname.toLowerCase() === PAGES_PRODUCTION_HOST && isDocumentPath(url.pathname)) {
    return { action: "redirect", location: canonicalDocsUrl(url.pathname) + url.search };
  }
  return { action: "noindex" };
}
