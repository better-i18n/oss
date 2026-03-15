/**
 * Toast Message Rule — Unit Tests
 *
 * Tests hardcoded string detection in toast function calls via analyzeSourceText.
 */

import { describe, it, expect } from "bun:test";
import { analyzeSourceText } from "../index.js";

// ── Detection ────────────────────────────────────────────────────────

describe("toast-message rule — detection", () => {
  it("detects direct toast() call with hardcoded string", () => {
    const source = `
      import toast from "react-hot-toast";
      function save() { toast("User saved successfully"); }
    `;
    const { issues } = analyzeSourceText(source, "test.tsx");
    const toastIssues = issues.filter((i) => i.type === "toast-message");
    expect(toastIssues.length).toBeGreaterThan(0);
    expect(toastIssues[0].text).toBe("User saved successfully");
  });

  it("detects toast.error() call with hardcoded string", () => {
    const source = `
      import toast from "react-hot-toast";
      function onError() { toast.error("Something went wrong"); }
    `;
    const { issues } = analyzeSourceText(source, "test.tsx");
    const toastIssues = issues.filter((i) => i.type === "toast-message");
    expect(toastIssues.length).toBeGreaterThan(0);
    expect(toastIssues[0].text).toBe("Something went wrong");
  });

  it("detects toast.success() call with hardcoded string", () => {
    const source = `
      import toast from "react-hot-toast";
      function onSave() { toast.success("Profile updated"); }
    `;
    const { issues } = analyzeSourceText(source, "test.tsx");
    const toastIssues = issues.filter((i) => i.type === "toast-message");
    expect(toastIssues.length).toBeGreaterThan(0);
    expect(toastIssues[0].text).toBe("Profile updated");
  });

  it("detects toast.warning() call with hardcoded string", () => {
    const source = `
      import toast from "react-hot-toast";
      function onWarn() { toast.warning("Session expiring soon"); }
    `;
    const { issues } = analyzeSourceText(source, "test.tsx");
    const toastIssues = issues.filter((i) => i.type === "toast-message");
    expect(toastIssues.length).toBeGreaterThan(0);
    expect(toastIssues[0].text).toBe("Session expiring soon");
  });

  it("detects toast.info() call with hardcoded string", () => {
    const source = `
      import toast from "react-hot-toast";
      function onInfo() { toast.info("New version available"); }
    `;
    const { issues } = analyzeSourceText(source, "test.tsx");
    const toastIssues = issues.filter((i) => i.type === "toast-message");
    expect(toastIssues.length).toBeGreaterThan(0);
    expect(toastIssues[0].text).toBe("New version available");
  });

  it("detects toast.loading() call with hardcoded string", () => {
    const source = `
      import toast from "react-hot-toast";
      function onLoad() { toast.loading("Saving changes..."); }
    `;
    const { issues } = analyzeSourceText(source, "test.tsx");
    const toastIssues = issues.filter((i) => i.type === "toast-message");
    expect(toastIssues.length).toBeGreaterThan(0);
    expect(toastIssues[0].text).toBe("Saving changes...");
  });
});

// ── Non-detection ─────────────────────────────────────────────────────

describe("toast-message rule — non-detection", () => {
  it("does NOT flag toast with string ≤2 chars", () => {
    const source = `
      import toast from "react-hot-toast";
      function onOk() { toast("OK"); }
    `;
    const { issues } = analyzeSourceText(source, "test.tsx");
    const toastIssues = issues.filter((i) => i.type === "toast-message");
    expect(toastIssues).toHaveLength(0);
  });

  it("does NOT flag toast with technical identifier string", () => {
    const source = `
      import toast from "react-hot-toast";
      function onCode() { toast("error_code"); }
    `;
    const { issues } = analyzeSourceText(source, "test.tsx");
    const toastIssues = issues.filter((i) => i.type === "toast-message");
    expect(toastIssues).toHaveLength(0);
  });

  it("does NOT flag non-toast function calls", () => {
    const source = `
      function notify(msg: string) {}
      function onSave() { notify("User saved"); }
    `;
    const { issues } = analyzeSourceText(source, "test.tsx");
    const toastIssues = issues.filter((i) => i.type === "toast-message");
    expect(toastIssues).toHaveLength(0);
  });

  it("does NOT flag toast.custom() with JSX argument", () => {
    const source = `
      import toast from "react-hot-toast";
      function onCustom() { toast.custom(() => <div>Hello</div>); }
    `;
    const { issues } = analyzeSourceText(source, "test.tsx");
    const toastIssues = issues.filter((i) => i.type === "toast-message");
    expect(toastIssues).toHaveLength(0);
  });
});

// ── Edge cases ────────────────────────────────────────────────────────

describe("toast-message rule — edge cases", () => {
  it("detects template literal in toast()", () => {
    const source = `
      import toast from "react-hot-toast";
      function onLoad() { toast(\`Fixed text\`); }
    `;
    const { issues } = analyzeSourceText(source, "test.tsx");
    const toastIssues = issues.filter((i) => i.type === "toast-message");
    expect(toastIssues.length).toBeGreaterThan(0);
    expect(toastIssues[0].text).toBe("Fixed text");
  });

  it("detects first argument when toast() is called with options object", () => {
    const source = `
      import toast from "react-hot-toast";
      function onSave() { toast("Message", { duration: 3000 }); }
    `;
    const { issues } = analyzeSourceText(source, "test.tsx");
    const toastIssues = issues.filter((i) => i.type === "toast-message");
    expect(toastIssues.length).toBeGreaterThan(0);
    expect(toastIssues[0].text).toBe("Message");
  });

  it("severity is 'warning'", () => {
    const source = `
      import toast from "react-hot-toast";
      function onSave() { toast("User saved successfully"); }
    `;
    const { issues } = analyzeSourceText(source, "test.tsx");
    const toastIssues = issues.filter((i) => i.type === "toast-message");
    expect(toastIssues.length).toBeGreaterThan(0);
    expect(toastIssues[0].severity).toBe("warning");
  });
});
