/**
 * Build-time llms.txt generator.
 *
 * Produces markdown-formatted llms.txt files from the same data sources used
 * by the sitemap generator (MARKETING_PAGES + content API blog posts).
 *
 * Supports per-locale generation: each locale gets its own llms.txt with
 * locale-specific URLs, translated headers, and localized section headings.
 * The root /llms.txt defaults to English.
 *
 * This module runs inside vite.config.ts at BUILD TIME — it must not import
 * React or any browser-only API.
 */

import type { BlogPostMeta } from "./generate-pages";
import type { SectionKey } from "./llms-txt-locales";

import { getLocaleStrings } from "./llms-txt-locales";
import { SITE_URL } from "./pages";

// ─── Types ──────────────────────────────────────────────────────────

interface LlmsTxtLink {
  readonly title: string;
  readonly path: string;
  readonly description?: string;
}

interface LlmsTxtSection {
  readonly headingKey: SectionKey;
  readonly links: readonly LlmsTxtLink[];
}

// ─── Page data ──────────────────────────────────────────────────────

/**
 * Page descriptions used in llms-full.txt for richer AI context.
 */
const PAGE_DESCRIPTIONS: Readonly<Record<string, string>> = {
  "": "AI-powered localization platform overview — SDKs for React, Next.js, Vue, Angular, Svelte, Expo, Flutter. Free tier available.",
  features: "Translation editor, GitHub sync, CLI scanning, CDN delivery, AI translations, plural rules, ICU format support.",
  pricing: "Free, Pro ($19/mo), and Enterprise plans. Compare features, limits, and team capabilities.",
  integrations: "Official SDK packages for 10+ frameworks with type-safe APIs and over-the-air updates.",
  "for-developers": "Type-safe SDKs, Git integration, global CDN delivery, and automated translation workflows for developers.",
  "for-translators": "Context-rich translation editor with AI suggestions, glossary, and translation memory.",
  "for-product-teams": "Localization management dashboard with progress tracking, review workflows, and analytics.",
  "i18n/complete-guide": "Comprehensive guide covering i18n fundamentals, implementation patterns, and best practices.",
  "what-is": "Learn the difference between internationalization (i18n) and localization (l10n) with comparison table.",
  compare: "Side-by-side comparisons of Better i18n vs Crowdin, Lokalise, Phrase, Transifex, Smartling, and XTM.",
  "compare/crowdin": "Feature, pricing, and developer experience comparison between Better i18n and Crowdin.",
  "compare/lokalise": "Feature, pricing, and developer experience comparison between Better i18n and Lokalise.",
  "compare/phrase": "Feature, pricing, and developer experience comparison between Better i18n and Phrase.",
  blog: "Latest articles on internationalization, localization, multilingual SEO, and translation management.",
  about: "Company story, mission, and team behind Better i18n.",
  "i18n/react": "Step-by-step React i18n setup with @better-i18n/use-intl, hooks, and context API.",
  "i18n/nextjs": "Next.js App Router i18n with Server Components, middleware locale detection, and SSR.",
  "i18n/vue": "Vue 3 Composition API i18n integration with reactive translations and lazy loading.",
  "i18n/doctor": "Automated translation health checks — missing keys, unused translations, inconsistencies.",
};

/**
 * Human-readable titles for marketing page paths.
 * Serves as the single source of truth for page names in llms.txt.
 */
