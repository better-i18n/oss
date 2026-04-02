import type { ServerI18n } from "../types.js";

// ---------------------------------------------------------------------------
// Minimal types — structurally compatible with Better Auth's plugin system.
// We avoid a runtime dependency on better-auth / @better-auth/core so that
// @better-i18n/server stays lightweight and version-independent.
// ---------------------------------------------------------------------------

/** @internal Duck-typed subset of Better Auth's HookEndpointContext */
interface HookContext {
  context: {
    returned?: unknown;
    responseHeaders?: Headers;
  };
  headers?: Headers;
  path?: string;
}

/**
 * Options for the Better Auth localization provider.
 */
export interface BetterAuthProviderOptions {
  /**
   * CDN namespace where auth error translations are stored.
   * Maps to the namespace in your Better i18n project.
   * @default "auth"
   */
  namespace?: string;

  /**
   * Custom locale resolver. Overrides the default Accept-Language detection.
   *
   * Useful when locale is stored in a cookie, database, or user profile.
   *
   * @example
   * ```ts
   * createBetterAuthProvider(i18n, {
   *   getLocale: async ({ headers }) => {
   *     const cookie = headers?.get("cookie");
   *     return parseCookie(cookie)?.locale ?? "en";
   *   },
   * })
   * ```
   */
  getLocale?: (context: { headers?: Headers }) => string | Promise<string>;

  /**
   * Log a warning when a translation key is missing in the namespace.
   * Helps identify untranslated error codes during development.
   * @default true
   */
  warnOnMissingKeys?: boolean;
}

// ---------------------------------------------------------------------------
// Duck-type detection for Better Auth's APIError.
// Checks `name === "APIError"` + numeric statusCode — matches the shape
// produced by `better-call`'s APIError class without importing it.
// ---------------------------------------------------------------------------

interface APIErrorLike {
  name: string;
  statusCode: number;
  body: {
    message?: string;
    code: string;
    [key: string]: unknown;
  };
  message?: string;
}

function isAPIErrorLike(value: unknown): value is APIErrorLike {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;
  if (obj.name !== "APIError" || typeof obj.statusCode !== "number") return false;

  const body = obj.body;
  if (!body || typeof body !== "object") return false;
  return typeof (body as Record<string, unknown>).code === "string";
}

/**
 * Creates a Better Auth plugin that translates error messages using your
 * Better i18n project's CDN translations.
 *
 * Unlike bundled localization packages, translations are fetched from the CDN
 * at runtime — add or update translations from the dashboard, no redeployment
 * needed. Missing keys log a warning and fall back to the original English
 * message, so auth never breaks.
 *
 * @param i18n - The `ServerI18n` singleton from `createServerI18n()`
 * @param options - Optional configuration (namespace, locale resolver, etc.)
 * @returns A Better Auth plugin — pass it to `betterAuth({ plugins: [...] })`
 *
 * @example
 * ```ts
 * import { createServerI18n } from "@better-i18n/server";
 * import { createBetterAuthProvider } from "@better-i18n/server/providers/better-auth";
 *
 * const i18n = createServerI18n({
 *   project: "acme/dashboard",
 *   defaultLocale: "en",
 * });
 *
 * export const auth = betterAuth({
 *   plugins: [
 *     createBetterAuthProvider(i18n),
 *   ],
 * });
 * ```
 */
export function createBetterAuthProvider(
  i18n: ServerI18n,
  options?: BetterAuthProviderOptions,
) {
  const namespace = options?.namespace ?? "auth";
  const warnOnMissing = options?.warnOnMissingKeys ?? true;

  return {
    id: "better-i18n" as const,
    hooks: {
      after: [
        {
          matcher: () => true,
          handler: async (ctx: HookContext) => {
            const returned = ctx.context.returned;

            // Only intercept APIError responses that carry an error code
            if (!isAPIErrorLike(returned)) return;

            const { body } = returned;
            const errorCode = body.code;

            // ── Detect locale ──────────────────────────────────────
            let locale: string;
            try {
              if (options?.getLocale) {
                locale = await options.getLocale({ headers: ctx.headers });
              } else if (ctx.headers) {
                locale = await i18n.detectLocaleFromHeaders(ctx.headers);
              } else {
                locale = i18n.config.defaultLocale;
              }
            } catch {
              // Locale detection failed — keep original message
              return;
            }

            // ── Translate ──────────────────────────────────────────
            try {
              const t = await i18n.getTranslator(locale, namespace);
              const translated = t(errorCode);

              // use-intl returns "namespace.key" for missing keys (default
              // getMessageFallback). Detect this to avoid replacing a
              // readable message with a raw fallback string.
              const isFallback =
                translated === errorCode ||
                translated === `${namespace}.${errorCode}`;

              if (!isFallback && translated) {
                body.message = translated;
                // Also update Error.message for consistent logging
                // eslint-disable-next-line @typescript-eslint/no-explicit-any -- APIError.message is writable
                (returned as any).message = translated;
              } else if (warnOnMissing) {
                console.warn(
                  `[better-i18n] Missing auth translation: "${errorCode}" (locale: ${locale}, namespace: ${namespace})`,
                );
              }
            } catch {
              // CDN fetch failed or namespace missing — keep original message.
              // Auth must never break because of i18n.
            }
          },
        },
      ],
    },
  };
}

