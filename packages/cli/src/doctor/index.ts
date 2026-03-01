/**
 * i18n Doctor — Programmatic API
 *
 * diagnose() is the core entry point. It orchestrates:
 * 1. Project context detection (i18n.config.ts)
 * 2. Code analysis (AST-based key extraction)
 * 3. Locale file discovery and loading
 * 4. Health rule execution
 * 5. Issue → Diagnostic adaptation
 * 6. Health score calculation
 *
 * Separation from the CLI command follows react-doctor's
 * diagnose() vs scan() pattern: pure data vs UI concerns.
 */

import { execFileSync } from "node:child_process";
import { relative } from "node:path";
import { collectFiles } from "../analyzer/file-collector.js";
import { analyzeFile } from "../analyzer/index.js";
import type { Issue, LintConfig } from "../analyzer/types.js";
import { detectProjectContext } from "../context/detector.js";
import { RULE_CATEGORY_MAP, RULE_HELP_MAP } from "../rules/categories.js";
import { healthRules } from "../rules/health/index.js";
import type {
  HealthRuleContext,
  I18nDiagnostic,
} from "../rules/registry.js";
import { flattenToRecord } from "../utils/json-keys.js";
import { fetchLocaleFile, fetchManifest } from "../utils/cdn-client.js";
import {
  discoverLocaleFiles,
  loadLocaleTranslations,
} from "./project-discovery.js";
import { calculateHealthScore, type HealthScore } from "./score.js";

// ── Types ────────────────────────────────────────────────────────────

export interface DoctorOptions {
  /** Directory to scan (default: cwd) */
  dir?: string;
  /** Skip AST code analysis */
  skipCode?: boolean;
  /** Skip translation file health checks */
  skipHealth?: boolean;
  /** Verbose logging */
  verbose?: boolean;
  /** Pass threshold for health score (default: 70) */
  passThreshold?: number;
}

export interface DoctorReport {
  /** ISO timestamp of when the report was generated */
  runAt: string;
  /** Total duration in milliseconds */
  durationMs: number;
  /** Git information (if available) */
  git?: {
    commit?: string;
    ref?: string;
    actor?: string;
    repository?: string;
    repositoryId?: string;
  };
  /** All diagnostics from all sources */
  diagnostics: I18nDiagnostic[];
  /** Health score calculation */
  score: HealthScore;
  /** Summary statistics */
  summary: {
    total: number;
    errors: number;
    warnings: number;
    infos: number;
    byCategory: Record<string, number>;
    filesScanned: number;
    keysChecked: number;
    localesChecked: number;
  };
}

// ── Main API ─────────────────────────────────────────────────────────

/**
 * Run i18n Doctor analysis on a directory.
 *
 * This is the pure data API — no console output, no spinners.
 * Use DoctorReport with a reporter for formatted output.
 */
export async function diagnose(
  directory: string,
  options: DoctorOptions = {},
): Promise<DoctorReport> {
  const startTime = Date.now();
  const diagnostics: I18nDiagnostic[] = [];

  // 1. Detect project context
  const context = await detectProjectContext(directory, false);
  const lintConfig = context?.lint;

  // 2. Code analysis (AST-based key extraction + hardcoded string detection)
  let filesScanned = 0;
  const codeKeys = new Set<string>();

  if (!options.skipCode) {
    const { codeDiagnostics, keys, fileCount } = await runCodeAnalysis(
      directory,
      lintConfig,
      options.verbose,
    );
    diagnostics.push(...codeDiagnostics);
    for (const key of keys) codeKeys.add(key);
    filesScanned = fileCount;
  }

  // 3. Locale file discovery and health rule execution
  let keysChecked = 0;
  let localesChecked = 0;

  if (!options.skipHealth) {
    const healthResult = await runHealthAnalysis(
      directory,
      context,
      codeKeys,
      options.verbose,
    );
    diagnostics.push(...healthResult.diagnostics);
    keysChecked = healthResult.keysChecked;
    localesChecked = healthResult.localesChecked;
  }

  // 4. Calculate score
  const score = calculateHealthScore(
    diagnostics,
    options.passThreshold ?? 70,
  );

  // 5. Build summary
  const byCategory: Record<string, number> = {};
  let errors = 0;
  let warnings = 0;
  let infos = 0;

  for (const d of diagnostics) {
    byCategory[d.category] = (byCategory[d.category] || 0) + 1;
    if (d.severity === "error") errors++;
    else if (d.severity === "warning") warnings++;
    else infos++;
  }

  // 6. Try to get git info
  const git = getGitInfo();

  return {
    runAt: new Date().toISOString(),
    durationMs: Date.now() - startTime,
    git,
    diagnostics,
    score,
    summary: {
      total: diagnostics.length,
      errors,
      warnings,
      infos,
      byCategory,
      filesScanned,
      keysChecked,
      localesChecked,
    },
  };
}

