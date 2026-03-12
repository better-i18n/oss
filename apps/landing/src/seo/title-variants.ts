interface TitleVariant {
  readonly pageKey: string;
  readonly variants: readonly string[];
  readonly activeIndex: number;
}

export const TITLE_VARIANTS: readonly TitleVariant[] = [
  {
    pageKey: "pricing",
    variants: [
      "Pricing — Better i18n",
      "i18n Pricing: Free Tier + Pro Plans | Better i18n",
      "Affordable Localization Platform — Better i18n Pricing",
    ],
    activeIndex: 0,
  },
] as const;

/**
 * Look up the active title variant for a given page key.
 * Returns undefined if no variant is configured for the page.
 */
export function getActiveVariant(pageKey: string): string | undefined {
  const entry = TITLE_VARIANTS.find((v) => v.pageKey === pageKey);
  if (!entry) return undefined;
  return entry.variants[entry.activeIndex];
}
