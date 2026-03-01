/**
 * Health Score Calculator
 *
 * Calculates an occurrence-based health score (0-100) from diagnostics.
 *
 * Unlike react-doctor (which counts unique rules), i18n doctor penalizes
 * per occurrence because each hardcoded string is an independent task
 * that requires its own t() wrapping.
 *
 * Overall score: 100 - (errors x 3.0) - (warnings x 0.15)
 * Category score: 100 - (errors x 5.0) - (warnings x 0.5)
 *
 * Calibration targets:
 *   0E,   0W  → 100
 *   0E, 104W  →  84
 *  10E,  20W  →  67
 *   5E,   0W  →  85
 *   1E,   0W  →  97
 */

import type { I18nDiagnostic } from "../rules/registry.js";

// ── Penalty Constants ───────────────────────────────────────────────

/** Per-occurrence penalty for errors on the overall score */
const ERROR_PENALTY = 3.0;
/** Per-occurrence penalty for warnings on the overall score */
const WARNING_PENALTY = 0.15;

/** Per-occurrence penalty for errors within a category */
const CAT_ERROR_PENALTY = 5.0;
/** Per-occurrence penalty for warnings within a category */
const CAT_WARNING_PENALTY = 0.5;

/** Default pass/fail threshold */
const PASS_THRESHOLD = 70;

// ── Types ───────────────────────────────────────────────────────────

export interface HealthScore {
  /** Overall score 0-100 */
  total: number;
  /** Per-category scores 0-100 */
  categories: Record<string, number>;
  /** Whether the project passes the threshold */
  passed: boolean;
  /** Pass threshold (configurable, default 70) */
  passThreshold: number;
}

// ── Calculator ──────────────────────────────────────────────────────

/**
 * Calculate health score from diagnostics.
 *
 * Algorithm:
 * 1. Count total errors and warnings (info ignored)
 * 2. Overall = 100 - (errors x 3.0) - (warnings x 0.15), clamped [0,100]
 * 3. Per category = 100 - (catErrors x 5.0) - (catWarnings x 0.5), clamped [0,100]
 * 4. passed = overall >= threshold
 */
export function calculateHealthScore(
  diagnostics: I18nDiagnostic[],
  passThreshold = PASS_THRESHOLD,
): HealthScore {
  // Count totals
  let totalErrors = 0;
  let totalWarnings = 0;

  // Count per category
  const catErrors = new Map<string, number>();
  const catWarnings = new Map<string, number>();

  for (const d of diagnostics) {
    if (d.severity === "error") {
      totalErrors++;
      catErrors.set(d.category, (catErrors.get(d.category) || 0) + 1);
    } else if (d.severity === "warning") {
      totalWarnings++;
      catWarnings.set(d.category, (catWarnings.get(d.category) || 0) + 1);
    }
    // "info" diagnostics don't affect score
  }

  // Overall score — flat, occurrence-based
  const rawTotal =
    100 - totalErrors * ERROR_PENALTY - totalWarnings * WARNING_PENALTY;
  const total = clamp(Math.round(rawTotal));

  // Per-category scores
  const allCategories = [
    "Coverage",
    "Quality",
    "Code",
    "Structure",
    "Performance",
  ];

  const categories: Record<string, number> = {};

  for (const cat of allCategories) {
    const errors = catErrors.get(cat) || 0;
    const warnings = catWarnings.get(cat) || 0;

    const rawCat =
      100 - errors * CAT_ERROR_PENALTY - warnings * CAT_WARNING_PENALTY;
    categories[cat] = clamp(Math.round(rawCat));
  }

  return {
    total,
    categories,
    passed: total >= passThreshold,
    passThreshold,
  };
}

// ── Helpers ─────────────────────────────────────────────────────────

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}
