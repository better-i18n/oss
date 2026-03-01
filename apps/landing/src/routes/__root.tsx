import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  Outlet,
  Link,
  redirect,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BetterI18nProvider,
  getLocaleFromPath,
  useTranslations,
} from "@better-i18n/use-intl";
import { getMessages } from "@better-i18n/use-intl/server";
import { i18nConfig } from "../i18n.config";
import { fetchLocales } from "../lib/locales";
import appCss from "../styles.css?url";
import { MarketingLayout } from "../components/MarketingLayout";
import { IconArrowLeft } from "@central-icons-react/round-outlined-radius-2-stroke-2";

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

/**
 * Paths that are handled by dedicated non-locale routes (API, etc.)
 * and should NOT be redirected to /$locale/...
 */
const BYPASS_LOCALE_CHECK = new Set(["api"]);

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ location }) => {
    const locales = await fetchLocales();
    const localeConfig = {
      locales,
      defaultLocale: i18nConfig.defaultLocale,
    };

    // Redirect non-locale first segments to /{defaultLocale}/{path}.
    // Without this, TanStack Router's $locale param accepts any string
    // (e.g., "blog", "compare") and renders the homepage with broken nav links.
    const segments = location.pathname.split("/").filter(Boolean);
    const firstSegment = segments[0];

    if (
      firstSegment &&
      !locales.includes(firstSegment) &&
      !BYPASS_LOCALE_CHECK.has(firstSegment)
    ) {
      const search = location.searchStr || "";
      const hash = location.hash || "";
      throw redirect({
        href: `/${i18nConfig.defaultLocale}${location.pathname}${search}${hash}`,
        statusCode: 301,
      });
    }

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
        {
          name: "theme-color",
          content: "#0a0a0a",
        },
      ],
      links: [
        {
          rel: "icon",
          href: "/favicon.ico",
        },
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
          rel: "dns-prefetch",
          href: "https://og.better-i18n.com",
        },
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
          href: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap",
          as: "style",
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
