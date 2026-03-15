/**
 * Orphan Keys Rule — Smart Matching Unit Tests
 *
 * Tests the smart matching features of orphanKeysRule:
 * - syncAvailable guard (skip when CDN sync handles orphan detection)
 * - codeKeys guard (skip when no code analysis data)
 * - Bound namespace coverage (useTranslations("ns") covers all ns.* keys)
 * - Dynamic pattern coverage (template literals like `pricing.${x}` cover variants)
 * - Diagnostic shape verification
 * - Combined scenarios (all mechanisms together)
 */

import { describe, expect, it } from "bun:test";
import type { Issue } from "../../../analyzer/types.js";
import type { HealthRuleContext } from "../../registry.js";
import { orphanKeysRule } from "../orphan-keys.js";

// ── Test Helpers ──────────────────────────────────────────────────────

function ctx(overrides?: Partial<HealthRuleContext>): HealthRuleContext {
  return {
    sourceLocale: "en",
    targetLocales: ["tr"],
    translations: {
      en: {
        "pricing.monthly": "Monthly",
        "pricing.annual": "Annual",
        "pricing.trial": "Trial",
        "faq.general": "FAQ",
        "faq.contact": "Contact",
      },
    },
    codeKeys: new Set<string>(),
    rootDir: "/test",
    projectContext: null,
    ...overrides,
  };
}

function boundIssueHelper(namespace: string): Issue {
  return {
    file: "test.tsx",
    line: 1,
    column: 1,
    text: "",
    type: "string-variable",
    severity: "info",
    message: "",
    key: `${namespace}.key`,
    bindingType: "bound-scoped",
    namespace,
  };
}

function dynamicIssueHelper(pattern: string): Issue {
  return {
    file: "test.tsx",
    line: 1,
    column: 1,
    text: "",
    type: "string-variable",
    severity: "info",
    message: "",
    key: pattern,
    isDynamic: true,
    pattern,
  };
}

// ── syncAvailable skip ────────────────────────────────────────────────

describe("syncAvailable skip", () => {
  it("returns [] when syncAvailable is true", () => {
    const result = orphanKeysRule.run(
      ctx({
        codeKeys: new Set(["pricing.monthly"]),
        syncAvailable: true,
      }),
    );
    expect(result).toEqual([]);
  });

  it("runs normally when syncAvailable is false", () => {
    // With one codeKey referencing only pricing.monthly, the rest are orphans
    const result = orphanKeysRule.run(
      ctx({
        codeKeys: new Set(["pricing.monthly"]),
        syncAvailable: false,
      }),
    );
    expect(result.length).toBeGreaterThan(0);
  });

  it("runs normally when syncAvailable is undefined (defaults to false)", () => {
    const result = orphanKeysRule.run(
      ctx({
        codeKeys: new Set(["pricing.monthly"]),
        // syncAvailable not set
      }),
    );
    expect(result.length).toBeGreaterThan(0);
  });
});

// ── codeKeys guard ────────────────────────────────────────────────────

describe("codeKeys guard", () => {
  it("returns [] when codeKeys is empty (cannot determine orphans)", () => {
    const result = orphanKeysRule.run(ctx({ codeKeys: new Set<string>() }));
    expect(result).toEqual([]);
  });

  it("runs orphan detection when at least one codeKey is present", () => {
    const result = orphanKeysRule.run(
      ctx({ codeKeys: new Set(["pricing.monthly"]) }),
    );
    // pricing.monthly is used → 4 remaining keys are orphans
    expect(result.length).toBe(4);
    expect(result.map((d) => d.key)).not.toContain("pricing.monthly");
  });
});

// ── Bound namespace coverage ──────────────────────────────────────────

