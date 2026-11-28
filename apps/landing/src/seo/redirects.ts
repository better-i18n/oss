/**
 * Redirect map for removed/consolidated pages.
 *
 * Each entry maps a removed path to its canonical replacement.
 * Consumers (e.g. router middleware, worker) should issue 301 redirects.
 */

export interface RedirectEntry {
  readonly from: string;
  readonly to: string;
  readonly status: 301;
}

/**
 * Audience pages consolidated during SEO pruning (2026-03).
 * Ultra-niche verticals and overlapping role pages redirect
 * to the closest high-value persona page.
 */
export const AUDIENCE_REDIRECTS: readonly RedirectEntry[] = [
  { from: "for-marketers", to: "for-product-teams", status: 301 },
  { from: "for-engineering-leaders", to: "for-developers", status: 301 },
  { from: "for-content-teams", to: "for-product-teams", status: 301 },
  { from: "for-mobile-teams", to: "for-developers", status: 301 },
  { from: "for-designers", to: "for-product-teams", status: 301 },
  { from: "for-freelancers", to: "for-agencies", status: 301 },
  { from: "for-open-source", to: "for-developers", status: 301 },
  { from: "for-gaming", to: "for-developers", status: 301 },
  { from: "for-education", to: "for-enterprises", status: 301 },
  { from: "for-healthcare", to: "for-enterprises", status: 301 },
] as const;

/**
 * SEO content pages consolidated to eliminate keyword cannibalization (2026-03).
 * Cannibalized pages redirect to their cluster's pillar page.
 */
export const SEO_CONTENT_REDIRECTS: readonly RedirectEntry[] = [
  // Cluster A: International SEO (8 archived pages → i18n/international-seo)
  { from: "i18n/multilingual-website-seo", to: "i18n/international-seo", status: 301 },
  { from: "i18n/technical-multilingual-seo", to: "i18n/international-seo", status: 301 },
  { from: "i18n/technical-international-seo", to: "i18n/international-seo", status: 301 },
  { from: "i18n/global-market-seo", to: "i18n/international-seo", status: 301 },
  { from: "i18n/seo-international-audiences", to: "i18n/international-seo", status: 301 },
  { from: "i18n/international-seo-consulting", to: "i18n/international-seo", status: 301 },
  { from: "i18n/local-seo-international", to: "i18n/international-seo", status: 301 },
  { from: "i18n/ecommerce-global-seo", to: "i18n/international-seo", status: 301 },

  // Cluster B: Localization Software (3 pages → i18n/localization-software)
  { from: "i18n/localization-tools", to: "i18n/localization-software", status: 301 },
  { from: "i18n/localization-platforms", to: "i18n/localization-software", status: 301 },
  { from: "i18n/localization-management", to: "i18n/localization-software", status: 301 },
  { from: "i18n/formatting-utilities", to: "i18n/localization-software", status: 301 },

  // Cluster C: Software Localization (1 page → i18n/software-localization)
  { from: "i18n/software-localization-services", to: "i18n/software-localization", status: 301 },

  // Cluster D: Content Localization (1 page → i18n/content-localization)
  { from: "i18n/content-localization-services", to: "i18n/content-localization", status: 301 },

  // Low-value / off-topic pages
  { from: "i18n/react-intl", to: "i18n", status: 301 },
  { from: "i18n/security-compliance", to: "i18n", status: 301 },
] as const;

/**
 * All redirect entries combined.
 * Add future redirect groups here as the site evolves.
 */
export const ALL_REDIRECTS: readonly RedirectEntry[] = [
  ...AUDIENCE_REDIRECTS,
  ...SEO_CONTENT_REDIRECTS,
] as const;

/**
 * Lookup map for O(1) redirect resolution.
 * Keys are source paths (without leading slash), values are target paths.
 */
export const REDIRECT_MAP: ReadonlyMap<string, string> = new Map(
  ALL_REDIRECTS.map((r) => [r.from, r.to]),
);

/**
 * Redirects that only start once their target is live.
 *
 * The three near-duplicate MCP posts had 0 clicks in 3 months (17 to 58
 * impressions each, Search Console 2026-11-28), so they fold into
 * `i18n-mcp-server-claude-cursor`. That post is a scheduled draft: it publishes
 * 2026-12-12 08:00 UTC and answers 404 before that. A redirect to a 404 is worse
 * than the duplicate, so these rules wait until `effectiveFrom` (one hour after
 * the publish time, to cover the poll and deploy lag).
 *
 * `mcp-for-localization-ai-agents-translations` is NOT here: it got 7 clicks, so it stays.
 *
 * The target post exists in English only, so every locale of a source post goes to
 * the English URL. Remove an entry once the redirect has been live for a few months.
 */
export interface ScheduledBlogRedirect {
  readonly slug: string;
  readonly toPath: string;
  readonly effectiveFrom: string;
}

export const SCHEDULED_BLOG_REDIRECTS: readonly ScheduledBlogRedirect[] = [
  "mcp-server-for-localization-ai-agents-manage-translations",
  "better-i18n-mcp-coding-agents-guide",
  "mcp-content-ai-blog",
].map((slug) => ({
  slug,
  toPath: "/en/blog/i18n-mcp-server-claude-cursor/",
  effectiveFrom: "2026-12-12T09:00:00Z",
}));

/** `/{locale}/blog/{slug}/` -> English target once the rule is active, else null. */
export function getScheduledBlogRedirect(pathname: string, now: number): string | null {
  const m = /^\/([a-z]{2}(?:-[a-z]{2,4})?)\/blog\/([^/]+)\/?$/.exec(pathname);
  if (!m) return null;
  const rule = SCHEDULED_BLOG_REDIRECTS.find((r) => r.slug === m[2]);
  if (!rule || now < Date.parse(rule.effectiveFrom)) return null;
  return rule.toPath;
}
