import { createI18nCore, normalizeLocale } from "@better-i18n/core";
import type { Plugin } from "vite";

export interface BetterI18nPluginOptions {
  /**
   * Project identifier in "org/project" format.
   * This is the single source of truth — `BetterI18nProvider` reads it
   * from the injected `<script>` tag, so you don't need to pass it as a prop.
   *
   * @example "acme/dashboard"
   */
  project: string;

  /**
   * Default locale when no locale is detected from URL, cookie, or Accept-Language.
   * @default "en"
   */
  defaultLocale?: string;

  /**
   * Cookie name used to persist the user's locale preference.
   * @default "locale"
   */
  localeCookie?: string;

  /**
   * CDN base URL override.
   * @default "https://cdn.better-i18n.com"
   */
  cdnBaseUrl?: string;
}

/**
 * Vite plugin for Better i18n — server-side translation injection.
 *
 * Fetches translations on the server (dev server or build) and injects
 * them into the HTML as a `<script id="__better_i18n__">` tag.
 * `BetterI18nProvider` reads this data synchronously on first render,
 * eliminating FOUC (Flash of Untranslated Content).
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import { betterI18n } from '@better-i18n/vite'
 *
 * export default defineConfig({
 *   plugins: [
 *     betterI18n({ project: 'acme/dashboard' }),
 *     react(),
 *   ],
 * })
 * ```
 *
 * Then in your app — no project/locale/messages props needed:
 * ```tsx
 * <BetterI18nProvider>
 *   <LocaleDropdown />
 *   <App />
 * </BetterI18nProvider>
 * ```
 */
export function betterI18n(options: BetterI18nPluginOptions): Plugin {
  const {
    project,
    defaultLocale = "en",
    localeCookie = "locale",
    cdnBaseUrl,
  } = options;

  // Singleton core instance — TtlCache shared across requests
  const i18nCore = createI18nCore({
    project,
    defaultLocale,
    cdnBaseUrl,
  });

  // Request-scoped locale detection (middleware → transformIndexHtml bridge)
  const requestLocales = new Map<string, string>();

  return {
    name: "better-i18n",

    configureServer(server) {
      // Middleware runs BEFORE Vite serves HTML — detects locale from request
      server.middlewares.use((req, _res, next) => {
        if (!req.url) return next();

        const locale = detectLocaleFromRequest(
          req.headers.cookie,
          req.headers["accept-language"] as string | undefined,
          req.url,
          localeCookie,
          defaultLocale,
        );

        requestLocales.set(req.url, locale);
        next();
      });
    },

    transformIndexHtml: {
      order: "pre",
      handler: async (_html, ctx) => {
        // Resolve locale: middleware-detected → default
        const requestUrl = ctx.originalUrl || ctx.path;
        let locale = requestLocales.get(requestUrl) || defaultLocale;
        requestLocales.delete(requestUrl);

        // Fetch languages first to validate locale against supported locales
        const languages = await i18nCore.getLanguages();
        const supportedLocales = languages.map((l: { code: string }) => l.code);

        // Fallback to default if detected locale is not supported
        if (!supportedLocales.includes(locale)) {
          locale = defaultLocale;
        }

        const messages = await i18nCore.getMessages(locale);

        // Inject as <script> tag — provider reads this synchronously
        const payload = JSON.stringify({
          project,
          locale,
          messages,
          languages,
          localeCookie,
          supportedLocales,
        });

        return {
          html: _html,
          tags: [
            {
              tag: "script",
              attrs: {
                id: "__better_i18n__",
                type: "application/json",
              },
              children: payload,
              injectTo: "head",
            },
          ],
        };
      },
    },
  };
}

// ─── Locale Detection ─────────────────────────────────────────────

/**
 * Detect locale from request context.
 * Priority: URL path segment → cookie → Accept-Language → default
 */
function detectLocaleFromRequest(
  cookieHeader: string | undefined,
  acceptLanguageHeader: string | undefined,
  url: string,
  cookieName: string,
  defaultLocale: string,
): string {
  // 1. URL path locale (e.g., /tr/about → "tr")
  const pathname = url.split("?")[0] || "/";
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];
  if (firstSegment && /^[a-z]{2}(-[a-z]{2,4})?$/i.test(firstSegment)) {
    return normalizeLocale(firstSegment);
  }

  // 2. Cookie locale
  const cookieLocale = parseCookieValue(cookieHeader, cookieName);
  if (cookieLocale) {
    return normalizeLocale(cookieLocale);
  }

  // 3. Accept-Language header (first match)
  if (acceptLanguageHeader) {
    const preferred = parseAcceptLanguageFirst(acceptLanguageHeader);
    if (preferred) {
      return normalizeLocale(preferred);
    }
  }

  return defaultLocale;
}

/** Extract a single cookie value by name */
function parseCookieValue(
  header: string | undefined,
  name: string,
): string | null {
  if (!header) return null;
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match?.[1]?.trim() || null;
}

/** Extract the highest-priority language from Accept-Language header */
function parseAcceptLanguageFirst(header: string): string | null {
  const first = header.split(",")[0];
  if (!first) return null;
  const tag = first.split(";")[0]?.trim();
  if (!tag || tag === "*") return null;
  // Return base language (e.g., "tr-TR" → "tr")
  return tag.split("-")[0] || null;
}
