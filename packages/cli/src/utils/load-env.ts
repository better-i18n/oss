/**
 * Lightweight .env file loader — zero dependencies.
 *
 * Loads environment variables from .env files in the current directory.
 * Does NOT override existing shell variables (shell wins).
 *
 * Load order (first file found wins per variable):
 *   1. .env.local     (git-ignored, user-specific)
 *   2. .env           (committed defaults)
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function parseEnvFile(filePath: string): Record<string, string> {
  const vars: Record<string, string> = {};

  if (!existsSync(filePath)) return vars;

  const content = readFileSync(filePath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;

    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();

    // Strip surrounding quotes
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }

    vars[key] = val;
  }

  return vars;
}

/**
 * Load .env files into process.env.
 * Shell variables take precedence — only sets vars that don't already exist.
 */
export function loadEnvFiles(dir?: string): void {
  const root = dir || process.cwd();
  const files = [
    resolve(root, ".env.local"),
    resolve(root, ".env"),
  ];

  for (const file of files) {
    const vars = parseEnvFile(file);
    for (const [key, value] of Object.entries(vars)) {
      // Don't override existing shell/CI variables
      if (process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }
}
