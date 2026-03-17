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
} from "@better-i18n/use-intl";
import type { Messages } from "@better-i18n/use-intl";
import { getMessages, detectLocale } from "@better-i18n/use-intl/server";
import { i18nConfig } from "../i18n.config";
import { fetchLocales } from "../lib/locales";
import appCss from "../styles.css?url";
import { IconArrowLeft } from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { useT } from "@/lib/i18n";

/**
 * Per-request SSR side-channel for i18n messages.
 * Keyed by unique requestId — safe under concurrent CF Worker requests.
 */
const ssrMessagesByRequest = new Map<string, Messages>();
const SSR_MAP_MAX_SIZE = 50;

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
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  });
}

interface RouterContext {
  locale: string;
  locales: string[];
  requestId: string;
}

const BYPASS_LOCALE_CHECK = new Set(["api"]);

export const Route = createRootRouteWithContext<RouterContext>()({
  staleTime: Infinity,
  beforeLoad: async ({ location }) => {
    const locales = await fetchLocales();
    const localeConfig = {
      locales,
      defaultLocale: i18nConfig.defaultLocale,
    };

    const segments = location.pathname.split("/").filter(Boolean);
    const firstSegment = segments[0];

    if (
      firstSegment &&
      !locales.includes(firstSegment) &&
      !BYPASS_LOCALE_CHECK.has(firstSegment)
    ) {
      const search = location.searchStr || "";
      const hash = location.hash || "";

      const detectedLocale = detectLocale({
        availableLocales: locales,
        defaultLocale: i18nConfig.defaultLocale,
      });

      await getMessages({ project: i18nConfig.project, locale: detectedLocale }).catch(() => {});

      throw redirect({
        href: `/${detectedLocale}${location.pathname}${search}${hash}`,
        statusCode: 301,
      });
    }

    const locale = getLocaleFromPath(location.pathname, localeConfig);
    const requestId = crypto.randomUUID();

    return { locale, locales, requestId };
  },

  loader: async ({ context }) => {
    const messages = await getMessages({ project: i18nConfig.project, locale: context.locale }).catch(() => ({}));

    const isSSR = typeof document === "undefined";
    if (isSSR) {
      if (ssrMessagesByRequest.size >= SSR_MAP_MAX_SIZE) {
        const firstKey = ssrMessagesByRequest.keys().next().value;
        if (firstKey) ssrMessagesByRequest.delete(firstKey);
      }
      ssrMessagesByRequest.set(context.requestId, messages);
    }

    return { locale: context.locale, messages: isSSR ? undefined : messages };
  },

  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "google", content: "notranslate" },
      { name: "theme-color", content: "#181c1e" },
    ],
    links: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "dns-prefetch", href: "https://cdn.better-i18n.com" },
      {
        rel: "preload",
        href: "/fonts/Geist-Variable.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),

  component: RootComponent,
  notFoundComponent: NotFoundPage,
});

function NotFoundPage() {
  const t = useT("common");
  const { locale } = Route.useRouteContext();

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <p className="text-6xl font-medium tracking-tight text-mist-300">404</p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-mist-950">
          {t("notFound.title")}
        </h1>
        <p className="mt-2 text-mist-600">
          {t("notFound.description")}
        </p>
        <Link
          to="/$locale"
          params={{ locale }}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-mist-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-mist-800 transition-colors"
        >
          <IconArrowLeft className="size-4" />
          {t("notFound.backHome")}
        </Link>
      </div>
    </div>
  );
}

function RootComponent() {
  const { locale, locales, requestId } = Route.useRouteContext();
  const [queryClient] = useState(createQueryClient);
  const loaderData = Route.useLoaderData();

  useEffect(() => {
    if (import.meta.env.DEV) {
      import("react-grab");
      import("react-scan").then(({ scan }) => {
        scan({ enabled: true });
      });
    }
  }, []);

  const messages = (() => {
    if (typeof document === "undefined") {
      const msgs = ssrMessagesByRequest.get(requestId);
      if (msgs) ssrMessagesByRequest.delete(requestId);
      return msgs;
    }
    return loaderData.messages ?? getClientMessages();
  })();

  return (
    <html lang={locale} translate="no" className="notranslate" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("theme")==="dark"||(!localStorage.getItem("theme")&&matchMedia("(prefers-color-scheme:dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`,
          }}
        />
        <script
          type="application/json"
          id="__i18n_locales__"
          suppressHydrationWarning
        >
          {JSON.stringify(locales)}
        </script>
      </head>
      <body className="text-mist-950">
        <script
          type="application/json"
          id="__i18n_messages__"
          suppressHydrationWarning
        >
          {JSON.stringify(messages)}
        </script>
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
