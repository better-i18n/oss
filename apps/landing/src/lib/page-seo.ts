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
  getReviewSchema,
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
  getReviewSchema,
  getBreadcrumbSchema,
  formatStructuredData,
  getCareersPageStructuredData,
};

type PageType = "default" | "home" | "pricing" | "comparison" | "framework" | "educational";

interface PageSEOOptions {
  /** i18n messages object */
  messages: Record<string, string>;
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
    title?: string;
    description?: string;
    url?: string;
  };
  /** Custom structured data (overrides pageType) */
  customStructuredData?: ReturnType<typeof formatStructuredData>;
}

/**
 * Get structured data based on page type
 */
function getStructuredDataForPageType(
  pageType: PageType,
  options?: PageSEOOptions["structuredDataOptions"]
) {
  switch (pageType) {
    case "home":
      return getHomePageStructuredData();
    case "pricing":
      return getPricingPageStructuredData();
    case "comparison":
      return options?.competitorName
        ? getComparisonPageStructuredData(options.competitorName)
        : getDefaultStructuredData();
    case "framework":
      return options?.framework && options?.frameworkDescription
        ? getFrameworkPageStructuredData(options.framework, options.frameworkDescription)
        : getDefaultStructuredData();
    case "educational":
      return options?.title && options?.description && options?.url
        ? getEducationalPageStructuredData({
            title: options.title,
            description: options.description,
            url: options.url,
          })
        : getDefaultStructuredData();
    default:
      return getDefaultStructuredData();
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

  const meta = getLocalizedMeta(messages, pageKey, {
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
    scripts = getStructuredDataForPageType(pageType, enrichedStructuredDataOptions);
  } else if (isHomepage) {
    scripts = getHomePageStructuredData();
  } else {
    scripts = getDefaultStructuredData();
  }

  // Generate breadcrumb schema for inner pages (skip homepage)
  const cleanPath = pathname.replace(/^\/+/, "");
  if (cleanPath) {
    const segments = cleanPath.split("/").filter(Boolean);
    const breadcrumbItems = [
      { name: "Home", url: `${SITE_URL}/${locale}` },
    ];

    const labelMap: Record<string, string> = {
      features: "Features",
      pricing: "Pricing",
      "what-is": "What is i18n",
      "for-developers": "For Developers",
      "for-translators": "For Translators",
      "for-product-teams": "For Product Teams",
      compare: "Compare",
      i18n: "Frameworks",
      "what-is-internationalization": "What is Internationalization",
      "what-is-localization": "What is Localization",
      "best-tms": "Best TMS",
    };

    let currentPath = "";
    for (const segment of segments) {
      currentPath += `/${segment}`;
      const label = labelMap[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbItems.push({
        name: label,
        url: `${SITE_URL}/${locale}${currentPath}`,
      });
    }

    const breadcrumbScript = formatStructuredData(getBreadcrumbSchema(breadcrumbItems));
    scripts = [...scripts, ...breadcrumbScript];
  }

  return {
    meta: formatMetaTags(meta, { locale }),
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
