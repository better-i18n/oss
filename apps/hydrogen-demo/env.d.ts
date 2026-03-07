/// <reference types="vite/client" />
/// <reference types="@shopify/remix-oxygen" />
/// <reference types="@shopify/hydrogen/storefront.d.ts" />
/// <reference types="@react-router/dev/vite-plugin" />

import type { HydrogenCart, Storefront } from "@shopify/hydrogen";
import type { Messages, LanguageOption } from "@better-i18n/remix";

declare global {
  /**
   * A global `process` object is only available during build to access NODE_ENV.
   */
  const process: { env: { NODE_ENV: string } };

  /**
   * Declare expected Env parameter in fetch handler.
   */
  interface Env {
    SESSION_SECRET: string;
    PUBLIC_STOREFRONT_API_TOKEN: string;
    PRIVATE_STOREFRONT_API_TOKEN: string;
    PUBLIC_STORE_DOMAIN: string;
    PUBLIC_STOREFRONT_API_VERSION: string;
    GITHUB_TOKEN?: string;
  }
}

declare module "@shopify/remix-oxygen" {
  interface AppLoadContext {
    storefront: Storefront;
    cart: HydrogenCart;
    env: Env;
    locale: string;
    messages: Messages;
    languages: LanguageOption[];
  }
}
