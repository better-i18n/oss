/** Hreflang tag generation and validation utilities. */

export interface HreflangTag {
  readonly locale: string;
  readonly url: string;
}

export type HreflangWarningType =
  | "missing-self-ref"
  | "missing-x-default"
  | "invalid-locale"
  | "duplicate";

export interface HreflangValidationWarning {
  readonly type: HreflangWarningType;
  readonly message: string;
}

/** BCP 47 locale code pattern: language[-script][-region] */
const LOCALE_CODE_RE = /^[a-z]{2,3}(?:-[A-Za-z]{4})?(?:-[A-Z]{2}|\d{3})?(?:-[a-zA-Z0-9]+)*$/;

/**
 * Normalise a base URL by stripping a trailing slash.
 * The per-locale URLs will always end with `/`.
 */
function normaliseBase(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "");
}

/** Build a locale URL: `{base}/{locale}/` */
function buildLocaleUrl(base: string, locale: string): string {
  return `${base}/${locale}/`;
}

/** Resolve the x-default locale: explicit value, or the first locale. */
function resolveXDefault(
  locales: readonly string[],
  xDefault?: string,
): string | undefined {
  if (locales.length === 0) return undefined;
  if (xDefault && locales.includes(xDefault)) return xDefault;
  return locales[0];
}

/**
 * Generate HTML `<link>` hreflang tags.
 *
 * Returns a multi-line string of `<link rel="alternate" …>` elements,
 * one per locale plus an `x-default` entry.
 *
 * @example
 * generateHreflangHtml("https://example.com", ["en", "fr", "de"])
 * // →
 * // <link rel="alternate" hreflang="en" href="https://example.com/en/" />
 * // <link rel="alternate" hreflang="fr" href="https://example.com/fr/" />
 * // <link rel="alternate" hreflang="de" href="https://example.com/de/" />
 * // <link rel="alternate" hreflang="x-default" href="https://example.com/en/" />
 */
export function generateHreflangHtml(
  baseUrl: string,
  locales: readonly string[],
  xDefault?: string,
): string {
  if (locales.length === 0) return "";

  const base = normaliseBase(baseUrl);
  const xDefaultLocale = resolveXDefault(locales, xDefault);

  const localeTags = locales.map(
    (locale) =>
      `<link rel="alternate" hreflang="${locale}" href="${buildLocaleUrl(base, locale)}" />`,
  );

  const xDefaultTag = xDefaultLocale
    ? `<link rel="alternate" hreflang="x-default" href="${buildLocaleUrl(base, xDefaultLocale)}" />`
    : "";

  const lines = xDefaultLocale
    ? [...localeTags, xDefaultTag]
    : localeTags;

  return lines.join("\n");
}

/**
 * Generate XML sitemap hreflang entries (xhtml:link elements).
 *
 * Returns the entries wrapped in a `<url>` block, ready to be embedded
 * in a `<urlset xmlns:xhtml="…">` sitemap document.
 *
 * @example
 * generateHreflangSitemap("https://example.com", ["en", "fr"])
 * // →
 * // <url>
 * //   <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/" />
 * //   <xhtml:link rel="alternate" hreflang="fr" href="https://example.com/fr/" />
 * //   <xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/en/" />
 * // </url>
 */
export function generateHreflangSitemap(
  baseUrl: string,
  locales: readonly string[],
  xDefault?: string,
): string {
  if (locales.length === 0) return "";

  const base = normaliseBase(baseUrl);
  const xDefaultLocale = resolveXDefault(locales, xDefault);

  const localeTags = locales.map(
    (locale) =>
      `  <xhtml:link rel="alternate" hreflang="${locale}" href="${buildLocaleUrl(base, locale)}" />`,
  );

  const xDefaultTag = xDefaultLocale
    ? `  <xhtml:link rel="alternate" hreflang="x-default" href="${buildLocaleUrl(base, xDefaultLocale)}" />`
    : "";

  const inner = xDefaultLocale
    ? [...localeTags, xDefaultTag]
    : localeTags;

  return `<url>\n${inner.join("\n")}\n</url>`;
}

/**
 * Generate HTTP `Link` header format hreflang values.
 *
 * Returns a comma-separated multi-line string suitable for the
 * `Link:` response header.
 *
 * @example
 * generateHreflangHeaders("https://example.com", ["en", "fr"])
 * // →
 * // <https://example.com/en/>; rel="alternate"; hreflang="en",
 * // <https://example.com/fr/>; rel="alternate"; hreflang="fr",
 * // <https://example.com/en/>; rel="alternate"; hreflang="x-default"
 */
export function generateHreflangHeaders(
  baseUrl: string,
  locales: readonly string[],
  xDefault?: string,
): string {
  if (locales.length === 0) return "";

  const base = normaliseBase(baseUrl);
  const xDefaultLocale = resolveXDefault(locales, xDefault);

  const localeParts = locales.map(
    (locale) =>
      `<${buildLocaleUrl(base, locale)}>; rel="alternate"; hreflang="${locale}"`,
  );

  const xDefaultPart = xDefaultLocale
    ? `<${buildLocaleUrl(base, xDefaultLocale)}>; rel="alternate"; hreflang="x-default"`
    : "";

  const allParts = xDefaultLocale
    ? [...localeParts, xDefaultPart]
    : localeParts;

  return allParts.join(",\n");
}

/**
 * Validate a hreflang configuration and return any warnings.
 *
 * Checks for:
 * - Duplicate locale codes
 * - Invalid BCP 47 locale codes
 * - Missing x-default entry (when locales are present)
 * - Missing self-referencing (when xDefault is set but not in the locale list)
 */
export function validateHreflang(
  locales: readonly string[],
  xDefault?: string,
): readonly HreflangValidationWarning[] {
  const warnings: HreflangValidationWarning[] = [];

  if (locales.length === 0) return warnings;

  // Check for duplicates
  const seen = new Set<string>();
  for (const locale of locales) {
    if (seen.has(locale)) {
      warnings.push({
        type: "duplicate",
        message: `Locale "${locale}" appears more than once. Each locale must be unique.`,
      });
    }
    seen.add(locale);
  }

  // Check for invalid locale codes
  for (const locale of locales) {
    if (!LOCALE_CODE_RE.test(locale)) {
      warnings.push({
        type: "invalid-locale",
        message: `"${locale}" does not look like a valid BCP 47 locale code (e.g. "en", "en-US", "zh-Hant-TW").`,
      });
    }
  }

  // Check for missing x-default
  if (!xDefault) {
    warnings.push({
      type: "missing-x-default",
      message:
        "No x-default locale is set. Google recommends an x-default tag to handle unmatched regions.",
    });
  }

  // Check that x-default locale is included in the list (self-referencing)
  if (xDefault && !locales.includes(xDefault)) {
    warnings.push({
      type: "missing-self-ref",
      message: `x-default locale "${xDefault}" is not in the locales list. The x-default URL should also appear as a regular hreflang tag.`,
    });
  }

  return warnings;
}
