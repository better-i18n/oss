import {
  getLocalizedMeta,
  formatMetaTags,
  getAlternateLinks,
  getCanonicalLink,
  getCanonicalUrl,
} from "./meta";
import {
  getDefaultStructuredData,
  getHomePageStructuredData,
  getPricingPageStructuredData,
  getComparisonPageStructuredData,
  getFrameworkPageStructuredData,
  getEducationalPageStructuredData,
  getFAQSchema,
  getBreadcrumbSchema,
  formatStructuredData,
  getCareersPageStructuredData,
} from "./structured-data";
import { SITE_URL } from "./meta";

// Re-export for convenience
export {
  getPricingPageStructuredData,
  getComparisonPageStructuredData,
  getFrameworkPageStructuredData,
  getEducationalPageStructuredData,
  getFAQSchema,
  getBreadcrumbSchema,
  formatStructuredData,
  getCareersPageStructuredData,
};

type PageType = "default" | "home" | "pricing" | "comparison" | "framework" | "educational";

interface PageSEOOptions {
  /** i18n messages object */
  messages: Record<string, unknown>;
  /** Current locale */
  locale: string;
  /** Page key for meta namespace (e.g., "features", "pricing") */
  pageKey: string;
  /** URL pathname without locale prefix (e.g., "/features") */
  pathname: string;
  /** Available locales for alternate links */
  locales?: string[];
  /** Whether this is the homepage (uses different structured data) */
  isHomepage?: boolean;
  /** Page type for structured data */
  pageType?: PageType;
  /** Additional options for structured data (e.g., competitorName for comparison pages) */
  structuredDataOptions?: {
    competitorName?: string;
    framework?: string;
    frameworkDescription?: string;
    dependencies?: string[];
    title?: string;
    description?: string;
    url?: string;
  };
  /** Custom structured data (overrides pageType) */
  customStructuredData?: ReturnType<typeof formatStructuredData>;
}

/**
 * English breadcrumb labels used as fallback when i18n messages are unavailable.
 */
const ENGLISH_LABEL_MAP: Readonly<Record<string, string>> = {
  features: "Features",
  pricing: "Pricing",
  integrations: "Integrations",
  "what-is": "What is i18n",
  "for-developers": "For Developers",
  "for-translators": "For Translators",
  "for-product-teams": "For Product Teams",
  compare: "Compare",
  i18n: "Frameworks",
  "what-is-internationalization": "What is Internationalization",
  "what-is-localization": "What is Localization",
  "best-tms": "Best TMS",
  "best-library": "Best i18n Library",
  blog: "Blog",
  about: "About",
  careers: "Careers",
  changelog: "Changelog",
  status: "Status",
  crowdin: "vs Crowdin",
  lokalise: "vs Lokalise",
  phrase: "vs Phrase",
  transifex: "vs Transifex",
  privacy: "Privacy Policy",
  terms: "Terms of Service",
  "cli-code-scanning": "CLI Code Scanning",
  "localization-software": "Localization Software",
  "translation-management-system": "Translation Management System",
  "content-localization-services": "Content Localization Services",
  "localization-platforms": "Localization Platforms",
  "website-localization": "Website Localization",
  "react-intl": "React Intl",
  "international-seo": "International SEO",
  "multilingual-seo": "Multilingual SEO",
  "software-localization": "Software Localization",
  "content-localization": "Content Localization",
  "localization-tools": "Localization Tools",
  "website-translation": "Website Translation",
  "localization-management": "Localization Management",
  "react-native-localization": "React Native Localization",
  "localization-vs-internationalization": "Localization vs Internationalization",
  "formatting-utilities": "Formatting Utilities",
  "security-compliance": "Security & Compliance",
  "cultural-adaptation": "Cultural Adaptation",
  react: "React",
  nextjs: "Next.js",
  vue: "Vue",
  nuxt: "Nuxt",
  angular: "Angular",
  svelte: "Svelte",
  expo: "Expo",
  "tanstack-start": "TanStack Start",
  server: "Server / Hono",
  // Persona pages
  "for-marketers": "For Marketers",
  "for-agencies": "For Agencies",
  "for-enterprises": "For Enterprises",
  "for-startups": "For Startups",
  "for-engineering-leaders": "For Engineering Leaders",
  "for-content-teams": "For Content Teams",
  "for-ecommerce": "For E-Commerce",
  "for-saas": "For SaaS",
  "for-mobile-teams": "For Mobile Teams",
  "for-designers": "For Designers",
  "for-freelancers": "For Freelancers",
  "for-open-source": "For Open Source",
  "for-gaming": "For Gaming",
  "for-education": "For Education",
  "for-healthcare": "For Healthcare",
};

