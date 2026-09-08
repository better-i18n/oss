import { describe, it, expect } from "vitest";
import {
  localeSnapshotVersion,
  resolveTranslationUrl,
  VERSION_PATTERN,
} from "../versioned-url";

const BASE = "https://cdn.better-i18n.com/acme/dashboard";

describe("resolveTranslationUrl (platform #115)", () => {
  it("builds the immutable snapshot URL when the locale has a version", () => {
    const manifest = {
      files: {
        en: {
          url: "",
          size: 0,
          lastModified: null,
          version: "loyw3v28-0f3c2a9e",
        },
      },
    };
    expect(resolveTranslationUrl(BASE, manifest, "en", "common")).toEqual({
      url: `${BASE}/v/loyw3v28-0f3c2a9e/en/common.json`,
      versioned: true,
    });
    expect(
      resolveTranslationUrl(BASE, manifest, "en", "translations").url,
    ).toBe(`${BASE}/v/loyw3v28-0f3c2a9e/en/translations.json`);
  });

  it("falls back to the legacy path for a locale without a version", () => {
    const manifest = {
      files: {
        en: {
          url: "",
          size: 0,
          lastModified: null,
          version: "loyw3v28-0f3c2a9e",
        },
        de: { url: "", size: 0, lastModified: null },
      },
    };
    expect(resolveTranslationUrl(BASE, manifest, "de", "common")).toEqual({
      url: `${BASE}/de/common.json`,
      versioned: false,
    });
    // A locale the manifest does not list at all (e.g. a fallback language)
    // is the legacy path too.
    expect(
      resolveTranslationUrl(BASE, manifest, "fr", "common").versioned,
    ).toBe(false);
  });

  it("is the legacy path without a manifest, without files, or with a malformed version", () => {
    expect(resolveTranslationUrl(BASE, null, "en", "common").url).toBe(
      `${BASE}/en/common.json`,
    );
    expect(
      resolveTranslationUrl(BASE, undefined, "en", "common").versioned,
    ).toBe(false);
    expect(
      resolveTranslationUrl(BASE, { files: undefined }, "en", "common")
        .versioned,
    ).toBe(false);
    const bad = {
      files: {
        en: { url: "", size: 0, lastModified: null, version: "../../manifest" },
      },
    };
    expect(resolveTranslationUrl(BASE, bad, "en", "common")).toEqual({
      url: `${BASE}/en/common.json`,
      versioned: false,
    });
    expect(localeSnapshotVersion(bad, "en")).toBeNull();
  });

  it("uses the same version shape the platform mints", () => {
    expect(VERSION_PATTERN.test("loyw3v28-0f3c2a9e")).toBe(true);
    for (const v of ["", "UPPER-1234", "a/b-1234", "short-1", "nodash"]) {
      expect(VERSION_PATTERN.test(v)).toBe(false);
    }
  });
});
