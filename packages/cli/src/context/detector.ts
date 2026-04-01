/**
 * Project context detection
 *
 * Auto-detect Better i18n project configuration from i18n.config.ts
 * or createI18n usage. Shared logic with MCP server.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import type { LintConfig, ProjectContext, PullConfig } from "../analyzer/types.js";

/**
 * Find and parse i18n configuration in workspace
 *
 * @param startDir - Starting directory for config search
 * @param searchUpTree - If true, search parent directories for config. Default: false (only search in startDir)
 */
export async function detectProjectContext(
  startDir: string = process.cwd(),
  searchUpTree = false,
): Promise<ProjectContext | null> {
  try {
    // First check the startDir itself for i18n.config.ts
    const localConfig = findConfigFile(startDir);
    if (localConfig) {
      return parseI18nConfig(localConfig);
    }

    // Only search workspace root if explicitly allowed
    if (searchUpTree) {
      const workspaceRoot = findWorkspaceRoot(startDir);
      if (workspaceRoot !== startDir) {
        const configFile = findConfigFile(workspaceRoot);
        if (configFile) {
          return parseI18nConfig(configFile);
        }
      }
    }
  } catch {
    // Silently fail - will use defaults
  }

  return null;
}

/**
 * Find workspace root by looking for .git or package.json with workspaces
 */
function findWorkspaceRoot(startDir: string): string {
  let currentDir = startDir;
  const maxDepth = 10;
  let depth = 0;

  while (depth < maxDepth) {
    if (existsSync(join(currentDir, ".git"))) {
      return currentDir;
    }

    const pkgPath = join(currentDir, "package.json");
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
        if (pkg.workspaces) {
          return currentDir;
        }
      } catch {
        // Ignore parse errors
      }
    }

    const parentDir = dirname(currentDir);
    if (parentDir === currentDir) break;

    currentDir = parentDir;
    depth++;
  }

  return startDir;
}

/**
 * Search for i18n config files
 */
