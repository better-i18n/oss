/**
 * Shared page definitions - single source of truth for sitemap, page generator, and meta utilities.
 */

export const SITE_URL = "https://better-i18n.com";

export type ChangeFreq =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export interface PageDefinition {
  readonly path: string;
  readonly priority: number;
  readonly changefreq: ChangeFreq;
  readonly prerender: boolean;
}

export const MARKETING_PAGES = [
  // Core pages
  { path: "", priority: 1.0, changefreq: "weekly", prerender: true },
  { path: "features", priority: 0.9, changefreq: "weekly", prerender: true },
  { path: "pricing", priority: 0.9, changefreq: "weekly", prerender: true },
  { path: "integrations", priority: 0.9, changefreq: "weekly", prerender: true },

  // Audience pages
  { path: "for-developers", priority: 0.9, changefreq: "weekly", prerender: true },
  { path: "for-translators", priority: 0.9, changefreq: "weekly", prerender: true },
  { path: "for-product-teams", priority: 0.9, changefreq: "weekly", prerender: true },
  { path: "for-marketers", priority: 0.85, changefreq: "weekly", prerender: true },
  { path: "for-agencies", priority: 0.85, changefreq: "weekly", prerender: true },
  { path: "for-enterprises", priority: 0.85, changefreq: "weekly", prerender: true },
  { path: "for-startups", priority: 0.85, changefreq: "weekly", prerender: true },
  { path: "for-engineering-leaders", priority: 0.85, changefreq: "weekly", prerender: true },
  { path: "for-content-teams", priority: 0.85, changefreq: "weekly", prerender: true },
  { path: "for-ecommerce", priority: 0.85, changefreq: "weekly", prerender: true },
  { path: "for-saas", priority: 0.85, changefreq: "weekly", prerender: true },
  { path: "for-mobile-teams", priority: 0.85, changefreq: "weekly", prerender: true },
  { path: "for-designers", priority: 0.85, changefreq: "weekly", prerender: true },
  { path: "for-freelancers", priority: 0.85, changefreq: "weekly", prerender: true },
  { path: "for-open-source", priority: 0.85, changefreq: "weekly", prerender: true },
  { path: "for-gaming", priority: 0.85, changefreq: "weekly", prerender: true },
  { path: "for-education", priority: 0.85, changefreq: "weekly", prerender: true },
  { path: "for-healthcare", priority: 0.85, changefreq: "weekly", prerender: true },

  // i18n Framework pages
  { path: "i18n", priority: 0.9, changefreq: "weekly", prerender: true },
  { path: "i18n/react", priority: 0.9, changefreq: "weekly", prerender: true },
  { path: "i18n/nextjs", priority: 0.9, changefreq: "weekly", prerender: true },
  { path: "i18n/vue", priority: 0.9, changefreq: "weekly", prerender: true },
  { path: "i18n/nuxt", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/angular", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/svelte", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/best-tms", priority: 0.85, changefreq: "weekly", prerender: true },
  { path: "i18n/best-library", priority: 0.85, changefreq: "weekly", prerender: true },
  { path: "i18n/for-developers", priority: 0.85, changefreq: "weekly", prerender: true },

  // i18n SEO content pages
  { path: "i18n/localization-software", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/content-localization-services", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/translation-management-system", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/localization-platforms", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/global-market-seo", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/website-localization", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/react-intl", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/ecommerce-global-seo", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/translation-solutions", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/international-seo", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/cli-code-scanning", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/multilingual-website-seo", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/formatting-utilities", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/react-native-localization", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/localization-vs-internationalization", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/localization-tools", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/content-localization", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/software-localization", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/technical-multilingual-seo", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/security-compliance", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/cultural-adaptation", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/local-seo-international", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/multilingual-seo", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/international-seo-consulting", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/seo-international-audiences", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/website-translation", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/software-localization-services", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/technical-international-seo", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/localization-management", priority: 0.8, changefreq: "weekly", prerender: true },

  // Comparison pages
  { path: "compare", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "compare/crowdin", priority: 0.85, changefreq: "weekly", prerender: true },
  { path: "compare/lokalise", priority: 0.85, changefreq: "weekly", prerender: true },
  { path: "compare/phrase", priority: 0.85, changefreq: "weekly", prerender: true },
  { path: "compare/transifex", priority: 0.85, changefreq: "weekly", prerender: true },

  // Educational pages
  { path: "what-is", priority: 0.85, changefreq: "monthly", prerender: true },
  { path: "what-is-internationalization", priority: 0.85, changefreq: "monthly", prerender: true },
  { path: "what-is-localization", priority: 0.85, changefreq: "monthly", prerender: true },

  // Company pages
  { path: "about", priority: 0.7, changefreq: "monthly", prerender: true },
  { path: "careers", priority: 0.7, changefreq: "weekly", prerender: true },
  { path: "status", priority: 0.6, changefreq: "daily", prerender: false },
  { path: "changelog", priority: 0.8, changefreq: "daily", prerender: false },

  // Legal pages
  { path: "privacy", priority: 0.3, changefreq: "yearly", prerender: true },
  { path: "terms", priority: 0.3, changefreq: "yearly", prerender: true },
] as const satisfies readonly PageDefinition[];
