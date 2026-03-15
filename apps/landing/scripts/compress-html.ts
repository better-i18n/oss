/**
 * Post-build script: Pre-compress all HTML files with Brotli level 11.
 *
 * Brotli 11 is ~20-30% smaller than Cloudflare's default edge compression
 * (typically level 4-5), but takes much longer to compress. Running at build
 * time amortises that cost — every visitor benefits from max compression.
 *
 * Usage: bun scripts/compress-html.ts
 */
import {
  readdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
} from "node:fs";
import { join } from "node:path";
import { brotliCompressSync, constants } from "node:zlib";

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
  return `${kb.toFixed(1)} KB`;
}

const htmlFiles = walkFiles(DIST_DIR, (f) => f.endsWith(".html"));

if (htmlFiles.length === 0) {
  console.warn("[brotli] No HTML files found in dist/client/");
  process.exit(0);
}

let totalOriginal = 0;
let totalCompressed = 0;
let skipped = 0;

for (const filePath of htmlFiles) {
  try {
    const original = readFileSync(filePath);
    const compressed = brotliCompressSync(original, {
      params: {
        [constants.BROTLI_PARAM_QUALITY]: 11,
        [constants.BROTLI_PARAM_MODE]: constants.BROTLI_MODE_TEXT,
      },
    });

    writeFileSync(`${filePath}.br`, compressed);
    totalOriginal += original.length;
    totalCompressed += compressed.length;
  } catch (err) {
    skipped++;
    console.warn(`[brotli] Skipped ${filePath}: ${(err as Error).message}`);
  }
}

const ratio = ((1 - totalCompressed / totalOriginal) * 100).toFixed(1);

const compressed = htmlFiles.length - skipped;
console.log(
  `[brotli] Compressed ${compressed} HTML files — ${formatBytes(totalOriginal)} → ${formatBytes(totalCompressed)} (${ratio}% savings)`,
);
if (skipped > 0) {
  console.warn(`[brotli] Skipped ${skipped} files due to errors`);
}
