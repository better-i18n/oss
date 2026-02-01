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
import { matchDynamicPattern } from "../analyzer/dynamic-matcher.js";

// Type for nested JSON translation files (can have string values or nested objects)
type TranslationValue = string | number | boolean | null | TranslationValue[] | { [key: string]: TranslationValue };
type RemoteTranslations = Record<string, TranslationValue>;

// Type for missing keys with their values
interface MissingKeyEntry {
  key: string;
  value: string;
}

// Type for dynamic pattern match information
interface DynamicPatternMatch {
  pattern: string;
  file: string;
  line: number;
  matchedKeys: string[];
}

// Type for scan statistics
interface ScanStats {
  dynamicKeys: number;
  dynamicNamespaces: number;
  unboundTranslators: number;
  rootScopedTranslators: number;
}

// Type for sync metrics returned by getSummary
interface SyncMetrics {
  localTotal: number;
  remoteTotal: number;
  intersectionCount: number;
  allLocal: Set<string>;
  allRemoteLeaves: Set<string>;
  missing: Record<string, MissingKeyEntry[]>;
  unused: Record<string, string[]>;
  dynamicReviewRequired: Record<string, string[]>;
  dynamicPatternMatches: DynamicPatternMatch[];
  classification: Record<string, number>;
  filteredKeys: Array<{ key: string; reason: string }>;
  localCoverage: number;
  remoteCoverage: number;
  invariants: { local: boolean; remote: boolean };
  scanStats?: ScanStats;
}

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

/**
 * Fetch manifest from CDN
 */
async function fetchManifest(
  cdnBaseUrl: string,
  workspaceId: string,
  projectSlug: string,
): Promise<CdnManifest> {
  const url = `${cdnBaseUrl}/${workspaceId}/${projectSlug}/manifest.json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Manifest fetch failed (${response.status})`);
  }

  return response.json() as Promise<CdnManifest>;
}

/**
 * Group keys by namespace
 */
function groupKeysByNamespace(issues: Issue[]): Record<string, string[]> {
  const result: Record<string, Set<string>> = {};

  for (const issue of issues) {
    if (!issue.key) continue;

    const parts = issue.key.split(".");
    const namespace = parts.length > 1 ? parts[0] : "default";
    const fullKey = issue.key;

    if (!result[namespace]) {
      result[namespace] = new Set();
    }
    result[namespace].add(fullKey);
  }

  // Convert Sets to arrays
  const output: Record<string, string[]> = {};
  for (const [namespace, keys] of Object.entries(result)) {
    output[namespace] = Array.from(keys).sort();
  }

  return output;
}

/**
 * Fetch remote keys from CDN
 */
async function fetchRemoteKeys(
  cdnBaseUrl: string,
  workspaceId: string,
  projectSlug: string,
  locale: string,
  manifest: CdnManifest | null,
): Promise<RemoteTranslations> {
  // Use manifest URL if available, otherwise construct URL
  let url: string;
  if (manifest?.files[locale]?.url) {
    url = manifest.files[locale].url;
  } else {
    url = `${cdnBaseUrl}/${workspaceId}/${projectSlug}/translations/${locale}.json`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`CDN fetch failed (${response.status})`);
  }

  return response.json() as Promise<RemoteTranslations>;
}

/**
 * Unify all comparison logic to ensure consistent metrics
 */
