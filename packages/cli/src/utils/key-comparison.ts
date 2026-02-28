/**
 * Key comparison utilities
 *
 * Core logic for comparing local code keys with remote translation keys.
 * Handles namespace binding resolution, container detection, fuzzy matching,
 * and dynamic pattern matching. Extracted from sync.ts for reuse.
 */

import { matchDynamicPattern } from "../analyzer/dynamic-matcher.js";
import type { Issue } from "../analyzer/types.js";
import {
  countMissingKeys,
  countMissingKeysFromEntries,
  flattenKeys,
  type MissingKeyEntry,
  type RemoteTranslations,
  type TranslationValue,
} from "./json-keys.js";

/** Dynamic key pattern match information */
export interface DynamicPatternMatch {
  pattern: string;
  file: string;
  line: number;
  matchedKeys: string[];
}

/** Scan statistics from code analysis */
export interface ScanStats {
  dynamicKeys: number;
  dynamicNamespaces: number;
  unboundTranslators: number;
  rootScopedTranslators: number;
}

/** Full sync metrics from key comparison */
export interface SyncMetrics {
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

/**
 * Build a set of all dotted paths in a nested JSON object.
 * Includes both leaf paths and container (branch) paths.
 */
function buildPathSet(
  obj: TranslationValue,
  prefix: string = "",
  paths: Set<string>,
): void {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return;
  for (const [key, value] of Object.entries(obj)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    paths.add(fullPath);
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      buildPathSet(value, fullPath, paths);
    }
  }
}

/**
 * Unify all comparison logic to ensure consistent metrics.
 *
 * This is the core comparison engine that:
 * 1. Flattens remote nested JSON to leaf keys
 * 2. Builds container set (paths with children but no direct value)
 * 3. Handles bound-scoped namespace bindings
 * 4. Resolves unknown-scoped partial keys via fuzzy suffix matching
 * 5. Handles container-access keys by expanding to all children
 * 6. Matches dynamic patterns via matchDynamicPattern
 *
 * Returns comprehensive SyncMetrics with missing, unused, coverage percentages.
 */
