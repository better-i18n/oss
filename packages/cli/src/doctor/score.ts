/**
 * Health Score Calculator
 *
 * Calculates a weighted health score (0-100) from diagnostics.
 *
 * Scoring follows react-doctor's approach:
 * - Start at 100
 * - Deduct penalties per UNIQUE rule violation per category
 * - Counting unique rules (not occurrences) prevents a single noisy rule
 *   from tanking the entire score
 *
 * Category weights (penalty per unique error/warning):
 *   Coverage:    3.0 (error), 1.5 (warning)
 *   Quality:     2.5 (error), 1.25 (warning)
 *   Code:        1.5 (error), 0.75 (warning)
 *   Structure:   1.0 (error), 0.5 (warning)
 *   Performance: 0.75 (error), 0.4 (warning)
 */

import type { I18nDiagnostic } from "../rules/registry.js";

/** Penalty per unique rule in a category */
const ERROR_PENALTIES: Record<string, number> = {
  Coverage: 3.0,
  Quality: 2.5,
  Code: 1.5,
  Structure: 1.0,
  Performance: 0.75,
};

const WARNING_PENALTIES: Record<string, number> = {
  Coverage: 1.5,
  Quality: 1.25,
  Code: 0.75,
  Structure: 0.5,
  Performance: 0.4,
};

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

/**
 * Calculate health score from diagnostics.
 *
 * Algorithm:
 * 1. Group diagnostics by category
 * 2. For each category, count unique rule IDs with errors and warnings
 * 3. Apply penalty per unique rule: score = 100 - Σ(penalties)
 * 4. Clamp to [0, 100]
 * 5. Overall = weighted average of category scores
 */
export function calculateHealthScore(
  diagnostics: I18nDiagnostic[],
  passThreshold = 70,
): HealthScore {
  // Group by category
  const byCategory = new Map<string, I18nDiagnostic[]>();
  for (const d of diagnostics) {
    const existing = byCategory.get(d.category) || [];
    existing.push(d);
    byCategory.set(d.category, existing);
  }

  // All possible categories
  const allCategories = [
    "Coverage",
    "Quality",
    "Code",
    "Structure",
    "Performance",
  ];

  const categoryScores: Record<string, number> = {};

  for (const category of allCategories) {
    const diags = byCategory.get(category) || [];

    if (diags.length === 0) {
      categoryScores[category] = 100;
      continue;
    }

    // Count unique rules by severity
    const errorRules = new Set<string>();
    const warningRules = new Set<string>();

    for (const d of diags) {
      if (d.severity === "error") {
        errorRules.add(d.rule);
      } else if (d.severity === "warning") {
        warningRules.add(d.rule);
      }
      // "info" diagnostics don't affect score
    }

    const errorPenalty =
      errorRules.size * (ERROR_PENALTIES[category] || 1.0);
    const warningPenalty =
      warningRules.size * (WARNING_PENALTIES[category] || 0.5);

    categoryScores[category] = Math.max(
      0,
      Math.round(100 - errorPenalty - warningPenalty),
    );
  }

  // Overall score = weighted average
  // Weights match category importance
  const weights: Record<string, number> = {
    Coverage: 40,
    Quality: 25,
    Code: 15,
    Structure: 15,
    Performance: 5,
  };

  let weightedSum = 0;
  let totalWeight = 0;

  for (const category of allCategories) {
    const weight = weights[category] || 10;
    weightedSum += categoryScores[category] * weight;
    totalWeight += weight;
  }

  const total = Math.round(weightedSum / totalWeight);

  return {
    total,
    categories: categoryScores,
    passed: total >= passThreshold,
    passThreshold,
  };
}
