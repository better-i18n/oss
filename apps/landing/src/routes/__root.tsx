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
import { getLocalizedMeta, formatMetaTags } from "../lib/meta";

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
    const meta = getLocalizedMeta(loaderData?.messages || {}, "home");
    const locale = loaderData?.locale || "en";

    return {
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        ...formatMetaTags(meta),
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
        {
          rel: "alternate",
          href: "https://better-i18n.com",
          hreflang: "en",
        },
        {
          rel: "alternate",
          href: "https://better-i18n.com/tr",
          hreflang: "tr",
        },
        {
          rel: "alternate",
          href: "https://better-i18n.com",
          hreflang: "x-default",
        },
        {
          rel: "canonical",
          href:
            locale === "en"
              ? "https://better-i18n.com"
              : `https://better-i18n.com/${locale}`,
        },
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
