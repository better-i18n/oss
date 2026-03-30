import { describe, expect, it, beforeEach, afterEach } from "bun:test";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { loadEnvFiles } from "../load-env.js";

const TEST_DIR = join(import.meta.dir, ".tmp-env-test");

beforeEach(() => {
  mkdirSync(TEST_DIR, { recursive: true });
});

afterEach(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
  // Clean up test env vars
  delete process.env.TEST_LOAD_ENV_A;
  delete process.env.TEST_LOAD_ENV_B;
  delete process.env.TEST_LOAD_ENV_C;
  delete process.env.TEST_LOAD_ENV_QUOTED;
});

describe("loadEnvFiles", () => {
  it("loads vars from .env file", () => {
    writeFileSync(join(TEST_DIR, ".env"), "TEST_LOAD_ENV_A=hello\n");
    loadEnvFiles(TEST_DIR);
    expect(process.env.TEST_LOAD_ENV_A).toBe("hello");
  });

  it("does not override existing shell vars", () => {
    process.env.TEST_LOAD_ENV_B = "from-shell";
    writeFileSync(join(TEST_DIR, ".env"), "TEST_LOAD_ENV_B=from-file\n");
    loadEnvFiles(TEST_DIR);
    expect(process.env.TEST_LOAD_ENV_B).toBe("from-shell");
  });

  it(".env.local takes precedence over .env", () => {
    writeFileSync(join(TEST_DIR, ".env"), "TEST_LOAD_ENV_C=from-env\n");
    writeFileSync(join(TEST_DIR, ".env.local"), "TEST_LOAD_ENV_C=from-local\n");
    loadEnvFiles(TEST_DIR);
    expect(process.env.TEST_LOAD_ENV_C).toBe("from-local");
  });

  it("strips surrounding quotes", () => {
    writeFileSync(
      join(TEST_DIR, ".env"),
      'TEST_LOAD_ENV_QUOTED="hello world"\n',
    );
    loadEnvFiles(TEST_DIR);
    expect(process.env.TEST_LOAD_ENV_QUOTED).toBe("hello world");
  });

  it("ignores comments and empty lines", () => {
    writeFileSync(
      join(TEST_DIR, ".env"),
      "# comment\n\nTEST_LOAD_ENV_A=yes\n# another comment\n",
    );
    loadEnvFiles(TEST_DIR);
    expect(process.env.TEST_LOAD_ENV_A).toBe("yes");
  });

  it("handles missing .env files gracefully", () => {
    // No files in TEST_DIR — should not throw
    loadEnvFiles(TEST_DIR);
    expect(process.env.TEST_LOAD_ENV_A).toBeUndefined();
  });
});