// ── Code Analysis Pipeline ──────────────────────────────────────────

async function runCodeAnalysis(
  directory: string,
  lintConfig?: LintConfig,
  verbose?: boolean,
): Promise<{
  codeDiagnostics: I18nDiagnostic[];
  keys: string[];
  fileCount: number;
}> {
  const files = await collectFiles({ rootDir: directory });
  const codeDiagnostics: I18nDiagnostic[] = [];
  const keys: string[] = [];

  for (const file of files) {
    try {
      const { issues } = await analyzeFile(file, lintConfig, verbose);

      for (const issue of issues) {
        // Extract translation keys
        if (issue.severity === "info" && issue.key) {
          keys.push(issue.key);
        }

        // Convert hardcoded string warnings to diagnostics
        if (issue.severity === "warning") {
          codeDiagnostics.push(adaptIssueToDiagnostic(issue, directory));
        }
      }
    } catch {
      // Skip files that can't be analyzed
    }
  }

  return { codeDiagnostics, keys, fileCount: files.length };
}

// ── Health Analysis Pipeline ────────────────────────────────────────

async function runHealthAnalysis(
  directory: string,
  context: Awaited<ReturnType<typeof detectProjectContext>>,
  codeKeys: Set<string>,
  verbose?: boolean,
): Promise<{
  diagnostics: I18nDiagnostic[];
  keysChecked: number;
  localesChecked: number;
}> {
  // Try to load translations
  let translations: Record<string, Record<string, string>> = {};
  let sourceLocale = context?.defaultLocale || "en";
  let targetLocales: string[] = [];

  // Strategy 1: CDN (if config exists)
  if (context?.cdnBaseUrl) {
    const cdnResult = await loadFromCdn(context, verbose);
    if (cdnResult) {
      translations = cdnResult.translations;
      sourceLocale = cdnResult.sourceLocale;
      targetLocales = cdnResult.targetLocales;
    }
  }

  // Strategy 2: Local files (if CDN not available or didn't work)
  if (Object.keys(translations).length === 0) {
    const discovery = discoverLocaleFiles(directory);
    if (discovery) {
      translations = loadLocaleTranslations(discovery);

      // Infer source locale
      if (translations[sourceLocale]) {
        targetLocales = discovery.locales.filter((l) => l !== sourceLocale);
      } else if (discovery.locales.length > 0) {
        sourceLocale = discovery.locales[0];
        targetLocales = discovery.locales.slice(1);
      }

      if (verbose) {
        console.log(
          `[VERBOSE] Discovered ${discovery.locales.length} locales in ${discovery.localeDir} (${discovery.pattern})`,
        );
      }
    }
  }

  if (Object.keys(translations).length === 0) {
    return { diagnostics: [], keysChecked: 0, localesChecked: 0 };
  }

  // Run health rules
  const ruleContext: HealthRuleContext = {
    sourceLocale,
    targetLocales,
    translations,
    codeKeys,
    rootDir: directory,
    projectContext: context,
  };

  const diagnostics: I18nDiagnostic[] = [];
  for (const rule of healthRules) {
    diagnostics.push(...rule.run(ruleContext));
  }

  const keysChecked = Object.keys(translations[sourceLocale] || {}).length;
  const localesChecked = targetLocales.length + 1; // +1 for source

  return { diagnostics, keysChecked, localesChecked };
}

