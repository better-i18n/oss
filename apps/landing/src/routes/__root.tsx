import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  Outlet,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BetterI18nProvider, getLocaleFromPath } from "@better-i18n/use-intl";
import { getMessages } from "@better-i18n/use-intl/server";
import { i18nConfig } from "../i18n.config";
import { fetchLocales } from "../lib/locales";
import appCss from "../styles.css?url";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes cache
      refetchOnWindowFocus: false,
    },
  },
});

interface RouterContext {
  locale: string;
  messages: Record<string, string>;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ location }) => {
    const locales = await fetchLocales();
    const localeConfig = {
      locales,
      defaultLocale: i18nConfig.defaultLocale,
    };
    const locale = getLocaleFromPath(location.pathname, localeConfig);

    const messages = await getMessages({
      project: i18nConfig.project,
      locale,
    });

    return {
      locale,
      messages,
    };
  },

  loader: ({ context }) => {
    return {
      locale: context.locale,
      messages: context.messages,
    };
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
      ],
      links: [
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap",
        },
        {
          rel: "stylesheet",
          href: appCss,
        },
      ],
      scripts: [
        // Google Ads (gtag.js)
        {
          src: "https://www.googletagmanager.com/gtag/js?id=AW-17928422726",
          async: true,
        },
        {
          children: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-17928422726');`,
        },
      ],
    };
  },

  component: RootComponent,
});

function RootComponent() {
  const { messages, locale } = Route.useRouteContext();

  useEffect(() => {
    if (import.meta.env.DEV) {
      import("react-grab");
    }
  }, []);

  return (
    <html lang={locale} translate="no" className="notranslate">
      <head>
        <HeadContent />
      </head>
      <body className="no-dark text-mist-950">
        <QueryClientProvider client={queryClient}>
          <BetterI18nProvider
            project={i18nConfig.project}
            locale={locale}
            messages={messages}
            timeZone="UTC"
          >
            <Outlet />
          </BetterI18nProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