function getSummary(
  allIssues: Issue[],
  remoteKeys: RemoteTranslations,
  verbose?: boolean,
): SyncMetrics {
  const remoteFlattened = flattenKeys(remoteKeys);

  // Use unique key sets for all calculations
  const allLocal = new Set<string>();
  const classification: Record<string, number> = {
    "bound-scoped": 0,
    "root-scoped": 0,
    "unknown-scoped": 0,
    "unbound": 0,
  };

  // Create a fast lookup for all remote keys (including paths)
  // This helps us identify if a local key is actually an object/container
  const remoteKeyPaths = new Set<string>();
  function buildPathSet(obj: TranslationValue, prefix: string = "") {
    if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return;
    for (const [key, value] of Object.entries(obj)) {
      const fullPath = prefix ? `${prefix}.${key}` : key;
      remoteKeyPaths.add(fullPath);
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        buildPathSet(value, fullPath);
      }
    }
  }
  buildPathSet(remoteKeys as TranslationValue);

  // Flatten all remote leaves for intersection
  const allRemoteLeaves = new Set<string>();
  for (const keys of Object.values(remoteFlattened)) {
    for (const k of keys) allRemoteLeaves.add(k);
  }

  // Build a set of all remote containers (paths that exist but aren't leaves)
  const remoteContainers = new Set<string>();
  for (const path of remoteKeyPaths) {
    if (!allRemoteLeaves.has(path)) {
      remoteContainers.add(path);
    }
  }

  // Handle namespace-scoped translators
  // When code has: const t = useTranslations("teacher.courses.course_modules")
  // ALL keys under that namespace are accessible, so mark them as used
  const boundNamespaces = new Set<string>();
  for (const issue of allIssues) {
    if (issue.bindingType === "bound-scoped" && issue.namespace) {
      boundNamespaces.add(issue.namespace);
    }
  }

  // For each bound namespace, mark all its children as used
  for (const namespace of boundNamespaces) {
    // Check if this namespace is a container in remote or exists as a path
    if (remoteContainers.has(namespace) || remoteKeyPaths.has(namespace)) {
      const namespacePrefix = namespace + '.';
      const childrenKeys = Array.from(allRemoteLeaves).filter(k =>
        k.startsWith(namespacePrefix)
      );

      if (verbose && childrenKeys.length > 0) {
        console.log(
          `[VERBOSE] Namespace binding detected: "${namespace}" (${childrenKeys.length} children accessible)`
        );
        console.log(
          `[VERBOSE]   → Marking all children as used:`,
          childrenKeys.slice(0, 3).join(', '),
          childrenKeys.length > 3 ? '...' : ''
        );
      }

      // Mark all children as used
      childrenKeys.forEach(child => allLocal.add(child));

      // Also increment classification counter for this namespace binding
      classification["bound-scoped"] = (classification["bound-scoped"] || 0) + 1;
    }
  }

  // Filter local keys: strictly skip if they refer to a container object in remote
  // Only skip if BOTH conditions are met:
  // 1. It's a container in remote (has children but no leaf value)
  // 2. AND we have extracted its children in local keys
  const rawLocalKeys = Array.from(new Set(allIssues.map(i => i.key).filter(Boolean) as string[]));
  const filteredKeys: Array<{ key: string; reason: string }> = [];

  // Separate partial keys (unknown-scoped) for fuzzy matching
  const partialKeys: Array<{ key: string; issue: Issue }> = [];
  const fullyQualifiedKeys: Issue[] = [];

  for (const issue of allIssues) {
    if (!issue.key) continue;

    // Check if this local key is accessing a remote container
    if (remoteContainers.has(issue.key)) {
      // This key accesses a container in remote
      // Mark ALL children of this container as used
      const containerPrefix = issue.key + '.';
      const childrenKeys = Array.from(allRemoteLeaves).filter(k =>
        k.startsWith(containerPrefix)
      );

      if (verbose) {
        console.log(
          `[VERBOSE] Container access detected: "${issue.key}" at ${issue.file}:${issue.line}`
        );
        console.log(
          `[VERBOSE]   → Marking ${childrenKeys.length} children as used:`,
          childrenKeys.slice(0, 3).join(', '),
          childrenKeys.length > 3 ? '...' : ''
        );
      }

      // Add all children to local set
      childrenKeys.forEach(child => allLocal.add(child));

      // Track classification for the container access
      if (issue.bindingType) {
        classification[issue.bindingType] = (classification[issue.bindingType] || 0) + 1;
      }

      // Don't add the container itself (it's not a leaf)
      continue;
    }

    // Check if this key is a container in remote (has children but no leaf value)
    const isRemoteContainer = remoteKeyPaths.has(issue.key) && !allRemoteLeaves.has(issue.key);

    // Only skip if it's a remote container AND we have its children extracted locally
    // This prevents filtering leaf keys that happen to share prefixes with other keys
    if (isRemoteContainer) {
      const hasChildrenInLocal = rawLocalKeys.some(other =>
        other !== issue.key && other.startsWith(issue.key + '.')
      );
      // Only skip if we've extracted children for this container
      if (hasChildrenInLocal) {
        if (verbose) {
          filteredKeys.push({ key: issue.key, reason: "container with extracted children" });
        }
        continue;
      }
      // Otherwise, treat it as a regular key (might be an edge case or missing children)
    }

    // Check if this is a partial key (pattern-matched translator without namespace)
    // Heuristic: If bindingType is "unknown-scoped" AND key has no dots OR single level, it's likely partial
    if (issue.bindingType === "unknown-scoped") {
      partialKeys.push({ key: issue.key, issue });
    } else {
      fullyQualifiedKeys.push(issue);
      allLocal.add(issue.key);
      if (issue.bindingType) {
        classification[issue.bindingType] = (classification[issue.bindingType] || 0) + 1;
      }
    }
  }

  // Fuzzy match partial keys against remote keys
  for (const { key: partialKey, issue } of partialKeys) {
    // Find all remote keys that match this partial key
    // Strategy 1: Exact match (in case it's actually fully qualified)
    // Strategy 2: Ends with the partial key (with dot prefix)
    // Strategy 3: Ends with the partial key (without prefix, for top-level keys)

    const matches = Array.from(allRemoteLeaves).filter(remoteKey => {
      // Exact match
      if (remoteKey === partialKey) return true;

      // Ends with .partialKey
      if (remoteKey.endsWith(`.${partialKey}`)) return true;

      // For partial keys without dots, also check if remote key ends with the partial
      // This handles cases like "student_view_..." matching "user_dropdown.student_view_..."
      if (!partialKey.includes('.') && remoteKey.endsWith(partialKey)) {
        // Make sure it's not a coincidence - check it's separated by a dot
        const beforePartial = remoteKey.slice(0, -partialKey.length);
        if (beforePartial.endsWith('.')) return true;
      }

      return false;
    });

    if (matches.length === 1) {
      // Unique match found - use the full remote key
      allLocal.add(matches[0]);
      if (verbose) {
        console.log(`[VERBOSE] Fuzzy matched partial key: "${partialKey}" → "${matches[0]}"`);
      }
    } else if (matches.length > 1) {
      // Ambiguous - multiple matches. Add all to be safe
      if (verbose) {
        console.log(`[VERBOSE] Ambiguous partial key: "${partialKey}" (${matches.length} matches: ${matches.slice(0, 3).join(', ')}${matches.length > 3 ? ', ...' : ''})`);
      }
      matches.forEach(m => allLocal.add(m));
    } else {
      // No match found - add as-is, will appear in "missing in remote"
      allLocal.add(partialKey);
      if (verbose) {
        console.log(`[VERBOSE] No fuzzy match for partial key: "${partialKey}"`);
      }
    }

    // Track classification for partial keys
    if (issue.bindingType) {
      classification[issue.bindingType] = (classification[issue.bindingType] || 0) + 1;
    }
  }

  // Calculate intersection once
  const intersection = new Set<string>();
  for (const k of allLocal) {
    if (allRemoteLeaves.has(k)) intersection.add(k);
  }

  // Missing: In Local Set but not in Remote Set
  const missing: Record<string, MissingKeyEntry[]> = {};
  for (const issue of allIssues) {
    if (!issue.key || !allLocal.has(issue.key)) continue;

    if (!allRemoteLeaves.has(issue.key)) {
      const ns = issue.key.split(".")[0] || "default";
      if (!missing[ns]) missing[ns] = [];

      // Only add if not already in missing for this namespace (dedupe)
      if (!missing[ns].some((m) => m.key === issue.key)) {
        missing[ns].push({
          key: issue.key,
          value: issue.text || "",
        });
      }
    }
  }

  // Extract dynamic patterns from issues
  const dynamicPatterns = allIssues
    .filter(i => i.isDynamic && i.pattern)
    .map(i => ({ pattern: i.pattern!, file: i.file, line: i.line }));

  if (verbose && dynamicPatterns.length > 0) {
    console.log(`[VERBOSE] Found ${dynamicPatterns.length} dynamic patterns`);
  }

  // Match dynamic patterns against remote keys
  const keysMatchedByDynamicPatterns = new Set<string>();
  const dynamicPatternMatches: Array<{
    pattern: string;
    file: string;
    line: number;
    matchedKeys: string[];
  }> = [];

  for (const { pattern, file, line } of dynamicPatterns) {
    const matches = matchDynamicPattern(pattern, Array.from(allRemoteLeaves));

    if (matches.length > 0) {
      dynamicPatternMatches.push({ pattern, file, line, matchedKeys: matches });
      matches.forEach(k => {
        keysMatchedByDynamicPatterns.add(k);
        allLocal.add(k); // Mark as used
      });

      if (verbose) {
        console.log(`[VERBOSE] Pattern "${pattern}" matched ${matches.length} keys`);
      }
    }
  }

  // Recalculate intersection after adding dynamic matches
  intersection.clear();
  for (const k of allLocal) {
    if (allRemoteLeaves.has(k)) intersection.add(k);
  }

  // Unused: In Remote Set but not in Local Set
  // Separate into static unused vs dynamic review required
  const staticUnused: Record<string, string[]> = {};
  const dynamicReviewRequired: Record<string, string[]> = {};

  for (const k of allRemoteLeaves) {
    if (!allLocal.has(k)) {
      const ns = k.split(".")[0] || "default";

      // Check if this key is matched by any dynamic pattern
      if (keysMatchedByDynamicPatterns.has(k)) {
        // This shouldn't happen since we added matched keys to allLocal
        // But keep this check for safety
        if (!dynamicReviewRequired[ns]) dynamicReviewRequired[ns] = [];
        dynamicReviewRequired[ns].push(k);
      } else {
        // True static unused
        if (!staticUnused[ns]) staticUnused[ns] = [];
        staticUnused[ns].push(k);
      }
    }
  }

  const localTotal = allLocal.size;
  const remoteTotal = allRemoteLeaves.size;
  const intersectionCount = intersection.size;

  return {
    localTotal,
    remoteTotal,
    intersectionCount,
    allLocal, // Pass these for probe check
    allRemoteLeaves,
    missing,
    unused: staticUnused, // Only static unused keys
    dynamicReviewRequired, // Keys that should be reviewed (not truly "unused")
    dynamicPatternMatches, // Details about which patterns matched which keys
    classification,
    filteredKeys, // Keys that were filtered out
    localCoverage:
      localTotal > 0 ? Math.round((intersectionCount / localTotal) * 100) : 100,
    remoteCoverage:
      remoteTotal > 0
        ? Math.round((intersectionCount / remoteTotal) * 100)
        : 100,
    invariants: {
      local: localTotal === intersectionCount + countMissingKeysFromEntries(missing),
      remote: remoteTotal === intersectionCount + countMissingKeys(staticUnused) + countMissingKeys(dynamicReviewRequired),
    },
  };
}



