/**
 * Dynamic pattern matching utility
 *
 * Matches dynamic key patterns (e.g., 'plans.${x}.name') against remote keys
 */

/**
 * Convert a dynamic pattern to a regex
 * Examples:
 *   'plans.${planKey}.name' -> /^plans\..*?\.name$/
 *   '${namespace}.title' -> /^.*?\.title$/
 *   'workflow.steps.${key}.title' -> /^workflow\.steps\..*?\.title$/
 */
export function patternToRegex(pattern: string): RegExp {
  // First, replace ${variable} with a placeholder that won't be escaped
  const placeholder = '\x00WILDCARD\x00';
  let regexPattern = pattern.replace(/\$\{[^}]+\}/g, placeholder);

  // Escape special regex characters (including dots)
  regexPattern = regexPattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');

  // Replace placeholder with .*? (non-greedy wildcard)
  regexPattern = regexPattern.replace(new RegExp(placeholder.replace(/\\/g, '\\\\'), 'g'), '.*?');

  // Return regex with anchors
  return new RegExp(`^${regexPattern}$`);
}

/**
 * Extract static segments from a pattern
 * Examples:
 *   'plans.${x}.name' -> { prefix: 'plans', suffix: 'name', hasPrefix: true, hasSuffix: true }
 *   '${namespace}.title' -> { prefix: '', suffix: 'title', hasPrefix: false, hasSuffix: true }
 */
export function extractStaticSegments(pattern: string): {
  prefix: string;
  suffix: string;
  hasPrefix: boolean;
  hasSuffix: boolean;
} {
  // Find first ${}
  const firstDynamic = pattern.indexOf('${');
  const prefix = firstDynamic > 0 ? pattern.substring(0, firstDynamic) : '';
  const hasPrefix = firstDynamic > 0;

  // Find last }
  const lastDynamic = pattern.lastIndexOf('}');
  const suffix = lastDynamic < pattern.length - 1 ? pattern.substring(lastDynamic + 1) : '';
  const hasSuffix = lastDynamic < pattern.length - 1;

  return {
    prefix: prefix.replace(/\.$/, ''), // Remove trailing dot
    suffix: suffix.replace(/^\./, ''), // Remove leading dot
    hasPrefix,
    hasSuffix,
  };
}

/**
 * Match a dynamic pattern against remote keys
 * Returns all matching keys
 *
 * @param pattern - Dynamic pattern like 'plans.${x}.name'
 * @param remoteKeys - Array of all remote keys
 * @returns Array of matching remote keys
 */
export function matchDynamicPattern(pattern: string, remoteKeys: string[]): string[] {
  const regex = patternToRegex(pattern);
  return remoteKeys.filter(key => regex.test(key));
}

/**
 * Group dynamic patterns by their static prefix for efficient matching
 * This helps identify which remote keys might be accessed by dynamic patterns
 *
 * @param patterns - Array of dynamic patterns
 * @returns Map of prefix -> patterns with that prefix
 */
export function groupPatternsByPrefix(patterns: string[]): Map<string, string[]> {
  const groups = new Map<string, string[]>();

  for (const pattern of patterns) {
    const { prefix } = extractStaticSegments(pattern);
    const groupKey = prefix || '(no-prefix)';

    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey)!.push(pattern);
  }

  return groups;
}

/**
 * Check if a pattern is ambiguous (matches too many keys)
 * This helps identify patterns that need manual review
 *
 * @param pattern - Dynamic pattern
 * @param matchCount - Number of keys matched by this pattern
 * @param threshold - Maximum number of matches to consider reasonable (default: 50)
 * @returns True if the pattern is ambiguous
 */
export function isAmbiguousPattern(
  pattern: string,
  matchCount: number,
  threshold: number = 50
): boolean {
  // Pattern starting with ${} is always ambiguous
  if (pattern.startsWith('${')) {
    return matchCount > 10;
  }

  return matchCount > threshold;
}
