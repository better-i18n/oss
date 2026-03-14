/**
 * Check text-to-HTML ratio of prerendered pages.
 * Run after `bun run build`:
 *   bun run scripts/check-text-ratio.ts
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const distDir = path.join(process.cwd(), "dist", "client");

function extractVisibleText(html: string): string {
  // Remove script tags and their content
  let text = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  // Remove style tags and their content
  text = text.replace(/<style[\s\S]*?<\/style>/gi, "");
  // Remove all HTML tags
  text = text.replace(/<[^>]+>/g, " ");
  // Decode common HTML entities
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
  // Collapse whitespace
  text = text.replace(/\s+/g, " ").trim();
  return text;
}

function findHtmlFiles(dir: string): string[] {
  const files: string[] = [];
  try {
    for (const entry of readdirSync(dir)) {
      const fullPath = path.join(dir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        files.push(...findHtmlFiles(fullPath));
      } else if (entry.endsWith(".html")) {
        files.push(fullPath);
      }
    }
  } catch {
    // Directory doesn't exist
  }
  return files;
}

const htmlFiles = findHtmlFiles(distDir);

if (htmlFiles.length === 0) {
  console.error("No HTML files found in dist/client/. Run `bun run build` first.");
  process.exit(1);
}

interface PageResult {
  path: string;
  htmlSize: number;
  textSize: number;
  ratio: number;
}

const results: PageResult[] = [];

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf-8");
  const text = extractVisibleText(html);
  const relativePath = path.relative(distDir, file);

  results.push({
    path: relativePath,
    htmlSize: html.length,
    textSize: text.length,
    ratio: html.length > 0 ? text.length / html.length : 0,
  });
}

// Sort by ratio ascending (worst first)
results.sort((a, b) => a.ratio - b.ratio);

// Summary stats
const ratios = results.map((r) => r.ratio);
const avgRatio = ratios.reduce((a, b) => a + b, 0) / ratios.length;
const minRatio = Math.min(...ratios);
const maxRatio = Math.max(...ratios);
const belowThreshold = results.filter((r) => r.ratio < 0.1).length;

console.log("═══════════════════════════════════════════════════════════");
console.log("  Text-to-HTML Ratio Report");
console.log("═══════════════════════════════════════════════════════════");
console.log(`  Pages analyzed:    ${results.length}`);
console.log(`  Average ratio:     ${(avgRatio * 100).toFixed(1)}%`);
console.log(`  Min ratio:         ${(minRatio * 100).toFixed(1)}%`);
console.log(`  Max ratio:         ${(maxRatio * 100).toFixed(1)}%`);
console.log(`  Below 10%:         ${belowThreshold} pages`);
console.log("═══════════════════════════════════════════════════════════\n");

// Show worst 20 pages
console.log("Worst 20 pages (lowest ratio):\n");
console.log("  Ratio   HTML(KB)  Text(KB)  Path");
console.log("  ─────   ────────  ────────  ────");
for (const r of results.slice(0, 20)) {
  const ratio = (r.ratio * 100).toFixed(1).padStart(5);
  const htmlKb = (r.htmlSize / 1024).toFixed(0).padStart(6);
  const textKb = (r.textSize / 1024).toFixed(0).padStart(6);
  console.log(`  ${ratio}%   ${htmlKb}KB  ${textKb}KB  ${r.path}`);
}

// Show best 5 pages
console.log("\nBest 5 pages (highest ratio):\n");
console.log("  Ratio   HTML(KB)  Text(KB)  Path");
console.log("  ─────   ────────  ────────  ────");
for (const r of results.slice(-5).reverse()) {
  const ratio = (r.ratio * 100).toFixed(1).padStart(5);
  const htmlKb = (r.htmlSize / 1024).toFixed(0).padStart(6);
  const textKb = (r.textSize / 1024).toFixed(0).padStart(6);
  console.log(`  ${ratio}%   ${htmlKb}KB  ${textKb}KB  ${r.path}`);
}
