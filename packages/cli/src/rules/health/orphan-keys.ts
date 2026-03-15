/**
 * Orphan Keys Rule
 *
 * Detects translation keys that exist in remote translation files but
 * are never referenced in code. These "orphan" keys increase bundle size
 * and maintenance burden without providing value.
 *
 * Uses smart matching from the sync pipeline:
 * - Dynamic pattern matching (e.g., `plans.${x}.name` matches `plans.free.name`)
 * - Bound namespace expansion (e.g., `useTranslations("pricing")` covers all children)
 * - Container access detection (keys accessing namespace objects)
 *
 * When sync analysis is available (CDN connected), this rule is skipped
 * because `unused-remote-key` from getSummary() does the same job more accurately.
 *
 * Category: Performance
 * Default Severity: warning
 */

import { matchDynamicPattern } from "../../analyzer/dynamic-matcher.js";
import { RULE_CATEGORY_MAP, RULE_HELP_MAP } from "../categories.js";
import type {
  HealthRule,
  HealthRuleContext,
  I18nDiagnostic,
} from "../registry.js";

const RULE_ID = "orphan-keys";

export const orphanKeysRule: HealthRule = {
  id: RULE_ID,
  defaultSeverity: "warning",
  description:
    "Detect translation keys not referenced in code (dead translations)",

  run(context: HealthRuleContext): I18nDiagnostic[] {
    const { sourceLocale, translations, codeKeys, localeFilePaths, allIssues, syncAvailable } = context;

    // Skip when sync analysis is available — unused-remote-key handles this better
    if (syncAvailable) return [];

    // If no code keys were collected, skip — we can't determine orphans
    // without knowing what code actually uses.
    if (codeKeys.size === 0) return [];

    const sourceKeys = translations[sourceLocale];
    if (!sourceKeys) return [];

    // Collect bound namespaces from allIssues (e.g., useTranslations("pricing"))
    const boundNamespaces = new Set<string>();
    if (allIssues) {
      for (const issue of allIssues) {
        if (issue.bindingType === "bound-scoped" && issue.namespace) {
          boundNamespaces.add(issue.namespace);
        }
      }
    }

    // Collect dynamic patterns from allIssues
    const dynamicPatterns: string[] = [];
    if (allIssues) {
      for (const issue of allIssues) {
        if (issue.isDynamic && issue.pattern) {
          dynamicPatterns.push(issue.pattern);
        }
      }
    }

    // Pre-compute: all source keys as array for dynamic matching
    const sourceKeyList = Object.keys(sourceKeys);

    // Pre-compute dynamic pattern regexes and their matched keys
    const dynamicMatchedKeys = new Set<string>();
    if (dynamicPatterns.length > 0) {
      for (const pattern of dynamicPatterns) {
        const matches = matchDynamicPattern(pattern, sourceKeyList);
        for (const m of matches) dynamicMatchedKeys.add(m);
      }
    }

    const diagnostics: I18nDiagnostic[] = [];

    for (const key of sourceKeyList) {
      // 1. Direct match — key is used in code
      if (codeKeys.has(key)) continue;

      // 2. Bound namespace match — key is under a namespace accessed via useTranslations("ns")
      let coveredByNamespace = false;
      for (const ns of boundNamespaces) {
        if (key === ns || key.startsWith(ns + ".")) {
          coveredByNamespace = true;
          break;
        }
      }
      if (coveredByNamespace) continue;

      // 3. Dynamic pattern match — key matches a template literal pattern like `plans.${x}.name`
      if (dynamicMatchedKeys.has(key)) continue;

      // None matched — this is a genuine orphan
      const namespace = key.split(".")[0] || "default";

      diagnostics.push({
        filePath: localeFilePaths?.[sourceLocale] ?? `${sourceLocale}.json`,
        line: 0,
        column: 0,
        rule: RULE_ID,
        category: RULE_CATEGORY_MAP[RULE_ID] || "Performance",
        severity: this.defaultSeverity,
        message: `Key "${key}" exists in translations but is not used in code`,
        help: RULE_HELP_MAP[RULE_ID] || "",
        key,
        namespace,
      });
    }

    return diagnostics;
  },
};
