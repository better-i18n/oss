/**
 * Internal linking configuration for topical authority clusters.
 *
 * Each page maps to its related pages, organized by relationship type.
 * Used by blog posts, framework guides, and comparison pages to render
 * contextual internal links within body content.
 */

export interface RelatedPage {
  readonly path: string;
  readonly anchor: string;
  /** pillar = parent topic, cluster = sibling, funnel = commercial */
  readonly relationship: "pillar" | "cluster" | "funnel";
}

export type InternalLinkMap = ReadonlyMap<string, readonly RelatedPage[]>;

// Cluster 1: Translation & Localization Hub

const TRANSLATION_MEMBERS = [
  "i18n/translation-management-system",
  "i18n/localization-software",
  "i18n/website-localization",
  "i18n/localization-vs-internationalization",
] as const;

const TRANSLATION_ANCHORS: Readonly<Record<string, string>> = {
  "i18n/translation-management-system": "translation management systems",
  "i18n/localization-software": "localization software options",
  "i18n/website-localization": "website localization strategies",
  "i18n/localization-vs-internationalization": "localization vs internationalization",
};

function buildTranslationCluster(): ReadonlyArray<readonly [string, readonly RelatedPage[]]> {
  const pillar: RelatedPage = { path: "i18n/complete-guide", anchor: "complete i18n guide", relationship: "pillar" };
  return TRANSLATION_MEMBERS.map((member) => {
    const siblings = TRANSLATION_MEMBERS.filter((s) => s !== member).slice(0, 3)
      .map((s): RelatedPage => ({ path: s, anchor: TRANSLATION_ANCHORS[s] ?? s, relationship: "cluster" }));
    return [member, [pillar, ...siblings]] as const;
  });
}

// Cluster 2: Framework Guides

const FRAMEWORKS: ReadonlyArray<{
  readonly path: string; readonly anchor: string;
  readonly siblings: readonly string[]; readonly comparison?: string;
}> = [
  { path: "i18n/react", anchor: "React i18n setup", siblings: ["i18n/nextjs", "i18n/expo"], comparison: "i18n/react-intl" },
  { path: "i18n/nextjs", anchor: "Next.js localization", siblings: ["i18n/react", "i18n/server"], comparison: "i18n/react-intl" },
  { path: "i18n/vue", anchor: "Vue internationalization", siblings: ["i18n/nuxt", "i18n/angular"] },
  { path: "i18n/nuxt", anchor: "Nuxt i18n integration", siblings: ["i18n/vue", "i18n/svelte"] },
  { path: "i18n/angular", anchor: "Angular i18n support", siblings: ["i18n/vue", "i18n/svelte"] },
  { path: "i18n/flutter", anchor: "Flutter localization", siblings: ["i18n/android", "i18n/ios", "i18n/expo"] },
  { path: "i18n/expo", anchor: "Expo i18n workflow", siblings: ["i18n/react", "i18n/flutter", "i18n/react-native-localization"] },
];

const FRAMEWORK_ANCHOR_MAP: Readonly<Record<string, string>> = Object.fromEntries(
  FRAMEWORKS.map((e) => [e.path, e.anchor]),
);

function buildFrameworkCluster(): ReadonlyArray<readonly [string, readonly RelatedPage[]]> {
  const pillar: RelatedPage = { path: "i18n", anchor: "framework overview", relationship: "pillar" };
  return FRAMEWORKS.map((entry) => {
    const siblings = entry.siblings.map((s): RelatedPage => ({
      path: s, anchor: FRAMEWORK_ANCHOR_MAP[s] ?? s.replace("i18n/", "") + " guide", relationship: "cluster",
    }));
    const extra: readonly RelatedPage[] = entry.comparison
      ? [{ path: entry.comparison, anchor: "library comparison", relationship: "cluster" as const }]
      : [];
    return [entry.path, [pillar, ...siblings, ...extra]] as const;
  });
}

// Cluster 3: Comparison Hub

