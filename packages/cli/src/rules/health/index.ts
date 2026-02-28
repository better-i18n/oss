/**
 * Health rules index
 *
 * Exports all health rules and a convenience array for bulk registration.
 * Health rules analyze translation files at the project level.
 */

import type { HealthRule } from "../registry.js";
import { missingTranslationsRule } from "./missing-translations.js";
import { orphanKeysRule } from "./orphan-keys.js";
import { placeholderMismatchRule } from "./placeholder-mismatch.js";

export { missingTranslationsRule } from "./missing-translations.js";
export { orphanKeysRule } from "./orphan-keys.js";
export {
  placeholderMismatchRule,
  extractPlaceholders,
} from "./placeholder-mismatch.js";

/**
 * All health rules in recommended execution order.
 * Coverage rules first, then quality, then performance.
 */
export const healthRules: HealthRule[] = [
  missingTranslationsRule,
  placeholderMismatchRule,
  orphanKeysRule,
];
