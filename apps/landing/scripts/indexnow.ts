/**
 * IndexNow submission script.
 *
 * Parses the generated sitemap.xml and submits all URLs to the IndexNow API
 * for rapid indexing by Bing, Yandex, Seznam, and Naver.
 *
 * Usage:
 *   INDEXNOW_KEY=<key> bun scripts/indexnow.ts
 *
 * The key file must also be served at https://better-i18n.com/<key>.txt
 * (place a file named <key>.txt in public/ with the key as its content).
 *
 * @see https://www.indexnow.org/documentation
 */

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const SITE_HOST = "better-i18n.com";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const SITEMAP_PATH = resolve(import.meta.dirname, "../dist/client/sitemap.xml");
const MAX_URLS_PER_BATCH = 10_000;

function extractUrlsFromSitemap(xml: string): string[] {
  const urls: string[] = [];
  const locRegex = /<loc>([^<]+)<\/loc>/g;
  let match: RegExpExecArray | null;
  while ((match = locRegex.exec(xml)) !== null) {
    const url = match[1];
    if (url && url.startsWith("https://")) {
      urls.push(url);
    }
  }
  // Deduplicate (sitemap may have alternate refs with same URLs)
  return [...new Set(urls)];
}

async function submitBatch(
  urls: readonly string[],
  key: string,
): Promise<{ ok: boolean; status: number }> {
  const body = {
    host: SITE_HOST,
    key,
    keyLocation: `https://${SITE_HOST}/${key}.txt`,
    urlList: urls,
  };

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return { ok: response.ok, status: response.status };
}

async function main() {
  const key = process.env.INDEXNOW_KEY;
  if (!key) {
    console.error("[IndexNow] Missing INDEXNOW_KEY environment variable");
    process.exit(1);
  }

  if (!existsSync(SITEMAP_PATH)) {
    console.error(`[IndexNow] Sitemap not found at ${SITEMAP_PATH}`);
    console.error("[IndexNow] Run 'bun run build' first to generate the sitemap");
    process.exit(1);
  }

  const xml = readFileSync(SITEMAP_PATH, "utf-8");
  const urls = extractUrlsFromSitemap(xml);

  if (urls.length === 0) {
    console.log("[IndexNow] No URLs found in sitemap");
    return;
  }

  console.log(`[IndexNow] Found ${urls.length} URLs in sitemap`);

  // Submit in batches of MAX_URLS_PER_BATCH
  for (let i = 0; i < urls.length; i += MAX_URLS_PER_BATCH) {
    const batch = urls.slice(i, i + MAX_URLS_PER_BATCH);
    const batchNum = Math.floor(i / MAX_URLS_PER_BATCH) + 1;
    const totalBatches = Math.ceil(urls.length / MAX_URLS_PER_BATCH);

    console.log(`[IndexNow] Submitting batch ${batchNum}/${totalBatches} (${batch.length} URLs)...`);

    const result = await submitBatch(batch, key);

    if (result.ok || result.status === 202) {
      console.log(`[IndexNow] Batch ${batchNum} accepted (HTTP ${result.status})`);
    } else {
      console.error(`[IndexNow] Batch ${batchNum} failed (HTTP ${result.status})`);
    }
  }

  console.log("[IndexNow] Submission complete");
}

main().catch((err) => {
  console.error("[IndexNow] Fatal error:", err);
  process.exit(1);
});
