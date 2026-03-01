/**
 * Build-time llms.txt generator.
 *
 * Produces a markdown-formatted llms.txt file from the same data sources used
 * by the sitemap generator (MARKETING_PAGES + content API blog posts).
 *
 * This module runs inside vite.config.ts at BUILD TIME — it must not import
 * React or any browser-only API.
 */

import type { BlogPostMeta } from "./generate-pages";

import { SITE_URL } from "./pages";

// ─── Types ──────────────────────────────────────────────────────────

interface LlmsTxtLink {
  readonly title: string;
  readonly path: string;
}

interface LlmsTxtSection {
  readonly heading: string;
  readonly links: readonly LlmsTxtLink[];
}

// ─── Page titles ────────────────────────────────────────────────────

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

  // Educational pages
  "what-is": "What is...",
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
 * Each section references page paths that must exist in PAGE_TITLES.
 */
const STATIC_SECTIONS: readonly LlmsTxtSection[] = [
  {
    heading: "Key Pages",
    links: [
      "",
      "features",
      "pricing",
      "integrations",
      "for-developers",
      "for-product-teams",
      "for-translators",
      "about",
      "blog",
      "changelog",
      "careers",
    ].map(toLink),
  },
  {
    heading: "Solutions by Role",
    links: [
      "for-marketers",
      "for-agencies",
      "for-engineering-leaders",
      "for-content-teams",
      "for-designers",
      "for-freelancers",
    ].map(toLink),
  },
  {
    heading: "Solutions by Industry",
    links: [
      "for-enterprises",
      "for-startups",
      "for-ecommerce",
      "for-saas",
      "for-mobile-teams",
      "for-open-source",
      "for-gaming",
      "for-education",
      "for-healthcare",
    ].map(toLink),
  },
  {
    heading: "Framework Guides",
    links: [
      "i18n",
      "i18n/react",
      "i18n/nextjs",
      "i18n/vue",
      "i18n/nuxt",
      "i18n/angular",
      "i18n/svelte",
      "i18n/expo",
      "i18n/server",
      "i18n/tanstack-start",
      "i18n/react-intl",
      "i18n/react-native-localization",
      "i18n/for-developers",
    ].map(toLink),
  },
  {
    heading: "Comparisons",
    links: [
      "compare",
      "compare/crowdin",
      "compare/lokalise",
      "compare/phrase",
      "compare/transifex",
    ].map(toLink),
  },
  {
    heading: "Educational Content",
    links: [
      "what-is",
      "what-is-internationalization",
      "what-is-localization",
      "i18n/best-library",
      "i18n/best-tms",
      "i18n/localization-vs-internationalization",
    ].map(toLink),
  },
  {
    heading: "Localization Guides",
    links: [
      "i18n/content-localization",
      "i18n/content-localization-services",
      "i18n/cultural-adaptation",
      "i18n/website-translation",
      "i18n/translation-solutions",
      "i18n/localization-software",
      "i18n/localization-platforms",
      "i18n/localization-tools",
      "i18n/translation-management-system",
      "i18n/website-localization",
      "i18n/software-localization",
      "i18n/software-localization-services",
      "i18n/localization-management",
    ].map(toLink),
  },
  {
    heading: "Multilingual SEO Guides",
    links: [
      "i18n/multilingual-seo",
      "i18n/international-seo",
      "i18n/international-seo-consulting",
      "i18n/technical-multilingual-seo",
      "i18n/technical-international-seo",
      "i18n/multilingual-website-seo",
      "i18n/global-market-seo",
      "i18n/seo-international-audiences",
      "i18n/local-seo-international",
      "i18n/ecommerce-global-seo",
    ].map(toLink),
  },
  {
    heading: "Developer Tools",
    links: [
      "i18n/cli-code-scanning",
      "i18n/formatting-utilities",
      "i18n/security-compliance",
    ].map(toLink),
  },
];

const EXTERNAL_SECTION: LlmsTxtSection = {
  heading: "External Links",
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

function buildUrl(pagePath: string): string {
  return pagePath.startsWith("http")
    ? pagePath
    : [SITE_URL, "en", pagePath].filter(Boolean).join("/");
}

function renderSection(section: LlmsTxtSection): string {
  const lines = [`## ${section.heading}`, ""];
  for (const link of section.links) {
    lines.push(`- [${link.title}](${buildUrl(link.path)})`);
  }
  return lines.join("\n");
}

// ─── Header ─────────────────────────────────────────────────────────

const header = [
  "# Better i18n",
  "",
  "> AI-powered localization platform for developers and product teams. Ship multilingual apps faster with automated translations, context-aware AI, and seamless framework integrations.",
  "",
  "## About",
  "",
  "Better i18n is a translation management system (TMS) that combines AI-powered translations with developer-first tooling. It supports React, Next.js, Vue, Nuxt, Angular, Svelte, and Expo (React Native) through official SDK packages. The platform provides context-rich translation environments for translators, automated sync for developers, and hassle-free localization management for product teams.",
].join("\n");

// ─── Main export ────────────────────────────────────────────────────

/**
 * Generates the full llms.txt content from pre-fetched blog posts.
 * Pure function — no I/O.
 */
export function generateLlmsTxtContent(
  blogPosts: readonly BlogPostMeta[],
): string {
  const staticSections = STATIC_SECTIONS.map(renderSection);

  const blogSection =
    blogPosts.length > 0
      ? renderSection({
          heading: "Blog Posts",
          links: blogPosts.map((post) => ({
            title: post.title,
            path: `blog/${post.slug}`,
          })),
        })
      : "";

  const externalSection = renderSection(EXTERNAL_SECTION);
  const parts = [
    header,
    ...staticSections,
    ...(blogSection ? [blogSection] : []),
    externalSection,
  ];
  return parts.join("\n\n") + "\n";
}
