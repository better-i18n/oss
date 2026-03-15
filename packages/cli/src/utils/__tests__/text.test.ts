import { describe, it, expect } from "bun:test";
import { truncate, generateKeyFromContext } from "../text.js";

// ---------------------------------------------------------------------------
// truncate
// ---------------------------------------------------------------------------

describe("truncate", () => {
  it("leaves a short string unchanged", () => {
    expect(truncate("Hello", 10)).toBe("Hello");
  });

  it("truncates a long string and appends ellipsis", () => {
    // "Hello World from the app" → after whitespace collapse: same
    // maxLength=10: slice(0, 9) + "…" → "Hello Wor…"
    expect(truncate("Hello World from the app", 10)).toBe("Hello Wor…");
  });

  it("collapses multiple spaces to a single space", () => {
    expect(truncate("Hello    World", 20)).toBe("Hello World");
  });

  it("does not truncate a string at exactly maxLength", () => {
    expect(truncate("Hello", 5)).toBe("Hello");
  });

  it("returns empty string for empty input", () => {
    expect(truncate("", 10)).toBe("");
  });

  it("returns a single character unchanged", () => {
    expect(truncate("A", 10)).toBe("A");
  });

  it("returns empty string for whitespace-only input", () => {
    expect(truncate("   ", 10)).toBe("");
  });
});

// ---------------------------------------------------------------------------
// generateKeyFromContext
// ---------------------------------------------------------------------------

describe("generateKeyFromContext", () => {
  it("combines path context and text into a dotted key", () => {
    // "auth/LoginForm.tsx" → parts ["auth", "LoginForm"] → last 2 → camelCase ["auth", "loginForm"]
    // "Save changes" → "saveChanges"
    expect(generateKeyFromContext("Save changes", "auth/LoginForm.tsx")).toBe(
      "auth.loginForm.saveChanges",
    );
  });

  it("returns only the text part when all path parts are filtered", () => {
    // All of src/app/components/pages/index are filtered
    expect(
      generateKeyFromContext("Hello", "src/app/components/pages/index.tsx"),
    ).toBe("hello");
  });

  it("limits text to a maximum of 4 words", () => {
    // "This is a very long text here" → first 4: ["this","is","a","very"] → "thisIsAVery"
    const result = generateKeyFromContext(
      "This is a very long text here",
      "module.tsx",
    );
    expect(result).toBe("module.thisIsAVery");
  });

  it("converts kebab-case path segments to camelCase", () => {
    // "user-profile/settings-page.tsx" → ["userProfile", "settingsPage"]
    expect(generateKeyFromContext("Go", "user-profile/settings-page.tsx")).toBe(
      "userProfile.settingsPage.go",
    );
  });

  it("strips special characters from text", () => {
    // "Hello! World?" → "hello world" → "helloWorld"
    expect(generateKeyFromContext("Hello! World?", "test.tsx")).toBe(
      "test.helloWorld",
    );
  });

  it("converts kebab-case filename to camelCase", () => {
    expect(generateKeyFromContext("Save", "my-component.tsx")).toBe(
      "myComponent.save",
    );
  });

  it("uses only the last 2 path parts for context", () => {
    // "a/b/c/d.tsx" → parts ["a","b","c","d"] → last 2 → ["c","d"]
    expect(generateKeyFromContext("Title", "a/b/c/d.tsx")).toBe("c.d.title");
  });

  it("generates key from single-word text, filtered path yields text-only key", () => {
    // "app.tsx" → strip extension → "app" → filtered out (in filter list)
    // contextParts = [] → result is text only
    expect(generateKeyFromContext("Dashboard", "app.tsx")).toBe("dashboard");
  });
});
