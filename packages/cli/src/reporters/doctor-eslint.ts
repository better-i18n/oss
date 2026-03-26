/**
 * Terminal Reporter for i18n Doctor
 *
 * Modern, clean diagnostic output with framed score card.
 * Visual hierarchy: score card → categories → diagnostics → tips.
 */

import { bold, cyan, dim, green, red, yellow } from "../utils/colors.js";
import type { DoctorReport } from "../doctor/index.js";
import type { I18nDiagnostic } from "../rules/registry.js";

// ── ANSI helpers ────────────────────────────────────────────────────

const ANSI_RE = /\u001B\[[0-9;]*m/g;
const stripAnsi = (s: string) => s.replace(ANSI_RE, "");
const visLen = (s: string) => stripAnsi(s).length;
const pad = (s: string, width: number) => s + " ".repeat(Math.max(0, width - visLen(s)));

// ── Framed Box ──────────────────────────────────────────────────────

interface FramedLine {
  plain: string;
  rendered: string;
}

function fl(plain: string, rendered?: string): FramedLine {
  return { plain, rendered: rendered ?? plain };
}

function printFramedBox(lines: FramedLine[], dividerAfter?: number): void {
  const maxWidth = Math.max(...lines.map((l) => l.plain.length));
  const inner = maxWidth + 2; // 1 space padding each side

  const top = dim(`  ╭${"─".repeat(inner)}╮`);
  const bot = dim(`  ╰${"─".repeat(inner)}╯`);
  const sep = dim(`  ├${"─".repeat(inner)}┤`);
  const wall = dim("│");

  console.log(top);
  for (let i = 0; i < lines.length; i++) {
    const padded = pad(lines[i].rendered, maxWidth);
    console.log(`  ${wall} ${padded} ${wall}`);
    if (dividerAfter !== undefined && i === dividerAfter) {
      console.log(sep);
    }
  }
  console.log(bot);
}

// ── Score Display ───────────────────────────────────────────────────

function getGrade(score: number): { letter: string; color: (s: string) => string } {
  if (score >= 90) return { letter: "A+", color: green };
  if (score >= 80) return { letter: "A", color: green };
  if (score >= 70) return { letter: "B", color: cyan };
  if (score >= 50) return { letter: "C", color: yellow };
  return { letter: "F", color: red };
}

function renderScoreBar(score: number, width = 20): { plain: string; rendered: string } {
  const filled = Math.round((score / 100) * width);
  const empty = width - filled;
  const { color } = getGrade(score);
  return {
    plain: "━".repeat(filled) + "─".repeat(empty),
    rendered: color("━".repeat(filled)) + dim("─".repeat(empty)),
  };
}

function renderCategoryRow(name: string, score: number, issueCount: number): FramedLine {
  const { color } = getGrade(score);
  const bar = renderScoreBar(score, 10);
  const detail = issueCount > 0 ? `${issueCount} issues` : "clean";
  const scoreStr = String(score).padStart(3);

  const plain = `${name.padEnd(14)} ${bar.plain}  ${scoreStr}  ${detail}`;
  const rendered = `${dim(name.padEnd(14))} ${bar.rendered}  ${color(bold(scoreStr))}  ${dim(detail)}`;
  return fl(plain, rendered);
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
  return [...groups].sort(([, a], [, b]) => {
    const sevDiff =
      (SEVERITY_ORDER[a[0].severity] ?? 2) - (SEVERITY_ORDER[b[0].severity] ?? 2);
    if (sevDiff !== 0) return sevDiff;
    return b.length - a.length;
  });
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

  // ── Framed Score Card ───────────────────────────────────────────
  const bar = renderScoreBar(score.total);
  const scoreStr = String(score.total);
  const statusText = score.passed ? "Passed" : "Failed";
  const statusColor = score.passed ? green : red;

  // Build summary parts
  const statParts: string[] = [];
  if (summary.errors > 0) statParts.push(`${summary.errors} errors`);
  if (summary.warnings > 0) statParts.push(`${summary.warnings} warnings`);
  if (summary.infos > 0) statParts.push(`${summary.infos} info`);
  const statLine = statParts.length > 0 ? statParts.join("  ·  ") : "No issues";

  const metaLine = `${summary.filesScanned} files  ·  ${summary.keysChecked} keys  ·  ${summary.localesChecked} locales  ·  ${(report.durationMs / 1000).toFixed(1)}s`;

  const boxLines: FramedLine[] = [
    fl(
      "i18n Doctor  ·  better-i18n",
      `${bold("i18n Doctor")}  ${dim("·")}  ${dim("better-i18n")}`,
    ),
    fl(""), // empty line
    fl(
      `${bar.plain}  ${scoreStr}/100  ${letter}`,
      `${bar.rendered}  ${color(bold(scoreStr))}${dim("/100")}  ${color(bold(letter))}`,
    ),
    fl(
      `${statusText} (threshold: ${score.passThreshold})`,
      `${statusColor(statusText)} ${dim(`(threshold: ${score.passThreshold})`)}`,
    ),
    fl(""), // empty line
  ];

  // Category rows
  const categories = ["Coverage", "Quality", "Code", "Structure", "Performance"];
  for (const cat of categories) {
    const catScore = score.categories[cat] ?? 100;
    const count = summary.byCategory[cat] ?? 0;
    boxLines.push(renderCategoryRow(cat, catScore, count));
  }

  boxLines.push(fl("")); // empty line

  // Stat parts — colorized in rendered, plain in plain
  const statRenderedParts: string[] = [];
  if (summary.errors > 0) statRenderedParts.push(red(`${summary.errors} errors`));
  if (summary.warnings > 0) statRenderedParts.push(yellow(`${summary.warnings} warnings`));
  if (summary.infos > 0) statRenderedParts.push(dim(`${summary.infos} info`));
  const statRendered = statRenderedParts.length > 0
    ? statRenderedParts.join(dim("  ·  "))
    : green("No issues");

  boxLines.push(fl(statLine, statRendered));
  boxLines.push(fl(metaLine, dim(metaLine)));

  console.log();
  printFramedBox(boxLines, 0); // divider after first line (title)
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
    const countLabel =
      count > 1 ? colorizeBySeverity(` (${count})`, first.severity) : "";

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
  const CODE_RULES = new Set([
    "jsx-text",
    "jsx-attribute",
    "string-variable",
    "toast-message",
  ]);
  const hasCodeIssues = visibleGroups.some(([rule]) => CODE_RULES.has(rule));

  if (hasCodeIssues) {
    console.log(
      dim(
        `  Tip: Add brand names and non-translatable text to lint.ignoreStrings in i18n.config.ts`,
      ),
    );
    console.log();
  }
}
