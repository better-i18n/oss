import { describe, it, expect, beforeEach } from "vitest";
import { clearManifestCache, clearMessagesCache } from "@better-i18n/core";
import { createServerI18n } from "../index.js";
import type { ManifestResponse } from "@better-i18n/core";

// ─── Mock fetch ─────────────────────────────────────────────────────

const fakeManifest: ManifestResponse = {
  projectSlug: "server",
  languages: [
    { code: "en", name: "English" },
    { code: "tr", name: "Turkish" },
    { code: "de", name: "German" },
  ],
};

const fakeMessages: Record<string, Record<string, Record<string, string>>> = {
  en: {
    errors: { notFound: "Not found", unauthorized: "Unauthorized" },
    emails: { welcome: "Welcome, {name}!" },
  },
  tr: {
    errors: { notFound: "Bulunamadı", unauthorized: "Yetkisiz erişim" },
    emails: { welcome: "Hoş geldin, {name}!" },
  },
  de: {
    errors: { notFound: "Nicht gefunden", unauthorized: "Nicht autorisiert" },
    emails: { welcome: "Willkommen, {name}!" },
  },
};

function createMockFetch(): typeof fetch {
  return async (input: Parameters<typeof fetch>[0]): Promise<Response> => {
    const url = typeof input === "string" ? input : input.toString();

    if (url.endsWith("/manifest.json")) {
      return new Response(JSON.stringify(fakeManifest), { status: 200 });
    }

    // Match /<locale>/translations.json
    const localeMatch = url.match(/\/([a-z]{2}(?:-[A-Z]{2})?)\/translations\.json$/);
    if (localeMatch) {
      const locale = localeMatch[1]!;
      const messages = fakeMessages[locale];
      if (messages) {
        return new Response(JSON.stringify(messages), { status: 200 });
      }
    }

    return new Response("Not found", { status: 404 });
  };
}

const baseConfig = {
  project: "test/server",
  defaultLocale: "en",
  cdnBaseUrl: "https://cdn.example.com",
  fetch: createMockFetch(),
};

beforeEach(() => {
  clearManifestCache();
  clearMessagesCache();
});

// ─── Tests ──────────────────────────────────────────────────────────

describe("createServerI18n", () => {
  it("returns a ServerI18n instance with required methods", () => {
    const i18n = createServerI18n(baseConfig);
    expect(typeof i18n.getTranslator).toBe("function");
    expect(typeof i18n.detectLocaleFromHeaders).toBe("function");
    expect(typeof i18n.getLocales).toBe("function");
    expect(typeof i18n.getLanguages).toBe("function");
  });

  it("config reflects the input", () => {
    const i18n = createServerI18n(baseConfig);
    expect(i18n.config.project).toBe("test/server");
    expect(i18n.config.defaultLocale).toBe("en");
  });
});

describe("getTranslator", () => {
  it("translates a simple key for English", async () => {
    const i18n = createServerI18n(baseConfig);
    const t = await i18n.getTranslator("en");
    expect(t("errors.notFound")).toBe("Not found");
  });

  it("translates a simple key for Turkish", async () => {
    const i18n = createServerI18n(baseConfig);
    const t = await i18n.getTranslator("tr");
    expect(t("errors.notFound")).toBe("Bulunamadı");
  });

  it("supports interpolation", async () => {
    const i18n = createServerI18n(baseConfig);
    const t = await i18n.getTranslator("en");
    expect(t("emails.welcome", { name: "Ali" })).toBe("Welcome, Ali!");
  });

  it("supports namespace scoping", async () => {
    const i18n = createServerI18n(baseConfig);
    const t = await i18n.getTranslator("en", "errors");
    expect(t("notFound")).toBe("Not found");
  });

  it("returns the same result for the same locale (cache hit)", async () => {
    const i18n = createServerI18n(baseConfig);
    const t1 = await i18n.getTranslator("tr");
    const t2 = await i18n.getTranslator("tr");
    // Both translators should produce the same output
    expect(t1("errors.notFound")).toBe(t2("errors.notFound"));
  });
});

describe("detectLocaleFromHeaders", () => {
  it("detects Turkish from Accept-Language header", async () => {
    const i18n = createServerI18n(baseConfig);
    const headers = new Headers({ "accept-language": "tr-TR,tr;q=0.9,en;q=0.8" });
    const locale = await i18n.detectLocaleFromHeaders(headers);
    expect(locale).toBe("tr");
  });

  it("detects English from Accept-Language header", async () => {
    const i18n = createServerI18n(baseConfig);
    const headers = new Headers({ "accept-language": "en-US,en;q=0.9" });
    const locale = await i18n.detectLocaleFromHeaders(headers);
    expect(locale).toBe("en");
  });

  it("falls back to defaultLocale when Accept-Language is absent", async () => {
    const i18n = createServerI18n(baseConfig);
    const headers = new Headers();
    const locale = await i18n.detectLocaleFromHeaders(headers);
    expect(locale).toBe("en");
  });

  it("falls back to defaultLocale for unsupported locale", async () => {
    const i18n = createServerI18n(baseConfig);
    const headers = new Headers({ "accept-language": "ja,ko;q=0.9" });
    const locale = await i18n.detectLocaleFromHeaders(headers);
    expect(locale).toBe("en");
  });

  it("picks the highest quality match across available locales", async () => {
    const i18n = createServerI18n(baseConfig);
    // de has higher q than tr in this header
    const headers = new Headers({ "accept-language": "ja;q=0.9,de;q=0.8,tr;q=0.7" });
    const locale = await i18n.detectLocaleFromHeaders(headers);
    expect(locale).toBe("de");
  });
});

describe("getLocales", () => {
  it("returns available locale codes", async () => {
    const i18n = createServerI18n(baseConfig);
    const locales = await i18n.getLocales();
    expect(locales).toContain("en");
    expect(locales).toContain("tr");
    expect(locales).toContain("de");
  });
});