const PAGE_TITLES: Readonly<Record<string, string>> = {
  // Core pages
  "": "Home",
  features: "Features",
  pricing: "Pricing",
  integrations: "Integrations",

  // Audience pages (personas)
  "for-developers": "For Developers",
  "for-translators": "For Translators",
  "for-product-teams": "For Product Teams",
  "for-marketers": "For Marketers",
  "for-agencies": "For Agencies",
  "for-enterprises": "For Enterprises",
  "for-startups": "For Startups",
  "for-engineering-leaders": "For Engineering Leaders",
  "for-content-teams": "For Content Teams",
  "for-ecommerce": "For E-Commerce",
  "for-saas": "For SaaS",
  "for-mobile-teams": "For Mobile Teams",
  "for-designers": "For Designers",
  "for-freelancers": "For Freelancers",
  "for-open-source": "For Open Source",
  "for-gaming": "For Gaming",
  "for-education": "For Education",
  "for-healthcare": "For Healthcare",

  // Company pages
  about: "About",
  blog: "Blog",
  changelog: "Changelog",
  careers: "Careers",

  // Framework guides
  i18n: "i18n Overview",
  "i18n/react": "React i18n Guide",
  "i18n/nextjs": "Next.js i18n Guide",
  "i18n/vue": "Vue i18n Guide",
  "i18n/nuxt": "Nuxt i18n Guide",
  "i18n/angular": "Angular i18n Guide",
  "i18n/svelte": "Svelte i18n Guide",
  "i18n/django": "Django i18n Guide",
  "i18n/ruby": "Ruby on Rails i18n Guide",
  "i18n/javascript": "JavaScript i18n Guide",
  "i18n/android": "Android Localization Guide",
  "i18n/ios": "iOS Localization Guide",
  "i18n/flutter": "Flutter Localization Guide",
  "i18n/expo": "Expo i18n Guide",
  "i18n/server": "Server-Side i18n Guide",
  "i18n/tanstack-start": "TanStack Start i18n Guide",
  "i18n/react-intl": "React Intl Guide",
  "i18n/react-native-localization": "React Native Localization",
  "i18n/for-developers": "i18n for Developers",

  // Comparison pages
  compare: "Comparisons Overview",
  "compare/crowdin": "Better i18n vs Crowdin",
  "compare/lokalise": "Better i18n vs Lokalise",
  "compare/phrase": "Better i18n vs Phrase",
  "compare/transifex": "Better i18n vs Transifex",
  "compare/smartling": "Better i18n vs Smartling",
  "compare/xtm": "Better i18n vs XTM",

  // Educational pages
  "i18n/complete-guide": "Complete Guide to i18n & Localization",
  "what-is": "What is i18n? Internationalization & Localization Guide",
  "what-is-internationalization": "What is Internationalization?",
  "what-is-localization": "What is Localization?",
  "i18n/best-tms": "Best Translation Management System",
  "i18n/best-library": "Best i18n Library",
  "i18n/localization-vs-internationalization":
    "Localization vs Internationalization",

  // Localization guides
  "i18n/website-localization": "Website Localization",
  "i18n/software-localization": "Software Localization",
  "i18n/content-localization": "Content Localization Best Practices",
  "i18n/content-localization-services": "Content Localization Services",
  "i18n/cultural-adaptation": "Cultural Adaptation for Websites",
  "i18n/website-translation": "Website Translation Services & Solutions",
  "i18n/translation-solutions": "Website Translation Solutions",
  "i18n/localization-software": "Localization Platform & Software",
  "i18n/localization-platforms": "Localization Management Platforms",
  "i18n/localization-tools": "Website Localization Software & Tools",
  "i18n/translation-management-system": "Translation Management System Guide",
  "i18n/software-localization-services": "Software Localization Services",
  "i18n/localization-management": "Localization Management",

  // Multilingual SEO guides
  "i18n/multilingual-seo": "Multilingual SEO Fundamentals",
  "i18n/international-seo": "International SEO Strategy",
  "i18n/international-seo-consulting": "International SEO Consulting",
  "i18n/technical-multilingual-seo": "Technical Multilingual SEO",
  "i18n/technical-international-seo": "Technical International SEO",
  "i18n/multilingual-website-seo": "Multilingual Website SEO Optimization",
  "i18n/global-market-seo": "Global Market Expansion SEO",
  "i18n/seo-international-audiences": "SEO for International Audiences",
  "i18n/local-seo-international": "Local SEO for International Markets",
  "i18n/ecommerce-global-seo": "E-Commerce Global SEO",

  // Developer tools
  "i18n/doctor": "i18n Doctor — Translation Health Report",
  "i18n/cli-code-scanning": "CLI Code Scanning",
  "i18n/formatting-utilities": "Formatting Utilities",
  "i18n/security-compliance": "Security & Compliance",

  // Legal & status (intentionally excluded from llms.txt sections)
  privacy: "Privacy Policy",
  terms: "Terms of Service",
  status: "System Status",
};

// ─── Section definitions ────────────────────────────────────────────

/**
 * Static section groupings for marketing pages.
 * Each section uses a headingKey that maps to localized heading strings
 * via llms-txt-locales.ts.
 */
