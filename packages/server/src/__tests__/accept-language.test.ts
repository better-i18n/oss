import { describe, it, expect } from "vitest";
import { parseAcceptLanguage, matchLocale } from "../utils/accept-language.js";

describe("parseAcceptLanguage", () => {
  it("parses a full Accept-Language header", () => {
    expect(parseAcceptLanguage("tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7")).toEqual([
      "tr-TR",
      "tr",
      "en-US",
      "en",
    ]);
  });

  it("handles a single locale without quality", () => {
    expect(parseAcceptLanguage("en")).toEqual(["en"]);
  });

  it("sorts by quality factor", () => {
    expect(parseAcceptLanguage("fr;q=0.5,de;q=0.9,en")).toEqual(["en", "de", "fr"]);
  });

  it("handles wildcard (*) by ignoring it", () => {
    expect(parseAcceptLanguage("*")).toEqual([]);
  });

  it("returns empty array for null", () => {
    expect(parseAcceptLanguage(null)).toEqual([]);
  });

  it("returns empty array for empty string", () => {
    expect(parseAcceptLanguage("")).toEqual([]);
  });

  it("handles locales with region subtags", () => {
    const result = parseAcceptLanguage("zh-CN,zh;q=0.9");
    expect(result).toEqual(["zh-CN", "zh"]);
  });

  it("preserves original order for equal quality values", () => {
    // Both have implicit q=1.0 — original order must be preserved (stable sort)
    const result = parseAcceptLanguage("fr,de");
    expect(result).toEqual(["fr", "de"]);
  });
});

describe("matchLocale", () => {
  const availableLocales = ["en", "tr", "de", "fr-FR"];

  it("exact match: tr-TR → tr", () => {
    expect(matchLocale(["tr-TR", "tr", "en"], availableLocales)).toBe("tr");
  });

  it("exact match wins over base language", () => {
    expect(matchLocale(["fr-FR", "fr", "en"], availableLocales)).toBe("fr-FR");
  });

  it("base language match: en-US → en", () => {
    expect(matchLocale(["en-US", "en"], availableLocales)).toBe("en");
  });

  it("region expansion: fr → fr-FR", () => {
    expect(matchLocale(["fr"], availableLocales)).toBe("fr-FR");
  });

  it("returns null when no match found", () => {
    expect(matchLocale(["ja", "ko"], availableLocales)).toBeNull();
  });

  it("returns null for empty languages list", () => {
    expect(matchLocale([], availableLocales)).toBeNull();
  });

  it("respects priority order — returns first match", () => {
    // "de" is available, "fr-FR" is also available → "de" comes first
    expect(matchLocale(["de", "fr-FR"], availableLocales)).toBe("de");
  });
});
