import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  Outlet,
  Link,
  redirect,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BetterI18nProvider,
  getLocaleFromPath,
  useTranslations,
} from "@better-i18n/use-intl";
import type { Messages } from "@better-i18n/use-intl";
import { getMessages } from "@better-i18n/use-intl/server";
import { detectLocale } from "@better-i18n/core";
import { getRequestHeader } from "@tanstack/react-start/server";
import { i18nConfig } from "../i18n.config";
import { filterMessagesByPath } from "../lib/page-namespaces";
import { fetchLocales } from "../lib/locales";
import appCss from "../styles.css?url";
import { MarketingLayout } from "../components/MarketingLayout";
import { SvgSprite } from "../components/SvgSprite";
import { IconArrowLeft } from "@central-icons-react/round-outlined-radius-2-stroke-2";

/**
 * Per-request SSR side-channel for i18n messages.
 *
 * Keyed by a unique requestId generated in beforeLoad — safe under concurrent
 * requests on CF Workers (unlike a single module-scoped variable).
 *
 * Entries are deleted immediately after the synchronous React render reads them.
 * Safety cap of 50 entries prevents leaks from errored requests that never render.
 */
const ssrMessagesByRequest = new Map<string, Messages>();
const SSR_MAP_MAX_SIZE = 50;

/**
 * Reads i18n messages from the `<script id="__i18n_messages__">` tag
 * injected during SSR. Called synchronously during React hydration.
 */
function getClientMessages(): Messages | undefined {
  if (typeof document === "undefined") return undefined;
  const el = document.getElementById("__i18n_messages__");
  if (!el?.textContent) return undefined;
  try {
    return JSON.parse(el.textContent) as Messages;
  } catch {
    return undefined;
  }
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes cache
        refetchOnWindowFocus: false,
      },
    },
  });
}

interface RouterContext {
  locale: string;
  locales: string[];
  requestId: string; // Unique per SSR request — keys into ssrMessagesByRequest
}

/**
 * Paths that are handled by dedicated non-locale routes (API, etc.)
 * and should NOT be redirected to /$locale/...
 */
const BYPASS_LOCALE_CHECK = new Set(["api", "brand"]);

export const Route = createRootRouteWithContext<RouterContext>()({
  staleTime: 0, // locale değişince loader'ın yeniden çalışması gerekiyor
  beforeLoad: async ({ location }) => {
    const locales = await fetchLocales();
    const localeConfig = {
      locales,
      defaultLocale: i18nConfig.defaultLocale,
    };

    // Detect locale from URL path or geo-IP.
    // Routes without a valid locale prefix (including root /) get redirected
    // to /{detectedLocale}/{path} using CF Worker's X-Country header.
    const segments = location.pathname.split("/").filter(Boolean);
    const firstSegment = segments[0];
    const hasLocalePrefix = firstSegment && locales.includes(firstSegment);
    const isBypassPath = firstSegment && BYPASS_LOCALE_CHECK.has(firstSegment);

    if (!hasLocalePrefix && !isBypassPath) {
      const search = location.searchStr || "";
      const hash = location.hash || "";

      // Detect locale from geo (CF Worker X-Country header) or fallback to default
      let countryCode: string | undefined;
      if (typeof document === "undefined") {
        try {
          countryCode = getRequestHeader("X-Country") ?? undefined;
        } catch {
          // getRequestHeader may throw outside request context (dev server)
        }
      }

      const { locale: detectedLocale } = detectLocale({
        project: i18nConfig.project,
        defaultLocale: i18nConfig.defaultLocale,
        availableLocales: locales,
        countryCode,
      });

      // Cache warming: pre-load messages before redirect so loader gets a TtlCache hit
      await getMessages({ project: i18nConfig.project, locale: detectedLocale }).catch(() => {});

      const targetPath = location.pathname === "/" ? "" : location.pathname;
      throw redirect({
        href: `/${detectedLocale}${targetPath}${search}${hash}`,
        statusCode: 301,
      });
    }

    const locale = getLocaleFromPath(location.pathname, localeConfig);
    const requestId = crypto.randomUUID();

    return { locale, locales, requestId };
  },

  loader: async ({ context, location }) => {
    const allMessages = await getMessages({ project: i18nConfig.project, locale: context.locale });
    const messages = filterMessagesByPath(allMessages, location.pathname);

    const isSSR = typeof document === "undefined";
    if (isSSR) {
      // SSR: store in per-request Map, keep out of loader data (avoids dehydration).
      if (ssrMessagesByRequest.size >= SSR_MAP_MAX_SIZE) {
        const firstKey = ssrMessagesByRequest.keys().next().value;
        if (firstKey) ssrMessagesByRequest.delete(firstKey);
      }
      ssrMessagesByRequest.set(context.requestId, messages);
    }
    // SSR: messages=undefined (tiny in dehydration). Client nav: messages=full data.
    return { locale: context.locale, messages: isSSR ? undefined : messages };
  },

  head: () => {
    return {
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          name: "google",
          content: "notranslate",
        },
        {
          name: "theme-color",
          content: "#0a0a0a",
        },
      ],
      links: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
        { rel: "manifest", href: "/site.webmanifest" },
        // TODO: restore dns-prefetch for og.better-i18n.com when OG service is live
        {
          rel: "dns-prefetch",
          href: "https://dash.better-i18n.com",
        },
        {
          rel: "dns-prefetch",
          href: "https://docs.better-i18n.com",
        },
        {
          rel: "preload",
          href: "/fonts/Geist-Variable.woff2",
          as: "font",
          type: "font/woff2",
          crossOrigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: appCss,
        },
      ],
      scripts: [
        // Google Tag Manager — deferred 3s to improve Core Web Vitals (TBT/INP)
        {
          children: `setTimeout(function(){(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-K2JQTFM3')},3000)`,
        },
        // Google Analytics (gtag.js) — deferred 3s to match GTM timing
        {
          children: `setTimeout(function(){var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=G-1QZTX3QHPX';document.head.appendChild(s);s.onload=function(){window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-1QZTX3QHPX')}},3000)`,
        },
      ],
    };
  },

  component: RootComponent,
  notFoundComponent: NotFoundPage,
});

