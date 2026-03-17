/**
 * SEO utilities for Help Center — structured data, meta tags, etc.
 */

import { SITE_URL, SITE_NAME } from "./config";
import { getCachedLocales } from "./locales";

// ─── Canonical URLs ─────────────────────────────────────────────────

export function getCanonicalUrl(locale: string, pathname: string = "/"): string {
  const cleanPath = pathname.replace(/^\/+/, "").replace(/\/+$/, "");
  return cleanPath
    ? `${SITE_URL}/${locale}/${cleanPath}/`
    : `${SITE_URL}/${locale}/`;
}

// ─── Alternate Links (hreflang) ─────────────────────────────────────

export function getAlternateLinks(pathname: string = "/", locales?: readonly string[]) {
  if (!locales) locales = getCachedLocales();
  const cleanPath = pathname.replace(/^\/[a-z]{2}\//, "/").replace(/^\/+/, "").replace(/\/+$/, "");

  const links = locales.map((locale) => ({
    rel: "alternate" as const,
    href: cleanPath
      ? `${SITE_URL}/${locale}/${cleanPath}/`
      : `${SITE_URL}/${locale}/`,
    hrefLang: locale,
  }));

  links.push({
    rel: "alternate" as const,
    href: cleanPath ? `${SITE_URL}/en/${cleanPath}/` : `${SITE_URL}/en/`,
    hrefLang: "x-default",
  });

  return links;
}

export function getCanonicalLink(locale: string, pathname: string = "/") {
  return {
    rel: "canonical" as const,
    href: getCanonicalUrl(locale, pathname),
  };
}

// ─── Structured Data ────────────────────────────────────────────────

export function formatStructuredData(schema: object | object[]) {
  const schemas = Array.isArray(schema) ? schema : [schema];
  return schemas.map((s) => ({
    type: "application/ld+json" as const,
    children: JSON.stringify(s),
  }));
}

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: "https://better-i18n.com",
    logo: { "@type": "ImageObject", url: "https://better-i18n.com/logo.png" },
  };
}

export function getWebSiteSchema(locale?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${SITE_NAME} ${locale ? "Help Center" : ""}`.trim(),
    url: SITE_URL,
    ...(locale && { inLanguage: locale }),
  };
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

interface ArticleSchemaOptions {
  title: string;
  description: string;
  url: string;
  dateModified?: string;
  inLanguage?: string;
}

export function getArticleSchema(options: ArticleSchemaOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: options.title,
    description: options.description,
    url: options.url,
    ...(options.dateModified && { dateModified: options.dateModified }),
    ...(options.inLanguage && { inLanguage: options.inLanguage }),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: "https://better-i18n.com/logo.png" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": options.url },
  };
}

interface FAQItem {
  question: string;
  answer: string;
}

export function getFAQSchema(items: FAQItem[], locale?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(locale && { inLanguage: locale }),
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function getCollectionPageSchema(options: {
  name: string;
  description: string;
  url: string;
  inLanguage?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: options.name,
    description: options.description,
    url: options.url,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    ...(options.inLanguage && { inLanguage: options.inLanguage }),
  };
}

// ─── Meta Tags ──────────────────────────────────────────────────────

const OG_LOCALE_MAP: Record<string, string> = {
  en: "en_US", tr: "tr_TR", de: "de_DE", fr: "fr_FR",
  es: "es_ES", pt: "pt_BR", ja: "ja_JP", ko: "ko_KR",
};

function toOgLocale(locale: string): string {
  return OG_LOCALE_MAP[locale] ?? `${locale}_${locale.toUpperCase()}`;
}

export function formatMetaTags(options: {
  title: string;
  description: string;
  locale: string;
  pathname?: string;
  locales?: string[];
}) {
  const canonicalUrl = getCanonicalUrl(options.locale, options.pathname);

  return [
    { title: options.title },
    { name: "description", content: options.description },
    { property: "og:title", content: options.title },
    { property: "og:description", content: options.description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: canonicalUrl },
    { property: "og:site_name", content: `${SITE_NAME} Help Center` },
    { property: "og:locale", content: toOgLocale(options.locale) },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: options.title },
    { name: "twitter:description", content: options.description },
    { name: "robots", content: "index, follow" },
  ];
}

export function getDefaultStructuredData(locale?: string) {
  return formatStructuredData([
    getOrganizationSchema(),
    getWebSiteSchema(locale),
  ]);
}
