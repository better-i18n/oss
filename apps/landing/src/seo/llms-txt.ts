/**
 * Build-time llms.txt generator.
 *
 * Produces a markdown-formatted llms.txt file from the same data sources used
 * by the sitemap generator (MARKETING_PAGES + content API blog posts).
 *
 * This module runs inside vite.config.ts at BUILD TIME — it must not import
 * React or any browser-only API.
 */

import { createClient } from "@better-i18n/sdk";

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

  // Audience pages
  "for-developers": "For Developers",
  "for-translators": "For Translators",
  "for-product-teams": "For Product Teams",

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
    heading: "Framework Guides",
    links: [
      "i18n",
      "i18n/react",
      "i18n/nextjs",
      "i18n/vue",
      "i18n/nuxt",
      "i18n/angular",
      "i18n/svelte",
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

// ─── Main export ────────────────────────────────────────────────────

export interface GenerateLlmsTxtOptions {
  readonly project: string;
  readonly apiKey: string;
}

/**
 * Generates the full llms.txt content at build time.
 *
 * 1. Renders static marketing page sections from MARKETING_PAGES groupings.
 * 2. Fetches published blog posts from the content API.
 * 3. Appends a dynamic "Blog Posts" section.
 * 4. Appends external links section.
 */
export async function generateLlmsTxtContent(
  options: GenerateLlmsTxtOptions,
): Promise<string> {
  const { project, apiKey } = options;

  // 1. Render static sections
  const staticSections = STATIC_SECTIONS.map(renderSection);

  // 2. Fetch blog posts
  let blogSection = "";
  try {
    const client = createClient({ project, apiKey });
    const response = await client.getEntries("blog-posts", {
      status: "published",
      sort: "publishedAt",
      order: "desc",
      limit: 100,
    });

    const blogLinks: readonly LlmsTxtLink[] = response.items.map((item) => ({
      title: item.title,
      path: `blog/${item.slug}`,
    }));

    if (blogLinks.length > 0) {
      blogSection = renderSection({
        heading: "Blog Posts",
        links: blogLinks,
      });
    }
  } catch (error) {
    console.error(
      "[llms-txt] Failed to fetch blog posts, continuing without blog section:",
      error,
    );
  }

  // 3. Render external links
  const externalSection = renderSection(EXTERNAL_SECTION);

  // 4. Assemble the full document
  const header = [
    "# Better i18n",
    "",
    "> AI-powered localization platform for developers and product teams. Ship multilingual apps faster with automated translations, context-aware AI, and seamless framework integrations.",
    "",
    "## About",
    "",
    "Better i18n is a translation management system (TMS) that combines AI-powered translations with developer-first tooling. It supports React, Next.js, Vue, Nuxt, Angular, Svelte, and Expo (React Native) through official SDK packages. The platform provides context-rich translation environments for translators, automated sync for developers, and hassle-free localization management for product teams.",
  ].join("\n");

  const parts = [
    header,
    ...staticSections,
    ...(blogSection ? [blogSection] : []),
    externalSection,
  ];

  const content = parts.join("\n\n") + "\n";

  console.log(
    `[llms-txt] Generated llms.txt: ${STATIC_SECTIONS.length} static sections` +
      (blogSection ? ` + blog posts` : "") +
      ` + external links`,
  );

  return content;
}
