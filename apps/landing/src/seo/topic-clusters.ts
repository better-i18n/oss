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

export const TOPIC_CLUSTERS: readonly TopicCluster[] = [
  {
    id: "seo",
    pages: [
      { slug: "multilingual-seo", titleFallback: "Multilingual SEO", descFallback: "Optimize your website for multiple languages and regions" },
      { slug: "international-seo", titleFallback: "International SEO", descFallback: "Reach global audiences with international SEO strategy" },
      { slug: "international-seo-consulting", titleFallback: "International SEO Consulting", descFallback: "Expert consulting for global search visibility" },
      { slug: "technical-multilingual-seo", titleFallback: "Technical Multilingual SEO", descFallback: "Technical implementation of multilingual SEO" },
      { slug: "technical-international-seo", titleFallback: "Technical International SEO", descFallback: "Technical deep-dive into international SEO" },
      { slug: "multilingual-website-seo", titleFallback: "Multilingual Website SEO", descFallback: "Practical guide to multilingual website optimization" },
      { slug: "global-market-seo", titleFallback: "Global Market SEO", descFallback: "SEO strategies for entering global markets" },
      { slug: "seo-international-audiences", titleFallback: "SEO for International Audiences", descFallback: "Target international audiences with SEO" },
      { slug: "local-seo-international", titleFallback: "Local SEO International", descFallback: "Local SEO strategies for international markets" },
      { slug: "ecommerce-global-seo", titleFallback: "E-commerce Global SEO", descFallback: "Global SEO for e-commerce platforms" },
    ],
  },
  {
    id: "localization",
    pages: [
      { slug: "localization-software", titleFallback: "Localization Software", descFallback: "Top localization software platforms compared" },
      { slug: "localization-platforms", titleFallback: "Localization Platforms", descFallback: "Compare localization management platforms" },
      { slug: "localization-tools", titleFallback: "Localization Tools", descFallback: "Best developer-facing localization tools" },
      { slug: "localization-management", titleFallback: "Localization Management", descFallback: "Managing translation workflows at scale" },
      { slug: "content-localization", titleFallback: "Content Localization", descFallback: "Adapt content for global audiences" },
      { slug: "content-localization-services", titleFallback: "Content Localization Services", descFallback: "Professional content localization services" },
      { slug: "software-localization", titleFallback: "Software Localization", descFallback: "Complete guide to software localization" },
      { slug: "software-localization-services", titleFallback: "Software Localization Services", descFallback: "Platform vs agency localization approaches" },
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
