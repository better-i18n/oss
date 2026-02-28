/**
 * Sync command
 *
 * Compares local t() calls with Better i18n cloud translations
 */

import { resolve } from "node:path";
import ora from "ora";
import { collectFiles } from "../analyzer/file-collector.js";
import { analyzeFile } from "../analyzer/index.js";
import type { CdnManifest, Issue, ScanOptions } from "../analyzer/types.js";
import { detectProjectContext } from "../context/detector.js";
import { bold, cyan, dim, green, red, yellow } from "../utils/colors.js";
import {
  countMissingKeys,
  countMissingKeysFromEntries,
  flattenKeys,
  countTotalKeys,
  type MissingKeyEntry,
} from "../utils/json-keys.js";
import { fetchManifest, fetchRemoteKeys } from "../utils/cdn-client.js";
import {
  getSummary,
  groupKeysByNamespace,
  type DynamicPatternMatch,
  type SyncMetrics,
} from "../utils/key-comparison.js";

// Type for local keys structure
interface LocalKeysData {
  project: string;
  namespaces: Record<string, string[]>;
  totalCount: number;
  filesScanned: number;
  verbose?: boolean;
}

// Type for verification results
interface VerificationResult {
  key: string;
  found: boolean;
  count: number;
}

export interface SyncOptions extends ScanOptions {
  format: "eslint" | "json";
  summary?: boolean;
  checkType?: "missing" | "unused" | "both"; // Which checks to run
}

