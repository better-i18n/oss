import {
  createStorefrontClient,
  createCartHandler,
  cartGetIdDefault,
  cartSetIdDefault,
} from "@shopify/hydrogen";
import { createRequestHandler } from "@shopify/remix-oxygen";
import { deriveShopifyLocale } from "~/lib/i18n";
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

    // 1. Detect locale via @better-i18n/remix — respects localePrefix config,
    //    validates against CDN language list (BCP 47 fallback on CDN miss).
    const [locale, languages] = await Promise.all([
      i18n.getLocaleFromRequest(request),
      i18n.getLanguages(),
    ]);

    const shopifyI18n = deriveShopifyLocale(locale, locale === i18n.config.defaultLocale);

    // 2. Create Shopify Storefront client
    const { storefront } = createStorefrontClient({
      cache,
      waitUntil: (p: Promise<unknown>) => executionContext.waitUntil(p),
      publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
      storeDomain: env.PUBLIC_STORE_DOMAIN,
      storefrontApiVersion: env.PUBLIC_STOREFRONT_API_VERSION || "2026-01",
      i18n: shopifyI18n,
    });

    // 3. Create cart handler
    const cart = createCartHandler({
      storefront,
      getCartId: cartGetIdDefault(request.headers),
      setCartId: cartSetIdDefault(),
    });

    const handleRequest = createRequestHandler({
      build: remixBuild,
      mode: process.env.NODE_ENV,
      getLoadContext() {
        return {
          storefront,
          env,
          locale,
          shopifyI18n,
          languages,
          cart,
        };
      },
    });

    const response = await handleRequest(request);

    // Persist detected locale to cookie so returning visitors get their
    // chosen language — no geo-IP dependency required.
    const localeCookie = i18n.getLocaleCookieHeader(locale, request);
    if (localeCookie) response.headers.append("Set-Cookie", localeCookie);

    return response;
  },
};
