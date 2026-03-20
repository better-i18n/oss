/**
 * Project context detection
 *
 * Auto-detect Better i18n project configuration from i18n.config.ts
 * or createI18n usage. Shared logic with MCP server.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import type { LintConfig, ProjectContext } from "../analyzer/types.js";

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

  // Search for createI18n import as fallback
  for (const file of files) {
    try {
      const content = readFileSync(file, "utf-8");

      if (
        /import\s+.*createI18n.*from\s+['"]@better-i18n\/(next|core)['"]/.test(
          content,
        ) &&
        /createI18n\s*\(/.test(content)
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

    return {
      workspaceId,
      projectSlug,
      defaultLocale: localeMatch?.[1] || "en",
      cdnBaseUrl: cdnMatch?.[1],
      lint,
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

    return {
      workspaceId,
      projectSlug,
      defaultLocale: localeMatch?.[1] || "en",
      cdnBaseUrl: cdnMatch?.[1],
      lint,
    };
  }

  // Try old format: workspaceId + projectSlug
  const workspaceMatch = content.match(/workspaceId:\s*['"]([^'"]+)['"]/);
  const projectSlugMatch = content.match(/projectSlug:\s*['"]([^'"]+)['"]/);
  const localeMatch = content.match(/defaultLocale:\s*['"]([^'"]+)['"]/);
  const cdnMatch = content.match(/cdnBaseUrl:\s*['"]([^'"]+)['"]/);

  if (workspaceMatch && projectSlugMatch) {
    const lint = parseLintConfig(content);

    return {
      workspaceId: workspaceMatch[1],
      projectSlug: projectSlugMatch[1],
      defaultLocale: localeMatch?.[1] || "en",
      cdnBaseUrl: cdnMatch?.[1],
      lint,
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
  const includeMatch = content.match(/include:\s*\[([^\]]+)\]/);
  if (includeMatch) {
    config.include = parseStringArray(includeMatch[1]);
  }

  // Extract exclude array
  const excludeMatch = content.match(/exclude:\s*\[([^\]]+)\]/);
  if (excludeMatch) {
    config.exclude = parseStringArray(excludeMatch[1]);
  }

  // Extract translationFunctions array
  const tfMatch = content.match(/translationFunctions:\s*\[([^\]]+)\]/);
  if (tfMatch) {
    config.translationFunctions = parseStringArray(tfMatch[1]);
  }

  // Extract ignoreStrings array
  const isMatch = content.match(/ignoreStrings:\s*\[([^\]]+)\]/);
  if (isMatch) {
    config.ignoreStrings = parseStringArray(isMatch[1]);
  }

  // Parse ignorePatterns: [/pattern1/, /pattern2/] or ignorePatterns: ["pattern1", "pattern2"]
  const ignorePatternsMatch = content.match(/ignorePatterns:\s*\[([^\]]+)\]/);
  if (ignorePatternsMatch) {
    // Strip inline comments (// ...) but not escaped slashes in regex (\/)
    const patternsRaw = ignorePatternsMatch[1].replace(/(?<!\\)\/\/[^\n]*/g, "");
    const patterns: RegExp[] = [];
    // Match regex literals like /pattern/flags, allowing escaped chars (e.g. \/)
    const regexLiterals = patternsRaw.matchAll(/\/((?:[^/\\]|\\.)*)\/([gimsuy]*)/g);
    for (const match of regexLiterals) {
      try {
        patterns.push(new RegExp(match[1], match[2]));
      } catch {}
    }
    // Match string literals like "pattern" or 'pattern'
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
