/**
 * URL → namespace mapping for selective i18n message loading.
 *
 * Instead of serializing ALL translation namespaces into every page's HTML,
 * only the namespaces that the page actually uses are included.
 *
 * Supports two levels of filtering:
 * 1. Top-level namespace filtering (e.g., "pricing" keeps only messages.pricing)
 * 2. Sub-path filtering with dot notation (e.g., "marketing.i18n.react" keeps
 *    only messages.marketing.i18n.react, discarding the rest of marketing)
 *
 * When a page is not found in the map, ALL namespaces are returned as a safe fallback.
 */

/** CDN message format: top-level keys are namespaces, values are nested key-value maps. */
type Messages = Record<string, Record<string, unknown>>;

// ─── Shared namespaces (included on every page) ─────────────────────

const SHARED_NAMESPACES = [
  "common",
  "header",
  "footer",
  "breadcrumbs",
] as const;

// ─── Types ──────────────────────────────────────────────────────────

/**
 * A namespace specifier can be:
 * - "pricing"              → include full messages.pricing
 * - "marketing.i18n.react" → include only messages.marketing.i18n.react
 *                            (rebuilds marketing with only the i18n.react subtree)
 */
type NamespaceSpec = string;

interface PageConfig {
  readonly namespaces: readonly NamespaceSpec[];
}

// ─── Page-specific namespace map ────────────────────────────────────

/**
 * useT("marketing.i18n.react") → accesses messages.marketing.i18n.react.*
 * So we need to keep marketing.i18n.react subtree plus marketing top-level
 * shared keys (titles, descriptions used across pages).
 *
 * "marketing.i18n.react" means: rebuild { marketing: { i18n: { react: {...} } } }
 * "marketing.compare"    means: rebuild { marketing: { compare: {...} } }
 */

const PAGE_NAMESPACE_MAP: ReadonlyMap<string, PageConfig> = new Map([
  // ─── Homepage ───────────────────────────────────────────────
  [
    "",
    {
      namespaces: [
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
    },
  ],

  // ─── Core pages ─────────────────────────────────────────────
  ["pricing", { namespaces: ["pricing", "pricingPage", "relatedPages"] }],
  ["features", { namespaces: ["featuresPage", "relatedPages"] }],
  ["integrations", { namespaces: ["integrationsPage", "integrations", "relatedPages"] }],
  ["about", { namespaces: ["aboutPage", "relatedPages"] }],
  ["careers", { namespaces: ["careersPage", "relatedPages"] }],
  ["status", { namespaces: ["statusPage"] }],
  ["changelog", { namespaces: ["changelogPage", "changelog"] }],

  // ─── Legal ──────────────────────────────────────────────────
  ["privacy", { namespaces: ["legal"] }],
  ["terms", { namespaces: ["legal"] }],

  // ─── Persona pages (hardcoded routes) ─────────────────────────
  ["for-developers", { namespaces: ["developers", "relatedPages", "cta"] }],
  ["for-translators", { namespaces: ["translators", "relatedPages", "cta"] }],
  ["for-product-teams", { namespaces: ["product-teams", "relatedPages", "cta"] }],

  // ─── Educational pages ──────────────────────────────────────
  ["what-is", { namespaces: ["marketing.whatIsPage", "relatedPages"] }],
  ["what-is-internationalization", { namespaces: ["marketing.whatIsInternationalization", "relatedPages"] }],
  ["what-is-localization", { namespaces: ["marketing.whatIsLocalization", "relatedPages"] }],

  // ─── i18n hub ────────────────────────────────────────────────
  ["i18n", { namespaces: ["marketing.i18n", "relatedPages"] }],

  // ─── Compare hub ─────────────────────────────────────────────
  ["compare", { namespaces: ["marketing.compare", "alternatives", "relatedPages"] }],
]);

/**
 * Dynamic page config resolver for route groups.
 * Returns a config based on the page path, or null if no match.
 *
 * Sub-namespace specs (e.g., "marketing.i18n.react") automatically include
 * parent scalar keys via mergeShallowAtPath — no need to add "marketing.i18n"
 * separately.
 */
function resolveDynamicConfig(pagePath: string): PageConfig | null {
  // /i18n/{subpage} → marketing.i18n.{subpage}
  if (pagePath.startsWith("i18n/")) {
    const subpage = pagePath.slice(5);
    const camelSubpage = kebabToCamel(subpage);
    return {
      namespaces: [
        `marketing.i18n.${camelSubpage}`,
        "relatedPages",
      ],
    };
  }

  // /compare/{competitor} → marketing.compare.{competitor}
  if (pagePath.startsWith("compare/")) {
    const competitor = pagePath.slice(8);
    const camelCompetitor = kebabToCamel(competitor);
    return {
      namespaces: [
        `marketing.compare.${camelCompetitor}`,
        "alternatives",
        "relatedPages",
      ],
    };
  }

  // /for-{role} (CMS-driven persona pages)
  if (pagePath.startsWith("for-")) {
    return { namespaces: ["persona", "cta"] };
  }

  // /blog/*
  if (pagePath.startsWith("blog")) {
    return { namespaces: ["blog", "relatedPages"] };
  }

  // /features/{slug}
  if (pagePath.startsWith("features/")) {
    return { namespaces: ["featuresPage", "relatedPages"] };
  }

  return null;
}

// ─── Helpers ────────────────────────────────────────────────────────

/**
 * Convert kebab-case to camelCase.
 * "best-tms" → "bestTms", "cli-code-scanning" → "cliCodeScanning"
 */
function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

/**
 * Get a nested value from an object using a dot-path.
 * "i18n.react" on { i18n: { react: {...} } } → {...}
 */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

/**
 * Set a nested value in an object using a dot-path, creating intermediate objects.
 * Mutates the target (used only on fresh objects we own).
 */
function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
  const keys = path.split(".");
  let current: Record<string, unknown> = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== "object") {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  current[keys[keys.length - 1]] = value;
}

