/**
 * File collector
 *
 * Collect TypeScript/JavaScript files for analysis
 */

import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

export interface CollectOptions {
  rootDir: string;
  include?: string[];
  exclude?: string[];
  extensions?: string[];
  staged?: boolean;
}

const DEFAULT_INCLUDE = ["src", "app", "components", "pages"];
const DEFAULT_EXCLUDE = [
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  "out",
  "__tests__",
  "__mocks__",
];
const DEFAULT_EXTENSIONS = [".tsx", ".jsx"];

/**
 * Collect files to analyze
 */
export async function collectFiles(options: CollectOptions): Promise<string[]> {
  const {
    rootDir,
    include,
    extensions = DEFAULT_EXTENSIONS,
  } = options;

  // Merge default excludes with user-provided excludes
  const allExcludes = [...DEFAULT_EXCLUDE, ...(options.exclude || [])];

  const files: string[] = [];

  // Directory names to exclude (no glob)
  const excludeSet = new Set(allExcludes.filter((e) => !e.includes("*")));

  // Glob patterns to exclude
  const globPatterns = allExcludes.filter((e) => e.includes("*"));

  // Determine which directories to scan
  let dirsToScan: string[] = [];

  if (include && include.length > 0) {
    // If user explicitly provided include patterns, use them
    const existingDirs = include.filter((dir) => existsSync(join(rootDir, dir)));
    dirsToScan = existingDirs.length > 0 ? existingDirs : ["."];
  } else {
    // If no config-based include, use smart defaults:
    // Check if DEFAULT_INCLUDE directories exist in rootDir
    const existingDefaults = DEFAULT_INCLUDE.filter((dir) =>
      existsSync(join(rootDir, dir)),
    );

    if (existingDefaults.length > 0) {
      // Found some default dirs, scan those
      dirsToScan = existingDefaults;
    } else {
      // No default dirs found, scan entire root directory
      dirsToScan = ["."];
    }
  }

  for (const dir of dirsToScan) {
    const fullDir = join(rootDir, dir);
    collectFromDir(
      fullDir,
      rootDir,
      files,
      excludeSet,
      extensions,
      globPatterns,
    );
  }

  return files;
}

function collectFromDir(
  dir: string,
  rootDir: string,
  files: string[],
  excludeSet: Set<string>,
  extensions: string[],
  globPatterns: string[] = [],
): void {
  try {
    const entries = readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (excludeSet.has(entry.name)) continue;

      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        // Check if directory matches glob pattern like **/components/ui/**
        if (shouldExcludeFile(fullPath, globPatterns)) continue;
        collectFromDir(
          fullPath,
          rootDir,
          files,
          excludeSet,
          extensions,
          globPatterns,
        );
      } else if (entry.isFile()) {
        const ext = entry.name.slice(entry.name.lastIndexOf("."));
        if (extensions.includes(ext)) {
          // Check if file matches glob pattern
          if (shouldExcludeFile(fullPath, globPatterns)) continue;
          files.push(fullPath);
        }
      }
    }
  } catch {
    // Ignore permission errors
  }
}

/**
 * Check if file matches exclude patterns
 */
export function shouldExcludeFile(
  filePath: string,
  patterns: string[],
): boolean {
  const fileName = filePath.split("/").pop() || "";

  for (const pattern of patterns) {
    // Handle **/filename.ext pattern (match filename anywhere)
    if (pattern.startsWith("**/") && !pattern.slice(3).includes("/")) {
      const filePattern = pattern.slice(3); // Remove **/
      if (filePattern.includes("*")) {
        // Convert glob to regex: *.stories.tsx -> .*\.stories\.tsx
        const regex = new RegExp(
          "^" + filePattern.replace(/\./g, "\\.").replace(/\*/g, ".*") + "$",
        );
        if (regex.test(fileName)) return true;
      } else if (fileName === filePattern) {
        return true;
      }
    }
    // Handle **/dir/** pattern (match directory path)
    else if (pattern.startsWith("**/") && pattern.endsWith("/**")) {
      const dirName = pattern.slice(3, -3); // Remove **/ and /**
      if (
        filePath.includes(`/${dirName}/`) ||
        filePath.includes(`${dirName}/`)
      ) {
        return true;
      }
    }
    // Handle **/*.ext pattern (match extension)
    else if (pattern.startsWith("**/*.")) {
      const ext = pattern.slice(4);
      if (fileName.endsWith(ext)) return true;
    }
    // Handle simple glob
    else if (pattern.includes("*")) {
      const regex = new RegExp(
        "^" +
          pattern
            .replace(/\./g, "\\.")
            .replace(/\*\*/g, ".*")
            .replace(/\*/g, "[^/]*") +
          "$",
      );
      if (regex.test(filePath) || regex.test(fileName)) return true;
    }
    // Simple string match
    else if (filePath.includes(pattern)) {
      return true;
    }
  }

  return false;
}
