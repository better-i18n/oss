import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  type LinksFunction,
  useLoaderData,
} from "react-router";
import type { LoaderFunctionArgs } from "@shopify/remix-oxygen";
import { useNonce } from "@shopify/hydrogen";
import { Layout } from "~/components/Layout";

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

  return {
    locale: context.locale,
    messages: context.messages,
    languages: context.languages,
    githubStars,
  };
}

export default function App() {
  const nonce = useNonce();
  const { locale, messages, languages, githubStars } =
    useLoaderData<typeof loader>();

  return (
    <html lang={locale} dir="ltr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google" content="notranslate" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-transparent text-slate-950 antialiased selection:bg-slate-950 selection:text-white">
        <Layout
          locale={locale}
          messages={messages}
          languages={languages}
          githubStars={githubStars}
        >
          <Outlet />
        </Layout>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}