/**
 * Flatten remote keys to get all namespaces
 */
function flattenKeys(
  remoteKeys: RemoteTranslations,
): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  function traverse(obj: TranslationValue, prefix: string = "") {
    if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return;

    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        traverse(value, fullKey);
      } else {
        // Leaf (string, number, array, boolean, or null)
        const namespace = fullKey.split(".")[0] || "default";
        if (!result[namespace]) result[namespace] = [];
        result[namespace].push(fullKey);
      }
    }
  }

  traverse(remoteKeys as TranslationValue);
  return result;
}

/**
 * Count total keys in nested structure
 */
function countTotalKeys(remoteKeys: RemoteTranslations): number {
  let count = 0;

  function traverse(obj: TranslationValue) {
    if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return;
    for (const value of Object.values(obj)) {
      if (typeof value === "string") {
        count++;
      } else if (typeof value === "object" && value !== null) {
        traverse(value);
      }
    }
  }

  traverse(remoteKeys as TranslationValue);
  return count;
}

/**
 * Count missing keys total (for string arrays)
 */
function countMissingKeys(keys: Record<string, string[]>): number {
  return Object.values(keys).reduce((sum, arr) => sum + arr.length, 0);
}

/**
 * Count missing keys total (for MissingKeyEntry arrays)
 */
function countMissingKeysFromEntries(keys: Record<string, MissingKeyEntry[]>): number {
  return Object.values(keys).reduce((sum, arr) => sum + arr.length, 0);
}


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
