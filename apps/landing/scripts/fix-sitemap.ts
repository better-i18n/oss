import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";

const distDir = path.join(process.cwd(), "dist", "client");

if (!existsSync(distDir)) {
  console.warn("[SEO] dist/client dizini bulunamadı, düzeltme atlandı");
  process.exit(0);
}

// Find all sitemap files (sitemap.xml, sitemap-0.xml, sitemap-1.xml, etc.)
const sitemapFiles = readdirSync(distDir).filter(
  (f) => f.startsWith("sitemap") && f.endsWith(".xml"),
);

if (sitemapFiles.length === 0) {
  console.warn("[SEO] sitemap.xml bulunamadı, düzeltme atlandı");
  process.exit(0);
}

/**
 * Paths the build decided not to advertise, written by `vite.config.ts`.
 *
 * They are excluded HERE, from the finished XML, rather than by withholding
 * their pages from the plugin — because that same page list is the prerender
 * candidate list. Filtering it meant "keep this out of the sitemap" silently
 * also meant "never build static HTML for this", and five pages (about,
 * careers, privacy, terms, cookies) were server-rendered on every request as a
 * result. Two decisions, two places.
 *
 * Missing file is not an error: a dev or partial build never writes it, and a
 * sitemap with a few extra URLs is a far smaller problem than a build that
 * refuses to finish.
 */
const noindexFile = path.join(process.cwd(), ".seo-noindex.json");
const noindexPaths: string[] = existsSync(noindexFile)
  ? (JSON.parse(readFileSync(noindexFile, "utf-8")) as string[])
  : [];

/** `about` -> matches https://better-i18n.com/{any-locale}/about/ */
const noindexUrlPattern = (p: string) =>
  new RegExp(
    `\\s*<url>(?:(?!</url>)[\\s\\S])*?<loc>https://better-i18n\\.com/[a-z-]+(?:/${p.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    )})?/</loc>[\\s\\S]*?</url>`,
    "g",
  );

let fixedCount = 0;
let droppedUrls = 0;

for (const file of sitemapFiles) {
  const filePath = path.join(distDir, file);
  const xml = readFileSync(filePath, "utf-8");

  let fixed = xml
    .replaceAll(
      '<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">',
      '<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    )
    .replaceAll(/ xmlns=""/g, "")
    // Remove bare root URL — it 301-redirects to /{defaultLocale}/ and should not be in sitemap
    .replace(/\s*<url>\s*<loc>https:\/\/better-i18n\.com\/<\/loc>\s*<\/url>/g, "");

  // Drop the noindex paths, in every locale.
  for (const p of noindexPaths) {
    if (!p) continue; // the home page is handled by the rule above
    const before = fixed;
    fixed = fixed.replace(noindexUrlPattern(p), "");
    if (fixed !== before) {
      droppedUrls += (before.length - fixed.length > 0 ? 1 : 0);
    }
  }

  if (fixed !== xml) {
    writeFileSync(filePath, fixed);
    fixedCount++;
  }
}

console.log(
  `[SEO] Sitemap xhtml namespace düzeltildi: ${fixedCount}/${sitemapFiles.length} dosya`,
);
console.log(
  `[SEO] noindex paths excluded from sitemap: ${noindexPaths.length} (${droppedUrls} matched)`,
);
