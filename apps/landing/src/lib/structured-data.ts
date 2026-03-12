import { SITE_URL, SITE_NAME } from "./meta";

const DEFAULT_REVIEW_DATE = "2025-01-15";

/** All supported locales — single source of truth for schema.org availableLanguage */
const DEFAULT_AVAILABLE_LANGUAGES: readonly string[] = [
  "en", "tr", "de", "fr", "es", "pt", "it", "nl", "pl", "cs",
  "ja", "ko", "zh", "ar", "hi", "ru", "uk", "sv", "da", "fi",
  "nb", "el", "th",
] as const;

// ─── Localized Organization fields ──────────────────────────────────

const SLOGAN: Readonly<Record<string, string>> = {
  en: "Ship multilingual apps faster",
  tr: "Çok dilli uygulamaları daha hızlı yayınlayın",
  de: "Mehrsprachige Apps schneller ausliefern",
  fr: "Livrez vos applications multilingues plus vite",
  es: "Lanza aplicaciones multilingües más rápido",
  pt: "Lance aplicativos multilíngues mais rápido",
  it: "Rilascia app multilingue più velocemente",
  nl: "Lever meertalige apps sneller op",
  pl: "Wydawaj wielojęzyczne aplikacje szybciej",
  cs: "Dodávejte vícejazyčné aplikace rychleji",
  ja: "多言語アプリをより速くリリース",
  ko: "다국어 앱을 더 빠르게 출시하세요",
  zh: "更快地发布多语言应用",
  ar: "أطلق التطبيقات متعددة اللغات بشكل أسرع",
  hi: "बहुभाषी ऐप्स तेज़ी से लॉन्च करें",
  ru: "Выпускайте мультиязычные приложения быстрее",
  uk: "Випускайте багатомовні додатки швидше",
  sv: "Leverera flerspråkiga appar snabbare",
  da: "Lever flersprogede apps hurtigere",
  fi: "Julkaise monikielisiä sovelluksia nopeammin",
  nb: "Lever flerspråklige apper raskere",
  el: "Κυκλοφορήστε πολύγλωσσες εφαρμογές πιο γρήγορα",
  th: "เปิดตัวแอปหลายภาษาได้เร็วขึ้น",
};

const KNOWS_ABOUT: Readonly<Record<string, readonly string[]>> = {
  en: ["internationalization", "localization", "translation management", "i18n", "l10n", "multilingual SEO", "software localization"],
  tr: ["uluslararasılaştırma", "yerelleştirme", "çeviri yönetimi", "i18n", "l10n", "çok dilli SEO", "yazılım yerelleştirme"],
  de: ["Internationalisierung", "Lokalisierung", "Übersetzungsmanagement", "i18n", "l10n", "mehrsprachiges SEO", "Software-Lokalisierung"],
  fr: ["internationalisation", "localisation", "gestion de traduction", "i18n", "l10n", "SEO multilingue", "localisation logicielle"],
  es: ["internacionalización", "localización", "gestión de traducciones", "i18n", "l10n", "SEO multilingüe", "localización de software"],
  pt: ["internacionalização", "localização", "gestão de traduções", "i18n", "l10n", "SEO multilíngue", "localização de software"],
  it: ["internazionalizzazione", "localizzazione", "gestione delle traduzioni", "i18n", "l10n", "SEO multilingue", "localizzazione software"],
  nl: ["internationalisatie", "lokalisatie", "vertaalbeheer", "i18n", "l10n", "meertalige SEO", "softwarelokalisatie"],
  pl: ["internacjonalizacja", "lokalizacja", "zarządzanie tłumaczeniami", "i18n", "l10n", "wielojęzyczne SEO", "lokalizacja oprogramowania"],
  cs: ["internacionalizace", "lokalizace", "správa překladů", "i18n", "l10n", "vícejazyčné SEO", "lokalizace softwaru"],
  ja: ["国際化", "ローカライゼーション", "翻訳管理", "i18n", "l10n", "多言語SEO", "ソフトウェアローカライゼーション"],
  ko: ["국제화", "현지화", "번역 관리", "i18n", "l10n", "다국어 SEO", "소프트웨어 현지화"],
  zh: ["国际化", "本地化", "翻译管理", "i18n", "l10n", "多语言SEO", "软件本地化"],
  ar: ["التدويل", "التوطين", "إدارة الترجمة", "i18n", "l10n", "تحسين محركات البحث متعدد اللغات", "توطين البرمجيات"],
  hi: ["अंतर्राष्ट्रीयकरण", "स्थानीयकरण", "अनुवाद प्रबंधन", "i18n", "l10n", "बहुभाषी SEO", "सॉफ़्टवेयर स्थानीयकरण"],
  ru: ["интернационализация", "локализация", "управление переводами", "i18n", "l10n", "мультиязычное SEO", "локализация ПО"],
  uk: ["інтернаціоналізація", "локалізація", "управління перекладами", "i18n", "l10n", "багатомовне SEO", "локалізація ПЗ"],
  sv: ["internationalisering", "lokalisering", "översättningshantering", "i18n", "l10n", "flerspråkig SEO", "mjukvarulokalisering"],
  da: ["internationalisering", "lokalisering", "oversættelsesstyring", "i18n", "l10n", "flersproget SEO", "softwarelokalisering"],
  fi: ["kansainvälistäminen", "lokalisointi", "käännösten hallinta", "i18n", "l10n", "monikielinen SEO", "ohjelmistolokalisointi"],
  nb: ["internasjonalisering", "lokalisering", "oversettelseshåndtering", "i18n", "l10n", "flerspråklig SEO", "programvarelokalisering"],
  el: ["διεθνοποίηση", "τοπικοποίηση", "διαχείριση μεταφράσεων", "i18n", "l10n", "πολύγλωσσο SEO", "τοπικοποίηση λογισμικού"],
  th: ["การทำให้เป็นสากล", "การแปลเป็นภาษาท้องถิ่น", "การจัดการแปลภาษา", "i18n", "l10n", "SEO หลายภาษา", "การแปลซอฟต์แวร์"],
};

