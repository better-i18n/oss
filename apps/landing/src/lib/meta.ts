import { getCachedLocales } from "./locales";
import { SITE_URL } from "@/seo/pages";
const SITE_NAME = "Better i18n";
const OG_SERVICE_URL = "https://og.better-i18n.com";
const DEFAULT_OG_IMAGE = `${OG_SERVICE_URL}/og`;
const TWITTER_HANDLE = "@betteri18n";
const MAX_TITLE_LENGTH = 70;
const BRAND_SUFFIX_SEPARATOR_PIPE = ` | ${SITE_NAME}`;
const BRAND_SUFFIX_SEPARATOR_DASH = ` - ${SITE_NAME}`;

interface MetaMessages {
  [key: string]: string | Record<string, unknown>;
}

/**
 * Access a nested value using dot notation path
 */
function getNestedValue(obj: MetaMessages, path: string): string | undefined {
  const keys = path.split(".");
  let current: unknown = obj;

  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return typeof current === "string" ? current : undefined;
}

/**
 * Ensure a title stays within the SERP-safe character limit.
 * Strategy: if the title exceeds MAX_TITLE_LENGTH and contains a brand suffix
 * (e.g. "| Better i18n" or "- Better i18n"), remove it first.
 * If still too long, hard-truncate with ellipsis.
 */
function truncateTitle(title: string): string {
  if (title.length <= MAX_TITLE_LENGTH) return title;

  // Try removing brand suffix first (pipe or dash separator)
  if (title.endsWith(BRAND_SUFFIX_SEPARATOR_PIPE)) {
    const stripped = title.slice(0, -BRAND_SUFFIX_SEPARATOR_PIPE.length).trimEnd();
    if (stripped.length <= MAX_TITLE_LENGTH) return stripped;
    return `${stripped.slice(0, MAX_TITLE_LENGTH - 1)}\u2026`;
  }

  if (title.endsWith(BRAND_SUFFIX_SEPARATOR_DASH)) {
    const stripped = title.slice(0, -BRAND_SUFFIX_SEPARATOR_DASH.length).trimEnd();
    if (stripped.length <= MAX_TITLE_LENGTH) return stripped;
    return `${stripped.slice(0, MAX_TITLE_LENGTH - 1)}\u2026`;
  }

  return `${title.slice(0, MAX_TITLE_LENGTH - 1)}\u2026`;
}

interface LocalizedMetaResult {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  canonicalUrl: string;
}

