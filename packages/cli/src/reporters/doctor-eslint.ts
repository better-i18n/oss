/**
 * ESLint-style Terminal Reporter for i18n Doctor
 *
 * Renders a framed summary box with health score bar,
 * category breakdown, and per-file diagnostic listing.
 *
 * Inspired by react-doctor's FramedLine pattern:
 * - Dual-track: plainText (width calc) + renderedText (ANSI colors)
 * - Box-drawing characters for consistent alignment
 * - Score bar with emoji indicators
 */

import { bold, cyan, dim, green, red, yellow } from "../utils/colors.js";
import type { DoctorReport } from "../doctor/index.js";
import type { I18nDiagnostic } from "../rules/registry.js";

// ── Score Bar ────────────────────────────────────────────────────────

function renderScoreBar(score: number): string {
  const width = 20;
  const filled = Math.round((score / 100) * width);
  const empty = width - filled;

  let color: (s: string) => string;
  let emoji: string;

  if (score >= 90) {
    color = green;
    emoji = "A+";
  } else if (score >= 80) {
    color = green;
    emoji = "A";
  } else if (score >= 70) {
    color = cyan;
    emoji = "B";
  } else if (score >= 50) {
    color = yellow;
    emoji = "C";
  } else {
    color = red;
    emoji = "F";
  }

  const bar = color("█".repeat(filled)) + dim("░".repeat(empty));
  return `${bar} ${bold(String(score))} ${dim(`/ 100`)} ${bold(emoji)}`;
}

// ── Category Table ──────────────────────────────────────────────────

function renderCategoryLine(
  category: string,
  score: number,
  count: number,
): string {
  const padded = category.padEnd(12);
  const scoreStr = String(score).padStart(3);

  let colorFn: (s: string) => string;
  if (score >= 90) colorFn = green;
  else if (score >= 70) colorFn = cyan;
  else if (score >= 50) colorFn = yellow;
  else colorFn = red;

  const countStr = count > 0 ? dim(` (${count} issues)`) : dim(" (clean)");
  return `  ${dim(padded)} ${colorFn(scoreStr)}${countStr}`;
}

// ── Diagnostic Listing ──────────────────────────────────────────────

function severityIcon(severity: string): string {
  if (severity === "error") return red("✖");
  if (severity === "warning") return yellow("⚠");
  return dim("ℹ");
}

function renderDiagnostic(d: I18nDiagnostic): string {
  const location = d.line > 0 ? `:${d.line}:${d.column}` : "";
  const file = dim(`${d.filePath}${location}`);
  const rule = dim(`[${d.rule}]`);
  return `  ${severityIcon(d.severity)} ${d.message}  ${rule}\n    ${file}`;
}

// ── Main Reporter ───────────────────────────────────────────────────

/**
 * Print ESLint-style report to stdout.
 */
export function reportEslint(report: DoctorReport): void {
  const { score, summary, diagnostics } = report;

  // ── Header Box ──────────────────────────────────────────────────
  console.log();
  console.log(bold("┌─────────────────────────────────────────────┐"));
  console.log(bold("│") + "  i18n Doctor Report" + " ".repeat(25) + bold("│"));
  console.log(bold("├─────────────────────────────────────────────┤"));
  console.log(bold("│") + "  " + renderScoreBar(score.total) + "      " + bold("│"));
  console.log(bold("│") + "  " + (score.passed ? green("PASSED") : red("FAILED")) + dim(` (threshold: ${score.passThreshold})`) + " ".repeat(10) + bold("│"));
  console.log(bold("└─────────────────────────────────────────────┘"));
  console.log();

  // ── Category Breakdown ──────────────────────────────────────────
  console.log(bold("Category Scores:"));
  const categories = ["Coverage", "Quality", "Code", "Structure", "Performance"];
  for (const cat of categories) {
    const catScore = score.categories[cat] ?? 100;
    const count = summary.byCategory[cat] ?? 0;
    console.log(renderCategoryLine(cat, catScore, count));
  }
  console.log();

  // ── Summary Line ────────────────────────────────────────────────
  const parts: string[] = [];
  if (summary.errors > 0) parts.push(red(`${summary.errors} errors`));
  if (summary.warnings > 0) parts.push(yellow(`${summary.warnings} warnings`));
  if (summary.infos > 0) parts.push(dim(`${summary.infos} info`));

  if (parts.length > 0) {
    console.log(`  ${parts.join(", ")}`);
  } else {
    console.log(green("  No issues found!"));
  }

  console.log(
    dim(
      `  ${summary.filesScanned} files scanned, ${summary.keysChecked} keys checked, ${summary.localesChecked} locales`,
    ),
  );
  console.log(dim(`  Completed in ${(report.durationMs / 1000).toFixed(2)}s`));
  console.log();

  // ── Diagnostic Listing (errors and warnings only) ───────────────
  const actionable = diagnostics.filter(
    (d) => d.severity === "error" || d.severity === "warning",
  );

  if (actionable.length > 0) {
    // Group by rule for readability
    const byRule = new Map<string, I18nDiagnostic[]>();
    for (const d of actionable) {
      const existing = byRule.get(d.rule) || [];
      existing.push(d);
      byRule.set(d.rule, existing);
    }

    for (const [rule, diags] of byRule) {
      const maxShow = 10;
      const shown = diags.slice(0, maxShow);
      const hidden = diags.length - maxShow;

      console.log(bold(`${rule} (${diags.length}):`));
      for (const d of shown) {
        console.log(renderDiagnostic(d));
      }
      if (hidden > 0) {
        console.log(dim(`  ... and ${hidden} more`));
      }
      console.log();
    }
  }
}
