/**
 * ESLint-style terminal reporter
 *
 * VS Code terminal auto-detects "path:line:column" format and makes it Cmd+clickable
 */

import { relative } from "node:path";
import type { Issue } from "../analyzer/types.js";
import { bold, cyan, dim, red, yellow } from "../utils/colors.js";

/**
 * Report issues in ESLint-style format
 */
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

  let _errorCount = 0;
  let _missingCount = 0;

  // Print each file's issues grouped by file
  for (const [file, fileIssues] of byFile.entries()) {
    const relPath = relative(rootDir, file);

    console.log();
    // File header: blue filename + issue count
    const count = dim(`(${fileIssues.length})`);
    console.log(`${cyan(relPath)} ${count}`);

    for (const issue of fileIssues) {
      // Format: "  line:col  severity  message  rule"
      // Full path clickable: relPath:line:col
      const loc = dim(`${issue.line}:${issue.column}`);
      const severity =
        issue.severity === "error" ? red("error") : yellow("missing");
      const text = truncateForDisplay(issue.text, 40);
      const rule = dim(`i18n/${issue.type}`);

      console.log(`  ${loc}  ${severity}  ${text}  ${rule}`);

      if (issue.severity === "error") {
        _errorCount++;
      } else {
        _missingCount++;
      }
    }
  }

  // Show "and X more" message if truncated
  if (hasMore) {
    const remaining = totalIssues - maxIssues;
    console.log();
    console.log(
      dim(`... and ${remaining} more problem${remaining > 1 ? "s" : ""}`),
    );
  }

  // Summary - use total counts, not just displayed
  const totalErrorCount = issues.filter((i) => i.severity === "error").length;
  const totalMissingCount = issues.filter(
    (i) => i.severity === "warning",
  ).length;
  const total = totalErrorCount + totalMissingCount;
  const summary = [];
  if (totalErrorCount > 0)
    summary.push(
      red(`${totalErrorCount} error${totalErrorCount > 1 ? "s" : ""}`),
    );
  if (totalMissingCount > 0)
    summary.push(
      yellow(
        `${totalMissingCount} missing translation${totalMissingCount > 1 ? "s" : ""}`,
      ),
    );

  console.log(
    bold(`✖ ${total} problem${total > 1 ? "s" : ""} (${summary.join(", ")})`),
  );
}

/**
 * Truncate text for display, cleaning up whitespace
 */
function truncateForDisplay(str: string, maxLen: number): string {
  const cleaned = str.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLen) return `"${cleaned}"`;
  return `"${cleaned.slice(0, maxLen - 1)}…"`;
}
