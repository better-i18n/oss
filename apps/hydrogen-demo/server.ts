import { createStorefrontClient } from "@shopify/hydrogen";
import { createRequestHandler } from "@shopify/remix-oxygen";
import { getLocaleFromRequest } from "~/lib/i18n";
import { i18n } from "~/i18n.server";

// @ts-expect-error - virtual module provided by React Router/Vite build
import * as remixBuild from "virtual:react-router/server-build";

interface WorkerExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: WorkerExecutionContext,
  ): Promise<Response> {
    const cache = await caches.open("hydrogen");

    // Canonical redirect: /en/... → /... (English is the default locale, no prefix)
    const url = new URL(request.url);
    if (/^\/en(\/|$)/.test(url.pathname)) {
      url.pathname = url.pathname.slice(3) || "/";
      return Response.redirect(url.toString(), 301);
    }

    // 1. Fetch CDN language list (TtlCache'd — instant after first request)
    const languages = await i18n.getLanguages();

    // 2. Detect locale from URL path, validated against CDN language list
    const { locale, i18n: shopifyI18n } = getLocaleFromRequest(request, languages);

    // 3. Load Better i18n translations from CDN
    const messages = await i18n.getMessages(locale);

    // 4. Create Shopify Storefront client with locale
    const { storefront } = createStorefrontClient({
      cache,
      waitUntil: (p: Promise<unknown>) => executionContext.waitUntil(p),
      publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
      storeDomain: env.PUBLIC_STORE_DOMAIN,
      storefrontApiVersion: env.PUBLIC_STOREFRONT_API_VERSION || "2026-01",
      i18n: shopifyI18n,
    });

    const handleRequest = createRequestHandler({
      build: remixBuild,
      mode: process.env.NODE_ENV,
      getLoadContext() {
        return {
          storefront,
          env,
          locale,
          messages,
          languages,
          cart: {} as never, // Cart not implemented in demo
        };
      },
    });

    return handleRequest(request);
  },
};
