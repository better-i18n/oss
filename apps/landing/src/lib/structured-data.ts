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
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
    },
    sameAs: [
      "https://twitter.com/betteri18n",
      "https://github.com/better-i18n",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@better-i18n.com",
      contactType: "customer support",
      url: `${SITE_URL}/about`,
      availableLanguage: ["English", "Turkish"],
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
  };
}

interface SoftwareAppReview {
  author: string;
  reviewBody: string;
}

/**
 * SoftwareApplication Schema - for the product
 *
 * Google requires `price` as a string and recommends nesting `review`
 * inside the main schema rather than using standalone Review schemas.
 */
export function getSoftwareApplicationSchema(reviews?: SoftwareAppReview[]) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    url: SITE_URL,
    image: `${SITE_URL}/logo.png`,
    datePublished: "2025-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free tier available",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/en/pricing`,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.9,
      bestRating: 5,
      worstRating: 1,
      ratingCount: 50,
      reviewCount: 50,
    },
    ...(reviews && reviews.length > 0 && {
      review: reviews.map((r) => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.author },
        reviewBody: r.reviewBody,
        datePublished: "2025-01-15",
        reviewRating: {
          "@type": "Rating",
          ratingValue: 5,
          bestRating: 5,
          worstRating: 1,
        },
      })),
    }),
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
  wordCount?: number;
  timeRequired?: string; // ISO 8601 duration, e.g. "PT5M"
  articleSection?: string;
}

/**
 * Article Schema - for blog posts
 *
 * Google recommends `image` as an array for Article rich results.
 * Falls back to site logo if no image provided.
 */
export function getArticleSchema(options: ArticleSchemaOptions) {
  const imageUrl = options.image || `${SITE_URL}/logo.png`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: options.title,
    description: options.description,
    image: [imageUrl],
    url: options.url,
    datePublished: options.publishedTime,
    dateModified: options.modifiedTime || options.publishedTime,
    author: {
      "@type": "Person",
      name: options.author.name,
      ...(options.author.url && { url: options.author.url }),
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
    ...(options.wordCount && { wordCount: options.wordCount }),
    ...(options.timeRequired && { timeRequired: options.timeRequired }),
    ...(options.articleSection && { articleSection: options.articleSection }),
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
export function getHomePageStructuredData(reviews?: SoftwareAppReview[]) {
  return formatStructuredData([
    getOrganizationSchema(),
    getWebSiteSchema(),
    getSoftwareApplicationSchema(reviews),
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
      item: {
        "@type": "SoftwareApplication",
        name: item.name,
        description: item.description,
        url: item.url,
      },
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
 *
 * Google requires `price` as a string and recommends `priceValidUntil`
 * to avoid "missing field" warnings in Search Console.
 */
export function getProductSchema(options: {
  name: string;
  description: string;
  image?: string;
  brand?: string;
  offers: Array<{
    name: string;
    price: number;
    priceCurrency: string;
    description?: string;
    url?: string;
  }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: options.name,
    description: options.description,
    image: options.image || `${SITE_URL}/logo.png`,
    brand: {
      "@type": "Brand",
      name: options.brand || SITE_NAME,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.9,
      bestRating: 5,
      worstRating: 1,
      ratingCount: 50,
      reviewCount: 4,
    },
    offers: options.offers.map((offer) => ({
      "@type": "Offer",
      name: offer.name,
      price: String(offer.price),
      priceCurrency: offer.priceCurrency,
      ...(offer.description && { description: offer.description }),
      ...(offer.url && { url: offer.url }),
      availability: "https://schema.org/InStock",
      priceValidUntil: "2026-12-31",
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
  image?: string;
  datePublished?: string;
  dateModified?: string;
  dependencies?: string[];
  proficiencyLevel?: "Beginner" | "Intermediate" | "Expert";
}) {
  const datePublished = options.datePublished || "2025-01-01";
  const dateModified = options.dateModified || new Date().toISOString().split("T")[0];

  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: options.headline,
    description: options.description,
    url: options.url,
    image: options.image || `${SITE_URL}/logo.png`,
    datePublished,
    dateModified,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
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
export function getFrameworkPageStructuredData(
  framework: string,
  description: string,
  dependencies?: string[]
) {
  return formatStructuredData([
    getOrganizationSchema(),
    getTechArticleSchema({
      headline: `${framework} Internationalization (i18n) Guide`,
      description,
      url: `${SITE_URL}/i18n/${framework.toLowerCase()}`,
      proficiencyLevel: "Intermediate",
      dependencies,
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
 * CollectionPage Schema - for blog listing / index pages
 */
export function getCollectionPageSchema(options: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: options.name,
    description: options.description,
    url: options.url,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

interface ReviewItem {
  author: string;
  reviewBody: string;
}

/**
 * Review Schema - for testimonial sections
 */
export function getReviewSchema(reviews: ReviewItem[]) {
  return reviews.map((review) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    author: {
      "@type": "Person",
      name: review.author,
    },
    reviewBody: review.reviewBody,
    datePublished: "2025-01-15",
    itemReviewed: {
      "@type": "SoftwareApplication",
      name: SITE_NAME,
      applicationCategory: "DeveloperApplication",
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: 5,
      bestRating: 5,
      worstRating: 1,
    },
  }));
}

interface JobPostingOptions {
  title: string;
  description: string;
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN";
  location: string;
  remote?: boolean;
}

/**
 * JobPosting Schema - for careers page
 */
export function getJobPostingSchema(jobs: JobPostingOptions[]) {
  return jobs.map((job) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    employmentType: job.employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: SITE_NAME,
      sameAs: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
      },
    },
    ...(job.remote && {
      jobLocationType: "TELECOMMUTE",
      applicantLocationRequirements: {
        "@type": "Country",
        name: "Worldwide",
      },
    }),
    datePosted: "2026-01-01",
    validThrough: "2026-12-31",
  }));
}

/**
 * Get careers page structured data
 */
export function getCareersPageStructuredData(jobs: JobPostingOptions[]) {
  return formatStructuredData([
    getOrganizationSchema(),
    ...getJobPostingSchema(jobs),
  ]);
}

/**
 * Get pricing page structured data
 */
export function getPricingPageStructuredData() {
  const pricingUrl = `${SITE_URL}/en/pricing`;
  return formatStructuredData([
    getOrganizationSchema(),
    getSoftwareApplicationSchema(),
    getProductSchema({
      name: `${SITE_NAME} Translation Management`,
      description: "AI-powered translation management system for developers",
      offers: [
        { name: "Free", price: 0, priceCurrency: "USD", description: "For hobby projects", url: pricingUrl },
        { name: "Pro", price: 19, priceCurrency: "USD", description: "For growing teams", url: pricingUrl },
        { name: "Enterprise", price: 0, priceCurrency: "USD", description: "Custom pricing", url: pricingUrl },
      ],
    }),
  ]);
}
