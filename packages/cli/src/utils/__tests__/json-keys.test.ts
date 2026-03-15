import { describe, it, expect } from "bun:test";
import {
  flattenKeys,
  flattenToRecord,
  countTotalKeys,
  countMissingKeys,
  countMissingKeysFromEntries,
  type MissingKeyEntry,
} from "../json-keys.js";

// ---------------------------------------------------------------------------
// flattenKeys
// ---------------------------------------------------------------------------

describe("flattenKeys", () => {
  it("flattens 2-level nested object into namespace-grouped key paths", () => {
    const result = flattenKeys({ common: { title: "Hello", desc: "World" } });
    expect(result).toEqual({ common: ["common.title", "common.desc"] });
  });

  it("flattens 3-level nesting into a single dotted path", () => {
    const result = flattenKeys({ auth: { login: { title: "Login" } } });
    expect(result).toEqual({ auth: ["auth.login.title"] });
  });

  it("handles multiple namespaces at the top level", () => {
    const result = flattenKeys({
      common: { title: "T" },
      auth: { login: "L" },
    });
    expect(result).toEqual({
      common: ["common.title"],
      auth: ["auth.login"],
    });
  });

  it("includes array leaf values", () => {
    const result = flattenKeys({ common: { items: ["a", "b"] } });
    expect(result["common"]).toContain("common.items");
  });

  it("includes boolean leaf values", () => {
    const result = flattenKeys({ common: { active: true } });
    expect(result["common"]).toContain("common.active");
  });

  it("includes null leaf values", () => {
    const result = flattenKeys({ common: { empty: null } });
    expect(result["common"]).toContain("common.empty");
  });

  it("returns empty object for empty input", () => {
    expect(flattenKeys({})).toEqual({});
  });

  it("treats single-level key as its own namespace", () => {
    // The leaf key "title" at root → namespace "title", key path "title"
    const result = flattenKeys({ title: "Hello" });
    expect(result).toEqual({ title: ["title"] });
  });
});

// ---------------------------------------------------------------------------
// flattenToRecord
// ---------------------------------------------------------------------------

describe("flattenToRecord", () => {
  it("flattens a basic nested object to a flat key→value map", () => {
    const result = flattenToRecord({ common: { title: "Hello" } });
    expect(result).toEqual({ "common.title": "Hello" });
  });

  it("excludes number leaves", () => {
    const result = flattenToRecord({ common: { count: 42 } });
    expect(result).toEqual({});
  });

  it("excludes boolean leaves", () => {
    const result = flattenToRecord({ common: { active: true } });
    expect(result).toEqual({});
  });

  it("excludes array leaves", () => {
    const result = flattenToRecord({ common: { items: ["a"] } });
    expect(result).toEqual({});
  });

  it("flattens deeply nested strings", () => {
    const result = flattenToRecord({ a: { b: { c: { d: "deep" } } } });
    expect(result).toEqual({ "a.b.c.d": "deep" });
  });

  it("returns empty object for empty input", () => {
    expect(flattenToRecord({})).toEqual({});
  });

  it("includes only string leaves from mixed-type object", () => {
    const result = flattenToRecord({
      common: { title: "Hi", count: 5, active: true },
    });
    expect(result).toEqual({ "common.title": "Hi" });
  });
});

// ---------------------------------------------------------------------------
// countTotalKeys
// ---------------------------------------------------------------------------

describe("countTotalKeys", () => {
  it("counts string leaves in a basic nested object", () => {
    expect(countTotalKeys({ common: { title: "T", desc: "D" } })).toBe(2);
  });

  it("counts a single deeply nested string", () => {
    expect(countTotalKeys({ a: { b: { c: "x" } } })).toBe(1);
  });

  it("returns 0 for empty input", () => {
    expect(countTotalKeys({})).toBe(0);
  });

  it("does not count number leaves", () => {
    expect(countTotalKeys({ a: { b: 42 } })).toBe(0);
  });

  it("counts only string leaves from mixed-type object", () => {
    expect(
      countTotalKeys({ a: { s: "string", n: 5, b: true } }),
    ).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// countMissingKeys
// ---------------------------------------------------------------------------

describe("countMissingKeys", () => {
  it("sums lengths across multiple namespaces", () => {
    expect(countMissingKeys({ common: ["a", "b"], auth: ["c"] })).toBe(3);
  });

  it("returns 0 for empty input", () => {
    expect(countMissingKeys({})).toBe(0);
  });

  it("returns length for a single namespace", () => {
    expect(countMissingKeys({ ns: ["x"] })).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// countMissingKeysFromEntries
// ---------------------------------------------------------------------------

describe("countMissingKeysFromEntries", () => {
  it("counts MissingKeyEntry objects across namespaces", () => {
    const keys: Record<string, MissingKeyEntry[]> = {
      ns: [{ key: "a", value: "b" }],
    };
    expect(countMissingKeysFromEntries(keys)).toBe(1);
  });

  it("sums multiple entries across multiple namespaces", () => {
    const keys: Record<string, MissingKeyEntry[]> = {
      common: [
        { key: "title", value: "Title" },
        { key: "desc", value: "Desc" },
      ],
      auth: [{ key: "login", value: "Login" }],
    };
    expect(countMissingKeysFromEntries(keys)).toBe(3);
  });

  it("returns 0 for empty input", () => {
    expect(countMissingKeysFromEntries({})).toBe(0);
  });
});
