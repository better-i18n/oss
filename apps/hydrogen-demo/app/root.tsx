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
  isRouteErrorResponse,
} from "react-router";
import type { LoaderFunctionArgs } from "@shopify/remix-oxygen";
import { useNonce } from "@shopify/hydrogen";
import { I18nextProvider } from "react-i18next";
import { Layout } from "~/components/Layout";
import { createI18nextInstance } from "~/lib/i18n-client";

import stylesheet from "./tailwind.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export async function loader({ context }: LoaderFunctionArgs) {
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

  const cartData = await context.cart.get();

  return {
    locale: context.locale,
    messages: context.messages,
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
        <I18nextProvider i18n={i18nInstance}>
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

export function ErrorBoundary() {
  const error = useRouteError();
  const nonce = useNonce();

  let title = "Error";
  let message = "An unexpected error occurred.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status}`;
    message = error.statusText || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <html lang="en" dir="ltr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-950 antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center text-center px-4">
          <p className="text-7xl font-semibold tracking-tight text-slate-300">
            {title}
          </p>
          <p className="mt-4 text-lg text-slate-600">{message}</p>
          <a href="/" className="mt-8 inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
            Go Home
          </a>
        </div>
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}
