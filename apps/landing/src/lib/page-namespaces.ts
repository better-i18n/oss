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

/**
 * The same messages, described so TanStack Router accepts them as loader data.
 *
 * Router validates loader return values against a structural serializable
 * constraint whose leaves are `{}` — and `unknown` is NOT assignable to `{}`, so
 * every route whose loader returned `Messages` reported TS2322 on its `loader`
 * property (93 occurrences before this was named, `__root.tsx` included).
 *
 * `NonNullable<unknown>` (i.e. `{}`) is both accurate and sufficient: these
 * values come from `JSON.parse` of the CDN payload, so a leaf is a string, a
 * number, a boolean, an array or a nested object — never null or undefined.
 * Narrowing to `string` would have been a lie for grouped/nested keys.
 */
export type SerializableMessages = Record<string, Record<string, NonNullable<unknown>>>;

// ─── Shared namespaces (included on every page) ─────────────────────

const SHARED_NAMESPACES = [
  "common",
  "header",
  "footer",
  "breadcrumbs",
  "cookieBanner",
  "cta",
  "meta",
  // Back-to-hub breadcrumb labels (<BackToHub />) appear on every framework and
  // comparison page. Without it here the component resolves to empty strings —
  // which is exactly what happened once its inline fallbacks were removed.
  "navigation",
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
        "demo",
      ],
    },
  ],

  // ─── Core pages ─────────────────────────────────────────────
  // `compare` travels with `/pricing` because <PricingComparison /> renders the
  // shared <SupportMark>, whose accessible names are the `compare.marks.*` keys
  // every comparison table uses. Without it `useT` humanises them and a screen
  // reader hears "Yes" / "No" in English on all 22 locales instead of the
  // translated "Supported" / "Not available".
  //
  // `compare.marks` is a sub-path SPEC, not a CDN address: getCdnNamespacesForPage
  // takes `spec.split(".")[0]` and fetches `compare.json`, while the filter keeps
  // only the `marks` subtree. So the page pays for one file it already needs and
  // ships three strings instead of the whole namespace.
  [
    "pricing",
    {
      namespaces: ["pricing", "pricingPage", "relatedPages", "compare.marks"],
    },
  ],
  ["features", { namespaces: ["featuresPage", "relatedPages"] }],
  [
    "integrations",
    { namespaces: ["integrationsPage", "integrations", "relatedPages"] },
  ],
  // `/about` argues from the same competitor evidence the home page shows —
  // <CompetitorLandscape /> reads the `alternatives` namespace, so that subtree
  // travels with the page (rule/client-messages-must-cover-every-key-the-page-
  // renders). `cta` is already in SHARED_NAMESPACES, which is where the
  // customer-proof label comes from.
  // `testimonials` travels with it too: <PageTestimonial /> renders quote 2 as
  // the proof for the positioning claim, and without the subtree `useT`
  // humanizes it to "Quote" on screen.
  [
    "about",
    { namespaces: ["aboutPage", "alternatives", "testimonials", "relatedPages"] },
  ],
  ["careers", { namespaces: ["careersPage", "relatedPages"] }],
  ["status", { namespaces: ["statusPage"] }],
  // <RelatedPages /> renders in MarketingLayout on the changelog index, so the
  // `relatedPages` namespace has to travel with it — without it the section
  // heading resolved to nothing.
  ["changelog", { namespaces: ["changelogPage", "changelog", "relatedPages"] }],

  // ─── Legal ──────────────────────────────────────────────────
  /* The three legal documents now read everything from `legal`
     (`legal.privacy.*`, `legal.terms.*`, `legal.cookies.*`) — their 313 strings
     used to live in the page files as `defaultValue`, so the per-page namespaces
     held only a handful of keys and are no longer read at all. */
  ["privacy", { namespaces: ["legal"] }],
  ["terms", { namespaces: ["legal"] }],
  ["cookies", { namespaces: ["legal"] }],

  // ─── Persona pages (hardcoded routes) ─────────────────────────
  ["for-developers", { namespaces: ["developers", "relatedPages", "cta"] }],
  ["for-translators", { namespaces: ["translators", "relatedPages", "cta"] }],
  [
    "for-product-teams",
    { namespaces: ["product-teams", "relatedPages", "cta"] },
  ],

  // ─── Educational pages ──────────────────────────────────────
  // `testimonials` — the page closes with <PageTestimonial />.
  [
    "what-is",
    {
      namespaces: [
        "marketing.whatIsPage",
        // Sibling subtree — the <FlowHero /> card copy. Named explicitly or the
        // whatIsPage filter drops it.
        "marketing.flowHero",
        // The page closes with <PageTestimonial />.
        "testimonials",
        "relatedPages",
      ],
    },
  ],
  // Both /what-is-* pages close with the shared "Related topics" link set, which
  // reads marketing.whatIs.links.* plus the scalar marketing.whatIs.relatedTopics.
  // That subtree is a SIBLING of whatIsInternationalization / whatIsLocalization,
  // so it is not pulled in by the page's own spec — it needs its own entry, the
  // same way resolveDynamicConfig already adds it for every /i18n/* page.
  [
    "what-is-internationalization",
    {
      namespaces: [
        "marketing.whatIsInternationalization",
        "marketing.whatIs.links",
        "relatedPages",
      ],
    },
  ],
  [
    "what-is-localization",
    {
      namespaces: [
        "marketing.whatIsLocalization",
        "marketing.whatIs.links",
        "relatedPages",
      ],
    },
  ],

  // ─── i18n hub (only index-level keys, NOT all sub-page content) ──
  ["i18n", { namespaces: ["marketing.i18n.index", "relatedPages"] }],

  // Slug↔key exception: resolveDynamicConfig would derive
  // "marketing.i18n.localizationVsInternationalization" from the URL, but the
  // keys were authored under the shorter `l10nVsI18n` and are already translated
  // into every locale. An exact-match entry wins over the dynamic resolver, so
  // the page reads the real subtree instead of an empty one.
  [
    "i18n/localization-vs-internationalization",
    {
      namespaces: [
        "marketing.i18n.l10nVsI18n",
        "marketing.i18n.relatedLinks",
        "marketing.whatIs.links",
        "relatedPages",
      ],
    },
  ],

  // ─── Compare hub (only index-level keys) ────────────────────────
  // `compare` (featureColumn, vsLabel) is the <ComparisonTable /> chrome — it is
  // a top-level CDN namespace, distinct from the marketing.compare.* page copy.
  [
    "compare",
    {
      namespaces: [
        "marketing.compare.index",
        "compare",
        "alternatives",
        "relatedPages",
      ],
    },
  ],

  // ─── Tools hub (no custom namespaces — UI is hardcoded English) ──
  // The hub's own section labels live under `tools.hub.*`; before that this
  // route loaded no namespace at all because every string was an English
  // literal (rule/client-messages-must-cover-every-key-the-page-renders).
  ["tools", { namespaces: ["tools"] }],
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
  // /i18n/{subpage} → marketing.i18n.{subpage} + shared related link keys
  if (pagePath.startsWith("i18n/")) {
    const subpage = pagePath.slice(5);
    const camelSubpage = kebabToCamel(subpage);
    return {
      namespaces: [
        `marketing.i18n.${camelSubpage}`,
        "marketing.i18n.relatedLinks",
        "marketing.whatIs.links",
        // Pillar pages mount <FlowHero /> and <PageTestimonial />; both read
        // subtrees that sit OUTSIDE marketing.i18n.*, so the filter drops them
        // unless they are named here.
        "marketing.flowHero",
        "testimonials",
        // <SeeAlso /> closes several guide pages and reads its own top-level
        // namespace — without this it rendered "Eyebrow" / "Heading".
        "seeAlso",
        // Framework guides embed <ComparisonTable />, whose column chrome
        // (featureColumn, vsLabel) lives in the top-level `compare` namespace —
        // not under marketing.compare.*.
        "compare",
        "relatedPages",
      ],
    };
  }

  // /compare/{competitor} → marketing.compare.{competitor} + shared compare keys
  // mergeShallowAtPath copies scalar keys (featureLabel, otherComparisons) from
  // the parent "compare" level, but shared nested objects (complaints, whySwitch)
  // are skipped. Add them explicitly as dot-path specs.
  if (pagePath.startsWith("compare/")) {
    const competitor = pagePath.slice(8);
    const camelCompetitor = kebabToCamel(competitor);
    return {
      namespaces: [
        `marketing.compare.${camelCompetitor}`,
        "marketing.compare.complaints",
        "marketing.compare.whySwitch",
        // <ComparisonTable /> chrome lives in its own top-level namespace.
        "compare",
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

  // /tools/{tool} — tool pages use hardcoded strings, no custom namespaces needed
  if (pagePath.startsWith("tools/")) {
    return { namespaces: [] };
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
    if (
      current === null ||
      current === undefined ||
      typeof current !== "object"
    ) {
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
function setNestedValue(
  obj: Record<string, unknown>,
  path: string,
  value: unknown,
): void {
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
  for (const [key, value] of Object.entries(
    sourceValue as Record<string, unknown>,
  )) {
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
export function getNamespacesForPage(
  pagePath: string,
): readonly string[] | null {
  const config = getPageConfig(pagePath);
  if (!config) return null;
  return [...SHARED_NAMESPACES, ...config.namespaces];
}

/**
 * Get the list of CDN namespace file names needed for a given page path.
 * Unlike `getNamespacesForPage`, this resolves dot-path specs (e.g., "marketing.compare.crowdin")
 * to their root CDN namespace ("marketing"), since CDN stores one file per top-level namespace.
 * Returns deduplicated list. Returns null when no mapping is found.
 */
export function getCdnNamespacesForPage(
  pagePath: string,
): string[] | null {
  const specs = getNamespacesForPage(pagePath);
  if (!specs) return null;

  const cdnNamespaces = new Set<string>();
  for (const spec of specs) {
    // "marketing.compare.crowdin" → "marketing" (CDN file name)
    // "common" → "common" (already a CDN file name)
    cdnNamespaces.add(spec.split(".")[0]);
  }
  return [...cdnNamespaces];
}

/**
 * Filter a messages object to only include the specified top-level namespace keys.
 * Returns a new object (immutable).
 */
export function filterMessages(
  messages: Messages,
  namespaces: readonly string[],
): SerializableMessages {
  const namespaceSet = new Set(namespaces);
  const filtered: SerializableMessages = {};

  for (const key of Object.keys(messages)) {
    if (namespaceSet.has(key)) {
      filtered[key] = messages[key] as SerializableMessages[string];
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
  ["cookies", "cookies"],
  ["for-developers", "forDevelopers"],
  ["for-translators", "forTranslators"],
  ["for-product-teams", "forProductTeams"],
  ["what-is", "whatIs"],
  ["what-is-internationalization", "whatIsInternationalization"],
  ["what-is-localization", "whatIsLocalization"],
  ["i18n", "i18n"],
  ["compare", "compare"],
  ["tools", "tools"],
  ["for-agencies", "forAgencies"],
  ["for-enterprises", "forEnterprises"],
  ["for-startups", "forStartups"],
  ["for-ecommerce", "forEcommerce"],
  ["for-saas", "forSaas"],
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

  // /tools/{tool} → "tools" + PascalCase(tool)
  if (pagePath.startsWith("tools/")) {
    const tool = pagePath.slice(6);
    const camel = kebabToCamel(tool);
    return `tools${camel.charAt(0).toUpperCase()}${camel.slice(1)}`;
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
): SerializableMessages {
  const pagePath = extractPagePath(pathname);
  const config = getPageConfig(pagePath);

  // No page config: everything passes through untouched.
  if (!config) return messages as SerializableMessages;

  const allSpecs = [...SHARED_NAMESPACES, ...config.namespaces];
  const filtered: SerializableMessages = {};

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
      filtered[key] = messages[key] as SerializableMessages[string];
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
    setNestedValue(
      filtered[rootKey] as Record<string, unknown>,
      subPath,
      value,
    );

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
      filtered["meta"] = metaNs as SerializableMessages[string];
    }
  }

  return filtered;
}