export function getSummary(
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

  // Build fast lookup for all remote keys (including paths)
  const remoteKeyPaths = new Set<string>();
  buildPathSet(remoteKeys as TranslationValue, "", remoteKeyPaths);

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
    if (remoteContainers.has(namespace) || remoteKeyPaths.has(namespace)) {
      const namespacePrefix = namespace + ".";
      const childrenKeys = Array.from(allRemoteLeaves).filter((k) =>
        k.startsWith(namespacePrefix),
      );

      if (verbose && childrenKeys.length > 0) {
        console.log(
          `[VERBOSE] Namespace binding detected: "${namespace}" (${childrenKeys.length} children accessible)`,
        );
        console.log(
          `[VERBOSE]   → Marking all children as used:`,
          childrenKeys.slice(0, 3).join(", "),
          childrenKeys.length > 3 ? "..." : "",
        );
      }

      childrenKeys.forEach((child) => allLocal.add(child));
      classification["bound-scoped"] =
        (classification["bound-scoped"] || 0) + 1;
    }
  }

  // Filter local keys: strictly skip if they refer to a container object in remote
  const rawLocalKeys = Array.from(
    new Set(allIssues.map((i) => i.key).filter(Boolean) as string[]),
  );
  const filteredKeys: Array<{ key: string; reason: string }> = [];

  // Separate partial keys (unknown-scoped) for fuzzy matching
  const partialKeys: Array<{ key: string; issue: Issue }> = [];
  const fullyQualifiedKeys: Issue[] = [];

  for (const issue of allIssues) {
    if (!issue.key) continue;

    // Check if this local key is accessing a remote container
    if (remoteContainers.has(issue.key)) {
      const containerPrefix = issue.key + ".";
      const childrenKeys = Array.from(allRemoteLeaves).filter((k) =>
        k.startsWith(containerPrefix),
      );

      if (verbose) {
        console.log(
          `[VERBOSE] Container access detected: "${issue.key}" at ${issue.file}:${issue.line}`,
        );
        console.log(
          `[VERBOSE]   → Marking ${childrenKeys.length} children as used:`,
          childrenKeys.slice(0, 3).join(", "),
          childrenKeys.length > 3 ? "..." : "",
        );
      }

      childrenKeys.forEach((child) => allLocal.add(child));

      if (issue.bindingType) {
        classification[issue.bindingType] =
          (classification[issue.bindingType] || 0) + 1;
      }

      continue;
    }

    // Check if this key is a container in remote (has children but no leaf value)
    const isRemoteContainer =
      remoteKeyPaths.has(issue.key) && !allRemoteLeaves.has(issue.key);

    if (isRemoteContainer) {
      const hasChildrenInLocal = rawLocalKeys.some(
        (other) => other !== issue.key && other.startsWith(issue.key + "."),
      );
      if (hasChildrenInLocal) {
        if (verbose) {
          filteredKeys.push({
            key: issue.key,
            reason: "container with extracted children",
          });
        }
        continue;
      }
    }

    // Check if this is a partial key (pattern-matched translator without namespace)
    if (issue.bindingType === "unknown-scoped") {
      partialKeys.push({ key: issue.key, issue });
    } else {
      fullyQualifiedKeys.push(issue);
      allLocal.add(issue.key);
      if (issue.bindingType) {
        classification[issue.bindingType] =
          (classification[issue.bindingType] || 0) + 1;
      }
    }
  }

  // Fuzzy match partial keys against remote keys
  for (const { key: partialKey, issue } of partialKeys) {
    const matches = Array.from(allRemoteLeaves).filter((remoteKey) => {
      if (remoteKey === partialKey) return true;
      if (remoteKey.endsWith(`.${partialKey}`)) return true;

      if (!partialKey.includes(".") && remoteKey.endsWith(partialKey)) {
        const beforePartial = remoteKey.slice(0, -partialKey.length);
        if (beforePartial.endsWith(".")) return true;
      }

      return false;
    });

    if (matches.length === 1) {
      allLocal.add(matches[0]);
      if (verbose) {
        console.log(
          `[VERBOSE] Fuzzy matched partial key: "${partialKey}" → "${matches[0]}"`,
        );
      }
    } else if (matches.length > 1) {
      if (verbose) {
        console.log(
          `[VERBOSE] Ambiguous partial key: "${partialKey}" (${matches.length} matches: ${matches.slice(0, 3).join(", ")}${matches.length > 3 ? ", ..." : ""})`,
        );
      }
      matches.forEach((m) => allLocal.add(m));
    } else {
      allLocal.add(partialKey);
      if (verbose) {
        console.log(
          `[VERBOSE] No fuzzy match for partial key: "${partialKey}"`,
        );
      }
    }

    if (issue.bindingType) {
      classification[issue.bindingType] =
        (classification[issue.bindingType] || 0) + 1;
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
    .filter((i) => i.isDynamic && i.pattern)
    .map((i) => ({ pattern: i.pattern!, file: i.file, line: i.line }));

  if (verbose && dynamicPatterns.length > 0) {
    console.log(
      `[VERBOSE] Found ${dynamicPatterns.length} dynamic patterns`,
    );
  }

  // Match dynamic patterns against remote keys
  const keysMatchedByDynamicPatterns = new Set<string>();
  const dynamicPatternMatches: DynamicPatternMatch[] = [];

  for (const { pattern, file, line } of dynamicPatterns) {
    const matches = matchDynamicPattern(
      pattern,
      Array.from(allRemoteLeaves),
    );

    if (matches.length > 0) {
      dynamicPatternMatches.push({ pattern, file, line, matchedKeys: matches });
      matches.forEach((k) => {
        keysMatchedByDynamicPatterns.add(k);
        allLocal.add(k);
      });

      if (verbose) {
        console.log(
          `[VERBOSE] Pattern "${pattern}" matched ${matches.length} keys`,
        );
      }
    }
  }

  // Recalculate intersection after adding dynamic matches
  intersection.clear();
  for (const k of allLocal) {
    if (allRemoteLeaves.has(k)) intersection.add(k);
  }

  // Unused: In Remote Set but not in Local Set
  const staticUnused: Record<string, string[]> = {};
  const dynamicReviewRequired: Record<string, string[]> = {};

  for (const k of allRemoteLeaves) {
    if (!allLocal.has(k)) {
      const ns = k.split(".")[0] || "default";

      if (keysMatchedByDynamicPatterns.has(k)) {
        if (!dynamicReviewRequired[ns]) dynamicReviewRequired[ns] = [];
        dynamicReviewRequired[ns].push(k);
      } else {
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
    allLocal,
    allRemoteLeaves,
    missing,
    unused: staticUnused,
    dynamicReviewRequired,
    dynamicPatternMatches,
    classification,
    filteredKeys,
    localCoverage:
      localTotal > 0
        ? Math.round((intersectionCount / localTotal) * 100)
        : 100,
    remoteCoverage:
      remoteTotal > 0
        ? Math.round((intersectionCount / remoteTotal) * 100)
        : 100,
    invariants: {
      local:
        localTotal ===
        intersectionCount + countMissingKeysFromEntries(missing),
      remote:
        remoteTotal ===
        intersectionCount +
          countMissingKeys(staticUnused) +
          countMissingKeys(dynamicReviewRequired),
    },
  };
}

/**
 * Group issues by namespace (first dot-segment).
 * Single-segment keys go to "default" namespace.
 */
export function groupKeysByNamespace(
  issues: Issue[],
): Record<string, string[]> {
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

  const output: Record<string, string[]> = {};
  for (const [namespace, keys] of Object.entries(result)) {
    output[namespace] = Array.from(keys).sort();
  }

  return output;
}
