import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  discoverLocaleFiles,
  loadLocaleTranslations,
} from "../project-discovery.js";

// ── Test Setup ───────────────────────────────────────────────────────

const TEST_ROOT = join(tmpdir(), `cli-test-${Date.now()}`);

beforeAll(() => {
  mkdirSync(TEST_ROOT, { recursive: true });
});

afterAll(() => {
  rmSync(TEST_ROOT, { recursive: true, force: true });
});

function createTestDir(name: string): string {
  const dir = join(TEST_ROOT, name);
  mkdirSync(dir, { recursive: true });
  return dir;
}

function writeJson(filePath: string, data: unknown): void {
  mkdirSync(join(filePath, ".."), { recursive: true });
  writeFileSync(filePath, JSON.stringify(data));
}

// ── discoverLocaleFiles — flat pattern ───────────────────────────────

describe("discoverLocaleFiles — flat pattern", () => {
  it("discovers flat locale files", () => {
    const root = createTestDir("project1");
    writeJson(join(root, "locales", "en.json"), { title: "Hello" });
    writeJson(join(root, "locales", "tr.json"), { title: "Merhaba" });

    const result = discoverLocaleFiles(root);

    expect(result).not.toBeNull();
    expect(result!.pattern).toBe("flat");
    expect(result!.locales.sort()).toEqual(["en", "tr"]);
  });

  it("filters out non-locale filenames like index and schema", () => {
    const root = createTestDir("project2");
    writeJson(join(root, "locales", "en.json"), { title: "Hello" });
    writeJson(join(root, "locales", "index.json"), { type: "index" });
    writeJson(join(root, "locales", "schema.json"), { $schema: "..." });

    const result = discoverLocaleFiles(root);

    expect(result).not.toBeNull();
    expect(result!.locales).toEqual(["en"]);
    expect(result!.locales).not.toContain("index");
    expect(result!.locales).not.toContain("schema");
  });

  it("accepts pt-BR as a valid locale code", () => {
    const root = createTestDir("project8");
    writeJson(join(root, "locales", "pt-BR.json"), { title: "Olá" });

    const result = discoverLocaleFiles(root);

    expect(result).not.toBeNull();
    expect(result!.locales).toContain("pt-BR");
  });
});

// ── discoverLocaleFiles — namespaced pattern ─────────────────────────

describe("discoverLocaleFiles — namespaced pattern", () => {
  it("discovers namespaced locale subdirectories", () => {
    const root = createTestDir("project3");
    writeJson(join(root, "locales", "en", "common.json"), { title: "Hello" });
    writeJson(join(root, "locales", "tr", "common.json"), {
      title: "Merhaba",
    });

    const result = discoverLocaleFiles(root);

    expect(result).not.toBeNull();
    expect(result!.pattern).toBe("namespaced");
    expect(result!.locales.sort()).toEqual(["en", "tr"]);
  });
});

// ── discoverLocaleFiles — returns null ───────────────────────────────

describe("discoverLocaleFiles — returns null", () => {
  it("returns null when no locale directory exists", () => {
    const root = createTestDir("project4");
    mkdirSync(join(root, "src"), { recursive: true });
    writeFileSync(join(root, "src", "index.ts"), "export {};");

    const result = discoverLocaleFiles(root);

    expect(result).toBeNull();
  });
});

// ── discoverLocaleFiles — alternative directories ────────────────────

describe("discoverLocaleFiles — alternative directories", () => {
  it("finds locale files in 'messages' directory", () => {
    const root = createTestDir("project5");
    writeJson(join(root, "messages", "en.json"), { hello: "Hello" });

    const result = discoverLocaleFiles(root);

    expect(result).not.toBeNull();
    expect(result!.locales).toContain("en");
  });

  it("finds locale files in 'i18n' directory", () => {
    const root = createTestDir("project6");
    writeJson(join(root, "i18n", "en.json"), { hello: "Hello" });

    const result = discoverLocaleFiles(root);

    expect(result).not.toBeNull();
    expect(result!.locales).toContain("en");
  });

  it("finds locale files in 'public/locales' directory", () => {
    const root = createTestDir("project7");
    writeJson(join(root, "public", "locales", "en.json"), { hello: "Hello" });

    const result = discoverLocaleFiles(root);

    expect(result).not.toBeNull();
    expect(result!.locales).toContain("en");
  });
});

// ── loadLocaleTranslations — flat ────────────────────────────────────

describe("loadLocaleTranslations — flat", () => {
  it("flattens nested JSON into dot-notation keys", () => {
    const root = createTestDir("load-project1");
    writeJson(join(root, "locales", "en.json"), {
      common: { title: "Hello" },
    });

    const discovery = discoverLocaleFiles(root)!;
    const translations = loadLocaleTranslations(discovery);

    expect(translations["en"]).toBeDefined();
    expect(translations["en"]["common.title"]).toBe("Hello");
  });

  it("flattens deeply nested values", () => {
    const root = createTestDir("load-project5");
    writeJson(join(root, "locales", "en.json"), {
      auth: { login: { title: "Login" } },
    });

    const discovery = discoverLocaleFiles(root)!;
    const translations = loadLocaleTranslations(discovery);

    expect(translations["en"]["auth.login.title"]).toBe("Login");
  });
});

// ── loadLocaleTranslations — namespaced ──────────────────────────────

describe("loadLocaleTranslations — namespaced", () => {
  it("prefixes keys with the namespace filename", () => {
    const root = createTestDir("load-project2");
    writeJson(join(root, "locales", "en", "common.json"), { title: "Hello" });

    const discovery = discoverLocaleFiles(root)!;
    const translations = loadLocaleTranslations(discovery);

    expect(translations["en"]).toBeDefined();
    expect(translations["en"]["common.title"]).toBe("Hello");
  });

  it("merges multiple namespace files into one locale map", () => {
    const root = createTestDir("load-project4");
    writeJson(join(root, "locales", "en", "common.json"), {
      title: "Common Title",
    });
    writeJson(join(root, "locales", "en", "auth.json"), {
      login: "Login",
    });

    const discovery = discoverLocaleFiles(root)!;
    const translations = loadLocaleTranslations(discovery);

    expect(translations["en"]["common.title"]).toBe("Common Title");
    expect(translations["en"]["auth.login"]).toBe("Login");
  });
});

// ── loadLocaleTranslations — error handling ──────────────────────────

describe("loadLocaleTranslations — malformed JSON", () => {
  it("skips files with invalid JSON without throwing", () => {
    const root = createTestDir("load-project3");
    const localesDir = join(root, "locales");
    mkdirSync(localesDir, { recursive: true });
    writeFileSync(join(localesDir, "en.json"), "{ invalid json !!!");
    writeJson(join(localesDir, "tr.json"), { title: "Merhaba" });

    const discovery = discoverLocaleFiles(root)!;

    expect(() => loadLocaleTranslations(discovery)).not.toThrow();

    const translations = loadLocaleTranslations(discovery);
    expect(translations["en"]).toEqual({});
    expect(translations["tr"]["title"]).toBe("Merhaba");
  });
});
