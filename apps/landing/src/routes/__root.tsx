import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  Outlet,
} from "@tanstack/react-router";
import { BetterI18nProvider, getLocaleFromPath } from "@better-i18n/use-intl";
import { getMessages } from "@better-i18n/use-intl/server";
import { i18nConfig } from "../i18n.config";
import appCss from "../styles.css?url";
import {
  getLocalizedMeta,
  formatMetaTags,
  getAlternateLinks,
  getCanonicalLink,
} from "../lib/meta";
import { getHomePageStructuredData } from "../lib/structured-data";

interface RouterContext {
  locale: string;
  messages: Record<string, string>;
}

const localeConfig = {
  locales: i18nConfig.locales,
  defaultLocale: i18nConfig.defaultLocale,
};

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ location }) => {
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

  head: ({ loaderData }) => {
    const locale = loaderData?.locale || "en";
    const meta = getLocalizedMeta(loaderData?.messages || {}, "home", {
      locale,
      pathname: "/",
    });

    return {
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        ...formatMetaTags(meta, { locale }),
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
          href: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wft@400;500&display=swap",
        },
        {
          rel: "stylesheet",
          href: appCss,
        },
        ...getAlternateLinks("/", i18nConfig.locales),
        getCanonicalLink(locale, "/"),
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
        // Structured data
        ...getHomePageStructuredData(),
      ],
    };
  },

  component: RootComponent,
});

function RootComponent() {
  const { messages, locale } = Route.useRouteContext();

  return (
    <html lang={locale}>
      <head>
        <HeadContent />
      </head>
      <body className="no-dark text-mist-950">
        <BetterI18nProvider
          project={i18nConfig.project}
          locale={locale}
          messages={messages}
          timeZone="UTC"
        >
          <Outlet />
        </BetterI18nProvider>
        <Scripts />
      </body>
    </html>
  );
}