const COMPARISONS = ["compare/crowdin", "compare/lokalise", "compare/phrase", "compare/transifex", "compare/smartling", "compare/xtm"] as const;

const COMPARISON_ANCHORS: Readonly<Record<string, string>> = {
  "compare/crowdin": "Crowdin alternative",
  "compare/lokalise": "Lokalise comparison",
  "compare/phrase": "Phrase vs Better i18n",
  "compare/transifex": "Transifex alternative",
  "compare/smartling": "Smartling comparison",
  "compare/xtm": "XTM alternative",
};

const COMPARISON_FUNNELS: readonly RelatedPage[] = [
  { path: "i18n/translation-management-system", anchor: "what makes a great TMS", relationship: "funnel" },
  { path: "pricing", anchor: "see pricing plans", relationship: "funnel" },
];

function buildComparisonCluster(): ReadonlyArray<readonly [string, readonly RelatedPage[]]> {
  const pillar: RelatedPage = { path: "compare", anchor: "all comparisons", relationship: "pillar" };
  return COMPARISONS.map((member) => {
    const siblings = COMPARISONS.filter((s) => s !== member).slice(0, 2)
      .map((s): RelatedPage => ({ path: s, anchor: COMPARISON_ANCHORS[s] ?? s, relationship: "cluster" }));
    return [member, [pillar, ...siblings, ...COMPARISON_FUNNELS]] as const;
  });
}

// Cluster 4: Blog -> Commercial Funnel

const BLOG_LINKS: ReadonlyArray<readonly [string, readonly RelatedPage[]]> = [
  ["blog/icu-message-format", [
    { path: "i18n/react", anchor: "React i18n integration", relationship: "funnel" },
    { path: "i18n/translation-management-system", anchor: "manage translations at scale", relationship: "funnel" },
    { path: "i18n/formatting-utilities", anchor: "formatting utilities", relationship: "cluster" },
  ]],
  ["blog/ai-translation-tools-2025", [
    { path: "compare/crowdin", anchor: "compare leading TMS platforms", relationship: "funnel" },
    { path: "compare/lokalise", anchor: "Lokalise feature breakdown", relationship: "funnel" },
    { path: "i18n/best-tms", anchor: "best TMS for developers", relationship: "funnel" },
  ]],
  ["blog/llm-translation-vs-nmt", [
    { path: "i18n/translation-management-system", anchor: "modern translation management", relationship: "funnel" },
    { path: "i18n/localization-software", anchor: "localization software with AI", relationship: "funnel" },
  ]],
  ["blog/open-source-tms-alternatives", [
    { path: "compare/crowdin", anchor: "how Crowdin compares", relationship: "funnel" },
    { path: "compare/lokalise", anchor: "Lokalise alternative", relationship: "funnel" },
    { path: "pricing", anchor: "free tier for open-source projects", relationship: "funnel" },
  ]],
  ["blog/multilingual-schema-markup", [
    { path: "i18n/international-seo", anchor: "international SEO best practices", relationship: "funnel" },
    { path: "i18n/website-localization", anchor: "full website localization guide", relationship: "funnel" },
    { path: "i18n/multilingual-seo", anchor: "multilingual SEO strategy", relationship: "cluster" },
  ]],
];

// Assembled map

function buildInternalLinkMap(): InternalLinkMap {
  return new Map([
    ...buildTranslationCluster(),
    ...buildFrameworkCluster(),
    ...buildComparisonCluster(),
    ...BLOG_LINKS,
  ]);
}

/** Singleton link map -- built once, reused across renders. */
const INTERNAL_LINKS: InternalLinkMap = buildInternalLinkMap();

/**
 * Returns related pages for a given page path.
 *
 * @param pagePath - Page path without locale prefix (e.g. "i18n/react", "blog/icu-message-format")
 * @returns Related pages for internal linking, or empty array if none configured
 */
export function getRelatedPages(pagePath: string): readonly RelatedPage[] {
  return INTERNAL_LINKS.get(pagePath) ?? [];
}
