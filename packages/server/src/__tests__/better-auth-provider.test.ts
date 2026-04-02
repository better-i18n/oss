import { describe, it, expect, beforeEach, vi } from "vitest";
import { clearManifestCache, clearMessagesCache } from "@better-i18n/core";
import type { ManifestResponse } from "@better-i18n/core";
import { createServerI18n } from "../index.js";
import {
  createBetterAuthProvider,
  DEFAULT_AUTH_KEYS,
} from "../providers/better-auth.js";

// ─── Mock data ──────────────────────────────────────────────────────

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
    auth: {
      INVALID_EMAIL_OR_PASSWORD: "Invalid email or password",
      USER_NOT_FOUND: "User not found",
      SESSION_EXPIRED: "Session expired. Please sign in again.",
    },
  },
  tr: {
    auth: {
      INVALID_EMAIL_OR_PASSWORD: "Geçersiz e-posta veya şifre",
      USER_NOT_FOUND: "Kullanıcı bulunamadı",
      SESSION_EXPIRED: "Oturum süresi doldu. Lütfen tekrar giriş yapın.",
    },
  },
  de: {
    auth: {
      INVALID_EMAIL_OR_PASSWORD: "Ungültige E-Mail oder Passwort",
      USER_NOT_FOUND: "Benutzer nicht gefunden",
    },
  },
};

