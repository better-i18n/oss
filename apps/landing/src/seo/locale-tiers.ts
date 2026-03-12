/**
 * Tiered localization configuration.
 *
 * Locales are grouped into three tiers that control SEO treatment:
 *
 * - **Tier 1**: Full SEO support — prerendered, indexed, high sitemap priority.
 * - **Tier 2**: Partial SEO support — indexed but not prerendered, lower sitemap priority.
 * - **Tier 3**: Minimal SEO support — noindex, excluded from sitemap, not prerendered.
 *
 * Any locale not listed in tier1 or tier2 is automatically assigned to tier3.
 */

export const LOCALE_TIERS = {
  tier1: ["en", "de", "fr", "es", "pt", "ja"],
  tier2: ["tr", "it", "nl", "ko", "zh"],
  tier3: [],
} as const;

export type LocaleTier = "tier1" | "tier2" | "tier3";

const TIER1_SET: ReadonlySet<string> = new Set(LOCALE_TIERS.tier1);
const TIER2_SET: ReadonlySet<string> = new Set(LOCALE_TIERS.tier2);

/**
 * Returns the tier for a given locale.
 * Locales not explicitly listed in tier1 or tier2 default to tier3.
 */
export function getLocaleTier(locale: string): LocaleTier {
  if (TIER1_SET.has(locale)) return "tier1";
  if (TIER2_SET.has(locale)) return "tier2";
  return "tier3";
}

/**
 * Sitemap priority multiplier per tier.
 * Tier 2 pages receive 80% of their base priority.
 * Tier 3 pages are excluded from sitemap entirely.
 */
export const TIER_PRIORITY_MULTIPLIER: Readonly<Record<LocaleTier, number>> = {
  tier1: 1.0,
  tier2: 0.8,
  tier3: 0,
};
