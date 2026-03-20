/**
 * Rule Metadata — Category and Help Maps
 *
 * Centralized metadata for all i18n Doctor rules.
 * Following react-doctor's pattern: rules produce only `message`,
 * category and help text are external for central management.
 *
 * To add a new rule:
 * 1. Add entry to RULE_CATEGORY_MAP
 * 2. Add entry to RULE_HELP_MAP
 * 3. Implement the rule in src/rules/health/ or src/rules/code/
 */

import type { I18nDiagnostic } from "./registry.js";

/**
 * Maps rule ID → category.
 *
 * react-doctor uses RULE_CATEGORY_MAP + PLUGIN_CATEGORY_MAP with fallback.
 * We simplify to a single map since all rules are "better-i18n" plugin.
 */
export const RULE_CATEGORY_MAP: Record<string, I18nDiagnostic["category"]> = {
  // ── Health Rules (translation file analysis) ──────────────────────
  "missing-translations": "Coverage",
  "orphan-keys": "Performance",
  "placeholder-mismatch": "Quality",
  "empty-translations": "Quality",
  "key-naming": "Structure",
  "namespace-structure": "Structure",
  "file-format": "Structure",

  // ── Sync Rules (remote CDN comparison) ───────────────────────────
  "missing-in-remote": "Coverage",
  "unused-remote-key": "Performance",

  // ── Code Rules (AST analysis, from existing analyzer) ─────────────
  "jsx-text": "Code",
  "jsx-attribute": "Code",
  "ternary-locale": "Code",
  "toast-message": "Code",
  "string-variable": "Code",
};

/**
 * Maps rule ID → actionable fix suggestion.
 *
 * react-doctor stores these in RULE_HELP_MAP in run-oxlint.ts.
 * We centralize them here alongside categories.
 */
export const RULE_HELP_MAP: Record<string, string> = {
  // ── Health Rules ──────────────────────────────────────────────────
  "missing-translations":
    "Add translations for missing keys using the AI Drawer or manual entry in the editor",
  "orphan-keys":
    "Remove unused keys from translation files to reduce bundle size and maintenance cost",
  "placeholder-mismatch":
    "Ensure {placeholders} in source and target translations match exactly. Missing or extra placeholders cause runtime errors",
  "empty-translations":
    "Replace empty translation strings with actual translations, or remove the key if unused",
  "key-naming":
    "Use consistent naming convention within each namespace (e.g., camelCase or snake_case, not mixed)",
  "namespace-structure":
    "Maintain consistent namespace depth across translation files for predictable key organization",
  "file-format":
    "Fix malformed JSON or encoding issues in translation files",

  // ── Sync Rules ────────────────────────────────────────────────────
  "missing-in-remote":
    "Key found in code but not in remote translations. Run sync or add the key in the editor",
  "unused-remote-key":
    "Key exists in remote but not used in code. Consider removing it to reduce bundle size",

  // ── Code Rules ────────────────────────────────────────────────────
  "jsx-text":
    "Wrap with t() for translation, or add to lint.ignoreStrings for intentional hardcoded text (brand names, code identifiers)",
  "jsx-attribute":
    "Use t() for translatable attributes, or add to lint.ignoreStrings for brand names and non-translatable text",
  "ternary-locale":
    "Replace locale-based ternary (locale === 'en' ? 'Hello' : 'Merhaba') with t() function",
  "toast-message":
    "Wrap toast notification messages with t() for translation support",
  "string-variable":
    "Extract user-facing strings into translation keys, or add to lint.ignoreStrings if not translatable",
};

/**
 * Default severity for code rules.
 *
 * Health rules define defaultSeverity on the rule object itself.
 * Code rules (from the analyzer) have severity embedded in their output,
 * but this map provides fallback/override capability.
 */
export const RULE_DEFAULT_SEVERITY: Record<string, I18nDiagnostic["severity"]> = {
  // Health rules (also defined on rule object, this is for reference)
  "missing-translations": "error",
  "orphan-keys": "warning",
  "placeholder-mismatch": "error",
  "empty-translations": "warning",
  "key-naming": "warning",
  "namespace-structure": "info",
  "file-format": "error",

  // Sync rules
  "missing-in-remote": "warning",
  "unused-remote-key": "info",

  // Code rules
  "jsx-text": "warning",
  "jsx-attribute": "warning",
  "ternary-locale": "error",
  "toast-message": "warning",
  "string-variable": "warning",
};