export async function syncCommand(options: SyncOptions) {
  const startTime = Date.now();
  const isJson = options.format === "json";

  // Create spinner (noop for JSON output)
  const spinner = isJson
    ? {
      start: (_text?: string) => { },
      succeed: (_text?: string) => { },
      fail: (_text?: string) => { },
      warn: (_text?: string) => { },
      text: "",
    }
    : ora({ text: "Detecting project...", color: "cyan" }).start();

  // Step 1: Detect project context
  // Resolve relative paths to absolute for consistency
  const rootDir = resolve(options.dir || process.cwd());

  // Always search only in the specified directory, never search parent tree
  // This prevents confusing behavior where CLI picks up config from parent workspaces
  const context = await detectProjectContext(rootDir, false);

  if (context) {
    spinner.succeed(
      `Project: ${bold(context.workspaceId + "/" + context.projectSlug)}`,
    );
  } else {
    spinner.warn("No i18n.config.ts found, using defaults");
  }

  // Step 2: Fetch manifest to get source language
  let manifest: CdnManifest | null = null;
  let sourceLocale = context?.defaultLocale || "en";

  // Use default CDN URL if not specified in config
  const cdnBaseUrl = context?.cdnBaseUrl || "https://cdn.better-i18n.com";

  if (context) {
    spinner.start("Fetching manifest...");
    try {
      manifest = await fetchManifest(
        cdnBaseUrl,
        context.workspaceId,
        context.projectSlug,
      );
      // Get source language from manifest
      const sourceLanguage = manifest.languages.find((l) => l.isSource);
      if (sourceLanguage) {
        sourceLocale = sourceLanguage.code;
      }
      spinner.succeed(
        `Manifest loaded (source: ${bold(sourceLocale)}, ${manifest.languages.length} languages)`,
      );
    } catch (error) {
      spinner.warn(
        `Could not fetch manifest: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  // Step 3: Collect files
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

  // Step 4: Analyze files for t() calls with progress
  const allIssues: Issue[] = [];
  const aggregatedStats = {
    dynamicKeys: 0,
    dynamicNamespaces: 0,
    unboundTranslators: 0,
    rootScopedTranslators: 0,
  };
  let processedFiles = 0;

  for (const file of files) {
    processedFiles++;
    // Update spinner with progress every 10 files
    if (!isJson && processedFiles % 10 === 0) {
      spinner.text = `Extracting keys... (${processedFiles}/${files.length})`;
    }
    if (!isJson && processedFiles === 1) {
      spinner.start(`Extracting keys... (${processedFiles}/${files.length})`);
    }

    try {
      const { issues, stats } = await analyzeFile(file, context?.lint, options.verbose);

      // Filter only translation function calls (exclude hardcoded strings)
      // Translation keys have severity "info", hardcoded strings have "warning"
      const translationKeys = issues.filter(
        (i: Issue) => i.type === "string-variable" && i.severity === "info",
      );
      allIssues.push(...translationKeys);

      // Aggregate stats
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

  spinner.succeed(`Extracted ${allIssues.length} keys from ${files.length} files`);

  // Step 5: Organize keys by namespace
  const keysByNamespace = groupKeysByNamespace(allIssues);

  const localKeys = {
    project: context
      ? `${context.workspaceId}/${context.projectSlug}`
      : "unknown",
    namespaces: keysByNamespace,
    totalCount: allIssues.length,
    filesScanned: files.length,
    verbose: options.verbose,
  };

  // Step 6: Compare with CDN (always if manifest available)
  if (manifest && context) {
    spinner.start(`Comparing with remote (${sourceLocale})...`);

    try {
      const remoteKeys = await fetchRemoteKeys(
        cdnBaseUrl,
        context.workspaceId,
        context.projectSlug,
        sourceLocale,
        manifest,
      );

      spinner.succeed(
        `Fetched ${countTotalKeys(remoteKeys)} keys from remote`,
      );

      // Unified comparison logic
      const metrics = getSummary(allIssues, remoteKeys, options.verbose);
      // Attach stats to metrics for reporting
      metrics.scanStats = aggregatedStats;
      const duration = Date.now() - startTime;

      // Show ultra-detailed debug info if verbose
      if (options.verbose) {
        console.log();
        console.log(bold("🔍 [DEBUG] Sync Audit Log (Verbose)"));
        console.log(dim("Checking key normalization and matching..."));

        const localSample = Array.from(new Set(Object.values(localKeys.namespaces).flat())).slice(0, 15);

        console.log(cyan("\n--- LOCAL KEYS SAMPLE ---"));
        localSample.forEach(k => console.log(`  ${k}`));

        console.log(cyan("\n--- REMOTE KEYS SAMPLE ---"));
        const remoteRawKeys = Array.from(new Set(Object.values(flattenKeys(remoteKeys)).flat() as string[])).slice(0, 15);
        remoteRawKeys.forEach(k => console.log(`  ${k}`));

        console.log(cyan("\n--- MATCHING CONDITIONS ---"));
        console.log(`  Local Total: ${metrics.localTotal}`);
        console.log(`  Remote Total: ${metrics.remoteTotal}`);
        console.log(`  Intersection: ${metrics.intersectionCount}`);

        if (localSample.length > 0 && remoteRawKeys.length > 0) {
          const firstLocal = localSample[0];
          const hasMatch = remoteRawKeys.includes(firstLocal);
          console.log(`\n  Test Match: "${firstLocal}" -> ${hasMatch ? green("MATCHED") : red("NOT FOUND")}`);
        }
        console.log(dim("------------------------\n"));
      }

      // Report comparison
      if (isJson) {
        const output = {
          project: context
            ? {
              workspace: context.workspaceId,
              slug: context.projectSlug,
              sourceLocale,
            }
            : null,
          localKeys: {
            total: metrics.localTotal,
            namespaces: localKeys.namespaces,
          },
          remoteKeys: {
            total: metrics.remoteTotal,
          },
          comparison: {
            missingInRemote: metrics.missing,
            missingCount: countMissingKeysFromEntries(metrics.missing),
            usedViaDynamicPatterns: metrics.dynamicPatternMatches?.map(p => ({
              pattern: p.pattern,
              file: p.file,
              line: p.line,
              matchCount: p.matchedKeys.length,
              examples: p.matchedKeys.slice(0, 5),
            })),
            dynamicMatchCount: metrics.dynamicPatternMatches?.reduce((sum, p) => sum + p.matchedKeys.length, 0) || 0,
            possiblyUnused: metrics.unused,
            possiblyUnusedCount: countMissingKeys(metrics.unused),
          },
          coverage: {
            local: metrics.localCoverage,
            remote: metrics.remoteCoverage,
          },
          files: files.length,
          duration,
        };
        console.log(JSON.stringify(output, null, 2));
      } else {
        // Unused verification (Grep) in verbose mode
        let verificationResults = null;
        if (options.verbose) {
          verificationResults = await verifyUnusedKeys(metrics.unused, rootDir);
        }

        reportComparisonReport(
          localKeys, // Still pass for meta info
          metrics,
          duration,
          sourceLocale,
          options.summary,
          verificationResults,
          options.checkType // Pass checkType to filter report
        );
      }
    } catch (error) {
      spinner.fail(
        `Failed to fetch remote keys: ${error instanceof Error ? error.message : String(error)}`,
      );
      reportLocalKeys(localKeys, allIssues.length, Date.now() - startTime);
    }
  } else {
    // Just report local keys
    const duration = Date.now() - startTime;
    if (isJson) {
      const output = {
        localKeys,
        files: files.length,
        duration,
      };
      console.log(JSON.stringify(output, null, 2));
    } else {
      reportLocalKeys(localKeys, allIssues.length, duration);
    }
  }
}

// fetchManifest, groupKeysByNamespace, fetchRemoteKeys → imported from utils/

// getSummary → imported from utils/key-comparison.js



// flattenKeys, countTotalKeys, countMissingKeys, countMissingKeysFromEntries → imported from utils/json-keys.js


/**
 * Report local keys (human-readable) - simplified summary
 */
function reportLocalKeys(
  localKeys: LocalKeysData,
  _issueCount: number,
  duration: number,
) {
  console.log();
  console.log(bold("📦 Local Translation Keys"));
  console.log();

  const sortedNamespaces = Object.keys(localKeys.namespaces).sort();

  // Show namespace summary in compact format
  for (const namespace of sortedNamespaces) {
    const keys = localKeys.namespaces[namespace];
    console.log(`  ${dim(namespace + ":")} ${keys.length} keys`);
  }

  console.log();
  console.log(green(bold(`✓ Found ${localKeys.totalCount} keys in ${sortedNamespaces.length} namespaces`)));
  console.log(
    dim(
      `Scanned ${localKeys.filesScanned} files in ${(duration / 1000).toFixed(2)}s`,
    ),
  );
}

/**
 * Report comparison (human-readable)
 */
function reportComparisonReport(
  localKeys: LocalKeysData,
  metrics: SyncMetrics,
  duration: number,
  sourceLocale: string,
  onlySummary?: boolean,
  verificationResults?: VerificationResult[] | null,
  checkType?: "missing" | "unused" | "both"
) {
  // Default to 'both' if not specified (backward compatibility)
  const effectiveCheckType = checkType || "both";
  console.log();
  console.log(bold("📊 Translation Keys Comparison"));
  console.log(dim(`Source locale: ${sourceLocale}`));
  console.log();

  // Show coverage based on check type
  console.log(`${dim("Coverage:")}`);
  if (effectiveCheckType === "missing" || effectiveCheckType === "both") {
    console.log(`  Local → Remote: ${cyan(metrics.localCoverage + "%")} ${dim("(keys in code that exist in remote)")}`);
  }
  if (effectiveCheckType === "unused" || effectiveCheckType === "both") {
    console.log(`  Remote Used: ${cyan(metrics.remoteCoverage + "%")} ${dim("(remote keys detected in code)")}`);
  }
  console.log();

  // Audit Invariants (Verbose)
  if (process.env.DEBUG || localKeys.verbose) {
    console.log(dim("🛠️  Invariant Audit:"));
    console.log(`  Local Invariant: ${metrics.invariants.local ? green("PASS") : red("FAIL")}`);
    console.log(`  Remote Invariant: ${metrics.invariants.remote ? green("PASS") : red("FAIL")}`);
    console.log(`  Intersection: ${metrics.intersectionCount}`);

    console.log(dim("\n📦 Scoping Summary:"));
    for (const [type, count] of Object.entries(metrics.classification)) {
      if ((count as number) > 0) console.log(`  - ${type}: ${count}`);
    }

    if (metrics.scanStats) {
      console.log(dim("\n🔍 Scan Details:"));
      console.log(`  - Root-scoped translators: ${metrics.scanStats.rootScopedTranslators}`);
      console.log(`  - Unbound translators: ${metrics.scanStats.unboundTranslators}`);
      console.log(`  - Dynamic namespaces skipped: ${metrics.scanStats.dynamicNamespaces}`);
      console.log(`  - Dynamic keys skipped: ${metrics.scanStats.dynamicKeys}`);
    }

    if (metrics.filteredKeys && metrics.filteredKeys.length > 0) {
      console.log(dim("\n📦 Filtered Keys (Not Added to Local):"));
      const displayLimit = 10;
      const filtered = metrics.filteredKeys.slice(0, displayLimit);
      for (const { key, reason } of filtered) {
        console.log(`  - ${key} (${reason})`);
      }
      if (metrics.filteredKeys.length > displayLimit) {
        console.log(`  ... and ${metrics.filteredKeys.length - displayLimit} more`);
      }
    }

    console.log(dim("\n🎯 Key Probes:"));
    const probes = [
      "hero.features.practiceSpeaking",
      "hero.ariaLabel",
      "pages.bestApps.meta.description",
      "meta.keywords"
    ];

    for (const probe of probes) {
      const inLocal = metrics.allLocal.has(probe);
      const inRemote = metrics.allRemoteLeaves.has(probe);

      let status = dim("NOT FOUND");
      if (inLocal && inRemote) status = green("MATCHED");
      else if (inLocal && !inRemote) status = red("MISSING IN REMOTE");
      else if (!inLocal && inRemote) status = yellow("UNUSED IN CODE");

      console.log(`  - ${probe}: ${status}`);
    }

    if (verificationResults && verificationResults.length > 0) {
      console.log(dim("\n🔍 Unused Verification Sample (Grep Check):"));
      for (const res of verificationResults) {
        console.log(`  - ${res.key}: ${res.found ? green(`FOUND (${res.count} times)`) : yellow("NOT FOUND")}`);
      }
    }
    console.log();
  }

  if (onlySummary) {
    console.log(
      dim(
        `Scanned ${localKeys.filesScanned} files in ${(duration / 1000).toFixed(2)}s`,
      ),
    );
    console.log(green(bold(`✓ Summary report complete`)));
    return;
  }

  // Missing keys (in code but not in remote) - Tree format
  // Only show if checking for missing keys or both
  if (effectiveCheckType === "missing" || effectiveCheckType === "both") {
    const totalMissing = countMissingKeysFromEntries(metrics.missing);
    if (totalMissing > 0) {
      console.log(red(bold(`⊕ Missing in Remote (${totalMissing} keys)`)));
      console.log(dim("  Keys used in code but not uploaded to Better i18n"));
      console.log();

      renderTree(metrics.missing, true, false);
      console.log();
    } else {
      console.log(green(bold("✓ All local keys exist in remote!")));
      console.log();
    }
  }

  // Dynamic pattern matches (MOVED UP - positive evidence comes before negative)
  // Only show if checking for unused keys or both (relevant when analyzing unused)
  if (
    (effectiveCheckType === "unused" || effectiveCheckType === "both") &&
    metrics.dynamicPatternMatches &&
    metrics.dynamicPatternMatches.length > 0
  ) {
    const totalMatched = metrics.dynamicPatternMatches.reduce(
      (sum: number, p: DynamicPatternMatch) => sum + p.matchedKeys.length,
      0
    );

    console.log(cyan(bold(`🔍 Used via Dynamic Patterns (${totalMatched} keys)`)));
    console.log(dim("  These keys are accessed through template literals like t(`plans.${x}.name`)"));
    console.log(dim("  Detected patterns:"));
    console.log();

    // Group by pattern
    for (const match of metrics.dynamicPatternMatches) {
      const { pattern, file, line, matchedKeys } = match;
      const fileName = file.split('/').pop() || file;

      console.log(`  ${bold(pattern)} ${dim(`(${matchedKeys.length} keys)`)}`);
      console.log(`    ${dim(`└─ ${fileName}:${line}`)}`);

      // Show a few example matched keys
      const examples = matchedKeys.slice(0, 5);
      examples.forEach((key: string) => {
        console.log(`       ${dim('→')} ${key}`);
      });

      if (matchedKeys.length > 5) {
        console.log(`       ${dim(`... and ${matchedKeys.length - 5} more`)}`);
      }

      console.log();
    }

    console.log(yellow(bold("  ⚠️  WARNING: Do NOT delete these keys without manual verification!")));
    console.log(dim("  The CLI detected these keys through pattern matching, but cannot guarantee"));
    console.log(dim("  100% accuracy. Review the source code before deleting any keys."));
    console.log();
  }

  // Static unused keys (in remote but not detected in code) - Tree format (MOVED DOWN)
  // Only show if checking for unused keys or both
  if (effectiveCheckType === "unused" || effectiveCheckType === "both") {
    const totalUnused = countMissingKeys(metrics.unused);
    if (totalUnused > 0) {
      console.log(yellow(bold(`⊖ Possibly Unused (${totalUnused} keys)`)));
      console.log(dim("  Static keys not detected in code - safe to review for deletion"));
      console.log();

      renderTree(metrics.unused, false, true); // Use showFullPaths=true for clarity
      console.log();
    } else {
      console.log(green(bold("✓ No obviously unused keys detected!")));
      console.log();
    }
  }

  // Summary
  console.log(
    dim(
      `Scanned ${localKeys.filesScanned} files in ${(duration / 1000).toFixed(2)}s`,
    ),
  );
  console.log(green(bold(`✓ Comparison complete`)));
}

/**
 * Render key groupings as a 2-level compact tree
 * @param groups - Either Record<string, MissingKeyEntry[]> when isMissing=true, or Record<string, string[]> otherwise
 */
function renderTree(groups: Record<string, MissingKeyEntry[]> | Record<string, string[]>, isMissing: boolean = false, showFullPaths: boolean = false) {
  // Sort namespaces by total key count descending
  const sortedNamespaces = Object.entries(groups).sort((a, b) => b[1].length - a[1].length);

  for (const [ns, items] of sortedNamespaces) {
    console.log(`${bold(ns)} (${items.length})`);

    if (showFullPaths) {
      // Show full key paths for clarity (used for "Possibly Unused" section)
      const keys = items.map((item: MissingKeyEntry | string) => isMissing ? (item as MissingKeyEntry).key : (item as string));
      // Sort keys and show up to 15 per namespace
      const sortedKeys = keys.sort();
      const displayKeys = sortedKeys.slice(0, 15);
      const more = sortedKeys.length > 15 ? sortedKeys.length - 15 : 0;

      displayKeys.forEach((key: string) => {
        console.log(`  ${dim(key)}`);
      });

      if (more > 0) {
        console.log(`  ${dim(`... and ${more} more`)}`);
      }
    } else {
      // Original compact tree format (used for "Missing in Remote" section)
      // Group keys by the next segment (level 2)
      const level2: Record<string, string[]> = {};
      for (const item of items) {
        const key = isMissing ? (item as MissingKeyEntry).key : (item as string);
        const parts = key.split(".");
        // If ns is "pages.affordable", parts[0] is pages, parts[1] is affordable
        const nsPartsCount = ns.split(".").length;
        const subGroup = parts[nsPartsCount] || "root";
        if (!level2[subGroup]) level2[subGroup] = [];

        // Keep only the suffix for display if it's deeper, otherwise the full key segment
        const suffix = parts.slice(nsPartsCount + 1).join(".") || parts[nsPartsCount] || "";
        if (suffix) level2[subGroup].push(suffix);
      }

      const subGroupEntries = Object.entries(level2).sort((a, b) => b[1].length - a[1].length);
      for (const [sub, leaves] of subGroupEntries) {
        const displayLeaves = leaves.slice(0, 40);
        const more = leaves.length > 40 ? `, ...+${leaves.length - 40}` : "";
        console.log(`  ${dim(sub)} (${displayLeaves.join(", ")}${more})`);
      }
    }

    console.log();
  }
}

/**
 * Verify if "unused" keys are really unused by performing a plain grep/search
 */
async function verifyUnusedKeys(unused: Record<string, string[]>, rootDir: string) {
  const allUnused = Object.values(unused).flat();
  if (allUnused.length === 0) return [];

  // Pick 10 random keys to sample
  const sample = allUnused.sort(() => 0.5 - Math.random()).slice(0, 10);
  const results = [];

  for (const key of sample) {
    // Extract the last part after the final dot for grep search
    // e.g., "user_dropdown.student_view_only_available_in_class_dashboard"
    // → search for "student_view_only_available_in_class_dashboard"
    const searchTerm = key.split('.').pop() || key;

    try {
      // Dynamic import to avoid issues in different environments
      const { execSync } = await import('node:child_process');

      // Use grep to search in rootDir
      // Search in .tsx, .jsx, .ts, .js files
      const result = execSync(
        `grep -r --include="*.tsx" --include="*.jsx" --include="*.ts" --include="*.js" "${searchTerm}" "${rootDir}"`,
        { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
      );

      const lines = result.trim().split('\n').filter(Boolean);
      results.push({ key, found: lines.length > 0, count: lines.length });
    } catch {
      // Grep returns exit code 1 when no matches found
      results.push({ key, found: false, count: 0 });
    }
  }

  return results;
}
