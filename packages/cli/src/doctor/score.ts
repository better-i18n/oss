/**
 * Health Score Calculator
 *
 * Calculates an occurrence-based health score (0-100) from diagnostics.
 *
 * Unlike react-doctor (which counts unique rules), i18n doctor penalizes
 * per occurrence because each hardcoded string is an independent task
 * that requires its own t() wrapping.
 *
 * Overall score: 100 - (errors x 3.0) - Σ min(ruleWarnings x 0.15, 20)
 * Category score: 100 - (errors x 5.0) - Σ min(ruleWarnings x 0.5, 80)
 *
 * Per-rule warning cap: Each rule can penalize the overall score by at most
 * MAX_RULE_WARNING_PENALTY (20) points, and each category by at most
 * MAX_RULE_CAT_PENALTY (80) points. This prevents a single rule with
 * thousands of warnings (e.g. missing-in-remote) from zeroing the score.
 * Errors are NOT capped.
 *
 * Calibration targets:
 *   0E,   0W  → 100
 *   0E, 104W  →  84  (single rule, cap threshold = 133)
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

/** Max penalty any single rule's warnings can contribute to the overall score */
const MAX_RULE_WARNING_PENALTY = 20;

/** Per-occurrence penalty for errors within a category */
const CAT_ERROR_PENALTY = 5.0;
/** Per-occurrence penalty for warnings within a category */
const CAT_WARNING_PENALTY = 0.5;

/** Max penalty any single rule's warnings can contribute to a category score */
const MAX_RULE_CAT_PENALTY = 80;

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
 * 1. Count total errors and per-rule warnings (info ignored)
 * 2. Overall = 100 - (errors x 3.0) - Σ min(ruleWarnings x 0.15, 20), clamped [0,100]
 * 3. Per category = 100 - (catErrors x 5.0) - Σ min(ruleWarnings x 0.5, 80), clamped [0,100]
 * 4. passed = overall >= threshold
 */
export function calculateHealthScore(
  diagnostics: I18nDiagnostic[],
  passThreshold = PASS_THRESHOLD,
): HealthScore {
  // Count totals
  let totalErrors = 0;

  // Per-rule warning counts (for capped overall penalty)
  const ruleWarningCounts = new Map<string, number>();

  // Count per category
  const catErrors = new Map<string, number>();
  // Per-category, per-rule warning counts (for capped category penalty)
  const catRuleWarnings = new Map<string, Map<string, number>>();

  for (const d of diagnostics) {
    if (d.severity === "error") {
      totalErrors++;
      catErrors.set(d.category, (catErrors.get(d.category) || 0) + 1);
    } else if (d.severity === "warning") {
      ruleWarningCounts.set(d.rule, (ruleWarningCounts.get(d.rule) || 0) + 1);
      if (!catRuleWarnings.has(d.category)) {
        catRuleWarnings.set(d.category, new Map());
      }
      const ruleMap = catRuleWarnings.get(d.category)!;
      ruleMap.set(d.rule, (ruleMap.get(d.rule) || 0) + 1);
    }
    // "info" diagnostics don't affect score
  }

  // Overall score — per-rule capped warning penalty
  let totalWarningPenalty = 0;
  for (const count of ruleWarningCounts.values()) {
    totalWarningPenalty += Math.min(
      count * WARNING_PENALTY,
      MAX_RULE_WARNING_PENALTY,
    );
  }
  const rawTotal = 100 - totalErrors * ERROR_PENALTY - totalWarningPenalty;
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

    // Sum per-rule capped warning penalties for this category
    let catWarningPenalty = 0;
    const ruleMap = catRuleWarnings.get(cat);
    if (ruleMap) {
      for (const count of ruleMap.values()) {
        catWarningPenalty += Math.min(
          count * CAT_WARNING_PENALTY,
          MAX_RULE_CAT_PENALTY,
        );
      }
    }

    const rawCat = 100 - errors * CAT_ERROR_PENALTY - catWarningPenalty;
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
