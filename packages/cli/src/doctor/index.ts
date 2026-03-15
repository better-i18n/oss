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
import { fetchLocaleFile, fetchManifest, fetchRemoteKeys } from "../utils/cdn-client.js";
import { getSummary } from "../utils/key-comparison.js";
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
  /** Skip remote CDN comparison */
  skipSync?: boolean;
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
  let allIssues: Issue[] = [];

  if (!options.skipCode) {
    const result = await runCodeAnalysis(
      directory,
      lintConfig,
      options.verbose,
    );
    diagnostics.push(...result.codeDiagnostics);
    for (const key of result.keys) codeKeys.add(key);
    filesScanned = result.fileCount;
    allIssues = result.allIssues;
  }

  // 3. Sync analysis (remote CDN comparison) — run BEFORE health rules
  // so we can tell orphan-keys to skip when sync is available (avoids duplication)
  let syncAvailable = false;
  if (!options.skipSync && context?.workspaceId && context?.projectSlug) {
    // Filter to only translation key extractions (info severity),
    // matching sync command's filtering behavior
    const keyExtractionIssues = allIssues.filter(
      (i) => i.severity === "info" && i.key,
    );
    const syncResult = await runSyncAnalysis(
      context,
      keyExtractionIssues,
      options.verbose,
    );
    syncAvailable = syncResult.success;
    diagnostics.push(...syncResult.diagnostics);
  }

  // 4. Locale file discovery and health rule execution
  let keysChecked = 0;
  let localesChecked = 0;

  if (!options.skipHealth) {
    const healthResult = await runHealthAnalysis(
      directory,
      context,
      codeKeys,
      allIssues,
      syncAvailable,
      options.verbose,
    );
    diagnostics.push(...healthResult.diagnostics);
    keysChecked = healthResult.keysChecked;
    localesChecked = healthResult.localesChecked;
  }

  // 5. Calculate score
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
  allIssues: Issue[];
}> {
  const files = await collectFiles({ rootDir: directory });
  const codeDiagnostics: I18nDiagnostic[] = [];
  const keys: string[] = [];
  const allIssues: Issue[] = [];

  for (const file of files) {
    try {
      const { issues } = await analyzeFile(file, lintConfig, verbose);

      for (const issue of issues) {
        allIssues.push(issue);

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

  return { codeDiagnostics, keys, fileCount: files.length, allIssues };
}

// ── Health Analysis Pipeline ────────────────────────────────────────

async function runHealthAnalysis(
  directory: string,
  context: Awaited<ReturnType<typeof detectProjectContext>>,
  codeKeys: Set<string>,
  allIssues: Issue[],
  syncAvailable: boolean,
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

  // Strategy 1: CDN (workspaceId + projectSlug is enough —
  // loadFromCdn falls back to https://cdn.better-i18n.com when cdnBaseUrl is missing)
  if (context?.workspaceId && context?.projectSlug) {
    const cdnResult = await loadFromCdn(context, verbose);
    if (cdnResult) {
      translations = cdnResult.translations;
      sourceLocale = cdnResult.sourceLocale;
      targetLocales = cdnResult.targetLocales;
    }
  }

  // Strategy 2: Local files (if CDN not available or didn't work)
  let discovery: ReturnType<typeof discoverLocaleFiles> = null;
  if (Object.keys(translations).length === 0) {
    discovery = discoverLocaleFiles(directory);
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

  // Build localeFilePaths from discovery (local strategy only — CDN has no local files)
  let localeFilePaths: Record<string, string> | undefined;
  if (discovery) {
    const paths: Record<string, string> = {};
    for (const [locale, files] of Object.entries(discovery.localeFiles)) {
      if (files.length > 0) {
        // Use first file as representative path (relative to project root)
        // Flat: "locales/ja.json", Namespaced: "locales/ja/common.json"
        paths[locale] = relative(directory, files[0]);
      }
    }
    if (Object.keys(paths).length > 0) {
      localeFilePaths = paths;
    }
  }

  // Run health rules
  const ruleContext: HealthRuleContext = {
    sourceLocale,
    targetLocales,
    translations,
    codeKeys,
    rootDir: directory,
    projectContext: context,
    localeFilePaths,
    allIssues,
    syncAvailable,
  };

  const diagnostics: I18nDiagnostic[] = [];
  for (const rule of healthRules) {
    const ruleConfig = context?.lint?.rules?.[rule.id];
    if (ruleConfig === "off") continue;

    const ruleDiagnostics = rule.run(ruleContext);

    if (ruleConfig === "warning") {
      diagnostics.push(...ruleDiagnostics.map(d => ({ ...d, severity: "warning" as const })));
    } else {
      diagnostics.push(...ruleDiagnostics);
    }
  }

  const keysChecked = Object.keys(translations[sourceLocale] || {}).length;
  const localesChecked = targetLocales.length + 1; // +1 for source

  return { diagnostics, keysChecked, localesChecked };
}

// ── Sync Analysis Pipeline ──────────────────────────────────────────

/**
 * Compare local code keys with remote CDN keys.
 *
 * Reuses getSummary() from the sync command for consistent comparison logic
 * (namespace binding, dynamic patterns, fuzzy matching).
 * Returns diagnostics for missing-in-remote and unused-remote-key.
 */
async function runSyncAnalysis(
  context: NonNullable<Awaited<ReturnType<typeof detectProjectContext>>>,
  allIssues: Issue[],
  verbose?: boolean,
): Promise<{ diagnostics: I18nDiagnostic[]; success: boolean }> {
  try {
    const cdnBaseUrl = context.cdnBaseUrl || "https://cdn.better-i18n.com";

    // 1. Fetch manifest
    const manifest = await fetchManifest(
      cdnBaseUrl,
      context.workspaceId,
      context.projectSlug,
    );

    // 2. Determine source locale from manifest
    const sourceLanguage = manifest.languages.find((l) => l.isSource);
    const sourceLocale = sourceLanguage?.code || context.defaultLocale || "en";

    // 3. Fetch remote keys for source locale
    const remoteKeys = await fetchRemoteKeys(
      cdnBaseUrl,
      context.workspaceId,
      context.projectSlug,
      sourceLocale,
      manifest,
    );

    // 4. Compare using getSummary (reuses sync command's full comparison engine)
    const summary = getSummary(allIssues, remoteKeys, verbose);

    // 5. Convert to diagnostics
    const diagnostics: I18nDiagnostic[] = [];

    // Missing in remote: keys found in code but not in CDN
    for (const [namespace, entries] of Object.entries(summary.missing)) {
      for (const entry of entries) {
        diagnostics.push({
          filePath: "",
          line: 0,
          column: 0,
          rule: "missing-in-remote",
          category: "Coverage",
          severity: "warning",
          message: `Key "${entry.key}" found in code but not in remote translations`,
          help: RULE_HELP_MAP["missing-in-remote"] || "",
          key: entry.key,
          namespace,
        });
      }
    }

    // Unused remote keys: keys in CDN but not detected in code
    for (const [namespace, keys] of Object.entries(summary.unused)) {
      for (const key of keys) {
        diagnostics.push({
          filePath: "",
          line: 0,
          column: 0,
          rule: "unused-remote-key",
          category: "Performance",
          severity: "info",
          message: `Key "${key}" exists in remote but not used in code`,
          help: RULE_HELP_MAP["unused-remote-key"] || "",
          key,
          namespace,
        });
      }
    }

    if (verbose) {
      console.log(
        `[VERBOSE] Sync analysis: ${Object.values(summary.missing).flat().length} missing in remote, ${Object.values(summary.unused).flat().length} unused remote keys`,
      );
    }

    return { diagnostics, success: true };
  } catch (error) {
    // Graceful degradation: CDN unreachable or no manifest
    if (verbose) {
      console.log(
        `[VERBOSE] Sync analysis skipped: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
    return { diagnostics: [], success: false };
  }
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
