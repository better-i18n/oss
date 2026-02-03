import { SITE_URL, SITE_NAME } from "./meta";

/**
 * Organization Schema - represents the company/brand
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
      "https://twitter.com/betteri18n",
      "https://github.com/better-i18n",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@better-i18n.com",
      contactType: "customer support",
    },
  };
}

/**
 * WebSite Schema - for sitelinks search box
 */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/docs?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * SoftwareApplication Schema - for the product
 */
export function getSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    url: SITE_URL,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free tier available",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "50",
    },
  };
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * BreadcrumbList Schema
 */
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
  image: string;
  publishedTime: string;
  modifiedTime?: string;
  author: {
    name: string;
    url?: string;
  };
}

/**
 * Article Schema - for blog posts
 */
export function getArticleSchema(options: ArticleSchemaOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: options.title,
    description: options.description,
    image: options.image,
    url: options.url,
    datePublished: options.publishedTime,
    dateModified: options.modifiedTime || options.publishedTime,
    author: {
      "@type": "Person",
      name: options.author.name,
      url: options.author.url,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": options.url,
    },
  };
}

interface FAQItem {
  question: string;
  answer: string;
}

/**
 * FAQPage Schema
 */
export function getFAQSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
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

/**
 * Format structured data as script tag for TanStack Router head
 */
export function formatStructuredData(schema: object | object[]) {
  const schemas = Array.isArray(schema) ? schema : [schema];

  return schemas.map((s) => ({
    type: "application/ld+json",
    children: JSON.stringify(s),
  }));
}

/**
 * Get default page structured data (Organization + WebSite)
 */
export function getDefaultStructuredData() {
  return formatStructuredData([
    getOrganizationSchema(),
    getWebSiteSchema(),
  ]);
}

/**
 * Get home page structured data
 */
export function getHomePageStructuredData() {
  return formatStructuredData([
    getOrganizationSchema(),
    getWebSiteSchema(),
    getSoftwareApplicationSchema(),
  ]);
}

interface ComparisonItem {
  name: string;
  description: string;
  url: string;
}

/**
 * ItemList Schema - for comparison pages
 */
export function getComparisonSchema(options: {
  title: string;
  description: string;
  items: ComparisonItem[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: options.title,
    description: options.description,
    itemListElement: options.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      description: item.description,
      url: item.url,
    })),
  };
}

interface HowToStep {
  name: string;
  text: string;
  url?: string;
}

/**
 * HowTo Schema - for educational/guide pages
 */
export function getHowToSchema(options: {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string; // ISO 8601 duration format
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: options.name,
    description: options.description,
    ...(options.totalTime && { totalTime: options.totalTime }),
    step: options.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.url && { url: step.url }),
    })),
  };
}

/**
 * Product Schema - for pricing page
 */
export function getProductSchema(options: {
  name: string;
  description: string;
  brand?: string;
  offers: Array<{
    name: string;
    price: string;
    priceCurrency: string;
    description?: string;
  }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: options.name,
    description: options.description,
    brand: {
      "@type": "Brand",
      name: options.brand || SITE_NAME,
    },
    offers: options.offers.map((offer) => ({
      "@type": "Offer",
      name: offer.name,
      price: offer.price,
      priceCurrency: offer.priceCurrency,
      ...(offer.description && { description: offer.description }),
      availability: "https://schema.org/InStock",
    })),
  };
}

/**
 * WebPage Schema with Speakable - for all pages
 */
export function getWebPageSchema(options: {
  name: string;
  description: string;
  url: string;
  speakable?: string[]; // CSS selectors for speakable content
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: options.name,
    description: options.description,
    url: options.url,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    ...(options.speakable && {
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: options.speakable,
      },
    }),
  };
}

/**
 * TechArticle Schema - for framework/technical pages
 */
export function getTechArticleSchema(options: {
  headline: string;
  description: string;
  url: string;
  dependencies?: string[];
  proficiencyLevel?: "Beginner" | "Intermediate" | "Expert";
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: options.headline,
    description: options.description,
    url: options.url,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    ...(options.dependencies && { dependencies: options.dependencies.join(", ") }),
    ...(options.proficiencyLevel && { proficiencyLevel: options.proficiencyLevel }),
  };
}

/**
 * Get comparison page structured data
 */
export function getComparisonPageStructuredData(competitorName: string) {
  return formatStructuredData([
    getOrganizationSchema(),
    getWebPageSchema({
      name: `${SITE_NAME} vs ${competitorName} Comparison`,
      description: `Compare ${SITE_NAME} with ${competitorName} - features, pricing, and developer experience.`,
      url: `${SITE_URL}/compare/${competitorName.toLowerCase()}`,
      speakable: ["h1", "h2", ".comparison-summary"],
    }),
  ]);
}

/**
 * Get framework page structured data
 */
export function getFrameworkPageStructuredData(framework: string, description: string) {
  return formatStructuredData([
    getOrganizationSchema(),
    getTechArticleSchema({
      headline: `${framework} Internationalization (i18n) Guide`,
      description,
      url: `${SITE_URL}/i18n/${framework.toLowerCase()}`,
      proficiencyLevel: "Intermediate",
    }),
  ]);
}

/**
 * Get educational page structured data
 */
export function getEducationalPageStructuredData(options: {
  title: string;
  description: string;
  url: string;
}) {
  return formatStructuredData([
    getOrganizationSchema(),
    getWebPageSchema({
      name: options.title,
      description: options.description,
      url: options.url,
      speakable: ["h1", "h2", ".intro"],
    }),
  ]);
}

/**
 * Get pricing page structured data
 */
export function getPricingPageStructuredData() {
  return formatStructuredData([
    getOrganizationSchema(),
    getSoftwareApplicationSchema(),
    getProductSchema({
      name: `${SITE_NAME} Translation Management`,
      description: "AI-powered translation management system for developers",
      offers: [
        { name: "Free", price: "0", priceCurrency: "USD", description: "For hobby projects" },
        { name: "Pro", price: "49", priceCurrency: "USD", description: "For growing teams" },
        { name: "Enterprise", price: "0", priceCurrency: "USD", description: "Custom pricing" },
      ],
    }),
  ]);
}
