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
import { Layout } from "~/components/Layout";

import stylesheet from "./tailwind.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export async function loader({ context }: LoaderFunctionArgs) {
  return {
    locale: context.locale,
    messages: context.messages,
    locales: context.locales,
    languages: context.languages,
  };
}

export default function App() {
  const { locale, messages, languages } = useLoaderData<typeof loader>();

  return (
    <html lang={locale} dir="ltr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-transparent text-slate-950 antialiased selection:bg-slate-950 selection:text-white">
        <Layout
          locale={locale}
          messages={messages}
          languages={languages}
        >
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