/**
 * Common entity mentions for schema.org `mentions` property.
 * Helps AI models understand entity relationships.
 */
export function getFrameworkMention(frameworkName: string, frameworkUrl: string) {
  return {
    "@type": "SoftwareApplication" as const,
    name: frameworkName,
    url: frameworkUrl,
  };
}

const COMMON_MENTIONS = {
  react: getFrameworkMention("React", "https://react.dev"),
  nextjs: getFrameworkMention("Next.js", "https://nextjs.org"),
  vue: getFrameworkMention("Vue.js", "https://vuejs.org"),
  nuxt: getFrameworkMention("Nuxt", "https://nuxt.com"),
  angular: getFrameworkMention("Angular", "https://angular.dev"),
  svelte: getFrameworkMention("Svelte", "https://svelte.dev"),
  expo: getFrameworkMention("Expo", "https://expo.dev"),
  flutter: getFrameworkMention("Flutter", "https://flutter.dev"),
} as const;

export { COMMON_MENTIONS };

/**
 * Organization Schema - represents the company/brand
 */
export function getOrganizationSchema(options?: {
  locale?: string;
  availableLanguages?: readonly string[];
}) {
  const locale = options?.locale ?? "en";
  const languages = options?.availableLanguages ?? DEFAULT_AVAILABLE_LANGUAGES;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    ...(options?.locale && { inLanguage: locale }),
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
    },
    foundingDate: "2024",
    slogan: SLOGAN[locale] ?? SLOGAN.en,
    knowsAbout: KNOWS_ABOUT[locale] ?? KNOWS_ABOUT.en,
    sameAs: [
      "https://twitter.com/betteri18n",
      "https://github.com/better-i18n",
      "https://www.linkedin.com/company/better-i18n",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@better-i18n.com",
      contactType: "customer support",
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
 * Get home page structured data
 */
export function getHomePageStructuredData(reviews?: SoftwareAppReview[], locale?: string) {
  return formatStructuredData([
    getOrganizationSchema(locale ? { locale } : undefined),
    getWebSiteSchema(locale),
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
      reviewCount: 50,
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
  mentions?: ReadonlyArray<{ readonly "@type": string; readonly name: string; readonly url: string }>;
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

interface ReviewItem {
  author: string;
  reviewBody: string;
}

/**
 * Review Schema - for testimonial sections
 */
export function getReviewSchema(
  reviews: ReviewItem[],
  defaultDatePublished: string = DEFAULT_REVIEW_DATE,
  locale?: string,
) {
  return reviews.map((review) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    author: {
      "@type": "Person",
      name: review.author,
    },
    reviewBody: review.reviewBody,
    datePublished: defaultDatePublished,
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
    ...(locale && { inLanguage: locale }),
  }));
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
    datePosted: "2026-01-01",
    validThrough: "2026-12-31",
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
export function getPricingPageStructuredData(locale?: string) {
  const pricingUrl = `${SITE_URL}/en/pricing`;
  return formatStructuredData([
    getOrganizationSchema(locale ? { locale } : undefined),
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
