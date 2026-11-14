import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fixSitemapXml } from "../src/seo/sitemap-xml";

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
 * Locale-prefixed paths that were BUILT but must not be advertised, written by
 * `vite.config.ts` from `sitemap.excludeFromSitemap`.
 *
 * They are removed here, from the finished XML, rather than by withholding
 * their pages from the plugin — because that page list is also the prerender
 * candidate list. Withholding them is what made "keep this out of the sitemap"
 * silently mean "never build static HTML for this", and left five pages
 * (about, careers, privacy, terms, cookies) server-rendered on every request.
 *
 * Missing file is not an error: a dev or partial build never writes one, and a
 * sitemap with a few extra URLs is a far smaller problem than a build that
 * refuses to finish.
 */
const excludeFile = path.join(process.cwd(), ".seo-noindex.json");
const excludedPaths: string[] = existsSync(excludeFile)
  ? (JSON.parse(readFileSync(excludeFile, "utf-8")) as string[])
  : [];

let fixedCount = 0;
let droppedUrls = 0;

for (const file of sitemapFiles) {
  const filePath = path.join(distDir, file);
  const xml = readFileSync(filePath, "utf-8");

  /* Namespace fix, bare-root removal and excluded paths all live in
     src/seo/sitemap-xml.ts, where they are unit-tested. */
  const { xml: fixed, droppedUrls: dropped } = fixSitemapXml(xml, excludedPaths);
  droppedUrls += dropped;

  if (fixed !== xml) {
    writeFileSync(filePath, fixed);
    fixedCount++;
  }
}

console.log(
  `[SEO] Sitemap namespace (http://www.sitemaps.org) fixed: ${fixedCount}/${sitemapFiles.length} dosya`,
);
console.log(
  `[SEO] built but kept out of sitemap: ${excludedPaths.length} paths, ${droppedUrls} <url> blocks removed`,
);
if (excludedPaths.length > 0 && droppedUrls === 0) {
  console.warn(
    "[SEO] none matched — the sitemap may be advertising pages marked sitemap:false",
  );
}
