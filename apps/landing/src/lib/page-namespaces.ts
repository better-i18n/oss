/**
 * URL → namespace mapping for selective i18n message loading.
 *
 * Instead of serializing ALL translation namespaces into every page's HTML,
 * only the namespaces that the page actually uses are included.
 * This dramatically reduces the HTML payload (from ~40KB to ~3-5KB per page).
 *
 * When a page is not found in the map, ALL namespaces are returned as a safe fallback.
 */

/** CDN message format: top-level keys are namespaces, values are nested key-value maps. */
type Messages = Record<string, Record<string, unknown>>;

// ─── Shared namespaces (included on every page) ─────────────────────

/**
 * Namespaces required by layout components (Header, Footer, MarketingLayout)
 * and SEO utilities (getPageHead, breadcrumbs).
 */
const SHARED_NAMESPACES = [
  "common",
  "header",
  "footer",
  "meta",
  "breadcrumbs",
] as const;

// ─── Page-specific namespace map ────────────────────────────────────

/**
 * Maps URL path patterns (without locale prefix) to the extra namespaces
 * that page needs beyond SHARED_NAMESPACES.
 *
 * Pattern matching order:
 * 1. Exact match (e.g., "pricing")
 * 2. Prefix match (e.g., "i18n/" matches "i18n/react", "i18n/nextjs", etc.)
 *
 * To add a new page: add its path and the namespaces its components use via useT().
 */
const PAGE_NAMESPACE_MAP: ReadonlyMap<string, readonly string[]> = new Map([
  // ─── Homepage ───────────────────────────────────────────────
  [
    "",
    [
      "hero",
      "features",
      "pricing",
      "testimonials",
      "alternatives",
      "frameworkSupport",
      "userSegments",
      "segments",
      "metrics",
      "industryStats",
      "changelog",
      "developerFeatures",
      "integrations",
      "cta",
      "relatedPages",
    ],
  ],

  // ─── Core pages ─────────────────────────────────────────────
  ["pricing", ["pricing", "pricingPage", "relatedPages"]],
  ["features", ["featuresPage", "relatedPages"]],
  ["integrations", ["integrationsPage", "integrations", "relatedPages"]],
  ["about", ["aboutPage", "relatedPages"]],
  ["careers", ["careersPage", "relatedPages"]],
  ["status", ["statusPage"]],
  ["changelog", ["changelogPage", "changelog"]],

  // ─── Legal ──────────────────────────────────────────────────
  ["privacy", ["legal"]],
  ["terms", ["legal"]],

  // ─── Persona pages (/for-*) ─────────────────────────────────
  ["for-developers", ["developers", "relatedPages", "cta"]],
  ["for-translators", ["translators", "relatedPages", "cta"]],
  ["for-product-teams", ["product-teams", "relatedPages", "cta"]],

  // ─── Educational pages ──────────────────────────────────────
  ["what-is", ["marketing", "relatedPages"]],
  ["what-is-internationalization", ["marketing", "relatedPages"]],
  ["what-is-localization", ["marketing", "relatedPages"]],
]);

/**
 * Prefix-based namespace mapping for route groups.
 * Matched when no exact match is found.
 */
const PREFIX_NAMESPACE_MAP: ReadonlyMap<string, readonly string[]> = new Map([
  // All /i18n/* pages use the "marketing" namespace
  ["i18n/", ["marketing", "relatedPages"]],

  // All /compare/* pages use "marketing" + "alternatives"
  ["compare/", ["marketing", "alternatives", "relatedPages"]],

  // CMS-driven persona pages (/for-agencies, /for-saas, etc.)
  ["for-", ["persona", "cta"]],

  // Blog pages
  ["blog/", ["blog", "relatedPages"]],
  ["blog", ["blog", "relatedPages"]],

  // Feature detail pages
  ["features/", ["featuresPage", "relatedPages"]],
]);

// ─── Public API ─────────────────────────────────────────────────────

/**
 * Extract the page path from a full pathname by stripping the locale prefix.
 *
 * @example
 * extractPagePath("/en/pricing/")  → "pricing"
 * extractPagePath("/tr/i18n/react/") → "i18n/react"
 * extractPagePath("/en/") → ""
 */
export function extractPagePath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  // First segment is always the locale — skip it
  return segments.slice(1).join("/");
}

/**
 * Get the list of namespace keys needed for a given page path.
 * Returns null when no mapping is found (meaning: don't filter, use all).
 */
export function getNamespacesForPage(pagePath: string): readonly string[] | null {
  // 1. Exact match
  const exact = PAGE_NAMESPACE_MAP.get(pagePath);
  if (exact) {
    return [...SHARED_NAMESPACES, ...exact];
  }

  // 2. Prefix match
  for (const [prefix, namespaces] of PREFIX_NAMESPACE_MAP) {
    if (pagePath.startsWith(prefix) || pagePath === prefix.replace(/\/$/, "")) {
      return [...SHARED_NAMESPACES, ...namespaces];
    }
  }

  // 3. No match — return null to signal "keep all namespaces"
  return null;
}

/**
 * Filter a messages object to only include the specified top-level namespace keys.
 * Returns a new object (immutable).
 */
export function filterMessages(
  messages: Messages,
  namespaces: readonly string[],
): Messages {
  const namespaceSet = new Set(namespaces);
  const filtered: Record<string, Record<string, unknown>> = {};

  for (const key of Object.keys(messages)) {
    if (namespaceSet.has(key)) {
      filtered[key] = messages[key];
    }
  }

  return filtered;
}

/**
 * Filter messages based on the current URL pathname.
 * If no namespace mapping exists for the page, returns all messages unchanged.
 */
export function filterMessagesByPath(
  messages: Messages,
  pathname: string,
): Messages {
  const pagePath = extractPagePath(pathname);
  const namespaces = getNamespacesForPage(pagePath);

  if (!namespaces) {
    // No mapping found — safe fallback: return everything
    return messages;
  }

  return filterMessages(messages, namespaces);
}
