import {
  getLocalizedMeta,
  formatMetaTags,
  getAlternateLinks,
  getCanonicalLink,
  getCanonicalUrl,
  SITE_NAME,
} from "./meta";
import { getLocaleTier } from "@/seo/locale-tiers";
import { getMessages } from "@better-i18n/use-intl/server";
import { i18nConfig } from "../i18n.config";
import { filterMessages } from "./page-namespaces";
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
  getOrganizationSchema,
  getWebSiteSchema,
  getWebPageSchema,
  getToolSchema,
} from "./structured-data";
import { SITE_URL } from "./meta";

/** Default CSS selectors for speakable content across all page types */
const DEFAULT_SPEAKABLE_SELECTORS = ["h1", "h2", "[data-citation]", ".faq-answer"];

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

type PageType = "default" | "home" | "pricing" | "comparison" | "framework" | "educational" | "tool";

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
    dependencies?: string[];
    proficiencyLevel?: "Beginner" | "Intermediate" | "Expert";
    title?: string;
    description?: string;
    url?: string;
  };
  /** Custom structured data (overrides pageType) */
  customStructuredData?: ReturnType<typeof formatStructuredData>;
  /** FAQ items to auto-inject as FAQ schema + page content */
  faqItems?: Array<{ question: string; answer: string }>;
  /** Mark page as noindex (e.g., thin content with low translation coverage) */
  noindex?: boolean;
  /** Fallback meta when CDN-provided meta keys do not exist yet */
  metaFallback?: {
    title: string;
    description: string;
    ogTitle?: string;
    ogDescription?: string;
  };
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
      return getHomePageStructuredData({});
    case "pricing":
      return getPricingPageStructuredData({});
    case "comparison":
      return options?.competitorName
        ? getComparisonPageStructuredData(options.competitorName)
        : getDefaultStructuredData();
    case "framework":
      return options?.framework && options?.frameworkDescription
        ? getFrameworkPageStructuredData(
            options.framework,
            options.frameworkDescription,
            options.dependencies,
            options.proficiencyLevel
          )
        : getDefaultStructuredData();
    case "educational":
      return options?.title && options?.description && options?.url
        ? getEducationalPageStructuredData({
            title: options.title,
            description: options.description,
            url: options.url,
          })
        : getDefaultStructuredData();
    case "tool":
      return formatStructuredData([
        getOrganizationSchema(),
        getToolSchema({
          name: options?.title ?? "Free i18n Tool",
          description: options?.description ?? "",
          url: options?.url ?? SITE_URL,
        }),
      ]);
    case "default":
    default:
      return options?.title && options?.description
        ? formatStructuredData([
            getOrganizationSchema(),
            getWebSiteSchema(),
            getWebPageSchema({
              name: options.title,
              description: options.description,
              url: options.url || "",
              speakable: DEFAULT_SPEAKABLE_SELECTORS,
            }),
          ])
        : getDefaultStructuredData();
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
  const resolvedMeta = {
    ...meta,
    title:
      meta.title === SITE_NAME && options.metaFallback?.title
        ? options.metaFallback.title
        : meta.title,
    description: meta.description || options.metaFallback?.description || "",
    ogTitle:
      meta.ogTitle === SITE_NAME
        ? options.metaFallback?.ogTitle || options.metaFallback?.title || meta.ogTitle
        : meta.ogTitle,
    ogDescription:
      meta.ogDescription ||
      options.metaFallback?.ogDescription ||
      options.metaFallback?.description ||
      "",
  };

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
    scripts = getHomePageStructuredData({});
  } else {
    scripts = getDefaultStructuredData();
  }

  // Generate breadcrumb schema for inner pages (skip homepage)
  const cleanPath = pathname.replace(/^\/+/, "");
  if (cleanPath) {
    const segments = cleanPath.split("/").filter(Boolean);
    const homeLabel = messages["breadcrumbs.home"] ?? "Home";
    const breadcrumbItems = [
      { name: homeLabel, url: `${SITE_URL}/${locale}/` },
    ];

    let currentPath = "";
    for (const segment of segments) {
      currentPath += `/${segment}`;
      const label = messages[`breadcrumbs.${segment}`]
        ?? segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbItems.push({
        name: label,
        url: `${SITE_URL}/${locale}${currentPath}/`,
      });
    }

    const breadcrumbScript = formatStructuredData(getBreadcrumbSchema(breadcrumbItems));
    scripts = [...scripts, ...breadcrumbScript];
  }

  // Auto-inject FAQ schema when FAQ items are provided
  if (options.faqItems && options.faqItems.length > 0) {
    const faqScript = formatStructuredData(
      getFAQSchema(options.faqItems, locale)
    );
    scripts = [...scripts, ...faqScript];
  }

  return {
    meta: formatMetaTags(resolvedMeta, {
      locale,
      locales,
      noindex: options.noindex || getLocaleTier(locale) === "tier3",
    }),
    links: [
      ...getAlternateLinks(pathname, locales),
      getCanonicalLink(locale, pathname),
    ],
    scripts,
  };
}