interface MetaOptions {
  locale: string;
  pathname?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

/**
 * Get the canonical URL for a page.
 * All locales (including English) use /$locale/ prefix to avoid 301 redirects.
 */
export function getCanonicalUrl(locale: string, pathname: string = "/"): string {
  const cleanPath = pathname.replace(/^\/+/, "");

  return cleanPath
    ? `${SITE_URL}/${locale}/${cleanPath}`
    : `${SITE_URL}/${locale}`;
}

/**
 * Extract localized meta tags from i18n messages
 * @param messages - All loaded i18n messages from Better i18n CDN
 * @param pageKey - Meta page key (e.g., 'home', 'forTranslators', 'forDevelopers')
 * @param options - Additional options like locale and pathname
 * @returns Localized meta tag values
 */
export function getLocalizedMeta(
  messages: MetaMessages,
  pageKey: string,
  options: MetaOptions = { locale: "en" }
): LocalizedMetaResult {
  const metaPrefix = `meta.${pageKey}`;
  const { locale, pathname = "/", ogImage, ogType = "website" } = options;

  const title = getNestedValue(messages, `${metaPrefix}.title`);
  const description = getNestedValue(messages, `${metaPrefix}.description`);
  const ogTitleValue = getNestedValue(messages, `${metaPrefix}.ogTitle`);
  const ogDescriptionValue = getNestedValue(messages, `${metaPrefix}.ogDescription`);
  const ogImageValue = getNestedValue(messages, `${metaPrefix}.ogImage`);

  const safeTitle = truncateTitle(title || SITE_NAME);

  return {
    title: safeTitle,
    description: description || "",
    ogTitle: ogTitleValue || title || SITE_NAME,
    ogDescription: ogDescriptionValue || description || "",
    ogImage: ogImage || ogImageValue || DEFAULT_OG_IMAGE,
    ogType,
    canonicalUrl: getCanonicalUrl(locale, pathname),
  };
}

/**
 * Format meta tags for TanStack Router head function
 * @param meta - Localized meta values from getLocalizedMeta()
 * @param options - Additional options for article-specific meta
 * @returns Array of meta tag objects for TanStack Router
 */
export function formatMetaTags(
  meta: LocalizedMetaResult,
  options: Partial<MetaOptions> & { locales?: string[] } = {}
) {
  const tags = [
    // Basic meta tags
    { title: meta.title },
    { name: "description", content: meta.description },

    // Open Graph
    { property: "og:title", content: meta.ogTitle },
    { property: "og:description", content: meta.ogDescription },
    { property: "og:image", content: meta.ogImage },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:type", content: meta.ogType },
    { property: "og:url", content: meta.canonicalUrl },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:locale", content: options.locale || "en" },

    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: TWITTER_HANDLE },
    { name: "twitter:title", content: meta.ogTitle },
    { name: "twitter:description", content: meta.ogDescription },
    { name: "twitter:image", content: meta.ogImage },

    // Additional SEO
    { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
  ];

  // Add article-specific meta tags
  if (meta.ogType === "article" && options.publishedTime) {
    tags.push({ property: "article:published_time", content: options.publishedTime });

    if (options.modifiedTime) {
      tags.push({ property: "article:modified_time", content: options.modifiedTime });
    }

    if (options.author) {
      tags.push({ property: "article:author", content: options.author });
    }
  }

  // Add og:locale:alternate tags for other locales
  if (options.locales) {
    const currentLocale = options.locale || "en";
    for (const loc of options.locales) {
      if (loc !== currentLocale) {
        tags.push({ property: "og:locale:alternate", content: loc });
      }
    }
  }

  return tags;
}

/**
 * Get alternate language links for hreflang tags.
 * All locales use /$locale/ prefix so hreflang URLs return HTTP 200 (not 301 redirects).
 */
export function getAlternateLinks(pathname: string = "/", locales?: string[]) {
  if (!locales) {
    locales = getCachedLocales();
  }
  const cleanPath = pathname.replace(/^\/[a-z]{2}\//, "/").replace(/^\/+/, "");

  const links = locales.map((locale) => ({
    rel: "alternate",
    href: cleanPath
      ? `${SITE_URL}/${locale}/${cleanPath}`
      : `${SITE_URL}/${locale}`,
    hrefLang: locale,
  }));

  // x-default points to the English version (default locale) with /en/ prefix to avoid redirects
  links.push({
    rel: "alternate",
    href: cleanPath ? `${SITE_URL}/en/${cleanPath}` : `${SITE_URL}/en`,
    hrefLang: "x-default",
  });

  return links;
}

/**
 * Get canonical link
 */
export function getCanonicalLink(locale: string, pathname: string = "/") {
  return {
    rel: "canonical",
    href: getCanonicalUrl(locale, pathname),
  };
}

export function buildOgImageUrl(
  endpoint: "og" | "og/blog" | "og/docs",
  params: Record<string, string | undefined>
): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) searchParams.set(key, value);
  }
  const qs = searchParams.toString();
  return qs ? `${OG_SERVICE_URL}/${endpoint}?${qs}` : `${OG_SERVICE_URL}/${endpoint}`;
}

export { SITE_URL } from "@/seo/pages";
export { SITE_NAME, DEFAULT_OG_IMAGE, OG_SERVICE_URL, TWITTER_HANDLE };