function NotFoundPage() {
  const t = useTranslations("common");
  const { locale } = Route.useRouteContext();

  return (
    <MarketingLayout showCTA={false} bgClassName="bg-white">
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <p className="font-display text-6xl font-medium tracking-[-0.02em] text-mist-300 sm:text-8xl">
            404
          </p>
          <h1 className="mt-4 font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1]">
            {t("notFound.title", { defaultValue: "Page not found" })}
          </h1>
          <p className="mt-4 text-lg text-mist-600">
            {t("notFound.description", {
              defaultValue:
                "The page you're looking for doesn't exist or has been moved.",
            })}
          </p>
          <Link
            to="/$locale"
            params={{ locale }}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-mist-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-mist-800 transition-colors"
          >
            <IconArrowLeft className="w-4 h-4" />
            {t("notFound.backHome", { defaultValue: "Back to Home" })}
          </Link>
        </div>
      </div>
    </MarketingLayout>
  );
}

function RootComponent() {
  const { locale, locales, requestId } = Route.useRouteContext();
  // Per-mount QueryClient — prevents cross-request cache leak on CF Workers
  const [queryClient] = useState(createQueryClient);

  const loaderData = Route.useLoaderData();

  // SSR: per-request Map (race-free across concurrent CF Worker requests)
  // Client hydration: <script id="__i18n_messages__"> tag from SSR HTML
  // Client navigation: loader data (fresh messages for the new page)
  const messages = (() => {
    if (typeof document === "undefined") {
      const msgs = ssrMessagesByRequest.get(requestId);
      if (msgs) ssrMessagesByRequest.delete(requestId);
      return msgs;
    }
    return loaderData.messages ?? getClientMessages();
  })();

  useEffect(() => {
    if (import.meta.env.DEV) {
      import("react-grab");
      import("react-scan").then(({ scan }) => {
        scan({ enabled: true });
      });
    }
  }, []);

  return (
    <html lang={locale} translate="no" className="notranslate">
      <head>
        <HeadContent />
        {/* SSR locales → prevents client fetchLocales() from making a CDN round-trip.
            type="application/json" means the browser never executes this — no XSS risk. */}
        <script
          type="application/json"
          id="__i18n_locales__"
          suppressHydrationWarning
        >
          {JSON.stringify(locales)}
        </script>
      </head>
      <body className="no-dark text-mist-950">
        {/* SSR messages — keeps ~30-60 KB out of TSR's dehydration pipeline.
            type="application/json" = browser never executes this (no XSS risk).
            Client reads synchronously during hydration via getClientMessages(). */}
        <script
          type="application/json"
          id="__i18n_messages__"
          suppressHydrationWarning
        >
          {JSON.stringify(messages)}
        </script>
        <SvgSprite />
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K2JQTFM3"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <QueryClientProvider client={queryClient}>
          <BetterI18nProvider
            project={i18nConfig.project}
            locale={locale}
            messages={messages}
            timeZone="UTC"
            getMessageFallback={({ key }) => {
              const lastSegment = key.split(".").pop() || key;
              return lastSegment
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (c) => c.toUpperCase())
                .trim();
            }}
          >
            <Outlet />
          </BetterI18nProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
