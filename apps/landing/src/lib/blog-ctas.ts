/**
 * Contextual CTA configuration for blog posts.
 *
 * Maps blog post slugs and categories to specific CTA content
 * so inline and floating CTAs are relevant to the reader's context.
 */

export interface BlogCTAConfig {
  readonly title: string;
  readonly description: string;
  readonly ctaText: string;
  readonly ctaUrl: string;
}

const DEFAULT_CTA: BlogCTAConfig = {
  title: "Ship multilingual products faster",
  description:
    "Better i18n automates translation workflows so you can focus on building, not translating.",
  ctaText: "Start free trial",
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
        title: "Better i18n handles ICU natively",
        description:
          "Full ICU MessageFormat support with plurals, selects, and nested arguments out of the box.",
        ctaText: "See pricing",
        ctaUrl: "/pricing",
      },
    ],
    [
      "ai-translation-tools",
      {
        title: "Compare AI engines in Better i18n",
        description:
          "Switch between GPT-4, Claude, DeepL, and Google Translate per project or per key.",
        ctaText: "Explore features",
        ctaUrl: "/features",
      },
    ],
    [
      "llm-translation-vs-nmt",
      {
        title: "Switch between LLM and NMT per content type",
        description:
          "Use LLMs for marketing copy and NMT for UI strings — all from one dashboard.",
        ctaText: "Explore features",
        ctaUrl: "/features",
      },
    ],
    [
      "open-source-tms-alternatives",
      {
        title: "Generous free tier for open source",
        description:
          "Open-source projects get a free tier with unlimited keys and community support.",
        ctaText: "See pricing",
        ctaUrl: "/pricing",
      },
    ],
    [
      "multilingual-schema-markup",
      {
        title: "Automated multilingual schema markup",
        description:
          "Better i18n generates hreflang tags, JSON-LD, and localized sitemaps automatically.",
        ctaText: "Explore features",
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
    title: "Built for developer workflows",
    description:
      "CLI, SDK, and CI/CD integrations that fit into your existing development pipeline.",
    ctaText: "View developer docs",
    ctaUrl: "/features",
  },
  "product-updates": {
    title: "Stay up to date with Better i18n",
    description:
      "New features ship every week. Try the latest improvements in your dashboard.",
    ctaText: "Open dashboard",
    ctaUrl: "https://dash.better-i18n.com",
  },
  seo: {
    title: "Multilingual SEO, automated",
    description:
      "Hreflang tags, localized sitemaps, and translated meta — generated automatically.",
    ctaText: "Explore features",
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
