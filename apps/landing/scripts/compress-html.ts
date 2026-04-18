/**
 * Post-build script: Pre-compress all HTML files with Brotli level 11.
 *
 * Brotli 11 is ~20-30% smaller than Cloudflare's default edge compression
 * (typically level 4-5), but takes much longer to compress. Running at build
 * time amortises that cost — every visitor benefits from max compression.
 *
 * Parallelised with async brotliCompress across the libuv thread pool to
 * avoid single-core bottlenecks on 4000+ HTML files. Concurrency is bounded
 * so memory doesn't balloon when every prerendered page loads simultaneously.
 *
 * Usage: bun scripts/compress-html.ts
 */

// Raise libuv thread pool BEFORE any async work so brotliCompress actually
// parallelises. Default is 4 — we lift it to match our concurrency ceiling.
// Must be set before any zlib/dns/fs async call touches the pool.
process.env.UV_THREADPOOL_SIZE ??= "16";

import {
  readdirSync,
  readFileSync,
  existsSync,
  promises as fs,
} from "node:fs";
import { join } from "node:path";
import { brotliCompress, constants } from "node:zlib";
import { promisify } from "node:util";
import { cpus } from "node:os";

const brotliCompressAsync = promisify(brotliCompress);
const CONCURRENCY = Math.max(4, Math.min(16, cpus().length));

const DIST_DIR = join(process.cwd(), "dist", "client");

if (!existsSync(DIST_DIR)) {
  console.warn("[brotli] dist/client not found — skipping compression");
  process.exit(0);
}

/** Recursively collect all files matching a predicate. */
function walkFiles(dir: string, predicate: (f: string) => boolean): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(fullPath, predicate));
    } else if (predicate(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

const htmlFiles = walkFiles(DIST_DIR, (f) => f.endsWith(".html"));

if (htmlFiles.length === 0) {
  console.warn("[brotli] No HTML files found in dist/client/");
  process.exit(0);
}

const t0 = Date.now();
let totalOriginal = 0;
let totalCompressed = 0;
let done = 0;
let skipped = 0;
const errors: string[] = [];

async function compressOne(filePath: string): Promise<void> {
  try {
    const original = readFileSync(filePath);
    const compressed = await brotliCompressAsync(original, {
      params: {
        [constants.BROTLI_PARAM_QUALITY]: 11,
        [constants.BROTLI_PARAM_MODE]: constants.BROTLI_MODE_TEXT,
      },
    });
    await fs.writeFile(`${filePath}.br`, compressed);
    totalOriginal += original.length;
    totalCompressed += compressed.length;
  } catch (err) {
    skipped++;
    errors.push(`${filePath}: ${(err as Error).message}`);
  } finally {
    done++;
    // Progress ping every ~5% so the log shows life during long runs.
    if (done % Math.max(1, Math.floor(htmlFiles.length / 20)) === 0) {
      const pct = ((done / htmlFiles.length) * 100).toFixed(0);
      const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
      console.log(`[brotli] ${done}/${htmlFiles.length} (${pct}%) — ${elapsed}s`);
    }
  }
}

// Bounded-concurrent worker pool — N workers pull from a shared queue.
async function run(): Promise<void> {
  const queue = [...htmlFiles];
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length > 0) {
      const file = queue.pop();
      if (!file) return;
      await compressOne(file);
    }
  });
  await Promise.all(workers);
}

console.log(
  `[brotli] Compressing ${htmlFiles.length} HTML files (quality 11, concurrency ${CONCURRENCY})...`,
);

await run();

const elapsedSec = ((Date.now() - t0) / 1000).toFixed(1);
const ratio = totalOriginal > 0
  ? ((1 - totalCompressed / totalOriginal) * 100).toFixed(1)
  : "0.0";

const compressed = htmlFiles.length - skipped;
console.log(
  `[brotli] Done ${compressed}/${htmlFiles.length} in ${elapsedSec}s — ` +
    `${formatBytes(totalOriginal)} → ${formatBytes(totalCompressed)} (${ratio}% savings)`,
);
if (skipped > 0) {
  console.warn(`[brotli] Skipped ${skipped} files due to errors:`);
  for (const e of errors.slice(0, 5)) console.warn(`  - ${e}`);
  if (errors.length > 5) console.warn(`  ... +${errors.length - 5} more`);
}
