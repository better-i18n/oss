import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/meta";

interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

const LOCALES = ["en", "tr"];

// Static pages with their priorities
const PAGES = [
  // Core pages
  { path: "", priority: 1.0, changefreq: "weekly" as const },
  { path: "features", priority: 0.9, changefreq: "weekly" as const },
  { path: "pricing", priority: 0.9, changefreq: "weekly" as const },
  { path: "integrations", priority: 0.9, changefreq: "weekly" as const },

  // Audience pages
  { path: "for-developers", priority: 0.9, changefreq: "weekly" as const },
  { path: "for-translators", priority: 0.9, changefreq: "weekly" as const },
  { path: "for-product-teams", priority: 0.9, changefreq: "weekly" as const },

  // i18n Framework pages (high SEO value)
  { path: "i18n", priority: 0.9, changefreq: "weekly" as const },
  { path: "i18n/react", priority: 0.9, changefreq: "weekly" as const },
  { path: "i18n/nextjs", priority: 0.9, changefreq: "weekly" as const },
  { path: "i18n/vue", priority: 0.9, changefreq: "weekly" as const },
  { path: "i18n/nuxt", priority: 0.8, changefreq: "weekly" as const },
  { path: "i18n/angular", priority: 0.8, changefreq: "weekly" as const },
  { path: "i18n/svelte", priority: 0.8, changefreq: "weekly" as const },
  { path: "i18n/best-tms", priority: 0.85, changefreq: "weekly" as const },
  { path: "i18n/best-library", priority: 0.85, changefreq: "weekly" as const },
  { path: "i18n/for-developers", priority: 0.85, changefreq: "weekly" as const },

  // Comparison pages (high SEO value)
  { path: "compare", priority: 0.8, changefreq: "weekly" as const },
  { path: "compare/crowdin", priority: 0.85, changefreq: "weekly" as const },
  { path: "compare/lokalise", priority: 0.85, changefreq: "weekly" as const },
  { path: "compare/phrase", priority: 0.85, changefreq: "weekly" as const },
  { path: "compare/transifex", priority: 0.85, changefreq: "weekly" as const },

  // Educational pages (high SEO value)
  { path: "what-is", priority: 0.85, changefreq: "monthly" as const },
  { path: "what-is-internationalization", priority: 0.85, changefreq: "monthly" as const },
  { path: "what-is-localization", priority: 0.85, changefreq: "monthly" as const },

  // Company pages
  { path: "about", priority: 0.7, changefreq: "monthly" as const },
  { path: "careers", priority: 0.7, changefreq: "weekly" as const },
  { path: "status", priority: 0.6, changefreq: "daily" as const },
  { path: "changelog", priority: 0.8, changefreq: "daily" as const },
  { path: "blog", priority: 0.7, changefreq: "daily" as const },

  // Legal pages
  { path: "privacy", priority: 0.3, changefreq: "yearly" as const },
  { path: "terms", priority: 0.3, changefreq: "yearly" as const },
];

function generateSitemapEntries(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  const today = new Date().toISOString().split("T")[0];

  for (const page of PAGES) {
    for (const locale of LOCALES) {
      const path = page.path ? `/${page.path}` : "";
      const loc = locale === "en"
        ? `${SITE_URL}${path}`
        : `${SITE_URL}/${locale}${path}`;

      entries.push({
        loc,
        lastmod: today,
        changefreq: page.changefreq,
        priority: page.priority,
      });
    }
  }

  return entries;
}

function generateSitemapXml(entries: SitemapEntry[]): string {
  const urlElements = entries
    .map((entry) => {
      const parts = [`    <url>`, `      <loc>${entry.loc}</loc>`];

      if (entry.lastmod) {
        parts.push(`      <lastmod>${entry.lastmod}</lastmod>`);
      }
      if (entry.changefreq) {
        parts.push(`      <changefreq>${entry.changefreq}</changefreq>`);
      }
      if (entry.priority !== undefined) {
        parts.push(`      <priority>${entry.priority}</priority>`);
      }

      parts.push(`    </url>`);
      return parts.join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = generateSitemapEntries();
        const xml = generateSitemapXml(entries);

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
          },
        });
      },
    },
  },
});
