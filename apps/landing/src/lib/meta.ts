import { getCachedLocales } from "./locales";

const SITE_URL = "https://better-i18n.com";
const SITE_NAME = "Better i18n";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
const TWITTER_HANDLE = "@betteri18n";

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
 * Get the canonical URL for a page
 */
export function getCanonicalUrl(locale: string, pathname: string = "/"): string {
  const cleanPath = pathname.replace(/^\/+/, "");

  if (locale === "en") {
    return cleanPath ? `${SITE_URL}/${cleanPath}` : SITE_URL;
  }

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

  return {
    title: title || SITE_NAME,
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
  options: Partial<MetaOptions> = {}
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
    { name: "robots", content: "index, follow" },
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

  return tags;
}

/**
 * Get alternate language links for hreflang tags
 */
export function getAlternateLinks(pathname: string = "/", locales?: string[]) {
  if (!locales) {
    locales = getCachedLocales();
  }
  const cleanPath = pathname.replace(/^\/[a-z]{2}\//, "/").replace(/^\/+/, "");

  const links = locales.map((locale) => ({
    rel: "alternate",
    href: locale === "en"
      ? (cleanPath ? `${SITE_URL}/${cleanPath}` : SITE_URL)
      : (cleanPath ? `${SITE_URL}/${locale}/${cleanPath}` : `${SITE_URL}/${locale}`),
    hrefLang: locale,
  }));

  // Add x-default (usually points to default locale)
  links.push({
    rel: "alternate",
    href: cleanPath ? `${SITE_URL}/${cleanPath}` : SITE_URL,
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

export { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, TWITTER_HANDLE };
