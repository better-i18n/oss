import { describe, expect, it } from "bun:test";
import { getDeviceLocale, getDeviceLocales } from "../locale";

describe("getDeviceLocale", () => {
  it("should return fallback when expo-localization is not available", () => {
    // In test environment, expo-localization is not installed
    const locale = getDeviceLocale({ fallback: "en" });
    expect(locale).toBe("en");
  });

  it("should use 'en' as default fallback", () => {
    const locale = getDeviceLocale();
    expect(locale).toBe("en");
  });

  it("should respect custom fallback", () => {
    const locale = getDeviceLocale({ fallback: "de" });
    expect(locale).toBe("de");
  });
});

describe("getDeviceLocales", () => {
  it("should return empty array when expo-localization is not available", () => {
    const locales = getDeviceLocales();
    expect(locales).toEqual([]);
  });
});
