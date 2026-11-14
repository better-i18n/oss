/**
 * Trailing-slash rules shared by the root locale redirect (__root.tsx) and the
 * worker (worker-entry.ts). Pure, no runtime imports beyond the locale list.
 *
 * Every page lives at a trailing-slash URL (router `trailingSlash: "always"`).
 * Two hops used to get there (SEO audit 2026-11-13, fix F7):
 *   http://better-i18n.com/ → 301 → https://…/ → 302 → /en → 307 → /en/
 * The 302 is the personalised locale pick and stays a 302. The 307 was
 * TanStack adding the slash, as a TEMPORARY redirect on a permanent rule.
 * Now the 302 lands on `/en/` directly, and a slash-less locale URL gets one
 * permanent 308 at the edge before SSR is even started.
 */

import { SUPPORTED_LOCALES } from "../seo/locale-tiers";

const LOCALES: ReadonlySet<string> = new Set(SUPPORTED_LOCALES);

/** A path whose last segment looks like a file (`/llms.txt`, `/og.png`). */
function looksLikeFile(pathname: string): boolean {
  const last = pathname.split("/").pop() ?? "";
  return last.includes(".");
}

/** `/en` → `/en/`, `/pricing` → `/pricing/`; files and `/x/` unchanged. */
export function withTrailingSlash(pathname: string): string {
  if (pathname.endsWith("/") || looksLikeFile(pathname)) return pathname;
  return `${pathname}/`;
}

/**
 * The 308 target for a slash-less page URL under a served locale
 * (`/en`, `/de/pricing`), or `null` when the request should pass through:
 * already slashed, a file, or not under a locale (API routes, `/_serverFn`,
 * `/.well-known` … all start with something else).
 */
export function localeTrailingSlashRedirect(pathname: string): string | null {
  if (pathname.endsWith("/") || looksLikeFile(pathname)) return null;
  const first = pathname.split("/")[1] ?? "";
  if (!LOCALES.has(first)) return null;
  return `${pathname}/`;
}
