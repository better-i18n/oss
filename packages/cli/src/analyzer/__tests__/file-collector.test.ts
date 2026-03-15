import { describe, it, expect } from "bun:test";
import { shouldExcludeFile } from "../file-collector.js";

// ---------------------------------------------------------------------------
// shouldExcludeFile
// ---------------------------------------------------------------------------

describe("shouldExcludeFile", () => {
  it("matches **/filename.ext exact file pattern anywhere in path", () => {
    expect(
      shouldExcludeFile("/src/foo.stories.tsx", ["**/foo.stories.tsx"]),
    ).toBe(true);
  });

  it("matches **/*.stories.tsx extension glob pattern", () => {
    expect(
      shouldExcludeFile("/src/Button.stories.tsx", ["**/*.stories.tsx"]),
    ).toBe(true);
  });

  it("does not match **/*.stories.tsx for a non-stories file", () => {
    expect(
      shouldExcludeFile("/src/Button.tsx", ["**/*.stories.tsx"]),
    ).toBe(false);
  });

  it("matches **/dir/** when path contains the directory", () => {
    expect(
      shouldExcludeFile("/src/ui/Button.tsx", ["**/ui/**"]),
    ).toBe(true);
  });

  it("does not match **/dir/** for an unrelated path", () => {
    expect(
      shouldExcludeFile("/src/utils/helper.ts", ["**/ui/**"]),
    ).toBe(false);
  });

  it("matches **/*.test.ts extension pattern", () => {
    expect(
      shouldExcludeFile("/src/foo.test.ts", ["**/*.test.ts"]),
    ).toBe(true);
  });

  it("matches simple string 'node_modules' when present in path", () => {
    expect(
      shouldExcludeFile("/project/node_modules/pkg/index.js", ["node_modules"]),
    ).toBe(true);
  });

  it("does not match simple string when not present in path", () => {
    expect(
      shouldExcludeFile("/project/src/index.ts", ["node_modules"]),
    ).toBe(false);
  });

  it("returns false for empty patterns array", () => {
    expect(shouldExcludeFile("/src/file.ts", [])).toBe(false);
  });

  it("returns false when no pattern matches", () => {
    expect(
      shouldExcludeFile("/src/main.tsx", ["**/test/**", "**/*.test.ts"]),
    ).toBe(false);
  });

  it("returns true when at least one of multiple patterns matches", () => {
    expect(
      shouldExcludeFile("/src/Button.stories.tsx", [
        "**/*.test.ts",
        "**/*.stories.tsx",
      ]),
    ).toBe(true);
  });

  it("matches **/*.d.ts declaration file pattern", () => {
    expect(
      shouldExcludeFile("/src/types.d.ts", ["**/*.d.ts"]),
    ).toBe(true);
  });

  it("matches **/dir/** for a deeply nested path containing the directory", () => {
    expect(
      shouldExcludeFile("/project/src/components/ui/Button.tsx", ["**/ui/**"]),
    ).toBe(true);
  });

  it("matches **/*.test.ts for a file at the root level", () => {
    expect(
      shouldExcludeFile("/foo.test.ts", ["**/*.test.ts"]),
    ).toBe(true);
  });

  it("is case-sensitive and does not match mismatched case", () => {
    expect(
      shouldExcludeFile("/src/Button.Stories.tsx", ["**/*.stories.tsx"]),
    ).toBe(false);
  });

  it("does not match **/setup pattern against a file named setup.ts", () => {
    // pattern "**/setup" looks for exact filename "setup", not "setup.ts"
    expect(
      shouldExcludeFile("/src/test/setup.ts", ["**/setup"]),
    ).toBe(false);
  });

  it("matches simple string '__tests__' when directory name appears in path", () => {
    expect(
      shouldExcludeFile("/project/__tests__/foo.ts", ["__tests__"]),
    ).toBe(true);
  });

  it("matches simple string 'dist' when present in path", () => {
    expect(
      shouldExcludeFile("/project/dist/bundle.js", ["dist"]),
    ).toBe(true);
  });
});
