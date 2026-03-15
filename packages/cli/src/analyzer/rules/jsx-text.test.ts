/**
 * JSX Text Rule — Unit Tests
 *
 * Tests hardcoded text detection in JSX elements via analyzeSourceText.
 */

import { describe, it, expect } from "bun:test";
import { analyzeSourceText } from "../index.js";

// ── Detection ────────────────────────────────────────────────────────

describe("jsx-text rule — detection", () => {
  it("detects basic hardcoded text in a div", () => {
    const source = `export default function Page() { return <div>Hello World</div>; }`;
    const { issues } = analyzeSourceText(source, "test.tsx");
    const jsxIssues = issues.filter((i) => i.type === "jsx-text");
    expect(jsxIssues.length).toBeGreaterThan(0);
    expect(jsxIssues[0].text).toBe("Hello World");
  });

  it("detects paragraph text", () => {
    const source = `export default function Page() { return <p>Welcome to our platform</p>; }`;
    const { issues } = analyzeSourceText(source, "test.tsx");
    const jsxIssues = issues.filter((i) => i.type === "jsx-text");
    expect(jsxIssues.length).toBeGreaterThan(0);
    expect(jsxIssues[0].text).toBe("Welcome to our platform");
  });

  it("detects nested hardcoded text inside span", () => {
    const source = `export default function Page() { return <div><span>Some text here</span></div>; }`;
    const { issues } = analyzeSourceText(source, "test.tsx");
    const jsxIssues = issues.filter((i) => i.type === "jsx-text");
    expect(jsxIssues.length).toBeGreaterThan(0);
    expect(jsxIssues[0].text).toBe("Some text here");
  });
});

// ── Non-detection ─────────────────────────────────────────────────────

describe("jsx-text rule — non-detection", () => {
  it("does NOT flag short string ≤2 chars", () => {
    const source = `export default function Page() { return <div>Hi</div>; }`;
    const { issues } = analyzeSourceText(source, "test.tsx");
    const jsxIssues = issues.filter((i) => i.type === "jsx-text");
    expect(jsxIssues).toHaveLength(0);
  });

  it("does NOT flag whitespace-only content", () => {
    const source = `export default function Page() { return <div>   </div>; }`;
    const { issues } = analyzeSourceText(source, "test.tsx");
    const jsxIssues = issues.filter((i) => i.type === "jsx-text");
    expect(jsxIssues).toHaveLength(0);
  });

  it("does NOT flag SCREAMING_CASE text", () => {
    const source = `export default function Page() { return <div>HELLO_WORLD</div>; }`;
    const { issues } = analyzeSourceText(source, "test.tsx");
    const jsxIssues = issues.filter((i) => i.type === "jsx-text");
    expect(jsxIssues).toHaveLength(0);
  });

  it("does NOT flag URL text", () => {
    const source = `export default function Page() { return <div>https://example.com</div>; }`;
    const { issues } = analyzeSourceText(source, "test.tsx");
    const jsxIssues = issues.filter((i) => i.type === "jsx-text");
    expect(jsxIssues).toHaveLength(0);
  });

  it("does NOT flag path text", () => {
    const source = `export default function Page() { return <div>/api/endpoint</div>; }`;
    const { issues } = analyzeSourceText(source, "test.tsx");
    const jsxIssues = issues.filter((i) => i.type === "jsx-text");
    expect(jsxIssues).toHaveLength(0);
  });

  it("does NOT flag CSS-like lowercase-hyphen text", () => {
    const source = `export default function Page() { return <div>flex-row</div>; }`;
    const { issues } = analyzeSourceText(source, "test.tsx");
    const jsxIssues = issues.filter((i) => i.type === "jsx-text");
    expect(jsxIssues).toHaveLength(0);
  });

  it("does NOT flag number text", () => {
    const source = `export default function Page() { return <div>42</div>; }`;
    const { issues } = analyzeSourceText(source, "test.tsx");
    const jsxIssues = issues.filter((i) => i.type === "jsx-text");
    expect(jsxIssues).toHaveLength(0);
  });

  it("does NOT flag symbols-only text", () => {
    const source = `export default function Page() { return <div>→←</div>; }`;
    const { issues } = analyzeSourceText(source, "test.tsx");
    const jsxIssues = issues.filter((i) => i.type === "jsx-text");
    expect(jsxIssues).toHaveLength(0);
  });

  it("does NOT flag HTML entities", () => {
    const source = `export default function Page() { return <div>&amp;</div>; }`;
    const { issues } = analyzeSourceText(source, "test.tsx");
    const jsxIssues = issues.filter((i) => i.type === "jsx-text");
    expect(jsxIssues).toHaveLength(0);
  });
});

// ── Meta ──────────────────────────────────────────────────────────────

describe("jsx-text rule — meta", () => {
  it("respects i18n-ignore comment suppression", () => {
    const source = [
      `export default function Page() {`,
      `  return (`,
      `    // i18n-ignore`,
      `    <div>Hello World</div>`,
      `  );`,
      `}`,
    ].join("\n");
    const { issues } = analyzeSourceText(source, "test.tsx");
    const jsxIssues = issues.filter((i) => i.type === "jsx-text");
    expect(jsxIssues).toHaveLength(0);
  });

  it("reports the correct line number", () => {
    const source = [
      `export default function Page() {`,
      `  return (`,
      `    <div>Hello World</div>`,
      `  );`,
      `}`,
    ].join("\n");
    const { issues } = analyzeSourceText(source, "test.tsx");
    const jsxIssues = issues.filter((i) => i.type === "jsx-text");
    expect(jsxIssues.length).toBeGreaterThan(0);
    // The text appears on line 3
    expect(jsxIssues[0].line).toBe(3);
  });

  it("severity is 'warning'", () => {
    const source = `export default function Page() { return <div>Hello World</div>; }`;
    const { issues } = analyzeSourceText(source, "test.tsx");
    const jsxIssues = issues.filter((i) => i.type === "jsx-text");
    expect(jsxIssues.length).toBeGreaterThan(0);
    expect(jsxIssues[0].severity).toBe("warning");
  });
});
