/**
 * Tests for string variable detection rule
 */

import { describe, it, expect } from "bun:test";
import { analyzeSourceText } from "../index.js";

describe("checkStringVariable rule", () => {
  // --- Detection ---

  it("detects variable assigned a string with a space", () => {
    const source = `function f() { const message = "Welcome to our platform"; }`;
    const issues = analyzeSourceText(source, "test.tsx").issues.filter(
      (i) => i.type === "string-variable",
    );
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].text).toBe("Welcome to our platform");
  });

  it("detects variable assigned a phrase with a space", () => {
    const source = `function f() { const label = "Save your changes"; }`;
    const issues = analyzeSourceText(source, "test.tsx").issues.filter(
      (i) => i.type === "string-variable",
    );
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].text).toBe("Save your changes");
  });

  it("detects variable assigned a capitalised multi-word title", () => {
    const source = `function f() { const title = "Dashboard Overview"; }`;
    const issues = analyzeSourceText(source, "test.tsx").issues.filter(
      (i) => i.type === "string-variable",
    );
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].text).toBe("Dashboard Overview");
  });

  // --- Non-detection: IGNORE_PATTERNS ---

  it("does NOT detect SCREAMING_CASE constants", () => {
    const source = `function f() { const STATUS = "ACTIVE"; }`;
    const issues = analyzeSourceText(source, "test.tsx").issues.filter(
      (i) => i.type === "string-variable",
    );
    expect(issues).toHaveLength(0);
  });

  it("does NOT detect CSS-like lowercase-hyphen strings", () => {
    const source = `function f() { const cls = "flex-row"; }`;
    const issues = analyzeSourceText(source, "test.tsx").issues.filter(
      (i) => i.type === "string-variable",
    );
    expect(issues).toHaveLength(0);
  });

  it("does NOT detect URLs", () => {
    const source = `function f() { const apiUrl = "https://api.example.com"; }`;
    const issues = analyzeSourceText(source, "test.tsx").issues.filter(
      (i) => i.type === "string-variable",
    );
    expect(issues).toHaveLength(0);
  });

  it("does NOT detect file paths", () => {
    const source = `function f() { const imgPath = "/images/logo.png"; }`;
    const issues = analyzeSourceText(source, "test.tsx").issues.filter(
      (i) => i.type === "string-variable",
    );
    expect(issues).toHaveLength(0);
  });

  it("does NOT detect hex colors", () => {
    const source = `function f() { const hex = "#ff0000"; }`;
    const issues = analyzeSourceText(source, "test.tsx").issues.filter(
      (i) => i.type === "string-variable",
    );
    expect(issues).toHaveLength(0);
  });

  it("does NOT detect numbers with CSS units", () => {
    const source = `function f() { const size = "12px"; }`;
    const issues = analyzeSourceText(source, "test.tsx").issues.filter(
      (i) => i.type === "string-variable",
    );
    expect(issues).toHaveLength(0);
  });

  // --- Non-detection: IGNORE_VARIABLE_NAMES ---

  it("does NOT detect when variable name is in ignore list (id)", () => {
    const source = `function f() { const id = "My Custom Identifier"; }`;
    const issues = analyzeSourceText(source, "test.tsx").issues.filter(
      (i) => i.type === "string-variable",
    );
    expect(issues).toHaveLength(0);
  });

  it("does NOT detect when variable name ends with 'class' suffix", () => {
    const source = `function f() { const btnClass = "Large Button"; }`;
    const issues = analyzeSourceText(source, "test.tsx").issues.filter(
      (i) => i.type === "string-variable",
    );
    expect(issues).toHaveLength(0);
  });

  it("does NOT detect when variable name ends with 'type'", () => {
    const source = `function f() { const buttonType = "Submit Button"; }`;
    const issues = analyzeSourceText(source, "test.tsx").issues.filter(
      (i) => i.type === "string-variable",
    );
    expect(issues).toHaveLength(0);
  });

  // --- Non-detection: technical single words ---

  it("does NOT detect technical single-word value when variable name is ignored (variant + Primary)", () => {
    const source = `function f() { const variant = "Primary"; }`;
    const issues = analyzeSourceText(source, "test.tsx").issues.filter(
      (i) => i.type === "string-variable",
    );
    expect(issues).toHaveLength(0);
  });

  it("does NOT detect technical single-word value when variable name is ignored (state + Loading)", () => {
    const source = `function f() { const state = "Loading"; }`;
    const issues = analyzeSourceText(source, "test.tsx").issues.filter(
      (i) => i.type === "string-variable",
    );
    expect(issues).toHaveLength(0);
  });

  // --- Non-detection: too short ---

  it("does NOT detect strings shorter than 5 characters", () => {
    const source = `function f() { const x = "Hi!"; }`;
    const issues = analyzeSourceText(source, "test.tsx").issues.filter(
      (i) => i.type === "string-variable",
    );
    expect(issues).toHaveLength(0);
  });
});
