/**
 * Rules index — backward compatibility barrel
 *
 * Canonical rule locations are now:
 *   src/rules/code/        — Code detection rules (JSX text, attributes, etc.)
 *   src/rules/extraction/  — Key extraction rules (t() calls, data structures)
 *
 * This file re-exports from the new locations so existing imports
 * (e.g., analyzer/index.ts) continue to work without changes.
 */

export * from "../../rules/code/index.js";
export * from "../../rules/extraction/index.js";

