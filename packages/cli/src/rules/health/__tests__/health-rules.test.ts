/**
 * Health Rules — Unit Tests
 *
 * Tests the core 3 health rules using fixture locale files with
 * intentional violations. Each fixture file contains specific patterns
 * designed to trigger diagnostics.
 *
 * Fixture inventory (see fixtures/ for actual files):
 *   en.json — Source locale (13 keys, 2 orphans, 4 placeholders)
 *   tr.json — Missing: common.cancel, common.delete, auth.login.forgot, auth.register.*
 *             Placeholder issues: dashboard.welcome ({name} missing), dashboard.stats (%d missing)
 *   de.json — Heavy missing coverage, extra placeholder {extra} in dashboard.items
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "bun:test";
import { flattenToRecord } from "../../../utils/json-keys.js";
import type { HealthRuleContext, I18nDiagnostic } from "../../registry.js";
import { missingTranslationsRule } from "../missing-translations.js";
import { orphanKeysRule } from "../orphan-keys.js";
import {
  extractPlaceholders,
  placeholderMismatchRule,
} from "../placeholder-mismatch.js";

// ── Test Helpers ─────────────────────────────────────────────────────

const FIXTURES_DIR = resolve(import.meta.dir, "fixtures");

function loadFixture(locale: string): Record<string, string> {
  const raw = JSON.parse(
    readFileSync(resolve(FIXTURES_DIR, `${locale}.json`), "utf-8"),
  );
  return flattenToRecord(raw);
}

/**
 * Build a HealthRuleContext from fixture files.
 * codeKeys defaults to all source keys minus the "orphan.*" keys.
 */
function buildContext(
  overrides?: Partial<HealthRuleContext>,
): HealthRuleContext {
  const en = loadFixture("en");
  const tr = loadFixture("tr");
  const de = loadFixture("de");

  // Simulate code keys — all source keys except orphan.* (which are unused in code)
  const codeKeys = new Set(
    Object.keys(en).filter((k) => !k.startsWith("orphan.")),
  );

  return {
    sourceLocale: "en",
    targetLocales: ["tr", "de"],
    translations: { en, tr, de },
    codeKeys,
    rootDir: FIXTURES_DIR,
    projectContext: null,
    ...overrides,
  };
}

/** Count diagnostics by rule */
function countByRule(
  diagnostics: I18nDiagnostic[],
  rule: string,
): number {
  return diagnostics.filter((d) => d.rule === rule).length;
}

/** Get diagnostics for a specific language */
function forLanguage(
  diagnostics: I18nDiagnostic[],
  lang: string,
): I18nDiagnostic[] {
  return diagnostics.filter((d) => d.language === lang);
}

// ── missing-translations ─────────────────────────────────────────────

describe("missing-translations", () => {
  it("detects keys missing in Turkish", () => {
    const ctx = buildContext();
    const diagnostics = missingTranslationsRule.run(ctx);
    const trDiags = forLanguage(diagnostics, "tr");

    // tr.json is missing: common.cancel, common.delete, auth.login.forgot,
    // and all orphan.* keys (which are in source but not in tr)
    expect(trDiags.length).toBeGreaterThan(0);

    const missingKeys = trDiags.map((d) => d.key);
    expect(missingKeys).toContain("common.cancel");
    expect(missingKeys).toContain("common.delete");
    expect(missingKeys).toContain("auth.login.forgot");
  });

  it("detects keys missing in German", () => {
    const ctx = buildContext();
    const diagnostics = missingTranslationsRule.run(ctx);
    const deDiags = forLanguage(diagnostics, "de");

    // de.json is missing many keys
    expect(deDiags.length).toBeGreaterThan(0);

    const missingKeys = deDiags.map((d) => d.key);
    expect(missingKeys).toContain("common.description");
    expect(missingKeys).toContain("common.delete");
    expect(missingKeys).toContain("auth.login.button");
    expect(missingKeys).toContain("auth.register.title");
  });

  it("returns empty for empty target locales", () => {
    const ctx = buildContext({ targetLocales: [] });
    const diagnostics = missingTranslationsRule.run(ctx);
    expect(diagnostics).toHaveLength(0);
  });

  it("returns empty when source locale has no translations", () => {
    const ctx = buildContext({
      translations: { en: {}, tr: { "common.title": "Merhaba" } },
    });
    const diagnostics = missingTranslationsRule.run(ctx);
    expect(diagnostics).toHaveLength(0);
  });

  it("sets correct severity and category", () => {
    const ctx = buildContext();
    const diagnostics = missingTranslationsRule.run(ctx);
    expect(diagnostics.length).toBeGreaterThan(0);

    for (const d of diagnostics) {
      expect(d.severity).toBe("error");
      expect(d.category).toBe("Coverage");
      expect(d.rule).toBe("missing-translations");
      expect(d.help).toBeTruthy();
    }
  });
});

// ── orphan-keys ──────────────────────────────────────────────────────

