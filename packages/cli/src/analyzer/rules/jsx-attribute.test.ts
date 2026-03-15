import { describe, it, expect } from "bun:test";
import { analyzeSourceText } from "../index.js";

describe("checkJsxAttribute rule", () => {
  // Detection tests

  it("detects hardcoded string in title attribute", () => {
    const source = `export default function Page() { return (<div><img title="My Photo" /></div>); }`;
    const issues = analyzeSourceText(source, "test.tsx").issues.filter(
      (i) => i.type === "jsx-attribute"
    );
    expect(issues.length).toBeGreaterThan(0);
  });

  it("detects hardcoded string in alt attribute", () => {
    const source = `export default function Page() { return (<div><img alt="Profile picture" /></div>); }`;
    const issues = analyzeSourceText(source, "test.tsx").issues.filter(
      (i) => i.type === "jsx-attribute"
    );
    expect(issues.length).toBeGreaterThan(0);
  });

  it("detects hardcoded string in placeholder attribute", () => {
    const source = `export default function Page() { return (<div><input placeholder="Enter your email" /></div>); }`;
    const issues = analyzeSourceText(source, "test.tsx").issues.filter(
      (i) => i.type === "jsx-attribute"
    );
    expect(issues.length).toBeGreaterThan(0);
  });

  it("detects hardcoded string in aria-label attribute", () => {
    const source = `export default function Page() { return (<div><button aria-label="Close dialog" /></div>); }`;
    const issues = analyzeSourceText(source, "test.tsx").issues.filter(
      (i) => i.type === "jsx-attribute"
    );
    expect(issues.length).toBeGreaterThan(0);
  });

  it("detects hardcoded string in label attribute", () => {
    const source = `export default function Page() { return (<div><button label="Submit form" /></div>); }`;
    const issues = analyzeSourceText(source, "test.tsx").issues.filter(
      (i) => i.type === "jsx-attribute"
    );
    expect(issues.length).toBeGreaterThan(0);
  });

  // Non-detection tests

  it("does not detect className attribute", () => {
    const source = `export default function Page() { return (<div><div className="flex items-center" /></div>); }`;
    const issues = analyzeSourceText(source, "test.tsx").issues.filter(
      (i) => i.type === "jsx-attribute"
    );
    expect(issues.length).toBe(0);
  });

  it("does not detect id attribute", () => {
    const source = `export default function Page() { return (<div><div id="main-content" /></div>); }`;
    const issues = analyzeSourceText(source, "test.tsx").issues.filter(
      (i) => i.type === "jsx-attribute"
    );
    expect(issues.length).toBe(0);
  });

  it("does not detect href attribute with path", () => {
    const source = `export default function Page() { return (<div><a href="/about" /></div>); }`;
    const issues = analyzeSourceText(source, "test.tsx").issues.filter(
      (i) => i.type === "jsx-attribute"
    );
    expect(issues.length).toBe(0);
  });

  it("does not detect src attribute with path", () => {
    const source = `export default function Page() { return (<div><img src="/logo.png" /></div>); }`;
    const issues = analyzeSourceText(source, "test.tsx").issues.filter(
      (i) => i.type === "jsx-attribute"
    );
    expect(issues.length).toBe(0);
  });

  it("does not detect data-testid attribute", () => {
    const source = `export default function Page() { return (<div><div data-testid="submit-btn" /></div>); }`;
    const issues = analyzeSourceText(source, "test.tsx").issues.filter(
      (i) => i.type === "jsx-attribute"
    );
    expect(issues.length).toBe(0);
  });

  // Edge cases

  it("skips title attribute value with 2 or fewer characters", () => {
    const source = `export default function Page() { return (<div><img title="OK" /></div>); }`;
    const issues = analyzeSourceText(source, "test.tsx").issues.filter(
      (i) => i.type === "jsx-attribute"
    );
    expect(issues.length).toBe(0);
  });

  it("detects hardcoded string in title attribute using JSX expression form", () => {
    const source = `export default function Page() { return (<div><img title={"Hello World"} /></div>); }`;
    const issues = analyzeSourceText(source, "test.tsx").issues.filter(
      (i) => i.type === "jsx-attribute"
    );
    expect(issues.length).toBeGreaterThan(0);
  });
});
