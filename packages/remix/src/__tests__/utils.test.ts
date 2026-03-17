import { describe, it, expect } from "vitest";
import { parseAcceptLanguage, matchLocale, msg } from "../utils.js";

describe("parseAcceptLanguage", () => {
  it("parses header into priority-sorted list", () => {
    const result = parseAcceptLanguage("tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7");
    expect(result).toEqual(["tr-TR", "tr", "en-US", "en"]);
  });

  it("returns empty array for null/undefined", () => {
    expect(parseAcceptLanguage(null)).toEqual([]);
    expect(parseAcceptLanguage(undefined)).toEqual([]);
    expect(parseAcceptLanguage("")).toEqual([]);
  });

  it("handles wildcard entries", () => {
    const result = parseAcceptLanguage("en,*;q=0.5");
    expect(result).toEqual(["en"]);
  });

  it("handles invalid quality values", () => {
    const result = parseAcceptLanguage("en;q=abc,tr");
    expect(result).toEqual(["en", "tr"]);
  });
});

describe("matchLocale", () => {
  const locales = ["en", "tr", "es", "pt-br"];

  it("returns exact match", () => {
    expect(matchLocale(["tr"], locales)).toBe("tr");
  });

  it("matches base language", () => {
    expect(matchLocale(["tr-TR"], locales)).toBe("tr");
  });

  it("expands region", () => {
    expect(matchLocale(["pt"], locales)).toBe("pt-br");
  });

  it("returns null when no match", () => {
    expect(matchLocale(["ja", "ko"], locales)).toBeNull();
  });

  it("returns first match by priority", () => {
    expect(matchLocale(["ja", "tr", "en"], locales)).toBe("tr");
  });
});

describe("msg", () => {
  it("extracts string value from namespace", () => {
    const ns = { hello: "Merhaba", count: 42 };
    expect(msg(ns, "hello")).toBe("Merhaba");
  });

  it("returns fallback for missing key", () => {
    expect(msg({}, "missing", "fallback")).toBe("fallback");
  });

  it("returns fallback for non-string value", () => {
    expect(msg({ count: 42 }, "count", "0")).toBe("0");
  });

  it("handles undefined namespace", () => {
    expect(msg(undefined, "key", "default")).toBe("default");
  });

  it("returns empty string as default fallback", () => {
    expect(msg(undefined, "key")).toBe("");
  });
});
