/**
 * Rule Registry
 *
 * Core interfaces for the i18n Doctor rule system.
 * Health rules implement HealthRule interface and produce I18nDiagnostic[].
 *
 * Design: Rules only produce message text. Category and help text are
 * externalized in categories.ts (react-doctor pattern) for central management.
 */

import type { ProjectContext } from "../analyzer/types.js";

/**
 * Universal diagnostic type — the single "currency" of i18n Doctor.
 *
 * All sources (code analysis, health rules, file checks) produce this same type.
 * Inspired by react-doctor's Diagnostic type which unifies oxlint + knip + motion check.
 */
export interface I18nDiagnostic {
  /** Relative file path from project root */
  filePath: string;
  /** Line number (1-indexed, 0 if not applicable) */
  line: number;
  /** Column number (1-indexed, 0 if not applicable) */
  column: number;
  /** Rule identifier e.g. "missing-translations", "jsx-text" */
  rule: string;
  /** Diagnostic category */
  category: "Coverage" | "Quality" | "Structure" | "Code" | "Performance";
  /** Severity level */
  severity: "error" | "warning" | "info";
  /** Human-readable description of the issue */
  message: string;
  /** Actionable fix suggestion (populated from RULE_HELP_MAP) */
  help: string;
  /** Translation key involved (if applicable) */
  key?: string;
  /** Namespace involved (if applicable) */
  namespace?: string;
  /** Target language involved (if applicable) */
  language?: string;
}

/**
 * Health rule interface.
 *
 * Health rules analyze translation files at the project level (not per-file AST).
 * Each rule receives a context with all translations and code keys,
 * and returns diagnostics for any issues found.
 *
 * Design notes:
 * - defaultSeverity lives on the rule (unlike react-doctor where oxlint sets it)
 *   because health rules are standalone functions, not ESLint visitors
 * - Category and help are NOT on the rule — they come from categories.ts
 * - User config can override defaultSeverity
 */
export interface HealthRule {
  /** Unique rule identifier e.g. "missing-translations" */
  id: string;
  /** Default severity (can be overridden by user config) */
  defaultSeverity: I18nDiagnostic["severity"];
  /** Short description of what the rule checks */
  description: string;
  /** Execute the rule against the health context */
  run(context: HealthRuleContext): I18nDiagnostic[];
}

/**
 * Context provided to health rules for analysis.
 *
 * Contains all the data a health rule needs: source translations,
 * target translations, code keys, and project configuration.
 */
export interface HealthRuleContext {
  /** Source locale code e.g. "en" */
  sourceLocale: string;
  /** Target locale codes e.g. ["tr", "de", "fr"] */
  targetLocales: string[];
  /** All translations: locale → flat key→value map */
  translations: Record<string, Record<string, string>>;
  /** Translation keys detected in code (from AST analysis) */
  codeKeys: Set<string>;
  /** Project root directory */
  rootDir: string;
  /** Project configuration (from i18n.config.ts) */
  projectContext: ProjectContext | null;
}
