import { useMemo } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  type LinksFunction,
  useLoaderData,
  useRouteError,
  useRouteLoaderData,
  isRouteErrorResponse,
} from "react-router";
import type { LoaderFunctionArgs } from "@shopify/remix-oxygen";
import { i18n as remixI18n } from "~/i18n.server";
import { useNonce } from "@shopify/hydrogen";
import { I18nextProvider, useTranslation } from "react-i18next";
import { Layout } from "~/components/Layout";
import { createI18nextInstance } from "~/lib/i18n-client";

import stylesheet from "./tailwind.css?url";

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
  { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
  { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png", media: "(prefers-color-scheme: light)" },
  { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png", media: "(prefers-color-scheme: light)" },
  { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32-dark.png", media: "(prefers-color-scheme: dark)" },
  { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16-dark.png", media: "(prefers-color-scheme: dark)" },
  { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
  { rel: "manifest", href: "/site.webmanifest" },
  { rel: "stylesheet", href: stylesheet },
];

export async function loader({ params, context }: LoaderFunctionArgs) {
  // Derive locale from React Router's URL params — this is CDN-independent and
  // always matches whatever prefix is in the URL (/tr → "tr", / → "en").
  const locale = (params.locale as string | undefined) ?? "en";

  // Fetch translations for the URL-derived locale (TtlCache'd — fast after first req).
  const [messages, cartData] = await Promise.all([
    remixI18n.getMessages(locale),
    context.cart.get(),
  ]);

  let githubStars = 0;
  try {
    const ghHeaders: HeadersInit = {
      Accept: "application/vnd.github+json",
      "User-Agent": "better-i18n-hydrogen-demo",
    };
    if (context.env.GITHUB_TOKEN) {
      ghHeaders.Authorization = `Bearer ${context.env.GITHUB_TOKEN}`;
    }
    const res = await fetch("https://api.github.com/repos/better-i18n/oss", {
      headers: ghHeaders,
    });
    if (res.ok) {
      const data = (await res.json()) as { stargazers_count: number };
      githubStars = data.stargazers_count;
    } else {
      const body = await res.text();
      console.error(`GitHub API: ${res.status} ${res.statusText} — ${body}`);
    }
  } catch (e) {
    console.error("GitHub API fetch failed:", e);
  }

  return {
    locale,
    messages,
    languages: context.languages,
    githubStars,
    totalQuantity: cartData?.totalQuantity ?? 0,
  };
}

export default function App() {
  const nonce = useNonce();
  const { locale, messages, languages, githubStars, totalQuantity } =
    useLoaderData<typeof loader>();

  const i18nInstance = useMemo(
    () => createI18nextInstance(locale, messages),
    [locale, messages],
  );

  return (
    <html lang={locale} dir="ltr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google" content="notranslate" />
        {languages.map((lang: { code: string }) => {
          const href =
            lang.code === "en"
              ? "/"
              : `/${lang.code}/`;
          return (
            <link
              key={lang.code}
              rel="alternate"
              hrefLang={lang.code}
              href={href}
            />
          );
        })}
        <link rel="alternate" hrefLang="x-default" href="/" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-transparent text-slate-950 antialiased selection:bg-slate-950 selection:text-white">
        <I18nextProvider key={locale} i18n={i18nInstance}>
          <Layout
            locale={locale}
            languages={languages}
            githubStars={githubStars}
            totalQuantity={totalQuantity}
          >
            <Outlet />
          </Layout>
        </I18nextProvider>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

function ErrorContent() {
  const error = useRouteError();
  const { t: tc } = useTranslation("common");

  let title = "Error";
  let message = tc("error_desc");

  if (isRouteErrorResponse(error)) {
    title = `${error.status}`;
    message = error.statusText || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center px-4">
      <p className="text-7xl font-semibold tracking-tight text-slate-300">
        {title}
      </p>
      <p className="mt-4 text-lg text-slate-600">{message}</p>
      <a
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
      >
        {tc("back_home")}
      </a>
    </div>
  );
}

export function ErrorBoundary() {
  const nonce = useNonce();
  const rootData = useRouteLoaderData<typeof loader>("root");

  const i18nInstance = useMemo(
    () => createI18nextInstance(rootData?.locale ?? "en", rootData?.messages ?? {}),
    [rootData?.locale, rootData?.messages],
  );

  return (
    <html lang={rootData?.locale ?? "en"} dir="ltr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-950 antialiased">
        <I18nextProvider i18n={i18nInstance}>
          <ErrorContent />
        </I18nextProvider>
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}
