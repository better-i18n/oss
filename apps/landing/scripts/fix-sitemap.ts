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

/**
 * The `<url>` block for one already-locale-prefixed path (e.g. `/en/about/`).
 *
 * Anchored on the exact `<loc>` so `/en/about/` cannot also match a longer path
 * that merely starts with it, and the `(?!</url>)` guard keeps the match inside
 * a single block instead of swallowing everything up to the last `</url>` in
 * the file.
 */
const urlBlockPattern = (p: string) =>
  new RegExp(
    `\\s*<url>(?:(?!</url>)[\\s\\S])*?<loc>https://better-i18n\\.com${p.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    )}</loc>(?:(?!</url>)[\\s\\S])*?</url>`,
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

  // Remove the built-but-unadvertised paths.
  for (const p of excludedPaths) {
    if (!p || p === "/") continue; // bare root is handled by the rule above
    const before = fixed;
    fixed = fixed.replace(urlBlockPattern(p), "");
    if (fixed !== before) droppedUrls++;
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
  `[SEO] built but kept out of sitemap: ${excludedPaths.length} paths, ${droppedUrls} <url> blocks removed`,
);
if (excludedPaths.length > 0 && droppedUrls === 0) {
  console.warn(
    "[SEO] none matched — the sitemap may be advertising pages marked sitemap:false",
  );
}
