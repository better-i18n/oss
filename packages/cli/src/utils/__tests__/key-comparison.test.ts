import { describe, it, expect } from "bun:test";
import { getSummary, groupKeysByNamespace } from "../key-comparison.js";
import type { Issue } from "../../analyzer/types.js";

// ---------------------------------------------------------------------------
// Helper factories
// ---------------------------------------------------------------------------

function issue(key: string, opts?: Partial<Issue>): Issue {
  return {
    file: "test.tsx",
    line: 1,
    column: 1,
    text: "",
    type: "string-variable",
    severity: "info",
    message: "",
    key,
    ...opts,
  };
}

function boundIssue(key: string, namespace: string): Issue {
  return issue(key, { bindingType: "bound-scoped", namespace });
}

function dynamicIssue(pattern: string): Issue {
  return issue(pattern, { isDynamic: true, pattern });
}

function unknownIssue(key: string): Issue {
  return issue(key, { bindingType: "unknown-scoped" });
}



// ---------------------------------------------------------------------------
// 1. Basic missing / unused
// ---------------------------------------------------------------------------

describe("getSummary - basic missing/unused", () => {
  it("returns all zeros for empty issues and empty remote", () => {
    const result = getSummary([], {});

    expect(result.localTotal).toBe(0);
    expect(result.remoteTotal).toBe(0);
    expect(result.intersectionCount).toBe(0);
    expect(result.allLocal.size).toBe(0);
    expect(result.allRemoteLeaves.size).toBe(0);
    expect(Object.keys(result.missing)).toHaveLength(0);
    expect(Object.keys(result.unused)).toHaveLength(0);
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("key in issues but not in remote goes to missing", () => {
    const result = getSummary([issue("common.title")], {});

    expect(result.missing["common"]).toBeDefined();
    expect(result.missing["common"].map((e) => e.key)).toContain("common.title");
    expect(result.intersectionCount).toBe(0);
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("key in remote but not in issues goes to unused", () => {
    const result = getSummary([], { common: { title: "Hello" } });

    expect(result.unused["common"]).toBeDefined();
    expect(result.unused["common"]).toContain("common.title");
    expect(result.intersectionCount).toBe(0);
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("key in both issues and remote goes to intersection", () => {
    const result = getSummary(
      [issue("common.title")],
      { common: { title: "Hello" } },
    );

    expect(result.intersectionCount).toBe(1);
    expect(Object.keys(result.missing)).toHaveLength(0);
    expect(Object.keys(result.unused)).toHaveLength(0);
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("groups missing/unused by first dot segment as namespace", () => {
    const result = getSummary(
      [issue("auth.login.title"), issue("auth.login.subtitle")],
      { common: { cta: "Click" } },
    );

    expect(result.missing["auth"]).toBeDefined();
    expect(result.unused["common"]).toBeDefined();
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("calculates 100% coverage when local and remote match exactly", () => {
    const result = getSummary(
      [issue("common.title"), issue("common.desc")],
      { common: { title: "Title", desc: "Desc" } },
    );

    expect(result.localCoverage).toBe(100);
    expect(result.remoteCoverage).toBe(100);
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("calculates 0% remote coverage when no local keys match remote", () => {
    const result = getSummary(
      [issue("common.missing")],
      { common: { title: "Title" } },
    );

    expect(result.remoteCoverage).toBe(0);
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("returns 100% coverage for empty local when remote is also empty", () => {
    const result = getSummary([], {});

    expect(result.localCoverage).toBe(100);
    expect(result.remoteCoverage).toBe(100);
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("partial match: some local keys match, some do not", () => {
    const result = getSummary(
      [issue("common.title"), issue("common.missing")],
      { common: { title: "Title", extra: "Extra" } },
    );

    expect(result.intersectionCount).toBe(1);
    expect(result.missing["common"].map((e) => e.key)).toContain("common.missing");
    expect(result.unused["common"]).toContain("common.extra");
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("localTotal matches allLocal.size", () => {
    const result = getSummary(
      [issue("common.a"), issue("common.b"), issue("auth.login")],
      { common: { a: "A", b: "B" }, auth: { login: "Login" } },
    );

    expect(result.localTotal).toBe(result.allLocal.size);
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 2. Bound namespace expansion
// ---------------------------------------------------------------------------

describe("getSummary - bound namespace expansion", () => {
  it("bound namespace marks all prefix children as used", () => {
    const remote = {
      pricing: {
        title: "Pricing",
        subtitle: "Plans",
        cta: "Get Started",
      },
    };

    const result = getSummary([boundIssue("pricing.title", "pricing")], remote);

    // All three pricing.* keys should be marked as used → none in unused
    expect(Object.keys(result.unused)).toHaveLength(0);
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("prefix boundary: pricing does not cover pricingV2 keys", () => {
    const remote = {
      pricing: { title: "Pricing" },
      pricingV2: { title: "Pricing V2" },
    };

    const result = getSummary(
      [boundIssue("pricing.title", "pricing")],
      remote,
    );

    // pricingV2 keys should remain unused
    expect(result.unused["pricingV2"]).toBeDefined();
    expect(result.unused["pricingV2"]).toContain("pricingV2.title");
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("sub-namespace binding: auth.login covers only auth.login.* children", () => {
    const remote = {
      auth: {
        login: { title: "Login", subtitle: "Sign in" },
        register: { title: "Register" },
      },
    };

    const result = getSummary(
      [boundIssue("auth.login.title", "auth.login")],
      remote,
    );

    // auth.register.title should remain unused
    expect(result.unused["auth"]).toBeDefined();
    expect(result.unused["auth"]).toContain("auth.register.title");
    // auth.login keys should be used
    expect(result.unused["auth"]).not.toContain("auth.login.title");
    expect(result.unused["auth"]).not.toContain("auth.login.subtitle");
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("non-existent bound namespace does not crash", () => {
    const result = getSummary(
      [boundIssue("ghost.key", "ghost")],
      { common: { title: "Title" } },
    );

    // ghost namespace doesn't exist — should not throw, just no expansion
    expect(result.unused["common"]).toContain("common.title");
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("multiple bound namespaces each expand their own children", () => {
    const remote = {
      pricing: { title: "Pricing", cta: "Buy" },
      auth: { title: "Auth", login: "Login" },
    };

    const result = getSummary(
      [
        boundIssue("pricing.title", "pricing"),
        boundIssue("auth.title", "auth"),
      ],
      remote,
    );

    expect(Object.keys(result.unused)).toHaveLength(0);
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("bound namespace with deeply nested children marks all leaves as used", () => {
    const remote = {
      dashboard: {
        overview: {
          title: "Overview",
          stats: { users: "Users", revenue: "Revenue" },
        },
      },
    };

    const result = getSummary(
      [boundIssue("dashboard.overview.title", "dashboard")],
      remote,
    );

    expect(Object.keys(result.unused)).toHaveLength(0);
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("bound namespace does not produce false missing entries", () => {
    const remote = {
      nav: { home: "Home", about: "About" },
    };

    const result = getSummary(
      [boundIssue("nav.home", "nav")],
      remote,
    );

    expect(Object.keys(result.missing)).toHaveLength(0);
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("bound namespace intersects correctly — keys appear in intersection", () => {
    const remote = {
      pricing: { monthly: "Monthly", yearly: "Yearly" },
    };

    const result = getSummary(
      [boundIssue("pricing.monthly", "pricing")],
      remote,
    );

    expect(result.intersectionCount).toBe(2);
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 3. Container access detection
// ---------------------------------------------------------------------------

describe("getSummary - container access detection", () => {
  it("local key pointing to a remote container marks all its leaf children as used", () => {
    const remote = {
      menu: {
        items: {
          home: "Home",
          about: "About",
          contact: "Contact",
        },
      },
    };

    const result = getSummary([issue("menu.items")], remote);

    // All children of menu.items should be marked as used
    expect(Object.keys(result.unused)).toHaveLength(0);
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("container key expansion does not add the container itself as a leaf", () => {
    const remote = {
      nav: {
        links: { home: "Home", about: "About" },
      },
    };

    const result = getSummary([issue("nav.links")], remote);

    // nav.links is a container, not a leaf — should not appear in allRemoteLeaves
    expect(result.allRemoteLeaves.has("nav.links")).toBe(false);
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("leaf key is not falsely expanded as container", () => {
    const remote = {
      common: { title: "Title", subtitle: "Subtitle" },
    };

    const result = getSummary([issue("common.title")], remote);

    // Only common.title should be marked as used, not common.subtitle
    expect(result.unused["common"]).toContain("common.subtitle");
    expect(result.unused["common"]).not.toContain("common.title");
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("container access with siblings: only the accessed container's children are expanded", () => {
    const remote = {
      forms: {
        login: { label: "Email", placeholder: "Enter email" },
        register: { label: "Name", placeholder: "Enter name" },
      },
    };

    const result = getSummary([issue("forms.login")], remote);

    // forms.register children should remain unused
    expect(result.unused["forms"]).toContain("forms.register.label");
    expect(result.unused["forms"]).toContain("forms.register.placeholder");
    expect(result.unused["forms"]).not.toContain("forms.login.label");
    expect(result.unused["forms"]).not.toContain("forms.login.placeholder");
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("top-level container access marks all descendants as used", () => {
    const remote = {
      errors: {
        network: { timeout: "Timeout", offline: "Offline" },
        validation: { required: "Required", invalid: "Invalid" },
      },
    };

    // Accessing 'errors' itself (the top-level container)
    const result = getSummary([issue("errors")], remote);

    expect(Object.keys(result.unused)).toHaveLength(0);
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 4. Fuzzy suffix matching (unknown-scoped)
// ---------------------------------------------------------------------------

describe("getSummary - fuzzy suffix matching (unknown-scoped)", () => {
  it("partial key matching unique suffix resolves to that remote key", () => {
    const remote = { common: { title: "Title" } };

    const result = getSummary([unknownIssue("title")], remote);

    // 'title' should fuzzy-match 'common.title' and be counted as used
    expect(Object.keys(result.unused)).toHaveLength(0);
    expect(result.intersectionCount).toBe(1);
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("ambiguous partial key matching multiple remote keys adds all matches as used", () => {
    const remote = {
      common: { title: "Common Title" },
      auth: { title: "Auth Title" },
    };

    const result = getSummary([unknownIssue("title")], remote);

    // 'title' matches both 'common.title' and 'auth.title' — both should be used
    expect(Object.keys(result.unused)).toHaveLength(0);
    expect(result.intersectionCount).toBe(2);
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("dot boundary: 'title' must NOT match 'subtitle'", () => {
    const remote = { common: { subtitle: "Subtitle" } };

    const result = getSummary([unknownIssue("title")], remote);

    // 'title' should NOT match 'common.subtitle' — boundary check
    expect(result.unused["common"]).toContain("common.subtitle");
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("dotted partial key: 'login.title' resolves to 'auth.login.title'", () => {
    const remote = { auth: { login: { title: "Login Title" } } };

    const result = getSummary([unknownIssue("login.title")], remote);

    expect(Object.keys(result.unused)).toHaveLength(0);
    expect(result.intersectionCount).toBe(1);
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("partial key with no remote match remains in allLocal (not crashed)", () => {
    const remote = { common: { title: "Title" } };

    const result = getSummary([unknownIssue("completely.unknown")], remote);

    // No match, but it should still be in allLocal (added as-is)
    expect(result.allLocal.has("completely.unknown")).toBe(true);
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("mixed: fully-qualified key and unknown-scoped key work together", () => {
    const remote = {
      common: { title: "Title", desc: "Desc" },
      auth: { login: "Login" },
    };

    const result = getSummary(
      [issue("common.title"), unknownIssue("login")],
      remote,
    );

    // common.title fully qualified, 'login' fuzzy-matches 'auth.login'
    expect(result.intersectionCount).toBe(2);
    expect(result.unused["common"]).toContain("common.desc");
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("unknown-scoped key that exactly matches a remote leaf is used", () => {
    const remote = { pricing: { cta: "Get Started" } };

    const result = getSummary([unknownIssue("pricing.cta")], remote);

    expect(Object.keys(result.unused)).toHaveLength(0);
    expect(result.intersectionCount).toBe(1);
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 5. Dynamic pattern matching (regression tests)
// ---------------------------------------------------------------------------

describe("getSummary - dynamic pattern matching", () => {
  it("plans.${x}.name matches plans.free.name and plans.pro.name — not in unused", () => {
    const remote = {
      plans: {
        free: { name: "Free", price: "$0" },
        pro: { name: "Pro", price: "$10" },
      },
    };

    const result = getSummary([dynamicIssue("plans.${x}.name")], remote);

    // plans.free.name and plans.pro.name should not be in unused
    expect(result.unused["plans"]).not.toContain("plans.free.name");
    expect(result.unused["plans"]).not.toContain("plans.pro.name");
    // But plans.free.price and plans.pro.price should still be unused
    expect(result.unused["plans"]).toContain("plans.free.price");
    expect(result.unused["plans"]).toContain("plans.pro.price");
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("unmatched dynamic pattern does not remove anything from unused", () => {
    const remote = { common: { title: "Title" } };

    const result = getSummary([dynamicIssue("plans.${x}.name")], remote);

    expect(result.unused["common"]).toContain("common.title");
    expect(result.dynamicPatternMatches).toHaveLength(0);
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("dynamicPatternMatches is correctly populated with matched keys", () => {
    const remote = {
      status: {
        active: { label: "Active" },
        inactive: { label: "Inactive" },
      },
    };

    const result = getSummary([dynamicIssue("status.${s}.label")], remote);

    expect(result.dynamicPatternMatches).toHaveLength(1);
    const match = result.dynamicPatternMatches[0];
    expect(match.pattern).toBe("status.${s}.label");
    expect(match.matchedKeys).toContain("status.active.label");
    expect(match.matchedKeys).toContain("status.inactive.label");
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("dynamic key itself is NOT added to missing", () => {
    const remote = {
      plans: { free: { name: "Free" }, pro: { name: "Pro" } },
    };

    const result = getSummary([dynamicIssue("plans.${x}.name")], remote);

    const allMissingKeys = Object.values(result.missing).flatMap((entries) =>
      entries.map((e) => e.key),
    );
    expect(allMissingKeys).not.toContain("plans.${x}.name");
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("multiple dynamic patterns work independently", () => {
    const remote = {
      plans: {
        free: { name: "Free" },
        pro: { name: "Pro" },
      },
      status: {
        active: { badge: "Active" },
        inactive: { badge: "Inactive" },
      },
    };

    const result = getSummary(
      [
        dynamicIssue("plans.${x}.name"),
        dynamicIssue("status.${s}.badge"),
      ],
      remote,
    );

    expect(Object.keys(result.unused)).toHaveLength(0);
    expect(result.dynamicPatternMatches).toHaveLength(2);
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("dynamically matched keys appear in intersection, not unused", () => {
    const remote = {
      tier: {
        starter: { title: "Starter" },
        growth: { title: "Growth" },
      },
    };

    const result = getSummary([dynamicIssue("tier.${t}.title")], remote);

    expect(result.intersectionCount).toBe(2);
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("dynamic pattern matched keys go to dynamicReviewRequired when not in allLocal before match", () => {
    // Keys matched solely by dynamic pattern appear in dynamicPatternMatches
    // but also get added to allLocal, so they appear in intersection
    const remote = {
      workflow: {
        steps: {
          first: { title: "First" },
          second: { title: "Second" },
        },
      },
    };

    const result = getSummary(
      [dynamicIssue("workflow.steps.${step}.title")],
      remote,
    );

    expect(result.dynamicPatternMatches).toHaveLength(1);
    expect(result.dynamicPatternMatches[0].matchedKeys).toHaveLength(2);
    // These get added to allLocal via the dynamic match path
    expect(result.allLocal.has("workflow.steps.first.title")).toBe(true);
    expect(result.allLocal.has("workflow.steps.second.title")).toBe(true);
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("dynamic pattern + static key: coverage adds up correctly", () => {
    const remote = {
      plans: { free: { name: "Free" }, pro: { name: "Pro" } },
      common: { title: "Title" },
    };

    const result = getSummary(
      [issue("common.title"), dynamicIssue("plans.${x}.name")],
      remote,
    );

    expect(result.intersectionCount).toBe(3);
    expect(Object.keys(result.unused)).toHaveLength(0);
    expect(result.localCoverage).toBe(100);
    expect(result.remoteCoverage).toBe(100);
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("dynamic pattern with no suffix matches all children under prefix", () => {
    const remote = {
      icons: { home: "home-icon", user: "user-icon", settings: "settings-icon" },
    };

    const result = getSummary([dynamicIssue("icons.${name}")], remote);

    expect(result.unused["icons"]).toBeUndefined();
    expect(result.dynamicPatternMatches).toHaveLength(1);
    expect(result.dynamicPatternMatches[0].matchedKeys).toHaveLength(3);
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 6. Invariants
// ---------------------------------------------------------------------------

describe("getSummary - invariants", () => {
  it("local invariant: localTotal === intersectionCount + missing count (all local keys match remote)", () => {
    const result = getSummary(
      [issue("common.title"), issue("common.desc")],
      { common: { title: "T", desc: "D" } },
    );

    const missingCount = Object.values(result.missing).reduce(
      (sum, arr) => sum + arr.length,
      0,
    );
    expect(result.localTotal).toBe(result.intersectionCount + missingCount);
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("local invariant: localTotal === intersectionCount + missing count (no local keys match remote)", () => {
    const result = getSummary(
      [issue("common.title")],
      { common: { other: "Other" } },
    );

    const missingCount = Object.values(result.missing).reduce(
      (sum, arr) => sum + arr.length,
      0,
    );
    expect(result.localTotal).toBe(result.intersectionCount + missingCount);
    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("remote invariant: remoteTotal === intersectionCount + unused + dynamicReview (all remote keys used)", () => {
    const result = getSummary(
      [issue("common.title"), issue("common.desc")],
      { common: { title: "T", desc: "D" } },
    );

    const unusedCount = Object.values(result.unused).reduce(
      (sum, arr) => sum + arr.length,
      0,
    );
    const dynamicCount = Object.values(result.dynamicReviewRequired).reduce(
      (sum, arr) => sum + arr.length,
      0,
    );
    expect(result.remoteTotal).toBe(
      result.intersectionCount + unusedCount + dynamicCount,
    );
    expect(result.invariants.remote).toBe(true);
  });

  it("remote invariant: remoteTotal === intersectionCount + unused + dynamicReview (no remote keys used)", () => {
    const result = getSummary(
      [],
      { common: { title: "T", desc: "D", cta: "CTA" } },
    );

    const unusedCount = Object.values(result.unused).reduce(
      (sum, arr) => sum + arr.length,
      0,
    );
    const dynamicCount = Object.values(result.dynamicReviewRequired).reduce(
      (sum, arr) => sum + arr.length,
      0,
    );
    expect(result.remoteTotal).toBe(
      result.intersectionCount + unusedCount + dynamicCount,
    );
    expect(result.invariants.remote).toBe(true);
  });

  it("invariants hold with empty issues and empty remote", () => {
    const result = getSummary([], {});

    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("invariants hold when all issues are missing (none in remote)", () => {
    const result = getSummary(
      [issue("a.b"), issue("c.d"), issue("e.f")],
      {},
    );

    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("invariants hold when all remote keys are unused", () => {
    const result = getSummary(
      [],
      { a: { b: "B" }, c: { d: "D" }, e: { f: "F" } },
    );

    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
  });

  it("invariants hold in complex combined scenario: bound + dynamic + fuzzy", () => {
    const remote = {
      nav: { home: "Home", about: "About", contact: "Contact" },
      plans: { free: { cta: "Free" }, pro: { cta: "Pro" } },
      auth: { title: "Auth", login: { label: "Login" } },
      extra: { orphan: "Orphan" },
    };

    const result = getSummary(
      [
        // bound namespace — covers all nav.*
        boundIssue("nav.home", "nav"),
        // dynamic pattern — covers plans.*.cta
        dynamicIssue("plans.${p}.cta"),
        // unknown-scoped fuzzy — matches auth.title
        unknownIssue("title"),
        // explicit key
        issue("auth.login.label"),
      ],
      remote,
    );

    expect(result.invariants.local).toBe(true);
    expect(result.invariants.remote).toBe(true);
    // extra.orphan should still be unused
    expect(result.unused["extra"]).toContain("extra.orphan");
  });
});

// ---------------------------------------------------------------------------
// 7. groupKeysByNamespace
// ---------------------------------------------------------------------------

describe("groupKeysByNamespace", () => {
  it("groups keys by first dot segment", () => {
    const result = groupKeysByNamespace([
      issue("common.title"),
      issue("common.desc"),
      issue("auth.login"),
    ]);

    expect(result["common"]).toEqual(["common.desc", "common.title"]);
    expect(result["auth"]).toEqual(["auth.login"]);
  });

  it("single-segment keys go to 'default' namespace", () => {
    const result = groupKeysByNamespace([issue("title"), issue("desc")]);

    expect(result["default"]).toBeDefined();
    expect(result["default"]).toContain("title");
    expect(result["default"]).toContain("desc");
  });

  it("returns empty object for empty issues array", () => {
    expect(groupKeysByNamespace([])).toEqual({});
  });

  it("deduplicates keys within the same namespace", () => {
    const result = groupKeysByNamespace([
      issue("common.title"),
      issue("common.title"), // duplicate
      issue("common.desc"),
    ]);

    expect(result["common"]).toHaveLength(2);
    expect(result["common"]).toEqual(["common.desc", "common.title"]);
  });

  it("issues without keys are skipped", () => {
    const noKeyIssue: Issue = {
      file: "test.tsx",
      line: 1,
      column: 1,
      text: "raw text",
      type: "jsx-text",
      severity: "warning",
      message: "Hardcoded text",
      // key intentionally omitted
    };

    const result = groupKeysByNamespace([noKeyIssue, issue("common.title")]);

    expect(result["common"]).toEqual(["common.title"]);
    expect(Object.keys(result)).toHaveLength(1);
  });

  it("deeply nested keys are grouped by first segment only", () => {
    const result = groupKeysByNamespace([
      issue("a.b.c.d"),
      issue("a.x.y"),
      issue("b.z"),
    ]);

    expect(result["a"]).toEqual(["a.b.c.d", "a.x.y"]);
    expect(result["b"]).toEqual(["b.z"]);
  });
});