/**
 * Merge a source object's keys shallowly into a target at a given path.
 * Only copies keys that don't already exist in target (non-destructive).
 * Used for including shared sibling keys from a parent namespace.
 *
 * Example: merging "marketing.i18n" shared keys (title, description)
 * alongside the specific "marketing.i18n.react" subtree.
 */
function mergeShallowAtPath(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
  path: string,
): void {
  const sourceValue = getNestedValue(source, path);
  if (!sourceValue || typeof sourceValue !== "object") return;

  // Ensure path exists in target
  const keys = path.split(".");
  let current: Record<string, unknown> = target;
  for (const key of keys) {
    if (!current[key] || typeof current[key] !== "object") {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }

  // Copy only scalar values (strings, numbers) — not sub-objects.
  // Sub-objects are other page namespaces we want to exclude.
  for (const [key, value] of Object.entries(sourceValue as Record<string, unknown>)) {
    if (!(key in current) && typeof value === "string") {
      current[key] = value;
    }
  }
}

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
  return segments.slice(1).join("/");
}

/**
 * Get the page config for a given page path.
 * Returns null when no mapping is found (meaning: don't filter, use all).
 */
function getPageConfig(pagePath: string): PageConfig | null {
  // 1. Exact match
  const exact = PAGE_NAMESPACE_MAP.get(pagePath);
  if (exact) return exact;

  // 2. Dynamic resolution (prefix-based with smart sub-namespace)
  return resolveDynamicConfig(pagePath);
}

/**
 * Get the list of namespace keys needed for a given page path.
 * Returns null when no mapping is found (meaning: don't filter, use all).
 */
