/**
 * Placeholder Mismatch Rule
 *
 * Detects placeholder inconsistencies between source and target translations.
 * Missing placeholders cause runtime errors (blank slots, crashes).
 * Extra placeholders indicate likely copy-paste mistakes.
 *
 * Supports formats:
 *   {{name}}    - Handlebars / Mustache
 *   {count}     - ICU MessageFormat / i18next
 *   {0}, {1}    - Indexed positional
 *   ${var}      - Template literal style
 *   %s, %d, %@  - printf-style
 *   %1$s        - Positional printf-style
 *
 * Category: Quality
 * Default Severity: error
 *
 * Note: extractPlaceholders() is adapted from
 * apps/api/domains/ai/quality/checks/placeholder-check.ts
 * (cross-repo import not possible, logic kept in sync manually)
 */

import { RULE_CATEGORY_MAP, RULE_HELP_MAP } from "../categories.js";
import type {
  HealthRule,
  HealthRuleContext,
  I18nDiagnostic,
} from "../registry.js";

const RULE_ID = "placeholder-mismatch";

/**
 * Extract placeholder tokens from a translation string.
 *
 * Uses ordered pattern matching with overlap detection to handle
 * nested formats like {{name}} vs {name}.
 */
export function extractPlaceholders(text: string): string[] {
  // Order matters: more specific patterns first to avoid sub-match overlaps.
  const patterns: RegExp[] = [
    /\{\{[^}]+\}\}/g, // {{name}}      — Handlebars / Mustache
    /\$\{[^}]+\}/g, // ${var}        — Template literal
    /\{[a-zA-Z_]\w*\}/g, // {count}       — ICU / i18next
    /\{\d+\}/g, // {0}, {1}      — Indexed positional
    /%\d*\$?[sd@f]/g, // %s, %d, %1$s — printf-style
  ];

  const placeholders: string[] = [];
  const claimed: Array<[number, number]> = [];

  function isOverlapping(start: number, end: number): boolean {
    return claimed.some(
      ([cs, ce]) =>
        (start >= cs && start < ce) || (end > cs && end <= ce),
    );
  }

  for (const pattern of patterns) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      if (!isOverlapping(start, end)) {
        placeholders.push(match[0]);
        claimed.push([start, end]);
      }
    }
  }

  return placeholders;
}

export const placeholderMismatchRule: HealthRule = {
  id: RULE_ID,
  defaultSeverity: "error",
  description:
    "Detect placeholder mismatches between source and target translations",

  run(context: HealthRuleContext): I18nDiagnostic[] {
    const { sourceLocale, targetLocales, translations } = context;

    const sourceKeys = translations[sourceLocale];
    if (!sourceKeys) return [];

    const diagnostics: I18nDiagnostic[] = [];

    for (const targetLocale of targetLocales) {
      const targetKeys = translations[targetLocale] || {};

      for (const [key, sourceValue] of Object.entries(sourceKeys)) {
        const targetValue = targetKeys[key];
        if (targetValue === undefined) continue; // missing-translations handles this

        const sourcePh = extractPlaceholders(sourceValue);
        const targetPh = extractPlaceholders(targetValue);

        if (sourcePh.length === 0 && targetPh.length === 0) continue;

        const namespace = key.split(".")[0] || "default";

        // Check for missing placeholders in target
        for (const ph of sourcePh) {
          if (!targetPh.includes(ph)) {
            diagnostics.push({
              filePath: `${targetLocale}.json`,
              line: 0,
              column: 0,
              rule: RULE_ID,
              category: RULE_CATEGORY_MAP[RULE_ID] || "Quality",
              severity: this.defaultSeverity,
              message: `Placeholder ${ph} in source is missing in "${targetLocale}" for key "${key}"`,
              help: RULE_HELP_MAP[RULE_ID] || "",
              key,
              namespace,
              language: targetLocale,
            });
          }
        }

        // Check for extra placeholders in target (lower severity)
        for (const ph of targetPh) {
          if (!sourcePh.includes(ph)) {
            diagnostics.push({
              filePath: `${targetLocale}.json`,
              line: 0,
              column: 0,
              rule: RULE_ID,
              category: RULE_CATEGORY_MAP[RULE_ID] || "Quality",
              severity: "warning",
              message: `Extra placeholder ${ph} in "${targetLocale}" not found in source for key "${key}"`,
              help: RULE_HELP_MAP[RULE_ID] || "",
              key,
              namespace,
              language: targetLocale,
            });
          }
        }
      }
    }

    return diagnostics;
  },
};
