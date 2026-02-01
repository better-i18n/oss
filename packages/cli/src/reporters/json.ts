/**
 * JSON reporter for CI/CD integration
 */

import type { Issue, ScanResult } from "../analyzer/types.js";

/**
 * Report results as JSON to stdout
 */
export function reportJson(result: ScanResult): void {
  const output = {
    project: result.project
      ? {
        workspace: result.project.workspaceId,
        slug: result.project.projectSlug,
      }
      : null,
    summary: {
      issues: result.issues.length,
      errors: result.issues.filter((i: Issue) => i.severity === "error").length,
      warnings: result.issues.filter((i: Issue) => i.severity === "warning").length,
      duration: result.duration,
      results: result.issues.map((issue: Issue) => ({
        file: issue.file,
        line: issue.line,
        column: issue.column,
        type: issue.type,
        severity: issue.severity,
        message: issue.message,
        text: issue.text,
        suggestedKey: issue.suggestedKey,
      })),
    },
  };

  console.log(JSON.stringify(output, null, 2));
}
