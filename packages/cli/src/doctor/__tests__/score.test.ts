import { describe, expect, it } from "bun:test";
import { calculateHealthScore } from "../score.js";
import type { I18nDiagnostic } from "../../rules/registry.js";

// ── Helpers ─────────────────────────────────────────────────────────

/** Create a diagnostic with minimal required fields */
function diag(
  severity: I18nDiagnostic["severity"],
  category: I18nDiagnostic["category"] = "Code",
  rule = "test-rule",
): I18nDiagnostic {
  return {
    filePath: "test.tsx",
    line: 1,
    column: 1,
    rule,
    category,
    severity,
    message: "test message",
    help: "",
  };
}

/** Create N diagnostics with the same severity/category */
function diagN(
  n: number,
  severity: I18nDiagnostic["severity"],
  category: I18nDiagnostic["category"] = "Code",
  rule = "test-rule",
): I18nDiagnostic[] {
  return Array.from({ length: n }, () => diag(severity, category, rule));
}

// ── Overall Score Tests ─────────────────────────────────────────────

describe("calculateHealthScore — overall", () => {
  it("returns 100 for zero diagnostics", () => {
    const result = calculateHealthScore([]);
    expect(result.total).toBe(100);
    expect(result.passed).toBe(true);
  });

  it("scores 84 for 104 warnings (main scenario)", () => {
    // 100 - 104 * 0.15 = 100 - 15.6 = 84.4 → 84
    const result = calculateHealthScore(diagN(104, "warning"));
    expect(result.total).toBe(84);
    expect(result.passed).toBe(true);
  });

  it("scores 67 for 10 errors + 20 warnings", () => {
    // 100 - 10*3 - 20*0.15 = 100 - 30 - 3 = 67
    const diagnostics = [...diagN(10, "error"), ...diagN(20, "warning")];
    const result = calculateHealthScore(diagnostics);
    expect(result.total).toBe(67);
    expect(result.passed).toBe(false);
  });

  it("scores 85 for 5 errors", () => {
    // 100 - 5*3 = 85
    const result = calculateHealthScore(diagN(5, "error"));
    expect(result.total).toBe(85);
    expect(result.passed).toBe(true);
  });

  it("scores 97 for 1 error", () => {
    // 100 - 1*3 = 97
    const result = calculateHealthScore(diagN(1, "error"));
    expect(result.total).toBe(97);
    expect(result.passed).toBe(true);
  });

  it("clamps to 0 for extreme errors (no negatives)", () => {
    // 100 - 200*3 = -500 → clamped to 0
    const result = calculateHealthScore(diagN(200, "error"));
    expect(result.total).toBe(0);
    expect(result.passed).toBe(false);
  });

  it("returns integer results (no fractional scores)", () => {
    // 100 - 3*0.15 = 99.55 → 100 (rounded)
    const result = calculateHealthScore(diagN(3, "warning"));
    expect(Number.isInteger(result.total)).toBe(true);
  });

  it("ignores info severity diagnostics", () => {
    const diagnostics = diagN(50, "info");
    const result = calculateHealthScore(diagnostics);
    expect(result.total).toBe(100);
  });
});

// ── Pass/Fail Threshold Tests ───────────────────────────────────────

describe("calculateHealthScore — threshold", () => {
  it("passes at exactly threshold (70)", () => {
    // 10 errors = 100 - 30 = 70
    const result = calculateHealthScore(diagN(10, "error"));
    expect(result.total).toBe(70);
    expect(result.passed).toBe(true);
  });

  it("fails at one below threshold (69)", () => {
    // Need score of 69: 100 - x*3 - y*0.15 = 69
    // 10 errors + 7 warnings = 100 - 30 - 1.05 = 68.95 → 69
    // Actually let's try: 100 - 10*3 - 4*0.15 = 100-30-0.6 = 69.4 → 69
    const diagnostics = [...diagN(10, "error"), ...diagN(4, "warning")];
    const result = calculateHealthScore(diagnostics);
    expect(result.total).toBe(69);
    expect(result.passed).toBe(false);
  });

  it("respects custom pass threshold", () => {
    // 5 errors → score 85, threshold 90 → fail
    const result = calculateHealthScore(diagN(5, "error"), 90);
    expect(result.total).toBe(85);
    expect(result.passed).toBe(false);
    expect(result.passThreshold).toBe(90);
  });
});

// ── Category Score Tests ────────────────────────────────────────────

describe("calculateHealthScore — categories", () => {
  it("scores 48 for Code category with 104 warnings", () => {
    // 100 - 104*0.5 = 48
    const result = calculateHealthScore(diagN(104, "warning", "Code"));
    expect(result.categories.Code).toBe(48);
  });

  it("returns 100 for categories with zero issues", () => {
    // Only Code has issues, other categories should be 100
    const result = calculateHealthScore(diagN(5, "warning", "Code"));
    expect(result.categories.Coverage).toBe(100);
    expect(result.categories.Quality).toBe(100);
    expect(result.categories.Structure).toBe(100);
    expect(result.categories.Performance).toBe(100);
  });

  it("scores 50 for category with 10 errors", () => {
    // 100 - 10*5 = 50
    const result = calculateHealthScore(
      diagN(10, "error", "Coverage"),
    );
    expect(result.categories.Coverage).toBe(50);
  });

  it("clamps category score to 0 (no negatives)", () => {
    // 100 - 50*5 = -150 → 0
    const result = calculateHealthScore(
      diagN(50, "error", "Quality"),
    );
    expect(result.categories.Quality).toBe(0);
  });

  it("includes all five categories in output", () => {
    const result = calculateHealthScore([]);
    const cats = Object.keys(result.categories);
    expect(cats).toContain("Coverage");
    expect(cats).toContain("Quality");
    expect(cats).toContain("Code");
    expect(cats).toContain("Structure");
    expect(cats).toContain("Performance");
  });
});
