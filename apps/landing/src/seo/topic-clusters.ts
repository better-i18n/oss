/**
 * Topic cluster definitions for cross-linking related SEO content pages.
 * Pure data — no React or component imports.
 */

type TopicClusterPage = {
  readonly slug: string;
  readonly titleFallback: string;
  readonly descFallback: string;
};

type TopicCluster = {
  readonly id: string;
  readonly pages: readonly TopicClusterPage[];
};

/**
 * Only pages that still exist in MARKETING_PAGES (pages.ts) should be listed here.
 * Consolidated/removed pages (see redirects.ts) must NOT appear — they cause
 * internal links to 301 redirect targets, which wastes link equity and confuses users.
 */
export const TOPIC_CLUSTERS: readonly TopicCluster[] = [
  {
    id: "seo",
    pages: [
      { slug: "international-seo", titleFallback: "International SEO", descFallback: "Reach global audiences with international SEO strategy" },
      { slug: "website-localization", titleFallback: "Website Localization", descFallback: "Adapt your website for global audiences" },
      { slug: "website-translation", titleFallback: "Website Translation", descFallback: "Translate your website for international users" },
    ],
  },
  {
    id: "localization",
    pages: [
      { slug: "localization-software", titleFallback: "Localization Software", descFallback: "Top localization software platforms compared" },
      { slug: "content-localization", titleFallback: "Content Localization", descFallback: "Adapt content for global audiences" },
      { slug: "software-localization", titleFallback: "Software Localization", descFallback: "Complete guide to software localization" },
      { slug: "website-localization", titleFallback: "Website Localization", descFallback: "Adapt your website for global audiences" },
      { slug: "website-translation", titleFallback: "Website Translation", descFallback: "Translate your website for international users" },
    ],
  },
  {
    id: "translation",
    pages: [
      { slug: "translation-management-system", titleFallback: "Translation Management System", descFallback: "Centralize your localization workflow with a TMS" },
      { slug: "translation-solutions", titleFallback: "Translation Solutions", descFallback: "Modern translation solutions for development teams" },
      { slug: "cultural-adaptation", titleFallback: "Cultural Adaptation", descFallback: "Adapt products for cultural differences" },
    ],
  },
] as const;

/** Look up sibling pages for a given slug, excluding the current page. Returns up to `limit` results. */
export function getClusterSiblings(
  currentSlug: string,
  limit = 5,
): readonly TopicClusterPage[] {
  const cluster = TOPIC_CLUSTERS.find((c) =>
    c.pages.some((p) => p.slug === currentSlug),
  );
  if (!cluster) return [];
  return cluster.pages
    .filter((p) => p.slug !== currentSlug)
    .slice(0, limit);
}
