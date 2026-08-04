/**
 * Contextual CTA configuration for blog posts.
 *
 * Maps blog post slugs and categories to specific CTA content
 * so inline and floating CTAs are relevant to the reader's context.
 */

/**
 * `titleKey` / `descriptionKey` / `ctaTextKey` are `blog` namespace key
 * SUFFIXES (e.g. "cta.default.title"), not copy — the caller already holds
 * `useT("blog")` and resolves them with `t()`. See rule/i18n-nextjs-visual-
 * timeline-keys-not-copy in nextjs.tsx for the same pattern: keeping the
 * English literal here would render in English on all 21 non-default
 * locales, exactly like the strings this file replaced.
 */
export interface BlogCTAConfig {
  readonly titleKey: string;
  readonly descriptionKey: string;
  readonly ctaTextKey: string;
  readonly ctaUrl: string;
}

const DEFAULT_CTA: BlogCTAConfig = {
  titleKey: "cta.default.title",
  descriptionKey: "cta.default.description",
  ctaTextKey: "cta.default.ctaText",
  ctaUrl: "https://dash.better-i18n.com",
} as const;

/**
 * Slug-specific CTAs for high-impression blog posts.
 * Keys are matched against the beginning of the slug (prefix match).
 */
const SLUG_CTAS: ReadonlyArray<readonly [prefix: string, cta: BlogCTAConfig]> =
  [
    [
      "icu-message-format",
      {
        titleKey: "cta.icuMessageFormat.title",
        descriptionKey: "cta.icuMessageFormat.description",
        ctaTextKey: "cta.icuMessageFormat.ctaText",
        ctaUrl: "/pricing",
      },
    ],
    [
      "ai-translation-tools",
      {
        titleKey: "cta.aiTranslationTools.title",
        descriptionKey: "cta.aiTranslationTools.description",
        ctaTextKey: "cta.aiTranslationTools.ctaText",
        ctaUrl: "/features",
      },
    ],
    [
      "llm-translation-vs-nmt",
      {
        titleKey: "cta.llmVsNmt.title",
        descriptionKey: "cta.llmVsNmt.description",
        ctaTextKey: "cta.llmVsNmt.ctaText",
        ctaUrl: "/features",
      },
    ],
    [
      "open-source-tms-alternatives",
      {
        titleKey: "cta.openSourceTms.title",
        descriptionKey: "cta.openSourceTms.description",
        ctaTextKey: "cta.openSourceTms.ctaText",
        ctaUrl: "/pricing",
      },
    ],
    [
      "multilingual-schema-markup",
      {
        titleKey: "cta.multilingualSchema.title",
        descriptionKey: "cta.multilingualSchema.description",
        ctaTextKey: "cta.multilingualSchema.ctaText",
        ctaUrl: "/features",
      },
    ],
  ] as const;

/**
 * Category-level fallback CTAs.
 * Used when no slug-specific CTA is found.
 */
const CATEGORY_CTAS: Readonly<Record<string, BlogCTAConfig>> = {
  engineering: {
    titleKey: "cta.engineering.title",
    descriptionKey: "cta.engineering.description",
    ctaTextKey: "cta.engineering.ctaText",
    ctaUrl: "/features",
  },
  "product-updates": {
    titleKey: "cta.productUpdates.title",
    descriptionKey: "cta.productUpdates.description",
    ctaTextKey: "cta.productUpdates.ctaText",
    ctaUrl: "https://dash.better-i18n.com",
  },
  seo: {
    titleKey: "cta.seo.title",
    descriptionKey: "cta.seo.description",
    ctaTextKey: "cta.seo.ctaText",
    ctaUrl: "/features",
  },
} as const;

/**
 * Returns the most relevant CTA config for a given blog post.
 *
 * Resolution order:
 * 1. Exact or prefix match on slug
 * 2. Category-level fallback
 * 3. Default CTA
 */
export function getBlogCTA(
  slug: string,
  category?: string | null,
): BlogCTAConfig {
  // 1. Check slug-specific CTAs (prefix match)
  const slugMatch = SLUG_CTAS.find(([prefix]) => slug.startsWith(prefix));
  if (slugMatch) {
    return slugMatch[1];
  }

  // 2. Check category-level CTAs
  if (category && category in CATEGORY_CTAS) {
    return CATEGORY_CTAS[category];
  }

  // 3. Default
  return DEFAULT_CTA;
}