describe("bound namespace coverage", () => {
  it("covers all keys under the bound namespace (none flagged as orphan)", () => {
    const result = orphanKeysRule.run(
      ctx({
        // Needs at least 1 codeKey to activate the rule; use something outside pricing
        codeKeys: new Set(["faq.general"]),
        allIssues: [boundIssueHelper("pricing")],
      }),
    );
    const orphanKeys = result.map((d) => d.key);
    expect(orphanKeys).not.toContain("pricing.monthly");
    expect(orphanKeys).not.toContain("pricing.annual");
    expect(orphanKeys).not.toContain("pricing.trial");
  });

  it("flags keys NOT under any bound namespace as orphans", () => {
    const result = orphanKeysRule.run(
      ctx({
        codeKeys: new Set(["faq.general"]),
        allIssues: [boundIssueHelper("pricing")],
      }),
    );
    const orphanKeys = result.map((d) => d.key);
    // faq.contact is not covered by "pricing" namespace and not in codeKeys
    expect(orphanKeys).toContain("faq.contact");
  });

  it("sub-namespace covers only its own children, not siblings", () => {
    // Add a key with deeper nesting for this test
    const result = orphanKeysRule.run(
      ctx({
        translations: {
          en: {
            "pricing.plans.monthly": "Monthly",
            "pricing.plans.annual": "Annual",
            "pricing.annual": "Annual top-level",
          },
        },
        codeKeys: new Set(["pricing.annual"]),
        allIssues: [boundIssueHelper("pricing.plans")],
      }),
    );
    const orphanKeys = result.map((d) => d.key);
    // pricing.plans.* are covered by "pricing.plans" namespace
    expect(orphanKeys).not.toContain("pricing.plans.monthly");
    expect(orphanKeys).not.toContain("pricing.plans.annual");
    // pricing.annual is NOT under "pricing.plans" — but it IS in codeKeys
    expect(orphanKeys).not.toContain("pricing.annual");
  });

  it("exact key match: key === namespace is covered", () => {
    // namespace = "pricing" covers key "pricing" itself (key === ns)
    const result = orphanKeysRule.run(
      ctx({
        translations: {
          en: {
            pricing: "Pricing",
            "faq.general": "FAQ",
          },
        },
        codeKeys: new Set(["faq.general"]),
        allIssues: [boundIssueHelper("pricing")],
      }),
    );
    const orphanKeys = result.map((d) => d.key);
    expect(orphanKeys).not.toContain("pricing");
  });

  it("multiple bound namespaces cover their respective key groups", () => {
    const result = orphanKeysRule.run(
      ctx({
        // Activate with a dummy codeKey outside both namespaces
        codeKeys: new Set(["other.key"]),
        translations: {
          en: {
            "pricing.monthly": "Monthly",
            "pricing.annual": "Annual",
            "faq.general": "FAQ",
            "faq.contact": "Contact",
            "other.key": "Other",
          },
        },
        allIssues: [boundIssueHelper("pricing"), boundIssueHelper("faq")],
      }),
    );
    // Both namespaces fully covered — no orphans
    expect(result).toHaveLength(0);
  });
});

// ── Dynamic pattern coverage ──────────────────────────────────────────

describe("dynamic pattern coverage", () => {
  it("dynamic pattern pricing.${x} covers all pricing.* keys (none orphaned)", () => {
    const result = orphanKeysRule.run(
      ctx({
        codeKeys: new Set(["faq.general"]),
        allIssues: [dynamicIssueHelper("pricing.${x}")],
      }),
    );
    const orphanKeys = result.map((d) => d.key);
    expect(orphanKeys).not.toContain("pricing.monthly");
    expect(orphanKeys).not.toContain("pricing.annual");
    expect(orphanKeys).not.toContain("pricing.trial");
  });

  it("pattern that matches pricing does not protect faq keys", () => {
    const result = orphanKeysRule.run(
      ctx({
        codeKeys: new Set(["faq.general"]),
        allIssues: [dynamicIssueHelper("pricing.${x}")],
      }),
    );
    const orphanKeys = result.map((d) => d.key);
    // faq.contact is not covered by the pricing pattern and not in codeKeys
    expect(orphanKeys).toContain("faq.contact");
  });

  it("issue with isDynamic: false is NOT treated as a pattern", () => {
    const nonDynamicIssue: Issue = {
      file: "test.tsx",
      line: 1,
      column: 1,
      text: "",
      type: "string-variable",
      severity: "info",
      message: "",
      key: "pricing.${x}",
      isDynamic: false,
      pattern: "pricing.${x}",
    };
    const result = orphanKeysRule.run(
      ctx({
        codeKeys: new Set(["faq.general"]),
        allIssues: [nonDynamicIssue],
      }),
    );
    const orphanKeys = result.map((d) => d.key);
    // Non-dynamic issue should NOT protect pricing keys
    expect(orphanKeys).toContain("pricing.monthly");
    expect(orphanKeys).toContain("pricing.annual");
    expect(orphanKeys).toContain("pricing.trial");
  });

  it("multiple disjoint patterns cover their respective key sets", () => {
    const result = orphanKeysRule.run(
      ctx({
        // No explicit codeKeys — activate via dummy
        codeKeys: new Set(["other.key"]),
        translations: {
          en: {
            "pricing.monthly": "Monthly",
            "pricing.annual": "Annual",
            "faq.general": "FAQ",
            "faq.contact": "Contact",
            "other.key": "Other",
          },
        },
        allIssues: [
          dynamicIssueHelper("pricing.${x}"),
          dynamicIssueHelper("faq.${x}"),
        ],
      }),
    );
    // All keys covered by patterns or codeKeys — no orphans
    expect(result).toHaveLength(0);
  });

  it("pattern with no matching keys produces no crash and no false coverage", () => {
    const result = orphanKeysRule.run(
      ctx({
        codeKeys: new Set(["faq.general"]),
        allIssues: [dynamicIssueHelper("nonexistent.${x}")],
      }),
    );
    // Pattern matched nothing — pricing keys are still orphans
    const orphanKeys = result.map((d) => d.key);
    expect(orphanKeys).toContain("pricing.monthly");
    expect(orphanKeys).toContain("pricing.annual");
    expect(orphanKeys).toContain("pricing.trial");
  });
});

