import { SITE_URL, SITE_NAME } from "./meta";

const BUILD_DATE = process.env.BUILD_DATE ?? "2026-03-12";
const FOUNDING_DATE = "2026";

/** English fallback — used when i18n messages are not available */
const DEFAULT_SLOGAN = "Ship multilingual apps faster";
const DEFAULT_KNOWS_ABOUT: readonly string[] = [
  "internationalization", "localization", "translation management",
  "i18n", "l10n", "multilingual SEO", "software localization",
];

/**
 * Creates a schema.org SoftwareApplication mention for a framework.
 * Used in TechArticle `mentions` to help AI models understand entity relationships.
 */
export function getFrameworkMention(frameworkName: string, frameworkUrl: string) {
  return {
    "@type": "SoftwareApplication" as const,
    name: frameworkName,
    url: frameworkUrl,
  };
}

/**
 * Organization Schema - represents the company/brand.
 *
 * `slogan` and `knowsAbout` should come from i18n messages (schema namespace)
 * via the caller's loaderData. Falls back to English defaults when not provided.
 */
export function getOrganizationSchema(options?: {
  locale?: string;
  availableLanguages?: readonly string[];
  slogan?: string;
  knowsAbout?: readonly string[];
  contactType?: string;
}) {
  const languages = options?.availableLanguages ?? ["en"];
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
    },
    foundingDate: FOUNDING_DATE,
    slogan: options?.slogan ?? DEFAULT_SLOGAN,
    knowsAbout: options?.knowsAbout ? [...options.knowsAbout] : [...DEFAULT_KNOWS_ABOUT],
    sameAs: [
      "https://twitter.com/betteri18n",
      "https://github.com/better-i18n",
      "https://www.linkedin.com/company/better-i18n",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@better-i18n.com",
      contactType: options?.contactType ?? "customer support",
      url: `${SITE_URL}/about`,
      availableLanguage: [...languages],
    },
  };
}

/**
 * WebSite Schema - for sitelinks search box
 */
export function getWebSiteSchema(locale?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    ...(locale && { inLanguage: locale }),
  };
}

/**
 * SoftwareApplication Schema - for the product
 *
 * Google requires `price` as a string.
 */