/**
 * Get a localized breadcrumb label for a URL segment.
 * Checks i18n messages first (breadcrumbs.{segment}), then falls back to English.
 */
function getBreadcrumbLabel(
  segment: string,
  messages: Record<string, unknown>
): string {
  const breadcrumbs = messages?.breadcrumbs as Record<string, string> | undefined;
  if (breadcrumbs?.[segment]) return breadcrumbs[segment];

  return ENGLISH_LABEL_MAP[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1);
}

/**
 * Get the localized "Home" breadcrumb label.
 */
function getHomeBreadcrumbLabel(messages: Record<string, unknown>): string {
  const breadcrumbs = messages?.breadcrumbs as Record<string, string> | undefined;
  return breadcrumbs?.home ?? "Home";
}

/**
 * Get structured data based on page type
 */
function getStructuredDataForPageType(
  pageType: PageType,
  options?: PageSEOOptions["structuredDataOptions"],
  locale?: string
) {
  switch (pageType) {
    case "home":
      return getHomePageStructuredData(undefined, locale);
    case "pricing":
      return getPricingPageStructuredData(locale);
    case "comparison":
      return options?.competitorName
        ? getComparisonPageStructuredData(options.competitorName, locale)
        : getDefaultStructuredData(locale);
    case "framework":
      return options?.framework && options?.frameworkDescription
        ? getFrameworkPageStructuredData(
            options.framework,
            options.frameworkDescription,
            options.dependencies,
            locale
          )
        : getDefaultStructuredData(locale);
    case "educational":
      return options?.title && options?.description && options?.url
        ? getEducationalPageStructuredData({
            title: options.title,
            description: options.description,
            url: options.url,
            locale,
          })
        : getDefaultStructuredData(locale);
    default:
      return getDefaultStructuredData(locale);
  }
}

/**
 * Generate complete head data for a marketing page.
 * Includes meta tags, Open Graph, Twitter Cards, canonical, hreflang, and structured data.
 */
export function getPageHead(options: PageSEOOptions) {
  const {
    messages,
    locale,
    pageKey,
    pathname,
    locales,
    isHomepage = false,
    pageType,
    structuredDataOptions,
    customStructuredData,
  } = options;

  const meta = getLocalizedMeta(messages as Record<string, string>, pageKey, {
    locale,
    pathname,
  });

  // Auto-populate URL in structured data options from canonical URL
  const enrichedStructuredDataOptions = structuredDataOptions
    ? { ...structuredDataOptions, url: structuredDataOptions.url ?? getCanonicalUrl(locale, pathname) }
    : structuredDataOptions;

  // Determine structured data: custom > pageType > isHomepage > default
  let scripts;
  if (customStructuredData) {
    scripts = customStructuredData;
  } else if (pageType) {
    scripts = getStructuredDataForPageType(pageType, enrichedStructuredDataOptions, locale);
  } else if (isHomepage) {
    scripts = getHomePageStructuredData(undefined, locale);
  } else {
    scripts = getDefaultStructuredData(locale);
  }

  // Generate breadcrumb schema for inner pages (skip homepage)
  const cleanPath = pathname.replace(/^\/+/, "");
  if (cleanPath) {
    const segments = cleanPath.split("/").filter(Boolean);
    const breadcrumbItems = [
      { name: getHomeBreadcrumbLabel(messages), url: `${SITE_URL}/${locale}/` },
    ];

    let currentPath = "";
    for (const segment of segments) {
      currentPath += `/${segment}`;
      const label = getBreadcrumbLabel(segment, messages);
      breadcrumbItems.push({
        name: label,
        url: `${SITE_URL}/${locale}${currentPath}/`,
      });
    }

    const breadcrumbScript = formatStructuredData(getBreadcrumbSchema(breadcrumbItems));
    scripts = [...scripts, ...breadcrumbScript];
  }

  return {
    meta: formatMetaTags(meta, { locale, locales }),
    links: [
      ...getAlternateLinks(pathname, locales),
      getCanonicalLink(locale, pathname),
    ],
    scripts,
  };
}

/**
 * Create a standard loader that exposes messages and locale for head().
 * Use this in route definitions.
 */
export function createPageLoader() {
  return ({ context }: { context: { messages: Record<string, string>; locale: string } }) => ({
    messages: context.messages,
    locale: context.locale,
  });
}

/**
 * Helper type for loader data
 */
export interface PageLoaderData {
  messages: Record<string, string>;
  locale: string;
}
