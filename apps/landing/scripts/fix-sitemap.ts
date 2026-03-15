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

let fixedCount = 0;

for (const file of sitemapFiles) {
  const filePath = path.join(distDir, file);
  const xml = readFileSync(filePath, "utf-8");

  const fixed = xml
    .replaceAll(
      '<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">',
      '<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    )
    .replaceAll(/ xmlns=""/g, "")
    // Remove bare root URL — it 301-redirects to /{defaultLocale}/ and should not be in sitemap
    .replace(/\s*<url>\s*<loc>https:\/\/better-i18n\.com\/<\/loc>\s*<\/url>/g, "");

  if (fixed !== xml) {
    writeFileSync(filePath, fixed);
    fixedCount++;
  }
}

console.log(
  `[SEO] Sitemap xhtml namespace düzeltildi: ${fixedCount}/${sitemapFiles.length} dosya`,
);