/**
 * Namespaces needed by head() / getPageHead():
 * - "meta" for getLocalizedMeta() which reads meta.{pageKey}.title etc.
 * - "breadcrumbs" for breadcrumb schema generation
 */
const HEAD_NAMESPACES = ["meta", "breadcrumbs"] as const;

/**
 * Create a standard async loader for route head() meta tags.
 *
 * Only serializes the minimal data needed by head() into the HTML:
 * - `messages`: filtered to HEAD_NAMESPACES only (meta + breadcrumbs)
 *
 * locale/locales are NOT returned — head() should use params.locale
 * and context.locales to avoid duplicating data already in root loader's $_TSR.
 *
 * Page components get their i18n messages from the root loader's BetterI18nProvider.
 *
 * @param extraNamespaces - Additional namespaces the head() function needs
 *   beyond meta + breadcrumbs (e.g., ["pricingPage"] for FAQ schema extraction).
 */
export function createPageLoader(extraNamespaces?: readonly string[]) {
  const namespaces = extraNamespaces
    ? [...HEAD_NAMESPACES, ...extraNamespaces]
    : [...HEAD_NAMESPACES];

  return async ({ context }: { context: { locale: string; locales: string[] } }) => {
    const allMessages = await getMessages({
      project: i18nConfig.project,
      locale: context.locale,
    });
    const messages = filterMessages(allMessages, namespaces);
    return { messages, locale: context.locale, locales: context.locales };
  };
}

/**
 * Helper type for loader data
 */
export interface PageLoaderData {
  messages: Record<string, string>;
  locale: string;
  locales: string[];
}

/** Category labels for breadcrumb generation, keyed by first path segment */
const CATEGORY_LABELS: Readonly<Record<string, { readonly label: string; readonly href: string }>> = {
  "i18n": { label: "i18n Guides", href: "/i18n" },
  "compare": { label: "Comparisons", href: "/compare" },
  "blog": { label: "Blog", href: "/blog" },
  "features": { label: "Features", href: "/features" },
  "tools": { label: "Free Tools", href: "/tools" },
};

/**
 * Generate breadcrumb items array from a pathname for the visual MarketingBreadcrumb component.
 *
 * @param pathname - URL pathname without locale prefix (e.g., "/i18n/react", "/compare/crowdin")
 * @param messages - i18n messages for translating breadcrumb labels (breadcrumbs namespace)
 * @returns Breadcrumb items array where the last item has no href (current page)
 */
export function getBreadcrumbItems(
  pathname: string,
  messages: Readonly<Record<string, string>> = {},
): ReadonlyArray<{ readonly label: string; readonly href?: string }> {
  const homeLabel = messages["breadcrumbs.home"] ?? "Home";
  const cleanPath = pathname.replace(/^\/+/, "").replace(/\/+$/, "");

  if (!cleanPath) return [];

  const segments = cleanPath.split("/").filter(Boolean);
  const items: Array<{ readonly label: string; readonly href?: string }> = [
    { label: homeLabel, href: "/" },
  ];

  if (segments.length === 1) {
    // Single segment: Home > Page (e.g., /for-developers, /pricing)
    const segmentLabel = messages[`breadcrumbs.${segments[0]}`]
      ?? segments[0].replace(/^for-/, "For ").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    items.push({ label: segmentLabel });
  } else if (segments.length === 2) {
    const category = CATEGORY_LABELS[segments[0]];
    const categoryLabel = messages[`breadcrumbs.${segments[0]}`] ?? category?.label
      ?? segments[0].charAt(0).toUpperCase() + segments[0].slice(1);
    items.push({ label: categoryLabel, href: category?.href ?? `/${segments[0]}` });

    const pageSegment = segments[segments.length - 1];
    const pageLabel = messages[`breadcrumbs.${pageSegment}`]
      ?? pageSegment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    items.push({ label: pageLabel });
  } else {
    // 3+ segments: Home > Category > Subcategory > ... > Page
    const category = CATEGORY_LABELS[segments[0]];
    const categoryLabel = messages[`breadcrumbs.${segments[0]}`] ?? category?.label
      ?? segments[0].charAt(0).toUpperCase() + segments[0].slice(1);
    items.push({ label: categoryLabel, href: category?.href ?? `/${segments[0]}` });

    for (let i = 1; i < segments.length - 1; i++) {
      const subPath = segments.slice(0, i + 1).join("/");
      const subLabel = messages[`breadcrumbs.${segments[i]}`]
        ?? segments[i].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      items.push({ label: subLabel, href: `/${subPath}` });
    }

    const pageSegment = segments[segments.length - 1];
    const pageLabel = messages[`breadcrumbs.${pageSegment}`]
      ?? pageSegment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    items.push({ label: pageLabel });
  }

  return items;
}
