import { describe, it, expect } from "vitest";
import { resolveLocaleFromRequest } from "../server.js";

// ─── Test fixtures ──────────────────────────────────────────────────

const LOCALES = ["en", "tr", "de"];
const DEFAULT_LOCALE = "en";

// ─── URL-based modes ("always" / "as-needed") ───────────────────────

describe("resolveLocaleFromRequest — URL-based modes", () => {
  it.each(["always", "as-needed"] as const)(
    '%s: requestLocale undefined + cookie "tr" → defaultLocale (cookie ignored)',
    (mode) => {
      const result = resolveLocaleFromRequest(
        undefined,
        "tr",
        LOCALES,
        DEFAULT_LOCALE,
        mode,
      );
      expect(result).toBe("en");
    },
  );

  it.each(["always", "as-needed"] as const)(
    "%s: requestLocale valid → uses requestLocale",
    (mode) => {
      const result = resolveLocaleFromRequest(
        "de",
        "tr",
        LOCALES,
        DEFAULT_LOCALE,
        mode,
      );
      expect(result).toBe("de");
    },
  );

  it.each(["always", "as-needed"] as const)(
    "%s: requestLocale undefined + no cookie → defaultLocale",
    (mode) => {
      const result = resolveLocaleFromRequest(
        undefined,
        null,
        LOCALES,
        DEFAULT_LOCALE,
        mode,
      );
      expect(result).toBe("en");
    },
  );

  it.each(["always", "as-needed"] as const)(
    "%s: requestLocale invalid → defaultLocale",
    (mode) => {
      const result = resolveLocaleFromRequest(
        "fr",
        "tr",
        LOCALES,
        DEFAULT_LOCALE,
        mode,
      );
      expect(result).toBe("en");
    },
  );
});

// ─── "never" mode (cookie is source of truth) ───────────────────────

describe('resolveLocaleFromRequest — "never" mode', () => {
  it("requestLocale undefined + cookie valid → cookie fallback", () => {
    const result = resolveLocaleFromRequest(
      undefined,
      "tr",
      LOCALES,
      DEFAULT_LOCALE,
      "never",
    );
    expect(result).toBe("tr");
  });

  it("requestLocale undefined + no cookie → defaultLocale", () => {
    const result = resolveLocaleFromRequest(
      undefined,
      null,
      LOCALES,
      DEFAULT_LOCALE,
      "never",
    );
    expect(result).toBe("en");
  });

  it("requestLocale undefined + cookie invalid → defaultLocale", () => {
    const result = resolveLocaleFromRequest(
      undefined,
      "fr",
      LOCALES,
      DEFAULT_LOCALE,
      "never",
    );
    expect(result).toBe("en");
  });

  it("requestLocale valid + cookie valid → requestLocale takes priority", () => {
    const result = resolveLocaleFromRequest(
      "de",
      "tr",
      LOCALES,
      DEFAULT_LOCALE,
      "never",
    );
    expect(result).toBe("de");
  });

  it("requestLocale invalid + cookie valid → defaultLocale (requestLocale truthy, cookie not checked)", () => {
    const result = resolveLocaleFromRequest(
      "fr",
      "tr",
      LOCALES,
      DEFAULT_LOCALE,
      "never",
    );
    expect(result).toBe("en");
  });

  it("requestLocale undefined + cookie undefined → defaultLocale", () => {
    const result = resolveLocaleFromRequest(
      undefined,
      undefined,
      LOCALES,
      DEFAULT_LOCALE,
      "never",
    );
    expect(result).toBe("en");
  });
});
