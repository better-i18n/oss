/**
 * Diagnostic messages for common i18n issues
 *
 * Provides helpful error messages and suggestions for detected problems
 */

export type DiagnosticSeverity = 'error' | 'warning' | 'info';

export interface DiagnosticMessage {
  message: string;
  suggestion: string;
  severity: DiagnosticSeverity;
  docsUrl?: string;
}

/**
 * Common diagnostic messages for translation detection issues
 */
export const DIAGNOSTIC_MESSAGES = {
  /**
   * Server component uses getTranslations() without namespace
   *
   * Impact: Keys will be in root scope, making them harder to organize
   */
  SERVER_COMPONENT_NO_NAMESPACE: {
    message: 'Server component uses getTranslations() without namespace',
    suggestion: 'Add a namespace to organize your translations:\n  const t = await getTranslations("your-namespace")',
    severity: 'warning' as DiagnosticSeverity,
    docsUrl: 'https://better-i18n.com/docs/namespaces',
  },

  /**
   * Dynamic namespace detected - keys cannot be statically analyzed
   *
   * Impact: CLI cannot extract translation keys at build time
   */
  DYNAMIC_NAMESPACE: {
    message: 'Dynamic namespace detected - translation keys cannot be statically analyzed',
    suggestion: 'Use string literal for static analysis:\n  ❌ getTranslations(variable)\n  ✅ getTranslations("namespace")',
    severity: 'info' as DiagnosticSeverity,
    docsUrl: 'https://better-i18n.com/docs/static-analysis',
  },

  /**
   * Translation key uses dynamic variable
   *
   * Impact: Key cannot be extracted and verified at build time
   */
  DYNAMIC_KEY: {
    message: 'Translation key uses dynamic variable - cannot be statically verified',
    suggestion: 'Use string literals for keys that should be verified:\n  ❌ t(dynamicKey)\n  ✅ t("static.key")',
    severity: 'info' as DiagnosticSeverity,
  },

  /**
   * Multiple translation hooks in same component
   *
   * Impact: May indicate component should be split
   */
  MULTIPLE_TRANSLATORS: {
    message: 'Multiple translation hooks detected in same component',
    suggestion: 'Consider splitting into smaller components, each with a single namespace',
    severity: 'info' as DiagnosticSeverity,
  },

  /**
   * Mixing root and namespaced translations
   *
   * Impact: Inconsistent organization pattern
   */
  MIXED_SCOPES: {
    message: 'Component mixes root-scoped and namespaced translations',
    suggestion: 'Use consistent scoping - either all namespaced or all root-scoped',
    severity: 'warning' as DiagnosticSeverity,
  },
} as const;

/**
 * Format diagnostic message for CLI output
 */
export function formatDiagnostic(
  diagnostic: DiagnosticMessage,
  context?: string,
): string {
  const icon = diagnostic.severity === 'error' ? '✘' : diagnostic.severity === 'warning' ? '⚠' : 'ℹ';
  const lines = [
    `${icon} ${diagnostic.message}`,
    '',
    `  ${diagnostic.suggestion}`,
  ];

  if (context) {
    lines.push('', `  Context: ${context}`);
  }

  if (diagnostic.docsUrl) {
    lines.push('', `  Learn more: ${diagnostic.docsUrl}`);
  }

  return lines.join('\n');
}

/**
 * Get diagnostic for specific issue type
 */
export function getDiagnostic(
  issueType: keyof typeof DIAGNOSTIC_MESSAGES,
): DiagnosticMessage {
  return DIAGNOSTIC_MESSAGES[issueType];
}
