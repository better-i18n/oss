/**
 * Orphan Keys Rule
 *
 * Detects translation keys that exist in remote translation files but
 * are never referenced in code. These "orphan" keys increase bundle size
 * and maintenance burden without providing value.
 *
 * Note: This rule requires code analysis results (codeKeys set).
 * If codeKeys is empty, it returns no diagnostics to avoid false positives.
 *
 * Category: Performance
 * Default Severity: warning
 */

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
    const { sourceLocale, translations, codeKeys } = context;

    // If no code keys were collected, skip — we can't determine orphans
    // without knowing what code actually uses.
    if (codeKeys.size === 0) return [];

    const sourceKeys = translations[sourceLocale];
    if (!sourceKeys) return [];

    const diagnostics: I18nDiagnostic[] = [];

    for (const key of Object.keys(sourceKeys)) {
      if (!codeKeys.has(key)) {
        const namespace = key.split(".")[0] || "default";

        diagnostics.push({
          filePath: `${sourceLocale}.json`,
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
    }

    return diagnostics;
  },
};