describe("orphan-keys", () => {
  it("detects orphan keys not used in code", () => {
    const ctx = buildContext();
    const diagnostics = orphanKeysRule.run(ctx);

    const orphanKeyNames = diagnostics.map((d) => d.key);
    expect(orphanKeyNames).toContain("orphan.unused_key");
    expect(orphanKeyNames).toContain("orphan.another_unused");
  });

  it("does not flag keys that are used in code", () => {
    const ctx = buildContext();
    const diagnostics = orphanKeysRule.run(ctx);

    const orphanKeyNames = diagnostics.map((d) => d.key);
    expect(orphanKeyNames).not.toContain("common.title");
    expect(orphanKeyNames).not.toContain("auth.login.title");
  });

  it("returns empty when codeKeys is empty (can't determine orphans)", () => {
    const ctx = buildContext({ codeKeys: new Set<string>() });
    const diagnostics = orphanKeysRule.run(ctx);
    expect(diagnostics).toHaveLength(0);
  });

  it("sets correct severity and category", () => {
    const ctx = buildContext();
    const diagnostics = orphanKeysRule.run(ctx);
    expect(diagnostics.length).toBeGreaterThan(0);

    for (const d of diagnostics) {
      expect(d.severity).toBe("warning");
      expect(d.category).toBe("Performance");
      expect(d.rule).toBe("orphan-keys");
    }
  });
});

// ── placeholder-mismatch ─────────────────────────────────────────────

describe("placeholder-mismatch", () => {
  it("detects missing {name} in Turkish dashboard.welcome", () => {
    const ctx = buildContext();
    const diagnostics = placeholderMismatchRule.run(ctx);
    const trDiags = forLanguage(diagnostics, "tr");

    // tr dashboard.welcome = "Merhaba!" — missing {name}
    const welcomeIssues = trDiags.filter(
      (d) => d.key === "dashboard.welcome",
    );
    expect(welcomeIssues.length).toBeGreaterThan(0);
    expect(welcomeIssues[0].message).toContain("{name}");
    expect(welcomeIssues[0].severity).toBe("error");
  });

  it("detects missing %d in Turkish dashboard.stats", () => {
    const ctx = buildContext();
    const diagnostics = placeholderMismatchRule.run(ctx);
    const trDiags = forLanguage(diagnostics, "tr");

    // tr dashboard.stats = "Toplam: items, Ortalama: %s" — missing %d
    const statsIssues = trDiags.filter(
      (d) => d.key === "dashboard.stats" && d.severity === "error",
    );
    expect(statsIssues.length).toBeGreaterThan(0);
    expect(statsIssues[0].message).toContain("%d");
  });

  it("detects extra {extra} in German dashboard.items", () => {
    const ctx = buildContext();
    const diagnostics = placeholderMismatchRule.run(ctx);
    const deDiags = forLanguage(diagnostics, "de");

    // de dashboard.items = "{count} Artikel und {extra} mehr" — {extra} not in source
    const itemsIssues = deDiags.filter(
      (d) =>
        d.key === "dashboard.items" && d.message.includes("{extra}"),
    );
    expect(itemsIssues.length).toBeGreaterThan(0);
    expect(itemsIssues[0].severity).toBe("warning"); // extra = warning
  });

  it("does not flag matching placeholders", () => {
    const ctx = buildContext();
    const diagnostics = placeholderMismatchRule.run(ctx);

    // tr dashboard.items = "{count} öğeniz var" — {count} matches source
    // tr dashboard.lastLogin = "Son giriş: {{date}}" — {{date}} matches source
    const trDiags = forLanguage(diagnostics, "tr");
    const itemsIssues = trDiags.filter(
      (d) => d.key === "dashboard.items",
    );
    expect(itemsIssues).toHaveLength(0);

    const lastLoginIssues = trDiags.filter(
      (d) => d.key === "dashboard.lastLogin",
    );
    expect(lastLoginIssues).toHaveLength(0);
  });

  it("skips keys missing in target (handled by missing-translations)", () => {
    const ctx = buildContext();
    const diagnostics = placeholderMismatchRule.run(ctx);

    // common.cancel is missing in tr — should NOT produce placeholder diagnostic
    const cancelIssues = diagnostics.filter(
      (d) => d.key === "common.cancel",
    );
    expect(cancelIssues).toHaveLength(0);
  });

  it("sets correct category", () => {
    const ctx = buildContext();
    const diagnostics = placeholderMismatchRule.run(ctx);
    expect(diagnostics.length).toBeGreaterThan(0);

    for (const d of diagnostics) {
      expect(d.category).toBe("Quality");
      expect(d.rule).toBe("placeholder-mismatch");
    }
  });
});

// ── extractPlaceholders (unit) ───────────────────────────────────────

describe("extractPlaceholders", () => {
  it("extracts ICU placeholders", () => {
    expect(extractPlaceholders("Hello, {name}!")).toEqual(["{name}"]);
    expect(extractPlaceholders("{count} items")).toEqual(["{count}"]);
  });

  it("extracts Handlebars placeholders", () => {
    expect(extractPlaceholders("Hello, {{name}}!")).toEqual(["{{name}}"]);
  });

  it("extracts indexed placeholders", () => {
    expect(extractPlaceholders("{0} and {1}")).toEqual(["{0}", "{1}"]);
  });

  it("extracts printf placeholders", () => {
    expect(extractPlaceholders("Total: %d, Avg: %s")).toEqual(["%d", "%s"]);
  });

  it("extracts positional printf", () => {
    expect(extractPlaceholders("%1$s said %2$d")).toEqual(["%1$s", "%2$d"]);
  });

  it("handles mixed formats", () => {
    const result = extractPlaceholders("Hello {name}, you have %d items");
    expect(result).toContain("{name}");
    expect(result).toContain("%d");
  });

  it("returns empty for plain text", () => {
    expect(extractPlaceholders("Hello World")).toEqual([]);
  });

  it("does not double-count nested formats", () => {
    // {{name}} should be extracted as Handlebars, not also as {name}
    const result = extractPlaceholders("{{name}} and {count}");
    expect(result).toEqual(["{{name}}", "{count}"]);
  });
});