// ---------------------------------------------------------------------------
// Default English keys for Better Auth core error codes.
//
// Seed your Better i18n project's "auth" namespace with these keys,
// then translate them from the dashboard. Use with MCP `createKeys` tool
// or import in your seed script.
//
// These cover Better Auth core only. Plugin-specific error codes
// (admin, two-factor, email-otp, etc.) can be added as separate keys.
// ---------------------------------------------------------------------------

/**
 * All Better Auth core error codes with their default English messages.
 * Use these to seed your project's "auth" namespace.
 *
 * @example
 * ```ts
 * import { DEFAULT_AUTH_KEYS } from "@better-i18n/server/providers/better-auth";
 *
 * // Seed via MCP createKeys tool
 * for (const [key, message] of Object.entries(DEFAULT_AUTH_KEYS)) {
 *   await createKey({ namespace: "auth", key, translations: { en: message } });
 * }
 * ```
 */
export const DEFAULT_AUTH_KEYS: Record<string, string> = {
  // ── Authentication ─────────────────────────────────────────────────
  INVALID_EMAIL_OR_PASSWORD: "Invalid email or password",
  INVALID_PASSWORD: "Invalid password",
  INVALID_EMAIL: "Invalid email",
  INVALID_TOKEN: "Invalid token",
  TOKEN_EXPIRED: "Token expired",
  EMAIL_NOT_VERIFIED: "Email not verified",
  EMAIL_ALREADY_VERIFIED: "Email is already verified",
  EMAIL_MISMATCH: "Email mismatch",

  // ── User management ────────────────────────────────────────────────
  USER_NOT_FOUND: "User not found",
  USER_ALREADY_EXISTS: "User already exists.",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
    "User already exists. Use another email.",
  INVALID_USER: "Invalid user",
  USER_EMAIL_NOT_FOUND: "User email not found",
  USER_ALREADY_HAS_PASSWORD:
    "User already has a password. Provide that to delete the account.",
  FAILED_TO_CREATE_USER: "Failed to create user",
  FAILED_TO_UPDATE_USER: "Failed to update user",
  FAILED_TO_GET_USER_INFO: "Failed to get user info",

  // ── Session ────────────────────────────────────────────────────────
  SESSION_EXPIRED:
    "Session expired. Re-authenticate to perform this action.",
  SESSION_NOT_FRESH: "Session is not fresh",
  FAILED_TO_CREATE_SESSION: "Failed to create session",
  FAILED_TO_GET_SESSION: "Failed to get session",

  // ── Password ───────────────────────────────────────────────────────
  PASSWORD_TOO_SHORT: "Password too short",
  PASSWORD_TOO_LONG: "Password too long",
  PASSWORD_ALREADY_SET: "User already has a password set",
  CREDENTIAL_ACCOUNT_NOT_FOUND: "Credential account not found",

  // ── Account & Social ──────────────────────────────────────────────
  ACCOUNT_NOT_FOUND: "Account not found",
  SOCIAL_ACCOUNT_ALREADY_LINKED: "Social account already linked",
  LINKED_ACCOUNT_ALREADY_EXISTS: "Linked account already exists",
  FAILED_TO_UNLINK_LAST_ACCOUNT: "You can't unlink your last account",
  PROVIDER_NOT_FOUND: "Provider not found",
  ID_TOKEN_NOT_SUPPORTED: "id_token not supported",

  // ── Email verification ─────────────────────────────────────────────
  VERIFICATION_EMAIL_NOT_ENABLED: "Verification email isn't enabled",
  EMAIL_CAN_NOT_BE_UPDATED: "Email can not be updated",
  FAILED_TO_CREATE_VERIFICATION: "Unable to create verification",

  // ── URL validation ─────────────────────────────────────────────────
  INVALID_ORIGIN: "Invalid origin",
  INVALID_CALLBACK_URL: "Invalid callbackURL",
  INVALID_REDIRECT_URL: "Invalid redirectURL",
  INVALID_ERROR_CALLBACK_URL: "Invalid errorCallbackURL",
  INVALID_NEW_USER_CALLBACK_URL: "Invalid newUserCallbackURL",
  MISSING_OR_NULL_ORIGIN: "Missing or null Origin",
  CALLBACK_URL_REQUIRED: "callbackURL is required",

  // ── Security ───────────────────────────────────────────────────────
  CROSS_SITE_NAVIGATION_LOGIN_BLOCKED:
    "Cross-site navigation login blocked. This request appears to be a CSRF attack.",

  // ── Validation ─────────────────────────────────────────────────────
  VALIDATION_ERROR: "Validation Error",
  MISSING_FIELD: "Field is required",
  FIELD_NOT_ALLOWED: "Field not allowed to be set",
  ASYNC_VALIDATION_NOT_SUPPORTED: "Async validation is not supported",
  BODY_MUST_BE_AN_OBJECT: "Body must be an object",
  METHOD_NOT_ALLOWED_DEFER_SESSION_REQUIRED:
    "POST method requires deferSessionRefresh to be enabled in session config",
};