export function getNamespacesForPage(pagePath: string): readonly string[] | null {
  const config = getPageConfig(pagePath);
  if (!config) return null;
  return [...SHARED_NAMESPACES, ...config.namespaces];
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

// ─── URL → pageKey mapping ──────────────────────────────────────────

/**
 * Maps URL page paths to their `getPageHead({ pageKey })` values.
 * Used to filter the `meta` namespace to only include the current page's meta.
 *
 * Pages not in this map get the full `meta` namespace as fallback.
 */
const PAGE_KEY_MAP: ReadonlyMap<string, string> = new Map([
  ["", "home"],
  ["pricing", "pricing"],
  ["features", "features"],
  ["integrations", "integrations"],
  ["about", "about"],
  ["careers", "careers"],
  ["status", "status"],
  ["changelog", "changelog"],
  ["privacy", "privacy"],
  ["terms", "terms"],
  ["for-developers", "forDevelopers"],
  ["for-translators", "forTranslators"],
  ["for-product-teams", "forProductTeams"],
  ["what-is", "whatIs"],
  ["what-is-internationalization", "whatIsInternationalization"],
  ["what-is-localization", "whatIsLocalization"],
  ["i18n", "i18n"],
  ["compare", "compare"],
]);

/**
 * Resolve the pageKey for dynamic routes.
 */
function resolvePageKey(pagePath: string): string | null {
  const exact = PAGE_KEY_MAP.get(pagePath);
  if (exact) return exact;

  // /i18n/{subpage} → "i18n" + camelCase(subpage)
  if (pagePath.startsWith("i18n/")) {
    const subpage = pagePath.slice(5);
    return `i18n${subpage.charAt(0).toUpperCase()}${kebabToCamel(subpage).slice(1)}`;
  }

  // /compare/{competitor} → "compare" + PascalCase(competitor)
  if (pagePath.startsWith("compare/")) {
    const competitor = pagePath.slice(8);
    const camel = kebabToCamel(competitor);
    return `compare${camel.charAt(0).toUpperCase()}${camel.slice(1)}`;
  }

  // /for-{role} → "for" + PascalCase(role)
  if (pagePath.startsWith("for-")) {
    const role = pagePath.slice(4);
    const camel = kebabToCamel(role);
    return `for${camel.charAt(0).toUpperCase()}${camel.slice(1)}`;
  }

  // /blog/* → "blog"
  if (pagePath.startsWith("blog")) return "blog";

  // /features/{slug} → "features"
  if (pagePath.startsWith("features/")) return "features";

  return null;
}

/**
 * Filter messages based on the current URL pathname.
 * Supports both top-level filtering and sub-namespace filtering.
 *
 * Also automatically filters the `meta` namespace to only include
 * the current page's meta keys (title, description, ogTitle, etc.)
 * instead of ALL pages' meta.
 */
export function filterMessagesByPath(
  messages: Messages,
  pathname: string,
): Messages {
  const pagePath = extractPagePath(pathname);
  const config = getPageConfig(pagePath);

  if (!config) return messages;

  const allSpecs = [...SHARED_NAMESPACES, ...config.namespaces];
  const filtered: Record<string, Record<string, unknown>> = {};

  // Group specs: top-level vs dot-path
  const topLevel: string[] = [];
  const dotPaths: string[] = [];

  for (const spec of allSpecs) {
    if (spec.includes(".")) {
      dotPaths.push(spec);
    } else {
      topLevel.push(spec);
    }
  }

  // 1. Copy top-level namespaces directly
  const topLevelSet = new Set(topLevel);
  for (const key of Object.keys(messages)) {
    if (topLevelSet.has(key)) {
      filtered[key] = messages[key];
    }
  }

  // 2. Handle dot-path specs — extract subtrees and rebuild
  for (const dotPath of dotPaths) {
    const rootKey = dotPath.split(".")[0];
    const subPath = dotPath.slice(rootKey.length + 1); // e.g., "i18n.react"
    const sourceNs = messages[rootKey];

    if (!sourceNs) continue;

    const value = getNestedValue(sourceNs, subPath);
    if (value === undefined) continue;

    // Ensure root key exists in filtered
    if (!filtered[rootKey]) {
      filtered[rootKey] = {};
    }

    // Set the subtree
    setNestedValue(filtered[rootKey] as Record<string, unknown>, subPath, value);

    // Also merge shallow scalar keys from parent path for shared labels.
    // e.g., for "marketing.i18n.react", also include marketing.i18n.{scalarKeys}
    const parentPath = subPath.includes(".")
      ? subPath.slice(0, subPath.lastIndexOf("."))
      : null;
    if (parentPath) {
      mergeShallowAtPath(
        filtered[rootKey] as Record<string, unknown>,
        sourceNs,
        parentPath,
      );
    }
  }

  // 3. Filter `meta` namespace — only include this page's meta keys
  const metaNs = messages["meta"];
  if (metaNs) {
    const pageKey = resolvePageKey(pagePath);
    if (pageKey && metaNs[pageKey]) {
      filtered["meta"] = { [pageKey]: metaNs[pageKey] };
    } else {
      // Unknown page — include full meta as fallback
      filtered["meta"] = metaNs;
    }
  }

  return filtered;
}