function createMockFetch(): typeof fetch {
  return async (input: Parameters<typeof fetch>[0]): Promise<Response> => {
    const url = typeof input === "string" ? input : input.toString();

    if (url.endsWith("/manifest.json")) {
      return new Response(JSON.stringify(fakeManifest), { status: 200 });
    }

    const localeMatch = url.match(
      /\/([a-z]{2}(?:-[A-Z]{2})?)\/translations\.json$/,
    );
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

// ─── Helpers ────────────────────────────────────────────────────────

function createI18n() {
  return createServerI18n({
    project: "test/server",
    defaultLocale: "en",
    cdnBaseUrl: "https://cdn.example.com",
    fetch: createMockFetch(),
  });
}

/** Create a mock APIError-like object matching Better Auth's runtime shape */
function createMockAPIError(
  code: string,
  message: string,
  statusCode = 401,
): {
  name: string;
  statusCode: number;
  body: { code: string; message: string };
  message: string;
} {
  return {
    name: "APIError",
    statusCode,
    body: { code, message },
    message,
  };
}

/** Create a mock HookEndpointContext */
function createHookContext(
  returned: unknown,
  locale?: string,
): {
  context: { returned: unknown };
  headers: Headers;
  path: string;
} {
  return {
    context: { returned },
    headers: new Headers({
      "accept-language": locale ? `${locale};q=1.0` : "en;q=1.0",
    }),
    path: "/sign-in/email",
  };
}

// ─── Tests ──────────────────────────────────────────────────────────

beforeEach(() => {
  clearManifestCache();
  clearMessagesCache();
});

describe("createBetterAuthProvider", () => {
  it("returns a plugin object with id and hooks", () => {
    const i18n = createI18n();
    const plugin = createBetterAuthProvider(i18n);
    expect(plugin.id).toBe("better-i18n");
    expect(plugin.hooks.after).toHaveLength(1);
    expect(typeof plugin.hooks.after[0].matcher).toBe("function");
    expect(typeof plugin.hooks.after[0].handler).toBe("function");
  });

  it("matcher always returns true", () => {
    const i18n = createI18n();
    const plugin = createBetterAuthProvider(i18n);
    expect(plugin.hooks.after[0].matcher()).toBe(true);
  });
});

describe("error translation", () => {
  it("translates APIError body.message to Turkish", async () => {
    const i18n = createI18n();
    const plugin = createBetterAuthProvider(i18n);
    const handler = plugin.hooks.after[0].handler;

    const error = createMockAPIError(
      "INVALID_EMAIL_OR_PASSWORD",
      "Invalid email or password",
    );
    const ctx = createHookContext(error, "tr");
    await handler(ctx);

    expect(error.body.message).toBe("Geçersiz e-posta veya şifre");
    expect(error.message).toBe("Geçersiz e-posta veya şifre");
  });

  it("translates APIError body.message to German", async () => {
    const i18n = createI18n();
    const plugin = createBetterAuthProvider(i18n);
    const handler = plugin.hooks.after[0].handler;

    const error = createMockAPIError("USER_NOT_FOUND", "User not found");
    const ctx = createHookContext(error, "de");
    await handler(ctx);

    expect(error.body.message).toBe("Benutzer nicht gefunden");
  });

  it("translates to English when locale matches defaultLocale", async () => {
    const i18n = createI18n();
    const plugin = createBetterAuthProvider(i18n);
    const handler = plugin.hooks.after[0].handler;

    const error = createMockAPIError(
      "SESSION_EXPIRED",
      "Session expired. Re-authenticate to perform this action.",
    );
    const ctx = createHookContext(error, "en");
    await handler(ctx);

    // English CDN translation replaces original
    expect(error.body.message).toBe(
      "Session expired. Please sign in again.",
    );
  });
});

describe("missing key handling", () => {
  it("keeps original message when error code has no translation", async () => {
    const i18n = createI18n();
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const plugin = createBetterAuthProvider(i18n);
    const handler = plugin.hooks.after[0].handler;

    const error = createMockAPIError(
      "SOME_UNKNOWN_CODE",
      "Something went wrong",
    );
    const ctx = createHookContext(error, "tr");
    await handler(ctx);

    // Original message preserved — not replaced with raw key
    expect(error.body.message).toBe("Something went wrong");
    expect(error.message).toBe("Something went wrong");
    warnSpy.mockRestore();
  });

  it("logs warning for missing keys when warnOnMissingKeys is true", async () => {
    const i18n = createI18n();
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const plugin = createBetterAuthProvider(i18n, {
      warnOnMissingKeys: true,
    });
    const handler = plugin.hooks.after[0].handler;

    const error = createMockAPIError("UNKNOWN_CODE", "Error");
    const ctx = createHookContext(error, "tr");
    await handler(ctx);

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("UNKNOWN_CODE"),
    );
    warnSpy.mockRestore();
  });

  it("suppresses warning when warnOnMissingKeys is false", async () => {
    const i18n = createI18n();
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const plugin = createBetterAuthProvider(i18n, {
      warnOnMissingKeys: false,
    });
    const handler = plugin.hooks.after[0].handler;

    const error = createMockAPIError("UNKNOWN_CODE", "Error");
    const ctx = createHookContext(error, "tr");
    await handler(ctx);

    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});

describe("non-error passthrough", () => {
  it("skips non-APIError returned values", async () => {
    const i18n = createI18n();
    const plugin = createBetterAuthProvider(i18n);
    const handler = plugin.hooks.after[0].handler;

    // Successful response — should not be touched
    const successResponse = { user: { id: "1", email: "a@b.com" } };
    const ctx = createHookContext(successResponse, "tr");
    await handler(ctx);

    expect(successResponse).toEqual({
      user: { id: "1", email: "a@b.com" },
    });
  });

  it("skips when returned is null/undefined", async () => {
    const i18n = createI18n();
    const plugin = createBetterAuthProvider(i18n);
    const handler = plugin.hooks.after[0].handler;

    const ctx = createHookContext(null, "tr");
    await handler(ctx); // Should not throw

    const ctx2 = createHookContext(undefined, "tr");
    await handler(ctx2); // Should not throw
  });

  it("skips APIError without body.code", async () => {
    const i18n = createI18n();
    const plugin = createBetterAuthProvider(i18n);
    const handler = plugin.hooks.after[0].handler;

    const error = {
      name: "APIError",
      statusCode: 500,
      body: { message: "Internal server error" },
      message: "Internal server error",
    };
    const ctx = createHookContext(error, "tr");
    await handler(ctx);

    // Message should be untouched — no code to translate
    expect(error.body.message).toBe("Internal server error");
  });
});

describe("locale detection", () => {
  it("uses Accept-Language header by default", async () => {
    const i18n = createI18n();
    const plugin = createBetterAuthProvider(i18n);
    const handler = plugin.hooks.after[0].handler;

    const error = createMockAPIError(
      "INVALID_EMAIL_OR_PASSWORD",
      "Invalid email or password",
    );
    // Turkish Accept-Language → should use Turkish translation
    const ctx = createHookContext(error, "tr-TR");
    await handler(ctx);

    expect(error.body.message).toBe("Geçersiz e-posta veya şifre");
  });

  it("falls back to defaultLocale when no headers", async () => {
    const i18n = createI18n();
    const plugin = createBetterAuthProvider(i18n);
    const handler = plugin.hooks.after[0].handler;

    const error = createMockAPIError(
      "SESSION_EXPIRED",
      "Session expired. Re-authenticate to perform this action.",
    );
    const ctx = {
      context: { returned: error },
      headers: undefined,
      path: "/sign-in/email",
    };
    await handler(ctx as any);

    // Falls back to English (defaultLocale)
    expect(error.body.message).toBe(
      "Session expired. Please sign in again.",
    );
  });

  it("uses custom getLocale when provided", async () => {
    const i18n = createI18n();
    const plugin = createBetterAuthProvider(i18n, {
      getLocale: async () => "de",
    });
    const handler = plugin.hooks.after[0].handler;

    const error = createMockAPIError(
      "INVALID_EMAIL_OR_PASSWORD",
      "Invalid email or password",
    );
    // Accept-Language says Turkish, but getLocale forces German
    const ctx = createHookContext(error, "tr");
    await handler(ctx);

    expect(error.body.message).toBe("Ungültige E-Mail oder Passwort");
  });
});

describe("custom namespace", () => {
  it("uses custom namespace for translation lookup", async () => {
    // Create a custom fetch that serves a "custom-ns" namespace
    const customFetch: typeof fetch = async (input: Parameters<typeof fetch>[0]) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url.endsWith("/manifest.json")) {
        return new Response(JSON.stringify(fakeManifest), { status: 200 });
      }
      if (url.includes("/tr/translations.json")) {
        return new Response(
          JSON.stringify({
            "custom-ns": {
              INVALID_EMAIL_OR_PASSWORD: "Özel çeviri",
            },
          }),
          { status: 200 },
        );
      }
      return new Response("{}", { status: 200 });
    };

    const i18n = createServerI18n({
      project: "test/custom",
      defaultLocale: "en",
      cdnBaseUrl: "https://cdn.example.com",
      fetch: customFetch,
    });

    const plugin = createBetterAuthProvider(i18n, {
      namespace: "custom-ns",
    });
    const handler = plugin.hooks.after[0].handler;

    const error = createMockAPIError(
      "INVALID_EMAIL_OR_PASSWORD",
      "Invalid email or password",
    );
    const ctx = createHookContext(error, "tr");
    await handler(ctx);

    expect(error.body.message).toBe("Özel çeviri");
  });
});

describe("CDN failure resilience", () => {
  it("keeps original message when CDN fetch fails", async () => {
    const failingFetch: typeof fetch = async () => {
      throw new Error("Network error");
    };

    const i18n = createServerI18n({
      project: "test/broken",
      defaultLocale: "en",
      cdnBaseUrl: "https://cdn.example.com",
      fetch: failingFetch,
    });

    const plugin = createBetterAuthProvider(i18n);
    const handler = plugin.hooks.after[0].handler;

    const error = createMockAPIError(
      "INVALID_EMAIL_OR_PASSWORD",
      "Invalid email or password",
    );
    const ctx = createHookContext(error, "tr");
    await handler(ctx); // Should not throw

    // Original message preserved
    expect(error.body.message).toBe("Invalid email or password");
  });
});

describe("DEFAULT_AUTH_KEYS", () => {
  it("exports all core Better Auth error codes", () => {
    expect(DEFAULT_AUTH_KEYS).toBeDefined();
    expect(typeof DEFAULT_AUTH_KEYS).toBe("object");

    // Spot-check critical keys
    expect(DEFAULT_AUTH_KEYS.INVALID_EMAIL_OR_PASSWORD).toBe(
      "Invalid email or password",
    );
    expect(DEFAULT_AUTH_KEYS.USER_NOT_FOUND).toBe("User not found");
    expect(DEFAULT_AUTH_KEYS.SESSION_EXPIRED).toBeTruthy();
    expect(DEFAULT_AUTH_KEYS.PASSWORD_TOO_SHORT).toBe("Password too short");
  });

  it("has at least 30 error codes", () => {
    const keyCount = Object.keys(DEFAULT_AUTH_KEYS).length;
    expect(keyCount).toBeGreaterThanOrEqual(30);
  });

  it("all values are non-empty strings", () => {
    for (const [_key, value] of Object.entries(DEFAULT_AUTH_KEYS)) {
      expect(typeof value).toBe("string");
      expect(value.length).toBeGreaterThan(0);
    }
  });
});
