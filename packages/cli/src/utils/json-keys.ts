/**
 * JSON key utilities
 *
 * Functions for flattening, counting, and working with nested translation JSON files.
 * Extracted from sync.ts for reuse in doctor, check, and sync commands.
 */

/**
 * Recursive type representing any valid JSON value in a translation file.
 * Leaves are strings (most common), numbers, booleans, null, or arrays.
 * Objects represent nested namespaces.
 */
export type TranslationValue =
  | string
  | number
  | boolean
  | null
  | TranslationValue[]
  | { [key: string]: TranslationValue };

/**
 * Top-level structure of a remote translation file (locale JSON).
 */
export type RemoteTranslations = Record<string, TranslationValue>;

/**
 * Flatten nested JSON translation file into a namespace-grouped key map.
 *
 * Only first-level key becomes the namespace (Better i18n convention).
 * Returns Record<namespace, fullKey[]>.
 *
 * @example
 * ```
 * flattenKeys({ common: { title: "Hello", actions: { save: "Save" } } })
 * // => { common: ["common.title", "common.actions.save"] }
 * ```
 */
export function flattenKeys(
  remoteKeys: RemoteTranslations,
): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  function traverse(obj: TranslationValue, prefix: string = "") {
    if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return;

    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        traverse(value, fullKey);
      } else {
        // Leaf (string, number, array, boolean, or null)
        const namespace = fullKey.split(".")[0] || "default";
        if (!result[namespace]) result[namespace] = [];
        result[namespace].push(fullKey);
      }
    }
  }

  traverse(remoteKeys as TranslationValue);
  return result;
}

/**
 * Flatten nested JSON to a flat key→value map (all namespaces merged).
 *
 * Unlike flattenKeys() which groups by namespace, this returns a single
 * flat map of dotted-path → leaf-value. Useful for health rules that
 * need to compare source and target translation values.
 */
export function flattenToRecord(
  translations: RemoteTranslations,
): Record<string, string> {
  const result: Record<string, string> = {};

  function traverse(obj: TranslationValue, prefix: string = "") {
    if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return;

    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        traverse(value, fullKey);
      } else if (typeof value === "string") {
        result[fullKey] = value;
      }
    }
  }

  traverse(translations as TranslationValue);
  return result;
}

/**
 * Count total leaf keys in nested translation structure.
 * Only counts string values (not numbers, arrays, booleans).
 */
export function countTotalKeys(remoteKeys: RemoteTranslations): number {
  let count = 0;

  function traverse(obj: TranslationValue) {
    if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return;
    for (const value of Object.values(obj)) {
      if (typeof value === "string") {
        count++;
      } else if (typeof value === "object" && value !== null) {
        traverse(value);
      }
    }
  }

  traverse(remoteKeys as TranslationValue);
  return count;
}

/**
 * Count total keys from a namespace-grouped string[] map.
 */
export function countMissingKeys(keys: Record<string, string[]>): number {
  return Object.values(keys).reduce((sum, arr) => sum + arr.length, 0);
}

/**
 * Count total keys from a namespace-grouped MissingKeyEntry[] map.
 */
export function countMissingKeysFromEntries(
  keys: Record<string, MissingKeyEntry[]>,
): number {
  return Object.values(keys).reduce((sum, arr) => sum + arr.length, 0);
}

/**
 * A key detected in code that doesn't exist in remote translations.
 */
export interface MissingKeyEntry {
  key: string;
  value: string;
}
