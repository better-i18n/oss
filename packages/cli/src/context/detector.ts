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
  const projectMatch = content.match(/project:\s*['"]([^'"]+\/[^'"]+)['"]/);
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
 * Parse optional lint config from file content
 */
function parseLintConfig(content: string): LintConfig | undefined {
  if (!content.includes("lint:") && !content.includes("lint =")) {
    return undefined;
  }

  const config: LintConfig = {};

  // Extract include array
  const includeMatch = content.match(/include:\s*\[([^\]]+)\]/);
  if (includeMatch) {
    config.include = includeMatch[1]
      .split(",")
      .map((s) => s.trim().replace(/['"]/g, ""))
      .filter(Boolean);
  }

  // Extract exclude array
  const excludeMatch = content.match(/exclude:\s*\[([^\]]+)\]/);
  if (excludeMatch) {
    config.exclude = excludeMatch[1]
      .split(",")
      .map((s) => s.trim().replace(/['"]/g, ""))
      .filter(Boolean);
  }

  return Object.keys(config).length > 0 ? config : undefined;
}
