import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const sitemapPath = path.join(process.cwd(), "dist", "client", "sitemap.xml");

if (!existsSync(sitemapPath)) {
  console.warn("[SEO] sitemap.xml bulunamadı, düzeltme atlandı");
  process.exit(0);
}

const xml = readFileSync(sitemapPath, "utf-8");
const fixed = xml
  .replace(
    '<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">',
    '<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  )
  .replace(/ xmlns=""/g, "");

writeFileSync(sitemapPath, fixed);
console.log("[SEO] Sitemap xhtml namespace düzeltildi");