// ── Diagnostic shape ──────────────────────────────────────────────────

describe("diagnostic shape", () => {
  it("produces diagnostics with correct rule, severity, and category", () => {
    const result = orphanKeysRule.run(
      ctx({ codeKeys: new Set(["faq.general"]) }),
    );
    expect(result.length).toBeGreaterThan(0);

    for (const d of result) {
      expect(d.rule).toBe("orphan-keys");
      expect(d.severity).toBe("warning");
      expect(d.category).toBe("Performance");
      expect(d.help).toBeTruthy();
    }
  });

  it("sets key and namespace correctly on each diagnostic", () => {
    const result = orphanKeysRule.run(
      ctx({ codeKeys: new Set(["faq.general"]) }),
    );

    const monthlyDiag = result.find((d) => d.key === "pricing.monthly");
    expect(monthlyDiag).toBeDefined();
    expect(monthlyDiag!.namespace).toBe("pricing");

    const contactDiag = result.find((d) => d.key === "faq.contact");
    expect(contactDiag).toBeDefined();
    expect(contactDiag!.namespace).toBe("faq");
  });

  it("uses localeFilePaths when provided", () => {
    const result = orphanKeysRule.run(
      ctx({
        codeKeys: new Set(["faq.general"]),
        localeFilePaths: { en: "src/locales/en.json" },
      }),
    );
    expect(result.length).toBeGreaterThan(0);
    for (const d of result) {
      expect(d.filePath).toBe("src/locales/en.json");
    }
  });

  it("falls back to {sourceLocale}.json when localeFilePaths is not provided", () => {
    const result = orphanKeysRule.run(
      ctx({ codeKeys: new Set(["faq.general"]) }),
    );
    expect(result.length).toBeGreaterThan(0);
    for (const d of result) {
      expect(d.filePath).toBe("en.json");
    }
  });
});

// ── Combined scenarios ────────────────────────────────────────────────

describe("combined scenarios", () => {
  it("codeKeys + bound namespace + dynamic pattern together leave only truly unused keys as orphans", () => {
    // Setup:
    //   - codeKeys covers: "faq.general"
    //   - bound namespace "pricing" covers: pricing.monthly, pricing.annual
    //   - dynamic pattern "faq.${x}" covers: faq.contact (and faq.general already in codeKeys)
    //   - "pricing.trial" is not in codeKeys, not under bound ns, not matched by pattern
    //     → BUT pricing is bound, so pricing.trial IS covered by bound ns
    // After applying all three: all keys covered → 0 orphans
    const result = orphanKeysRule.run(
      ctx({
        codeKeys: new Set(["faq.general"]),
        allIssues: [boundIssueHelper("pricing"), dynamicIssueHelper("faq.${x}")],
      }),
    );
    expect(result).toHaveLength(0);
  });

  it("partial coverage still flags uncovered keys", () => {
    // Only faq.general in codeKeys, only "pricing" bound → faq.contact is orphan
    const result = orphanKeysRule.run(
      ctx({
        codeKeys: new Set(["faq.general"]),
        allIssues: [boundIssueHelper("pricing")],
      }),
    );
    const orphanKeys = result.map((d) => d.key);
    expect(orphanKeys).toContain("faq.contact");
    expect(orphanKeys).not.toContain("faq.general"); // in codeKeys
    expect(orphanKeys).not.toContain("pricing.monthly"); // bound ns
    expect(orphanKeys).not.toContain("pricing.annual"); // bound ns
    expect(orphanKeys).not.toContain("pricing.trial"); // bound ns
  });

  it("no false positives — all three mechanisms combined leave 0 orphans", () => {
    const result = orphanKeysRule.run(
      ctx({
        translations: {
          en: {
            "pricing.monthly": "Monthly",
            "pricing.annual": "Annual",
            "pricing.trial": "Trial",
            "faq.general": "FAQ",
            "faq.contact": "Contact",
            "nav.home": "Home",
            "nav.about": "About",
          },
        },
        // codeKeys covers nav.*
        codeKeys: new Set(["nav.home", "nav.about"]),
        allIssues: [
          // bound ns covers pricing.*
          boundIssueHelper("pricing"),
          // dynamic pattern covers faq.*
          dynamicIssueHelper("faq.${section}"),
        ],
      }),
    );
    expect(result).toHaveLength(0);
  });

  it("syncAvailable overrides all other options and always returns []", () => {
    // Even if there are real orphans and no codeKeys guard, syncAvailable wins
    const result = orphanKeysRule.run(
      ctx({
        codeKeys: new Set(["faq.general"]),
        allIssues: [],
        syncAvailable: true,
      }),
    );
    expect(result).toEqual([]);
  });
});
