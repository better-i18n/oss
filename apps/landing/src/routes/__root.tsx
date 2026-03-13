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
import { getMessages, detectLocale } from "@better-i18n/use-intl/server";
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
  locales: string[]; // Populated by beforeLoad via fetchLocales()
}

/**
 * Paths that are handled by dedicated non-locale routes (API, etc.)
 * and should NOT be redirected to /$locale/...
 */
const BYPASS_LOCALE_CHECK = new Set(["api"]);

export const Route = createRootRouteWithContext<RouterContext>()({
  staleTime: 0, // locale değişince loader'ın yeniden çalışması gerekiyor
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

      const detectedLocale = detectLocale({
        availableLocales: locales,
        defaultLocale: i18nConfig.defaultLocale,
      });

      // Cache ısıtma: redirect'ten önce yükle → loader anında TtlCache'e hit eder → flash yok
      await getMessages({ project: i18nConfig.project, locale: detectedLocale }).catch(() => {});

      throw redirect({
        href: `/${detectedLocale}${location.pathname}${search}${hash}`,
        statusCode: 301,
      });
    }

    const locale = getLocaleFromPath(location.pathname, localeConfig);

    return { locale, locales };
  },

  loader: async ({ context }) => {
    const messages = await getMessages({
      project: i18nConfig.project,
      locale: context.locale,
    });
    return { locale: context.locale, locales: context.locales, messages };
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
        // Google Tag Manager
        {
          children: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-K2JQTFM3');`,
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
  const { locale, locales } = Route.useRouteContext();
  const { messages } = Route.useLoaderData();

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