const STATIC_SECTIONS: readonly LlmsTxtSection[] = [
  {
    headingKey: "keyPages",
    links: [
      "", "features", "pricing", "integrations",
      "for-developers", "for-product-teams", "for-translators",
      "about", "blog", "changelog", "careers",
    ].map(toLink),
  },
  {
    headingKey: "solutionsByRole",
    links: [
      "for-marketers", "for-agencies", "for-engineering-leaders",
      "for-content-teams", "for-designers", "for-freelancers",
    ].map(toLink),
  },
  {
    headingKey: "solutionsByIndustry",
    links: [
      "for-enterprises", "for-startups", "for-ecommerce", "for-saas",
      "for-mobile-teams", "for-open-source", "for-gaming",
      "for-education", "for-healthcare",
    ].map(toLink),
  },
  {
    headingKey: "frameworkGuides",
    links: [
      "i18n", "i18n/react", "i18n/nextjs", "i18n/vue", "i18n/nuxt",
      "i18n/angular", "i18n/svelte", "i18n/expo", "i18n/server",
      "i18n/tanstack-start", "i18n/react-intl", "i18n/react-native-localization",
      "i18n/django", "i18n/ruby", "i18n/javascript", "i18n/android",
      "i18n/ios", "i18n/flutter", "i18n/for-developers",
    ].map(toLink),
  },
  {
    headingKey: "comparisons",
    links: [
      "compare", "compare/crowdin", "compare/lokalise", "compare/phrase",
      "compare/transifex", "compare/smartling", "compare/xtm",
    ].map(toLink),
  },
  {
    headingKey: "educationalContent",
    links: [
      "i18n/complete-guide", "what-is", "what-is-internationalization",
      "what-is-localization", "i18n/best-library", "i18n/best-tms",
      "i18n/localization-vs-internationalization",
    ].map(toLink),
  },
  {
    headingKey: "localizationGuides",
    links: [
      "i18n/content-localization", "i18n/content-localization-services",
      "i18n/cultural-adaptation", "i18n/website-translation",
      "i18n/translation-solutions", "i18n/localization-software",
      "i18n/localization-platforms", "i18n/localization-tools",
      "i18n/translation-management-system", "i18n/website-localization",
      "i18n/software-localization", "i18n/software-localization-services",
      "i18n/localization-management",
    ].map(toLink),
  },
  {
    headingKey: "multilingualSeoGuides",
    links: [
      "i18n/multilingual-seo", "i18n/international-seo",
      "i18n/international-seo-consulting", "i18n/technical-multilingual-seo",
      "i18n/technical-international-seo", "i18n/multilingual-website-seo",
      "i18n/global-market-seo", "i18n/seo-international-audiences",
      "i18n/local-seo-international", "i18n/ecommerce-global-seo",
    ].map(toLink),
  },
  {
    headingKey: "developerTools",
    links: [
      "i18n/doctor", "i18n/cli-code-scanning",
      "i18n/formatting-utilities", "i18n/security-compliance",
    ].map(toLink),
  },
];

const EXTERNAL_SECTION: LlmsTxtSection = {
  headingKey: "externalLinks",
  links: [
    { title: "Full Documentation", path: "https://docs.better-i18n.com/" },
    { title: "API Reference", path: "https://docs.better-i18n.com/api" },
    { title: "GitHub", path: "https://github.com/better-i18n" },
    { title: "Sign Up / Log In", path: "https://dash.better-i18n.com" },
    { title: "System Status", path: "https://status.better-i18n.com" },
  ],
};

// ─── Helpers ────────────────────────────────────────────────────────

function toLink(pagePath: string): LlmsTxtLink {
  const title = PAGE_TITLES[pagePath];
  if (!title) {
    throw new Error(
      `[llms-txt] Missing title for page path "${pagePath}". Add it to PAGE_TITLES.`,
    );
  }
  return { title, path: pagePath };
}

function buildUrl(pagePath: string, locale: string): string {
  if (pagePath.startsWith("http")) return pagePath;
  const url = [SITE_URL, locale, pagePath].filter(Boolean).join("/");
  return url.endsWith("/") ? url : `${url}/`;
}

function resolveHeading(headingKey: SectionKey, locale: string): string {
  const strings = getLocaleStrings(locale);
  return strings.headings[headingKey];
}

function renderSection(section: LlmsTxtSection, locale: string): string {
  const heading = resolveHeading(section.headingKey, locale);
  const lines = [`## ${heading}`, ""];
  for (const link of section.links) {
    lines.push(`- [${link.title}](${buildUrl(link.path, locale)})`);
  }
  return lines.join("\n");
}

function renderDetailedSection(section: LlmsTxtSection, locale: string): string {
  const heading = resolveHeading(section.headingKey, locale);
  const lines = [`## ${heading}`, ""];
  for (const link of section.links) {
    const desc = link.description || PAGE_DESCRIPTIONS[link.path];
    if (desc) {
      lines.push(`- [${link.title}](${buildUrl(link.path, locale)}): ${desc}`);
    } else {
      lines.push(`- [${link.title}](${buildUrl(link.path, locale)})`);
    }
  }
  return lines.join("\n");
}