export function getSoftwareApplicationSchema(options?: {
  offerDescription?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    url: SITE_URL,
    image: `${SITE_URL}/logo.png`,
    datePublished: "2026-01-01",
    dateModified: BUILD_DATE,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: options?.offerDescription ?? "Free tier available",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/en/pricing`,
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
  wordCount?: number;
  timeRequired?: string; // ISO 8601 duration, e.g. "PT5M"
  articleSection?: string;
  type?: "Article" | "BlogPosting";
  inLanguage?: string;
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
    "@type": options.type ?? "Article",
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
    ...(options.inLanguage && { inLanguage: options.inLanguage }),
  };
}

interface FAQItem {
  question: string;
  answer: string;
}

/**
 * FAQPage Schema
 */
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
export function getDefaultStructuredData(locale?: string) {
  return formatStructuredData([
    getOrganizationSchema(locale ? { locale } : undefined),
    getWebSiteSchema(locale),
  ]);
}

/**
 * Verified customer testimonials — real quotes from real users.
 * These are displayed in the Testimonials UI component and also
 * emitted as schema.org Review markup on the homepage.
 *
 * NOTE: No aggregateRating is included because these are direct
 * testimonials, not sourced from a third-party review platform
 * (G2, Capterra, etc.). Adding aggregateRating without a verifiable
 * source risks a Google manual action for fabricated structured data.
 */
const TESTIMONIAL_REVIEWS = [
  {
    author: "Samet Selcuk",
    jobTitle: "Founder",
    worksFor: "Hellospace",
    url: "https://hellospace.world/",
    quote: "Better i18n completely changed how we handle localization. The AI translations are incredibly accurate and context-aware.",
  },
  {
    author: "Tevfik Can Karanfil",
    jobTitle: "Founder",
    worksFor: "Carna",
    url: "http://carna.ai/",
    quote: "The git-native workflow is a game changer. We went from manual JSON file management to fully automated translations.",
  },
  {
    author: "Eray Gündoğmuş",
    jobTitle: "Software Engineer",
    worksFor: "Aceware",
    url: "https://aceware.io/",
    quote: "Setting up took minutes, not days. The CDN delivery means our translations load instantly across all regions.",
  },
  {
    author: "Arhun Hınçalan",
    jobTitle: "Engineering Manager",
    worksFor: "Masraff",
    url: "https://masraff.ai",
    quote: "Better i18n transformed our localization pipeline. We manage 20+ languages across our fintech products with zero friction — the AI understands financial terminology perfectly.",
  },
] as const;

function getReviewSchemas() {
  return TESTIMONIAL_REVIEWS.map((t) => ({
    "@type": "Review" as const,
    author: {
      "@type": "Person" as const,
      name: t.author,
      jobTitle: t.jobTitle,
      worksFor: {
        "@type": "Organization" as const,
        name: t.worksFor,
        url: t.url,
      },
    },
    reviewBody: t.quote,
    itemReviewed: {
      "@type": "SoftwareApplication" as const,
      name: SITE_NAME,
    },
  }));
}

/**
 * Get home page structured data
 */
export function getHomePageStructuredData(options?: {
  locale?: string;
  offerDescription?: string;
}) {
  return formatStructuredData([
    getOrganizationSchema(options?.locale ? { locale: options.locale } : undefined),
    getWebSiteSchema(options?.locale),
    getSoftwareApplicationSchema({
      offerDescription: options?.offerDescription,
    }),
    ...getReviewSchemas(),
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
        "@type": "Thing",
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
  inLanguage?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: options.name,
    description: options.description,
    ...(options.totalTime && { totalTime: options.totalTime }),
    ...(options.inLanguage && { inLanguage: options.inLanguage }),
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
 * WebApplication Schema — for free interactive tools.
 */
export function getToolSchema(options: {
  readonly name: string;
  readonly description: string;
  readonly url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: options.name,
    description: options.description,
    url: options.url,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires a modern web browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
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
    offers: options.offers.map((offer) => ({
      "@type": "Offer",
      name: offer.name,
      price: String(offer.price),
      priceCurrency: offer.priceCurrency,
      ...(offer.description && { description: offer.description }),
      ...(offer.url && { url: offer.url }),
      availability: "https://schema.org/InStock",
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
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
  mentions?: ReadonlyArray<{ readonly "@type": string; readonly name: string; readonly url: string }>;
}) {
  const datePublished = options.datePublished || "2026-01-01";
  const dateModified = options.dateModified || BUILD_DATE;

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
    ...(options.mentions && { mentions: options.mentions }),
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
  dependencies?: string[],
  proficiencyLevel?: "Beginner" | "Intermediate" | "Expert"
) {
  return formatStructuredData([
    getOrganizationSchema(),
    getTechArticleSchema({
      headline: `${framework} Internationalization (i18n) Guide`,
      description,
      url: `${SITE_URL}/i18n/${framework.toLowerCase()}`,
      proficiencyLevel: proficiencyLevel ?? "Intermediate",
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
  locale?: string;
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
  inLanguage?: string;
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
    ...(options.inLanguage && { inLanguage: options.inLanguage }),
  };
}

interface JobPostingSalary {
  readonly minValue: number;
  readonly maxValue: number;
  readonly currency: string;
  readonly unitText: "YEAR" | "MONTH" | "HOUR";
}

interface JobPostingOptions {
  readonly title: string;
  readonly description: string;
  readonly employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN";
  readonly location: string;
  readonly remote?: boolean;
  readonly baseSalary?: JobPostingSalary;
}

/**
 * JobPosting Schema - for careers page
 */
export function getJobPostingSchema(jobs: JobPostingOptions[], locale?: string) {
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
    ...(job.baseSalary && {
      baseSalary: {
        "@type": "MonetaryAmount",
        currency: job.baseSalary.currency,
        value: {
          "@type": "QuantitativeValue",
          minValue: job.baseSalary.minValue,
          maxValue: job.baseSalary.maxValue,
          unitText: job.baseSalary.unitText,
        },
      },
    }),
    datePosted: "2026-03-01",
    validThrough: "2027-03-01",
    ...(locale && { inLanguage: locale }),
  }));
}

/**
 * Get careers page structured data
 */
export function getCareersPageStructuredData(
  jobs: JobPostingOptions[],
  locale?: string,
) {
  return formatStructuredData([
    getOrganizationSchema(),
    ...getJobPostingSchema(jobs, locale),
  ]);
}

/**
 * Get pricing page structured data
 */
export function getPricingPageStructuredData(options?: {
  locale?: string;
  messages?: Readonly<Record<string, string>>;
}) {
  const messages = options?.messages;
  const pricingUrl = `${SITE_URL}/en/pricing`;
  return formatStructuredData([
    getOrganizationSchema(options?.locale ? { locale: options.locale } : undefined),
    getSoftwareApplicationSchema({
      offerDescription: messages?.["schema.offers.free.description"] ?? "Free tier available",
    }),
    getProductSchema({
      name: messages?.["schema.product.name"] ?? `${SITE_NAME} Translation Management`,
      description: messages?.["schema.product.description"] ?? "AI-powered translation management system for developers",
      offers: [
        { name: "Free", price: 0, priceCurrency: "USD", description: messages?.["schema.offers.free.planDescription"] ?? "Perfect for side projects and open source", url: pricingUrl },
        { name: "Pro", price: 19, priceCurrency: "USD", description: messages?.["schema.offers.pro.planDescription"] ?? "Advanced features for scaling teams", url: pricingUrl },
        { name: "Enterprise", price: 0, priceCurrency: "USD", description: messages?.["schema.offers.enterprise.planDescription"] ?? "Custom solutions for large organizations", url: pricingUrl },
      ],
    }),
  ]);
}
