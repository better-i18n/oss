/**
 * Terminal Reporter for i18n Doctor
 *
 * Modern, clean diagnostic output inspired by biome, oxlint, react-doctor.
 * Visual hierarchy: score card → categories → diagnostics → tips.
 */

import { bold, cyan, dim, green, red, yellow } from "../utils/colors.js";
import type { DoctorReport } from "../doctor/index.js";
import type { I18nDiagnostic } from "../rules/registry.js";

// ── Score Display ───────────────────────────────────────────────────

function getGrade(score: number): { letter: string; color: (s: string) => string } {
  if (score >= 90) return { letter: "A+", color: green };
  if (score >= 80) return { letter: "A", color: green };
  if (score >= 70) return { letter: "B", color: cyan };
  if (score >= 50) return { letter: "C", color: yellow };
  return { letter: "F", color: red };
}

function renderScoreBar(score: number, width = 24): string {
  const filled = Math.round((score / 100) * width);
  const empty = width - filled;
  const { color } = getGrade(score);
  return color("━".repeat(filled)) + dim("─".repeat(empty));
}

function renderCategoryRow(name: string, score: number, issueCount: number): string {
  const { color } = getGrade(score);
  const label = dim(name.padEnd(14));
  const scoreText = color(bold(String(score).padStart(3)));
  const bar = renderScoreBar(score, 12);
  const detail = issueCount > 0 ? dim(` ${issueCount} issues`) : dim(" clean");
  return `  ${label} ${bar}  ${scoreText}${detail}`;
}

// ── Diagnostic Helpers ──────────────────────────────────────────────

const SEVERITY_ORDER: Record<string, number> = { error: 0, warning: 1, info: 2 };
const KEY_BASED_RULES = new Set(["missing-in-remote", "unused-remote-key"]);

function colorizeBySeverity(text: string, severity: string): string {
  if (severity === "error") return red(text);
  if (severity === "warning") return yellow(text);
  return dim(text);
}

function sortBySeverityAndCount(
  groups: [string, I18nDiagnostic[]][],
): [string, I18nDiagnostic[]][] {
  return [...groups].sort(
    ([, a], [, b]) => {
      const sevDiff = (SEVERITY_ORDER[a[0].severity] ?? 2) - (SEVERITY_ORDER[b[0].severity] ?? 2);
      if (sevDiff !== 0) return sevDiff;
      return b.length - a.length;
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

// ── Display Limits ──────────────────────────────────────────────────

const MAX_RULE_GROUPS = 5;
const MAX_ITEMS_PER_GROUP = 5;
const MAX_ITEMS_PER_GROUP_VERBOSE = 20;

// ── Main Reporter ───────────────────────────────────────────────────

export function reportEslint(report: DoctorReport, verbose = false): void {
  const { score, summary, diagnostics } = report;
  const { color, letter } = getGrade(score.total);

  // ── Score Card ──────────────────────────────────────────────────
  console.log();
  console.log(`  ${bold("i18n Doctor")} ${dim("·")} ${dim("better-i18n")}`);
  console.log();
  console.log(`  ${renderScoreBar(score.total)}  ${color(bold(String(score.total)))}${dim("/100")}  ${color(bold(letter))}`);
  console.log(`  ${score.passed ? green("Passed") : red("Failed")} ${dim(`(threshold: ${score.passThreshold})`)}`);
  console.log();

  // ── Category Breakdown ────────────────────────────────────────
  const categories = ["Coverage", "Quality", "Code", "Structure", "Performance"];
  for (const cat of categories) {
    const catScore = score.categories[cat] ?? 100;
    const count = summary.byCategory[cat] ?? 0;
    console.log(renderCategoryRow(cat, catScore, count));
  }
  console.log();

  // ── Summary Stats ─────────────────────────────────────────────
  const parts: string[] = [];
  if (summary.errors > 0) parts.push(red(`${summary.errors} errors`));
  if (summary.warnings > 0) parts.push(yellow(`${summary.warnings} warnings`));
  if (summary.infos > 0) parts.push(dim(`${summary.infos} info`));

  if (parts.length > 0) {
    console.log(`  ${parts.join(dim("  ·  "))}`);
  } else {
    console.log(green("  No issues found"));
  }

  console.log(dim(`  ${summary.filesScanned} files  ·  ${summary.keysChecked} keys  ·  ${summary.localesChecked} locales  ·  ${(report.durationMs / 1000).toFixed(2)}s`));
  console.log();

  // ── Diagnostics ───────────────────────────────────────────────
  const actionable = diagnostics.filter(
    (d) => d.severity === "error" || d.severity === "warning",
  );

  if (actionable.length === 0) return;

  // Group by rule
  const byRule = new Map<string, I18nDiagnostic[]>();
  for (const d of actionable) {
    const existing = byRule.get(d.rule) || [];
    existing.push(d);
    byRule.set(d.rule, existing);
  }

  const sortedGroups = sortBySeverityAndCount([...byRule.entries()]);
  const visibleGroups = sortedGroups.slice(0, MAX_RULE_GROUPS);
  const hiddenGroupCount = sortedGroups.length - visibleGroups.length;
  const maxItems = verbose ? MAX_ITEMS_PER_GROUP_VERBOSE : MAX_ITEMS_PER_GROUP;

  for (const [rule, diags] of visibleGroups) {
    const first = diags[0];
    const icon = first.severity === "error" ? red("✗") : yellow("⚠");
    const count = diags.length;
    const countLabel = count > 1 ? colorizeBySeverity(` (${count})`, first.severity) : "";

    console.log(`  ${icon} ${first.message}${countLabel}`);

    if (first.help) {
      console.log(dim(`    ${first.help}`));
    }

    // Key-based rules: show namespace/key entries
    if (KEY_BASED_RULES.has(rule)) {
      const keys = buildKeyEntries(diags);
      const shown = keys.slice(0, maxItems);
      const hidden = keys.length - shown.length;
      for (const key of shown) {
        console.log(dim(`    ${key}`));
      }
      if (hidden > 0) console.log(dim(`    ... and ${hidden} more`));
    } else {
      // File-based rules: show file:line entries
      const fileLines = buildFileLineMap(diags);
      const entries = [...fileLines.entries()];
      const shown = entries.slice(0, maxItems);
      const hidden = entries.length - shown.length;
      for (const [filePath, lines] of shown) {
        const lineLabel = lines.length > 0 ? `: ${lines.join(", ")}` : "";
        console.log(dim(`    ${filePath}${lineLabel}`));
      }
      if (hidden > 0) console.log(dim(`    ... and ${hidden} more files`));
    }

    console.log();
  }

  if (hiddenGroupCount > 0) {
    console.log(dim(`  ... and ${hiddenGroupCount} more rules`));
    console.log();
  }

  // ── Tips ──────────────────────────────────────────────────────
  const CODE_RULES = new Set(["jsx-text", "jsx-attribute", "string-variable", "toast-message"]);
  const hasCodeIssues = visibleGroups.some(([rule]) => CODE_RULES.has(rule));

  if (hasCodeIssues) {
    console.log(dim(`  Tip: Add brand names and non-translatable text to lint.ignoreStrings in i18n.config.ts`));
    console.log();
  }
}
