import { describe, it, expect } from "bun:test";
import {
  patternToRegex,
  extractStaticSegments,
  matchDynamicPattern,
  groupPatternsByPrefix,
  isAmbiguousPattern,
} from "../dynamic-matcher.js";

// ---------------------------------------------------------------------------
// patternToRegex
// ---------------------------------------------------------------------------

describe("patternToRegex", () => {
  // ── CRITICAL REGRESSION TESTS ──────────────────────────────────────────

  it("plans.${x}.name matches plans.free.name", () => {
    const regex = patternToRegex("plans.${x}.name");
    expect(regex.test("plans.free.name")).toBe(true);
  });

  it("plans.${x}.name matches plans.pro.name AND plans.enterprise.name", () => {
    const regex = patternToRegex("plans.${x}.name");
    expect(regex.test("plans.pro.name")).toBe(true);
    expect(regex.test("plans.enterprise.name")).toBe(true);
  });

  it("plans.${x}.name does NOT match plans.free.price (wrong suffix)", () => {
    const regex = patternToRegex("plans.${x}.name");
    expect(regex.test("plans.free.price")).toBe(false);
  });

  it("plans.${x}.name does NOT match extra.plans.free.name (anchored)", () => {
    const regex = patternToRegex("plans.${x}.name");
    expect(regex.test("extra.plans.free.name")).toBe(false);
  });

  it("plans.${x}.name does NOT match plans.free.name.extra (anchored)", () => {
    const regex = patternToRegex("plans.${x}.name");
    expect(regex.test("plans.free.name.extra")).toBe(false);
  });

  // ── Leading variable ────────────────────────────────────────────────────

  it("${ns}.title matches common.title", () => {
    const regex = patternToRegex("${ns}.title");
    expect(regex.test("common.title")).toBe(true);
  });

  it("${ns}.title matches auth.title", () => {
    const regex = patternToRegex("${ns}.title");
    expect(regex.test("auth.title")).toBe(true);
  });

  it("${ns}.title does NOT match title alone (needs dot separator)", () => {
    const regex = patternToRegex("${ns}.title");
    expect(regex.test("title")).toBe(false);
  });

  it("${ns}.title does NOT match common.title.extra (anchored suffix)", () => {
    const regex = patternToRegex("${ns}.title");
    expect(regex.test("common.title.extra")).toBe(false);
  });

  // ── Trailing variable ───────────────────────────────────────────────────

  it("workflow.${key} matches workflow.step1", () => {
    const regex = patternToRegex("workflow.${key}");
    expect(regex.test("workflow.step1")).toBe(true);
  });

  it("workflow.${key} matches workflow.anything", () => {
    const regex = patternToRegex("workflow.${key}");
    expect(regex.test("workflow.anything")).toBe(true);
  });

  it("workflow.${key} does NOT match otherworkflow.step1 (anchored)", () => {
    const regex = patternToRegex("workflow.${key}");
    expect(regex.test("otherworkflow.step1")).toBe(false);
  });

  // ── Multiple variables ──────────────────────────────────────────────────

  it("${a}.${b}.name matches x.y.name", () => {
    const regex = patternToRegex("${a}.${b}.name");
    expect(regex.test("x.y.name")).toBe(true);
  });

  it("${a}.${b}.name does NOT match x.y.other", () => {
    const regex = patternToRegex("${a}.${b}.name");
    expect(regex.test("x.y.other")).toBe(false);
  });

  // ── Dot escape: dots must be literal ───────────────────────────────────

  it("plans.${x}.name does NOT match plansXfreeXname (dots are literal)", () => {
    const regex = patternToRegex("plans.${x}.name");
    expect(regex.test("plansXfreeXname")).toBe(false);
  });

  // ── Only dynamic variable ───────────────────────────────────────────────

  it("${x} matches a single-segment key", () => {
    const regex = patternToRegex("${x}");
    expect(regex.test("anything")).toBe(true);
  });

  it("${x} matches any single token without dot", () => {
    const regex = patternToRegex("${x}");
    expect(regex.test("hello")).toBe(true);
  });

  // ── Nested dynamic ─────────────────────────────────────────────────────

  it("a.${x}.b.${y}.c matches a.foo.b.bar.c", () => {
    const regex = patternToRegex("a.${x}.b.${y}.c");
    expect(regex.test("a.foo.b.bar.c")).toBe(true);
  });

  it("a.${x}.b.${y}.c does NOT match a.foo.b.bar.d", () => {
    const regex = patternToRegex("a.${x}.b.${y}.c");
    expect(regex.test("a.foo.b.bar.d")).toBe(false);
  });

  // ── Returns RegExp ──────────────────────────────────────────────────────

  it("returns a RegExp instance", () => {
    expect(patternToRegex("foo.${x}.bar")).toBeInstanceOf(RegExp);
  });

  it("regex is anchored with ^ and $", () => {
    const regex = patternToRegex("foo.${x}");
    expect(regex.source.startsWith("^")).toBe(true);
    expect(regex.source.endsWith("$")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// matchDynamicPattern
// ---------------------------------------------------------------------------

describe("matchDynamicPattern", () => {
  it("returns empty array when remoteKeys is empty", () => {
    expect(matchDynamicPattern("plans.${x}.name", [])).toEqual([]);
  });

  it("returns single matching key among many", () => {
    const remoteKeys = [
      "plans.free.name",
      "plans.free.price",
      "common.title",
      "auth.login",
    ];
    const result = matchDynamicPattern("plans.free.name", remoteKeys);
    expect(result).toEqual(["plans.free.name"]);
  });

  it("returns multiple matches for a dynamic pattern", () => {
    const remoteKeys = [
      "plans.free.name",
      "plans.pro.name",
      "plans.enterprise.name",
      "plans.free.price",
    ];
    const result = matchDynamicPattern("plans.${x}.name", remoteKeys);
    expect(result).toContain("plans.free.name");
    expect(result).toContain("plans.pro.name");
    expect(result).toContain("plans.enterprise.name");
    expect(result).not.toContain("plans.free.price");
  });

  it("returns empty array when no keys match", () => {
    const remoteKeys = ["common.title", "auth.login"];
    expect(matchDynamicPattern("plans.${x}.name", remoteKeys)).toEqual([]);
  });

  it("matches keys with a leading dynamic segment (broad pattern)", () => {
    const remoteKeys = ["common.title", "auth.title", "nav.title", "auth.login"];
    const result = matchDynamicPattern("${ns}.title", remoteKeys);
    expect(result).toContain("common.title");
    expect(result).toContain("auth.title");
    expect(result).toContain("nav.title");
    expect(result).not.toContain("auth.login");
  });
});

// ---------------------------------------------------------------------------
// extractStaticSegments
// ---------------------------------------------------------------------------

describe("extractStaticSegments", () => {
  it("plans.${x}.name → prefix: 'plans', suffix: 'name', both true", () => {
    const result = extractStaticSegments("plans.${x}.name");
    expect(result.prefix).toBe("plans");
    expect(result.suffix).toBe("name");
    expect(result.hasPrefix).toBe(true);
    expect(result.hasSuffix).toBe(true);
  });

  it("${ns}.title → prefix: '', suffix: 'title', hasPrefix false, hasSuffix true", () => {
    const result = extractStaticSegments("${ns}.title");
    expect(result.prefix).toBe("");
    expect(result.suffix).toBe("title");
    expect(result.hasPrefix).toBe(false);
    expect(result.hasSuffix).toBe(true);
  });

  it("workflow.${key} → prefix: 'workflow', suffix: '', hasPrefix true, hasSuffix false", () => {
    const result = extractStaticSegments("workflow.${key}");
    expect(result.prefix).toBe("workflow");
    expect(result.suffix).toBe("");
    expect(result.hasPrefix).toBe(true);
    expect(result.hasSuffix).toBe(false);
  });

  it("${a}.${b} → prefix: '', suffix: '', both false", () => {
    const result = extractStaticSegments("${a}.${b}");
    expect(result.prefix).toBe("");
    expect(result.suffix).toBe("");
    expect(result.hasPrefix).toBe(false);
    expect(result.hasSuffix).toBe(false);
  });

  it("removes trailing dot from prefix", () => {
    // prefix raw is "workflow." → after replace becomes "workflow"
    const result = extractStaticSegments("workflow.${key}");
    expect(result.prefix).toBe("workflow");
    expect(result.prefix.endsWith(".")).toBe(false);
  });

  it("removes leading dot from suffix", () => {
    // suffix raw is ".name" → after replace becomes "name"
    const result = extractStaticSegments("plans.${x}.name");
    expect(result.suffix).toBe("name");
    expect(result.suffix.startsWith(".")).toBe(false);
  });

  it("workflow.steps.${key}.title → prefix: 'workflow.steps', suffix: 'title'", () => {
    const result = extractStaticSegments("workflow.steps.${key}.title");
    expect(result.prefix).toBe("workflow.steps");
    expect(result.suffix).toBe("title");
    expect(result.hasPrefix).toBe(true);
    expect(result.hasSuffix).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// groupPatternsByPrefix
// ---------------------------------------------------------------------------

describe("groupPatternsByPrefix", () => {
  it("groups patterns with same prefix together", () => {
    const patterns = ["plans.${x}.name", "plans.${y}.desc"];
    const groups = groupPatternsByPrefix(patterns);
    expect(groups.has("plans")).toBe(true);
    expect(groups.get("plans")).toContain("plans.${x}.name");
    expect(groups.get("plans")).toContain("plans.${y}.desc");
  });

  it("uses '(no-prefix)' for patterns starting with a dynamic variable", () => {
    const patterns = ["${ns}.title"];
    const groups = groupPatternsByPrefix(patterns);
    expect(groups.has("(no-prefix)")).toBe(true);
    expect(groups.get("(no-prefix)")).toContain("${ns}.title");
  });

  it("handles single pattern with prefix", () => {
    const groups = groupPatternsByPrefix(["workflow.${key}"]);
    expect(groups.has("workflow")).toBe(true);
    expect(groups.get("workflow")).toEqual(["workflow.${key}"]);
  });

  it("handles mixed prefix and no-prefix patterns", () => {
    const patterns = ["plans.${x}.name", "${ns}.title", "workflow.${key}"];
    const groups = groupPatternsByPrefix(patterns);
    expect(groups.has("plans")).toBe(true);
    expect(groups.has("(no-prefix)")).toBe(true);
    expect(groups.has("workflow")).toBe(true);
  });

  it("returns empty map for empty input", () => {
    const groups = groupPatternsByPrefix([]);
    expect(groups.size).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// isAmbiguousPattern
// ---------------------------------------------------------------------------

describe("isAmbiguousPattern", () => {
  it("pattern starting with ${} and matchCount 11 → true (threshold 10)", () => {
    expect(isAmbiguousPattern("${ns}.title", 11)).toBe(true);
  });

  it("pattern starting with ${} and matchCount 10 → false (not strictly greater)", () => {
    expect(isAmbiguousPattern("${ns}.title", 10)).toBe(false);
  });

  it("pattern starting with ${} and matchCount 9 → false", () => {
    expect(isAmbiguousPattern("${ns}.title", 9)).toBe(false);
  });

  it("normal pattern at matchCount 50 → false (not strictly greater than 50)", () => {
    expect(isAmbiguousPattern("plans.${x}.name", 50)).toBe(false);
  });

  it("normal pattern at matchCount 51 → true", () => {
    expect(isAmbiguousPattern("plans.${x}.name", 51)).toBe(true);
  });

  it("normal pattern at matchCount 49 → false", () => {
    expect(isAmbiguousPattern("plans.${x}.name", 49)).toBe(false);
  });

  it("custom threshold 20, matchCount 21 → true", () => {
    expect(isAmbiguousPattern("plans.${x}.name", 21, 20)).toBe(true);
  });

  it("custom threshold 20, matchCount 20 → false", () => {
    expect(isAmbiguousPattern("plans.${x}.name", 20, 20)).toBe(false);
  });

  it("pattern starting with ${} always uses lower threshold of 10 regardless of custom threshold", () => {
    // Even with threshold=100, starting-with-${} uses 10
    expect(isAmbiguousPattern("${x}", 11, 100)).toBe(true);
    expect(isAmbiguousPattern("${x}", 10, 100)).toBe(false);
  });
});
