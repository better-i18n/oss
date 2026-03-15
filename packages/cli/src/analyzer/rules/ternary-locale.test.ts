/**
 * Ternary Locale Rule — Unit Tests
 *
 * Tests detection of the anti-pattern: locale === 'en' ? 'Hello' : 'Merhaba'
 */

import { describe, it, expect } from "bun:test";
import { analyzeSourceText } from "../index.js";

// ── Detection ─────────────────────────────────────────────────────────

describe("ternary-locale rule — detection", () => {
  it("detects bare locale identifier in ternary condition", () => {
    const source = `function Page() { const x = locale === 'en' ? 'Hello' : 'Merhaba'; }`;
    const { issues } = analyzeSourceText(source, "test.tsx");
    const ternaryIssues = issues.filter((i) => i.type === "ternary-locale");
    expect(ternaryIssues.length).toBeGreaterThan(0);
  });

  it("detects property access ending in .locale (i18n.locale)", () => {
    const source = `function Page() { const x = i18n.locale === 'tr' ? 'Merhaba' : 'Hello'; }`;
    const { issues } = analyzeSourceText(source, "test.tsx");
    const ternaryIssues = issues.filter((i) => i.type === "ternary-locale");
    expect(ternaryIssues.length).toBeGreaterThan(0);
  });

  it("detects property access ending in .locale (router.locale)", () => {
    const source = `function Page() { const x = router.locale === 'en' ? 'Welcome' : 'Hoşgeldiniz'; }`;
    const { issues } = analyzeSourceText(source, "test.tsx");
    const ternaryIssues = issues.filter((i) => i.type === "ternary-locale");
    expect(ternaryIssues.length).toBeGreaterThan(0);
  });

  it("detects ternary when only whenTrue branch is a string literal", () => {
    const source = `function Page() { const x = locale === 'en' ? 'Hello' : variable; }`;
    const { issues } = analyzeSourceText(source, "test.tsx");
    const ternaryIssues = issues.filter((i) => i.type === "ternary-locale");
    expect(ternaryIssues.length).toBeGreaterThan(0);
  });
});

// ── Non-detection ──────────────────────────────────────────────────────

describe("ternary-locale rule — non-detection", () => {
  it("does NOT detect ternary not based on locale comparison", () => {
    const source = `function Page() { const x = isAdmin ? 'Admin Panel' : 'User Panel'; }`;
    const { issues } = analyzeSourceText(source, "test.tsx");
    const ternaryIssues = issues.filter((i) => i.type === "ternary-locale");
    expect(ternaryIssues).toHaveLength(0);
  });

  it("does NOT detect locale ternary with no string literal branches", () => {
    const source = `function Page() { const x = locale === 'en' ? <Admin /> : <User />; }`;
    const { issues } = analyzeSourceText(source, "test.tsx");
    const ternaryIssues = issues.filter((i) => i.type === "ternary-locale");
    expect(ternaryIssues).toHaveLength(0);
  });

  it("does NOT detect locale ternary where string branch is empty (URL construction)", () => {
    const source = `function Page() { const x = locale === 'en' ? '' : locale + '/'; }`;
    const { issues } = analyzeSourceText(source, "test.tsx");
    const ternaryIssues = issues.filter((i) => i.type === "ternary-locale");
    expect(ternaryIssues).toHaveLength(0);
  });

  it("does NOT detect ternary based on theme comparison (not locale)", () => {
    const source = `function Page() { const x = theme === 'dark' ? 'Dark Mode' : 'Light Mode'; }`;
    const { issues } = analyzeSourceText(source, "test.tsx");
    const ternaryIssues = issues.filter((i) => i.type === "ternary-locale");
    expect(ternaryIssues).toHaveLength(0);
  });
});

// ── Severity ──────────────────────────────────────────────────────────

describe("ternary-locale rule — severity", () => {
  it("reports severity as 'error' (anti-pattern, not warning)", () => {
    const source = `function Page() { const x = locale === 'en' ? 'Hello' : 'Merhaba'; }`;
    const { issues } = analyzeSourceText(source, "test.tsx");
    const ternaryIssues = issues.filter((i) => i.type === "ternary-locale");
    expect(ternaryIssues.length).toBeGreaterThan(0);
    expect(ternaryIssues[0].severity).toBe("error");
  });
});

// ── Meta ──────────────────────────────────────────────────────────────

describe("ternary-locale rule — meta", () => {
  it("reports the correct line number", () => {
    const source = [
      `function Page() {`,
      `  const label = 'unused';`,
      `  const x = locale === 'en' ? 'Hello' : 'Merhaba';`,
      `}`,
    ].join("\n");
    const { issues } = analyzeSourceText(source, "test.tsx");
    const ternaryIssues = issues.filter((i) => i.type === "ternary-locale");
    expect(ternaryIssues.length).toBeGreaterThan(0);
    expect(ternaryIssues[0].line).toBe(3);
  });
});