function findConfigFile(searchRoot: string): string | null {
  // First look for i18n.config.ts directly in search root
  const directConfigs = ["i18n.config.ts", "i18n.config.js"];
  for (const configName of directConfigs) {
    const configPath = join(searchRoot, configName);
    if (existsSync(configPath)) {
      return configPath;
    }
  }

  // Then search subdirectories
  const files: string[] = [];
  let foundConfig: string | null = null;

  function searchDir(dir: string, depth = 0) {
    if (depth > 5 || foundConfig) return;

    try {
      const entries = readdirSync(dir);

      for (const entry of entries) {
        if (foundConfig) return;

        if (
          ["node_modules", ".git", "dist", "build", ".next"].includes(entry)
        ) {
          continue;
        }

        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          searchDir(fullPath, depth + 1);
        } else if (/i18n\.config\.(ts|js)$/.test(entry)) {
          foundConfig = fullPath;
          return;
        } else if (/\.(ts|tsx|js|jsx)$/.test(entry)) {
          files.push(fullPath);
        }
      }
    } catch {
      // Ignore permission errors
    }
  }

  searchDir(searchRoot);

  if (foundConfig) {
    return foundConfig;
  }

  // Search for createI18n or initBetterI18n import as fallback
  for (const file of files) {
    try {
      const content = readFileSync(file, "utf-8");

      // Match: import { createI18n } from '@better-i18n/next' or '@better-i18n/core'
      if (
        /import\s+.*createI18n.*from\s+['"]@better-i18n\/(next|core)['"]/.test(
          content,
        ) &&
        /createI18n\s*\(/.test(content)
      ) {
        return file;
      }

      // Match: import { initBetterI18n } from '@better-i18n/expo'
      if (
        /import\s+.*initBetterI18n.*from\s+['"]@better-i18n\/expo['"]/.test(
          content,
        ) &&
        /initBetterI18n\s*\(/.test(content)
      ) {
        return file;
      }
    } catch {
      // Ignore read errors
    }
  }

  return null;
}

/**
 * Parse file to extract i18n configuration
 */
function parseI18nConfig(filePath: string): ProjectContext | null {
  const content = readFileSync(filePath, "utf-8");

  // Try project = "org/slug" format (exported const)
  const projectConstMatch = content.match(
    /(?:export\s+)?const\s+project\s*=\s*['"]([^'"]+\/[^'"]+)['"]/,
  );
  if (projectConstMatch) {
    const [workspaceId, projectSlug] = projectConstMatch[1].split("/");
    const localeMatch = content.match(/defaultLocale[:\s=]*['"]([^'"]+)['"]/);
    const cdnMatch = content.match(/cdnBaseUrl[:\s=]*['"]([^'"]+)['"]/);
    const lint = parseLintConfig(content);
    const pull = parsePullConfig(content);

    return {
      workspaceId,
      projectSlug,
      defaultLocale: localeMatch?.[1] || "en",
      cdnBaseUrl: cdnMatch?.[1],
      lint,
      pull,
    };
  }

  // Try project: "org/slug" format (object property)
  // Also handles: project: process.env.X || "org/slug"
  const projectMatch = content.match(
    /project:\s*(?:[^'"]*\|\|\s*)?['"]([^'"]+\/[^'"]+)['"]/,
  );
  if (projectMatch) {
    const [workspaceId, projectSlug] = projectMatch[1].split("/");
    const localeMatch = content.match(/defaultLocale:\s*['"]([^'"]+)['"]/);
    const cdnMatch = content.match(/cdnBaseUrl:\s*['"]([^'"]+)['"]/);
    const lint = parseLintConfig(content);
    const pull = parsePullConfig(content);

    return {
      workspaceId,
      projectSlug,
      defaultLocale: localeMatch?.[1] || "en",
      cdnBaseUrl: cdnMatch?.[1],
      lint,
      pull,
    };
  }

  // Try old format: workspaceId + projectSlug
  const workspaceMatch = content.match(/workspaceId:\s*['"]([^'"]+)['"]/);
  const projectSlugMatch = content.match(/projectSlug:\s*['"]([^'"]+)['"]/);
  const localeMatch = content.match(/defaultLocale:\s*['"]([^'"]+)['"]/);
  const cdnMatch = content.match(/cdnBaseUrl:\s*['"]([^'"]+)['"]/);

  if (workspaceMatch && projectSlugMatch) {
    const lint = parseLintConfig(content);
    const pull = parsePullConfig(content);

    return {
      workspaceId: workspaceMatch[1],
      projectSlug: projectSlugMatch[1],
      defaultLocale: localeMatch?.[1] || "en",
      cdnBaseUrl: cdnMatch?.[1],
      lint,
      pull,
    };
  }

  return null;
}

/**
 * Parse a string array from raw file content, handling inline comments.
 * Extracts only quoted string values — ignores comments and other noise.
 *
 * Example input:  `"foo", "bar", // comment\n  "baz"`
 * Returns:        ["foo", "bar", "baz"]
 */
/**
 * Extract the content of a `key: [...]` array from config text using balanced
 * bracket matching. Handles nested brackets inside regex character classes
 * (e.g., `/[Bb]etter/`) that would break a simple `[^\]]+` regex.
 */
function extractBalancedArray(content: string, key: string): string | null {
  const keyIdx = content.indexOf(`${key}:`);
  if (keyIdx === -1) return null;

  // Find the opening bracket after the key
  const bracketIdx = content.indexOf("[", keyIdx + key.length);
  if (bracketIdx === -1) return null;

  let depth = 1;
  const start = bracketIdx + 1;
  let inString: string | null = null;
  let escaped = false;

  for (let i = start; i < content.length; i++) {
    const ch = content[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (ch === "\\") {
      escaped = true;
      continue;
    }

    // Track string boundaries (don't count brackets inside strings)
    if (inString) {
      if (ch === inString) inString = null;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      inString = ch;
      continue;
    }

    if (ch === "[") depth++;
    else if (ch === "]") {
      depth--;
      if (depth === 0) {
        return content.slice(start, i);
      }
    }
  }

  return null;
}

function parseStringArray(raw: string): string[] {
  const results: string[] = [];
  // Match all quoted string literals (single or double quotes)
  for (const m of raw.matchAll(/["']([^"']*?)["']/g)) {
    const value = m[1].trim();
    if (value) results.push(value);
  }
  return results;
}

function parseLintConfig(content: string): LintConfig | undefined {
  if (!content.includes("lint:") && !content.includes("lint =")) {
    return undefined;
  }

  const config: LintConfig = {};

  // Extract include array
  const includeMatch = extractBalancedArray(content, "include");
  if (includeMatch) {
    config.include = parseStringArray(includeMatch);
  }

  // Extract exclude array
  const excludeMatch = extractBalancedArray(content, "exclude");
  if (excludeMatch) {
    config.exclude = parseStringArray(excludeMatch);
  }

  // Extract translationFunctions array
  const tfMatch = extractBalancedArray(content, "translationFunctions");
  if (tfMatch) {
    config.translationFunctions = parseStringArray(tfMatch);
  }

  // Extract ignoreStrings array
  const isMatch = extractBalancedArray(content, "ignoreStrings");
  if (isMatch) {
    config.ignoreStrings = parseStringArray(isMatch);
  }

  // Parse ignorePatterns: [/pattern1/, /pattern2/] or ignorePatterns: ["pattern1", "pattern2"]
  const ignorePatternsMatch = extractBalancedArray(content, "ignorePatterns");
  if (ignorePatternsMatch) {
    const patternsRaw = ignorePatternsMatch;
    const patterns: RegExp[] = [];

    // First pass: extract regex literals like /pattern/flags
    // Uses a state machine approach to avoid confusing // inside regex with comments
    const regexLiterals = patternsRaw.matchAll(
      /(?:^|,|\s)\s*\/((?:[^/\\]|\\.)*)\/([gimsuy]*)/g,
    );
    for (const match of regexLiterals) {
      try {
        patterns.push(new RegExp(match[1], match[2]));
      } catch {}
    }

    // Second pass: extract string literals like "pattern" or 'pattern'
    const stringLiterals = patternsRaw.matchAll(/["']([^"']+)["']/g);
    for (const match of stringLiterals) {
      try {
        patterns.push(new RegExp(match[1]));
      } catch {}
    }

    if (patterns.length > 0) {
      config.ignorePatterns = patterns;
    }
  }

  // Parse rules: { "rule-name": "off" | "warning" | "error" }
  const rulesMatch = content.match(/rules:\s*\{([^}]+)\}/);
  if (rulesMatch) {
    const rulesRaw = rulesMatch[1];
    const rules: Record<string, string> = {};
    const ruleEntries = rulesRaw.matchAll(/["']?([\w-]+)["']?\s*:\s*["'](off|warning|error)["']/g);
    for (const match of ruleEntries) {
      rules[match[1]] = match[2];
    }
    if (Object.keys(rules).length > 0) {
      config.rules = rules as Record<string, "error" | "warning" | "off">;
    }
  }

  return Object.keys(config).length > 0 ? config : undefined;
}

/**
 * Parse pull configuration from config file content.
 *
 * Supports:
 * ```ts
 * pull: {
 *   output: "./locales",
 *   locales: ["en", "tr"],
 * }
 * ```
 */
function parsePullConfig(content: string): PullConfig | undefined {
  if (!content.includes("pull:") && !content.includes("pull =")) {
    return undefined;
  }

  const config: PullConfig = {};

  // Extract output path: pull: { output: "./locales" }
  // Look for output inside a pull block
  const pullBlockMatch = content.match(/pull:\s*\{([^}]+)\}/s);
  if (pullBlockMatch) {
    const pullBlock = pullBlockMatch[1];

    const outputMatch = pullBlock.match(/output:\s*['"]([^'"]+)['"]/);
    if (outputMatch) {
      config.output = outputMatch[1];
    }

    const localesMatch = extractBalancedArray(pullBlock, "locales");
    if (localesMatch) {
      config.locales = parseStringArray(localesMatch);
    }
  }

  return Object.keys(config).length > 0 ? config : undefined;
}
