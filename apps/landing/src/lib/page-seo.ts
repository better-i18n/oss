import {
  getLocalizedMeta,
  formatMetaTags,
  getAlternateLinks,
  getCanonicalLink,
} from "./meta";
import {
  getDefaultStructuredData,
  getHomePageStructuredData,
  getPricingPageStructuredData,
  getComparisonPageStructuredData,
  getFrameworkPageStructuredData,
  getEducationalPageStructuredData,
  getFAQSchema,
  formatStructuredData,
} from "./structured-data";

// Re-export for convenience
export {
  getPricingPageStructuredData,
  getComparisonPageStructuredData,
  getFrameworkPageStructuredData,
  getEducationalPageStructuredData,
  getFAQSchema,
  formatStructuredData,
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
      return options?.title && options?.description
        ? getEducationalPageStructuredData({
            title: options.title,
            description: options.description,
            url: `https://better-i18n.com${options.title}`,
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
    locales = ["en", "tr", "zh"],
    isHomepage = false,
    pageType,
    structuredDataOptions,
    customStructuredData,
  } = options;

  const meta = getLocalizedMeta(messages, pageKey, {
    locale,
    pathname,
  });

  // Determine structured data: custom > pageType > isHomepage > default
  let scripts;
  if (customStructuredData) {
    scripts = customStructuredData;
  } else if (pageType) {
    scripts = getStructuredDataForPageType(pageType, structuredDataOptions);
  } else if (isHomepage) {
    scripts = getHomePageStructuredData();
  } else {
    scripts = getDefaultStructuredData();
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
