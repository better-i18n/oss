/**
 * Locale File Discovery
 *
 * Automatically discovers translation files in a project directory.
 * Supports multiple directory conventions and file patterns.
 *
 * Discovery strategy:
 * 1. If CDN base URL exists in config → fetch from CDN (handled elsewhere)
 * 2. Search common local directories: locales/, messages/, i18n/, public/locales/
 * 3. Detect file pattern: en.json (flat) vs en/common.json (namespaced)
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import type { RemoteTranslations } from "../utils/json-keys.js";

/** Well-known directories that commonly contain locale files */
const LOCALE_DIRS = [
  "locales",
  "locale",
  "messages",
  "i18n",
  "translations",
  "lang",
  "public/locales",
  "public/messages",
  "src/locales",
  "src/messages",
  "src/i18n",
];

/** Result of locale file discovery */
export interface LocaleDiscoveryResult {
  /** Root directory containing locale files */
  localeDir: string;
  /** Detected file pattern */
  pattern: "flat" | "namespaced";
  /** Map of locale code → file paths */
  localeFiles: Record<string, string[]>;
  /** All detected locale codes */
  locales: string[];
}

/**
 * Discover locale files in a project directory.
 *
 * Scans well-known directories for JSON translation files and
 * determines the file organization pattern (flat vs namespaced).
 */
export function discoverLocaleFiles(
  rootDir: string,
): LocaleDiscoveryResult | null {
  const absRoot = resolve(rootDir);

  for (const dir of LOCALE_DIRS) {
    const candidate = join(absRoot, dir);
    if (!existsSync(candidate) || !statSync(candidate).isDirectory()) continue;

    const entries = readdirSync(candidate);

    // Pattern 1: Flat files — en.json, tr.json, de.json
    const jsonFiles = entries.filter(
      (e) => extname(e) === ".json" && !e.startsWith("."),
    );
    if (jsonFiles.length > 0) {
      const localeFiles: Record<string, string[]> = {};
      for (const file of jsonFiles) {
        const locale = basename(file, ".json");
        if (isLikelyLocaleCode(locale)) {
          localeFiles[locale] = [join(candidate, file)];
        }
      }

      if (Object.keys(localeFiles).length >= 1) {
        return {
          localeDir: candidate,
          pattern: "flat",
          localeFiles,
          locales: Object.keys(localeFiles).sort(),
        };
      }
    }

    // Pattern 2: Namespaced dirs — en/common.json, en/auth.json
    const subdirs = entries.filter((e) => {
      const fullPath = join(candidate, e);
      return (
        statSync(fullPath).isDirectory() &&
        isLikelyLocaleCode(e) &&
        !e.startsWith(".")
      );
    });

    if (subdirs.length >= 1) {
      const localeFiles: Record<string, string[]> = {};
      for (const sub of subdirs) {
        const subPath = join(candidate, sub);
        const nsFiles = readdirSync(subPath).filter(
          (f) => extname(f) === ".json",
        );
        if (nsFiles.length > 0) {
          localeFiles[sub] = nsFiles.map((f) => join(subPath, f));
        }
      }

      if (Object.keys(localeFiles).length >= 1) {
        return {
          localeDir: candidate,
          pattern: "namespaced",
          localeFiles,
          locales: Object.keys(localeFiles).sort(),
        };
      }
    }
  }

  return null;
}

/**
 * Load all translation files for discovered locales.
 *
 * Returns a merged flat key→value map per locale.
 * For namespaced files, prefixes keys with the filename (sans extension).
 */
export function loadLocaleTranslations(
  discovery: LocaleDiscoveryResult,
): Record<string, Record<string, string>> {
  const result: Record<string, Record<string, string>> = {};

  for (const [locale, files] of Object.entries(discovery.localeFiles)) {
    const merged: Record<string, string> = {};

    for (const filePath of files) {
      try {
        const raw = JSON.parse(readFileSync(filePath, "utf-8"));

        if (discovery.pattern === "namespaced") {
          // Prefix keys with namespace (filename without extension)
          const namespace = basename(filePath, ".json");
          flattenWithPrefix(raw, namespace, merged);
        } else {
          flattenWithPrefix(raw, "", merged);
        }
      } catch {
        // Skip malformed JSON files
      }
    }

    result[locale] = merged;
  }

  return result;
}

/**
 * Flatten nested JSON object into a flat key→value map with optional prefix.
 */
function flattenWithPrefix(
  obj: RemoteTranslations,
  prefix: string,
  target: Record<string, string>,
): void {
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "string") {
      target[fullKey] = value;
    } else if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    ) {
      flattenWithPrefix(
        value as RemoteTranslations,
        fullKey,
        target,
      );
    }
  }
}

/**
 * Check if a string looks like a locale code (e.g., "en", "tr", "zh-Hans", "pt-BR").
 */
function isLikelyLocaleCode(str: string): boolean {
  return /^[a-z]{2}(-[a-zA-Z]{2,4})?$/.test(str);
}