// ─── Header builders ────────────────────────────────────────────────

function buildHeader(locale: string): string {
  const strings = getLocaleStrings(locale);
  return [
    "# Better i18n",
    "",
    `> ${strings.tagline}`,
    "",
    "## About",
    "",
    strings.about,
  ].join("\n");
}

function buildDetailedHeader(locale: string): string {
  const strings = getLocaleStrings(locale);
  return [
    "# Better i18n — Full Reference",
    "",
    `> ${strings.tagline}`,
    "",
    "## About",
    "",
    strings.about,
    "",
    "**Key facts:**",
    "- **Type:** Translation Management System (TMS) & Localization Platform",
    "- **Founded:** 2024",
    "- **Supported frameworks:** React, Next.js, Vue, Nuxt, Angular, Svelte, Expo, Flutter, Django, Ruby on Rails",
    "- **Languages supported:** 23+ locales including English, German, French, Spanish, Japanese, Korean, Chinese, Arabic, Turkish, and more",
    "- **Pricing:** Free tier, Pro ($19/month), Enterprise (custom)",
    "- **Key features:** AI-powered translations, GitHub sync, CLI code scanning, global CDN delivery, ICU message format, plural rules, over-the-air updates",
    "- **Website:** https://better-i18n.com",
    "- **Documentation:** https://docs.better-i18n.com",
    "- **GitHub:** https://github.com/better-i18n",
  ].join("\n");
}

// ─── Main exports ───────────────────────────────────────────────────

/**
 * Generates the llms.txt content for a given locale.
 * Pure function — no I/O.
 */
export function generateLlmsTxtContent(
  blogPosts: readonly BlogPostMeta[],
  locale: string = "en",
): string {
  const staticSections = STATIC_SECTIONS.map((s) => renderSection(s, locale));

  const blogSection =
    blogPosts.length > 0
      ? renderSection(
          {
            headingKey: "blogPosts",
            links: blogPosts.map((post) => ({
              title: post.title,
              path: `blog/${post.slug}`,
            })),
          },
          locale,
        )
      : "";

  const externalSection = renderSection(EXTERNAL_SECTION, locale);
  const parts = [
    buildHeader(locale),
    ...staticSections,
    ...(blogSection ? [blogSection] : []),
    externalSection,
  ];
  return parts.join("\n\n") + "\n";
}

/**
 * Generates llms-full.txt with page descriptions and blog excerpts
 * for a given locale.
 */
export function generateLlmsFullTxtContent(
  blogPosts: readonly BlogPostMeta[],
  locale: string = "en",
): string {
  const staticSections = STATIC_SECTIONS.map((s) => renderDetailedSection(s, locale));

  const blogSection =
    blogPosts.length > 0
      ? renderDetailedSection(
          {
            headingKey: "blogPosts",
            links: blogPosts.map((post) => ({
              title: post.title,
              path: `blog/${post.slug}`,
              description: post.excerpt || undefined,
            })),
          },
          locale,
        )
      : "";

  const externalSection = renderDetailedSection(EXTERNAL_SECTION, locale);
  const parts = [
    buildDetailedHeader(locale),
    ...staticSections,
    ...(blogSection ? [blogSection] : []),
    externalSection,
  ];
  return parts.join("\n\n") + "\n";
}

/**
 * Generates llms.txt + llms-full.txt files for all provided locales.
 * Returns a map of file paths to content strings.
 *
 * - Root `/llms.txt` and `/llms-full.txt` are always English.
 * - Each locale gets `{locale}/llms.txt` and `{locale}/llms-full.txt`.
 *
 * Pure function — no I/O.
 */
export function generateAllLlmsTxtFiles(
  blogPosts: readonly BlogPostMeta[],
  locales: readonly string[],
): ReadonlyMap<string, string> {
  const files = new Map<string, string>();

  // Root files are always English
  files.set("llms.txt", generateLlmsTxtContent(blogPosts, "en"));
  files.set("llms-full.txt", generateLlmsFullTxtContent(blogPosts, "en"));

  // Per-locale files
  for (const locale of locales) {
    files.set(
      `${locale}/llms.txt`,
      generateLlmsTxtContent(blogPosts, locale),
    );
    files.set(
      `${locale}/llms-full.txt`,
      generateLlmsFullTxtContent(blogPosts, locale),
    );
  }

  return files;
}
