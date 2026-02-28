/**
 * Missing Translations Rule
 *
 * Detects translation keys that exist in the source locale but are
 * missing in one or more target locales. This is the most fundamental
 * coverage check — if a key is missing, users see fallback or broken UI.
 *
 * Category: Coverage (highest weight in health score)
 * Default Severity: error
 */

import { RULE_CATEGORY_MAP, RULE_HELP_MAP } from "../categories.js";
import type {
  HealthRule,
  HealthRuleContext,
  I18nDiagnostic,
} from "../registry.js";

const RULE_ID = "missing-translations";

export const missingTranslationsRule: HealthRule = {
  id: RULE_ID,
  defaultSeverity: "error",
  description:
    "Detect keys present in source locale but missing in target locales",

  run(context: HealthRuleContext): I18nDiagnostic[] {
    const { sourceLocale, targetLocales, translations } = context;

    const sourceKeys = translations[sourceLocale];
    if (!sourceKeys) return [];

    const diagnostics: I18nDiagnostic[] = [];
    const sourceKeySet = Object.keys(sourceKeys);

    for (const targetLocale of targetLocales) {
      const targetKeys = translations[targetLocale] || {};

      for (const key of sourceKeySet) {
        if (!(key in targetKeys)) {
          const namespace = key.split(".")[0] || "default";

          diagnostics.push({
            filePath: `${targetLocale}.json`,
            line: 0,
            column: 0,
            rule: RULE_ID,
            category: RULE_CATEGORY_MAP[RULE_ID] || "Coverage",
            severity: this.defaultSeverity,
            message: `Key "${key}" is missing in locale "${targetLocale}"`,
            help: RULE_HELP_MAP[RULE_ID] || "",
            key,
            namespace,
            language: targetLocale,
          });
        }
      }
    }

    return diagnostics;
  },
};
