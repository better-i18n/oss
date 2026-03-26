/**
 * Scan command implementation
 */

import { resolve } from "node:path";
import ora from "ora";
import { collectFiles } from "../analyzer/file-collector.js";
import { analyzeFile } from "../analyzer/index.js";
import type { Issue, ScanOptions } from "../analyzer/types.js";
import { detectProjectContext } from "../context/detector.js";
import { reportEslintStyle, reportSuccess, reportVerboseStats } from "../reporters/eslint-style.js";
import { reportJson } from "../reporters/json.js";
import { bold, dim } from "../utils/colors.js";

export async function scanCommand(options: ScanOptions): Promise<void> {
  const startTime = Date.now();
  const spinner = ora({ text: "Detecting project...", color: "cyan" }).start();

  // Step 1: Detect project context
  const rootDir = resolve(options.dir || process.cwd());
  const context = await detectProjectContext(rootDir, false);

  if (context) {
    spinner.succeed(
      `Project: ${bold(context.workspaceId + "/" + context.projectSlug)}`,
    );
  } else {
    spinner.warn("No i18n.config.ts found, using defaults");
  }

  // Step 2: Collect files
  spinner.start("Collecting files...");
  const files = await collectFiles({
    rootDir,
    include: context?.lint?.include,
    exclude: context?.lint?.exclude,
  });

  if (files.length === 0) {
    spinner.fail("No .tsx or .jsx files found");
    return;
  }

  spinner.succeed(`Found ${files.length} files`);

  // Step 3: Analyze files
  spinner.start("Scanning for hardcoded strings...");
  const allIssues: Issue[] = [];
  const aggregatedStats = {
    dynamicKeys: 0,
    dynamicNamespaces: 0,
    unboundTranslators: 0,
    rootScopedTranslators: 0,
  };

  for (const file of files) {
    try {
      const { issues, stats } = await analyzeFile(file, context?.lint);
      const hardcodedIssues = issues.filter((issue) => issue.severity !== "info");
      allIssues.push(...hardcodedIssues);

      aggregatedStats.dynamicKeys += stats.dynamicKeys || 0;
      aggregatedStats.dynamicNamespaces += stats.dynamicNamespaces || 0;
      aggregatedStats.unboundTranslators += stats.unboundTranslators || 0;
      aggregatedStats.rootScopedTranslators += stats.rootScopedTranslators || 0;
    } catch (error) {
      if (options.verbose) {
        console.error(`Error analyzing ${file}:`, error);
      }
    }
  }

  spinner.stop();

  // Step 4: Report results
  const duration = Date.now() - startTime;

  if (options.format === "json") {
    reportJson({
      project: context || undefined,
      files: files.length,
      issues: allIssues,
      duration,
    });
  } else {
    const maxIssues = options.maxIssues ?? 100;

    if (allIssues.length === 0) {
      reportSuccess(files.length, duration);
    } else {
      reportEslintStyle(allIssues, rootDir, maxIssues);
      console.log();
      console.log(dim(`Scanned ${files.length} files in ${(duration / 1000).toFixed(2)}s`));
    }

    if (options.verbose) {
      reportVerboseStats(aggregatedStats, files.length, duration);
    }
  }

  // Exit with error code for CI
  if (options.ci && allIssues.length > 0) {
    process.exit(1);
  }
}