// ── CDN Loading ─────────────────────────────────────────────────────

async function loadFromCdn(
  context: NonNullable<Awaited<ReturnType<typeof detectProjectContext>>>,
  verbose?: boolean,
): Promise<{
  translations: Record<string, Record<string, string>>;
  sourceLocale: string;
  targetLocales: string[];
} | null> {
  try {
    const cdnBaseUrl =
      context.cdnBaseUrl || "https://cdn.better-i18n.com";
    const manifest = await fetchManifest(
      cdnBaseUrl,
      context.workspaceId,
      context.projectSlug,
    );

    const sourceLanguage = manifest.languages.find((l) => l.isSource);
    const sourceLocale = sourceLanguage?.code || context.defaultLocale || "en";
    const targetLocales = manifest.languages
      .filter((l) => !l.isSource)
      .map((l) => l.code);

    const translations: Record<string, Record<string, string>> = {};

    // Fetch all locales
    const allLocales = [sourceLocale, ...targetLocales];
    for (const locale of allLocales) {
      const data = await fetchLocaleFile(
        cdnBaseUrl,
        context.workspaceId,
        context.projectSlug,
        locale,
      );
      if (data) {
        translations[locale] = flattenToRecord(data);
      }
    }

    if (verbose) {
      console.log(
        `[VERBOSE] Loaded ${allLocales.length} locales from CDN`,
      );
    }

    return { translations, sourceLocale, targetLocales };
  } catch {
    return null;
  }
}

// ── Issue → Diagnostic Adapter ──────────────────────────────────────

/**
 * Convert legacy analyzer Issue to I18nDiagnostic.
 *
 * Maps issue.type to rule ID, looks up category and help from central maps.
 */
function adaptIssueToDiagnostic(issue: Issue, rootDir: string): I18nDiagnostic {
  const ruleId = mapIssueTypeToRuleId(issue);

  return {
    filePath: relative(rootDir, issue.file),
    line: issue.line,
    column: issue.column,
    rule: ruleId,
    category: RULE_CATEGORY_MAP[ruleId] || "Code",
    severity: issue.severity === "info" ? "info" : issue.severity,
    message: issue.message,
    help: RULE_HELP_MAP[ruleId] || "",
    key: issue.key,
    namespace: issue.namespace,
  };
}

function mapIssueTypeToRuleId(issue: Issue): string {
  const msg = issue.message.toLowerCase();
  if (msg.includes("jsx text") || issue.type === "jsx-text") return "jsx-text";
  if (msg.includes("jsx attribute") || issue.type === "jsx-attribute")
    return "jsx-attribute";
  if (msg.includes("ternary") || issue.type === "ternary-locale")
    return "ternary-locale";
  if (msg.includes("toast") || issue.type === "toast-message")
    return "toast-message";
  return "string-variable";
}

// ── Git Info ────────────────────────────────────────────────────────

function getGitInfo(): DoctorReport["git"] {
  try {
    const commit = execFileSync("git", ["rev-parse", "HEAD"], {
      encoding: "utf-8",
    }).trim();
    const ref = execFileSync(
      "git",
      ["symbolic-ref", "--short", "HEAD"],
      { encoding: "utf-8" },
    ).trim();

    return {
      commit,
      ref,
      // GitHub Actions env vars
      actor: process.env.GITHUB_ACTOR,
      repository: process.env.GITHUB_REPOSITORY,
      repositoryId: process.env.GITHUB_REPOSITORY_ID,
    };
  } catch {
    return undefined;
  }
}
