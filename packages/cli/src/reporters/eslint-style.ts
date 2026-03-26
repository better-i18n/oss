/**
 * ESLint-style terminal reporter for scan command
 *
 * Modern, clean output inspired by biome, oxlint, and react-doctor.
 * VS Code terminal auto-detects "path:line:column" format → Cmd+clickable.
 */

import { relative } from "node:path";
import type { Issue } from "../analyzer/types.js";
import { bold, cyan, dim, green, red, yellow } from "../utils/colors.js";

// ── Success Banner ──────────────────────────────────────────────────

export function reportSuccess(filesScanned: number, durationMs: number): void {
  console.log();
  console.log(green(bold("  ✓ No hardcoded strings found")));
  console.log(dim(`  Scanned ${filesScanned} files in ${(durationMs / 1000).toFixed(2)}s`));
}

// ── Issue Reporter ──────────────────────────────────────────────────

export function reportEslintStyle(
  issues: Issue[],
  rootDir: string,
  maxIssues?: number,
): void {
  if (issues.length === 0) return;

  const totalIssues = issues.length;
  const displayIssues = maxIssues ? issues.slice(0, maxIssues) : issues;
  const hasMore = maxIssues && totalIssues > maxIssues;

  // Group by file
  const byFile = new Map<string, Issue[]>();
  for (const issue of displayIssues) {
    const existing = byFile.get(issue.file) || [];
    existing.push(issue);
    byFile.set(issue.file, existing);
  }

  // Print each file's issues
  for (const [file, fileIssues] of byFile.entries()) {
    const relPath = relative(rootDir, file);
    console.log();
    console.log(`${cyan(relPath)} ${dim(`(${fileIssues.length})`)}`);

    for (const issue of fileIssues) {
      const loc = dim(`${issue.line}:${issue.column}`);
      const severity = yellow("missing");
      const text = truncateForDisplay(issue.text, 40);
      const rule = dim(`i18n/${issue.type}`);
      console.log(`  ${loc}  ${severity}  ${text}  ${rule}`);
    }
  }

  // Truncation notice
  if (hasMore) {
    const remaining = totalIssues - maxIssues;
    console.log();
    console.log(dim(`  ... and ${remaining} more problem${remaining > 1 ? "s" : ""}`));
  }

  // ── Summary Footer ──────────────────────────────────────────────
  const missingCount = issues.filter((i) => i.severity !== "error").length;
  const errorCount = issues.filter((i) => i.severity === "error").length;
  const parts: string[] = [];
  if (errorCount > 0) parts.push(red(`${errorCount} error${errorCount > 1 ? "s" : ""}`));
  if (missingCount > 0) parts.push(yellow(`${missingCount} missing translation${missingCount > 1 ? "s" : ""}`));

  console.log(bold(`✖ ${totalIssues} problem${totalIssues > 1 ? "s" : ""} (${parts.join(", ")})`));
}

// ── Verbose Stats ───────────────────────────────────────────────────

interface ScanStats {
  rootScopedTranslators: number;
  unboundTranslators: number;
  dynamicNamespaces: number;
  dynamicKeys: number;
}

export function reportVerboseStats(stats: ScanStats, filesScanned: number, durationMs: number): void {
  console.log(dim(`\n🔍 Scan Details:`));
  console.log(dim(`  - Root-scoped translators: ${stats.rootScopedTranslators}`));
  console.log(dim(`  - Unbound translators: ${stats.unboundTranslators}`));
  console.log(dim(`  - Dynamic namespaces skipped: ${stats.dynamicNamespaces}`));
  console.log(dim(`  - Dynamic keys skipped: ${stats.dynamicKeys}`));
}

// ── Helpers ─────────────────────────────────────────────────────────

function truncateForDisplay(str: string, maxLen: number): string {
  const cleaned = str.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLen) return `"${cleaned}"`;
  return `"${cleaned.slice(0, maxLen - 1)}…"`;
}
