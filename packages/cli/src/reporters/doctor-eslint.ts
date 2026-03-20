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

// ── Display Limits ──────────────────────────────────────────────────

const MAX_RULE_GROUPS = 5;
const MAX_ITEMS_PER_GROUP = 5;
const MAX_ITEMS_PER_GROUP_VERBOSE = 20;

// ── Diagnostic Helpers (react-doctor pattern) ───────────────────────

const SEVERITY_ORDER: Record<string, number> = {
  error: 0,
  warning: 1,
  info: 2,
};

/** Rules that produce key-based diagnostics (namespace/key format) */
const KEY_BASED_RULES = new Set([
  "missing-in-remote",
  "unused-remote-key",
]);

function colorizeBySeverity(text: string, severity: string): string {
  if (severity === "error") return red(text);
  if (severity === "warning") return yellow(text);
  return dim(text);
}

function sortBySeverityAndCount(
  groups: [string, I18nDiagnostic[]][],
): [string, I18nDiagnostic[]][] {
  return [...groups].sort(
    ([, a]: [string, I18nDiagnostic[]], [, b]: [string, I18nDiagnostic[]]) => {
      const sevDiff =
        (SEVERITY_ORDER[a[0].severity] ?? 2) -
        (SEVERITY_ORDER[b[0].severity] ?? 2);
      if (sevDiff !== 0) return sevDiff;
      return b.length - a.length; // more issues first
    },
  );
}

function buildFileLineMap(diagnostics: I18nDiagnostic[]): Map<string, number[]> {
  const fileLines = new Map<string, number[]>();
  for (const d of diagnostics) {
    const lines = fileLines.get(d.filePath) ?? [];
    if (d.line > 0) lines.push(d.line);
    fileLines.set(d.filePath, lines);
  }
  return fileLines;
}

function buildKeyEntries(diagnostics: I18nDiagnostic[]): string[] {
  const entries: string[] = [];
  for (const d of diagnostics) {
    if (d.key) {
      const prefix = d.namespace ? `${d.namespace}/` : "";
      entries.push(`${prefix}${d.key}`);
    }
  }
  return entries;
}

// ── Main Reporter ───────────────────────────────────────────────────

/**
 * Print ESLint-style report to stdout.
 *
 * When verbose is true, file:line listings are shown under each rule group
 * (react-doctor pattern). Without verbose, only rule summary + count is shown.
 */
export function reportEslint(report: DoctorReport, verbose = false): void {
  const { score, summary, diagnostics } = report;

  // ── Header Box ──────────────────────────────────────────────────
  console.log();
  console.log(bold("╭──────────────────────────────────────────────╮"));
  console.log(bold("│") + "                                              " + bold("│"));
  console.log(bold("│") + "   🌐 " + bold("better-i18n") + dim("  ·  i18n Doctor Report") + "  " + bold("│"));
  console.log(bold("│") + dim("   hello · hola · 你好 · こんにちは · 안녕") + "    " + bold("│"));
  console.log(bold("│") + "                                              " + bold("│"));
  console.log(bold("├──────────────────────────────────────────────┤"));
  console.log(bold("│") + "  " + renderScoreBar(score.total) + "       " + bold("│"));
  console.log(bold("│") + "  " + (score.passed ? green("PASSED") : red("FAILED")) + dim(` (threshold: ${score.passThreshold})`) + " ".repeat(11) + bold("│"));
  console.log(bold("╰──────────────────────────────────────────────╯"));
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

  // ── Diagnostic Listing (grouped by rule, react-doctor style) ────
  const actionable = diagnostics.filter(
    (d) => d.severity === "error" || d.severity === "warning",
  );

  if (actionable.length > 0) {
    // Group by rule
    const byRule = new Map<string, I18nDiagnostic[]>();
    for (const d of actionable) {
      const existing = byRule.get(d.rule) || [];
      existing.push(d);
      byRule.set(d.rule, existing);
    }

    // Sort: errors first, then by count descending
    const sortedGroups = sortBySeverityAndCount([...byRule.entries()]);
    const visibleGroups = sortedGroups.slice(0, MAX_RULE_GROUPS);
    const hiddenGroupCount = sortedGroups.length - visibleGroups.length;

    const maxItems = verbose ? MAX_ITEMS_PER_GROUP_VERBOSE : MAX_ITEMS_PER_GROUP;

    for (const [rule, diags] of visibleGroups) {
      const first = diags[0];
      const icon = colorizeBySeverity(
        first.severity === "error" ? "✗" : "⚠",
        first.severity,
      );
      const count = diags.length;
      const countLabel = count > 1
        ? colorizeBySeverity(` (${count})`, first.severity)
        : "";

      // Rule message line
      console.log(`  ${icon} ${first.message}${countLabel}`);

      // Help text (indented)
      if (first.help) {
        console.log(dim(`    ${first.help}`));
      }

      // Key-based rules: show namespace/key entries
      if (KEY_BASED_RULES.has(rule)) {
        const keys = buildKeyEntries(diags);
        const shown = keys.slice(0, maxItems);
        const hiddenKeys = keys.length - shown.length;

        for (const key of shown) {
          console.log(dim(`    ${key}`));
        }
        if (hiddenKeys > 0) {
          console.log(dim(`    ... and ${hiddenKeys} more`));
        }
      } else {
        // File-based rules: show file:line entries
        const fileLines = buildFileLineMap(diags);
        const entries = [...fileLines.entries()];
        const shown = entries.slice(0, maxItems);
        const hiddenFiles = entries.length - shown.length;

        for (const [filePath, lines] of shown) {
          const lineLabel = lines.length > 0 ? `: ${lines.join(", ")}` : "";
          console.log(dim(`    ${filePath}${lineLabel}`));
        }
        if (hiddenFiles > 0) {
          console.log(dim(`    ... and ${hiddenFiles} more files`));
        }
      }

      console.log();
    }

    if (hiddenGroupCount > 0) {
      console.log(dim(`  ... and ${hiddenGroupCount} more rules`));
      console.log();
    }

    // ── Hint: show ignoreStrings tip when code rules have issues ──
    const CODE_RULES = new Set(["jsx-text", "jsx-attribute", "string-variable", "toast-message"]);
    const hasCodeIssues = visibleGroups.some(([rule]) => CODE_RULES.has(rule));

    if (hasCodeIssues) {
      console.log(
        dim("  Tip: ") +
        dim("For brand names, code identifiers, and non-translatable text,") +
        "\n" +
        dim("  add them to lint.ignoreStrings in i18n.config.ts or use // i18n-ignore comments"),
      );
      console.log();
    }
  }

}
