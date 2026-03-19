import { describe, it, expect, vi } from "vitest";

// Mock modules not available in test environment
vi.mock("react", () => ({ cache: (fn: () => unknown) => fn }));
vi.mock("next-intl/server", () => ({ getRequestConfig: (fn: unknown) => fn }));
vi.mock("next/headers", () => ({}));

// Import after mocks
const { resolveLocaleFromRequest } = await import("../server.js");

// ─── Test fixtures ──────────────────────────────────────────────────

const LOCALES = ["en", "tr", "de"];
const DEFAULT_LOCALE = "en";

// ─── URL-based modes ("always" / "as-needed") ───────────────────────

describe("resolveLocaleFromRequest — URL-based modes", () => {
  it.each(["always", "as-needed"] as const)(
    "%s: requestLocale valid → uses requestLocale (ignores header & cookie)",
    (mode) => {
      const result = resolveLocaleFromRequest(
        "de",
        "tr",   // cookie
        "tr",   // header
        LOCALES,
        DEFAULT_LOCALE,
        mode,
      );
      expect(result).toBe("de");
    },
  );

  it.each(["always", "as-needed"] as const)(
    "%s: requestLocale undefined + header valid → uses header (not cookie)",
    (mode) => {
      const result = resolveLocaleFromRequest(
        undefined,
        "de",   // cookie — should be ignored
        "tr",   // header — should be used
        LOCALES,
        DEFAULT_LOCALE,
        mode,
      );
      expect(result).toBe("tr");
    },
  );

  it.each(["always", "as-needed"] as const)(
    "%s: requestLocale undefined + no header + cookie → defaultLocale (cookie ignored)",
    (mode) => {
      const result = resolveLocaleFromRequest(
        undefined,
        "tr",   // cookie — should be ignored
        null,   // no header
        LOCALES,
        DEFAULT_LOCALE,
        mode,
      );
      expect(result).toBe("en");
    },
  );

  it.each(["always", "as-needed"] as const)(
    "%s: requestLocale undefined + no header + no cookie → defaultLocale",
    (mode) => {
      const result = resolveLocaleFromRequest(
        undefined,
        null,
        null,
        LOCALES,
        DEFAULT_LOCALE,
        mode,
      );
      expect(result).toBe("en");
    },
  );

  it.each(["always", "as-needed"] as const)(
    "%s: requestLocale invalid + header valid → defaultLocale (requestLocale truthy)",
    (mode) => {
      const result = resolveLocaleFromRequest(
        "fr",
        null,
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
      "tr",   // cookie
      null,   // header (not used in "never")
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
      null,
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
      null,
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
      null,
      LOCALES,
      DEFAULT_LOCALE,
      "never",
    );
    expect(result).toBe("en");
  });

  it("cookie is used over header in never mode", () => {
    const result = resolveLocaleFromRequest(
      undefined,
      "tr",   // cookie — used in "never"
      "de",   // header — ignored in "never"
      LOCALES,
      DEFAULT_LOCALE,
      "never",
    );
    expect(result).toBe("tr");
  });
});
