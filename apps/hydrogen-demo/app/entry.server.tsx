import { ServerRouter } from "react-router";
import { createContentSecurityPolicy } from "@shopify/hydrogen";
import type { EntryContext, AppLoadContext } from "@shopify/remix-oxygen";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  context: AppLoadContext,
) {
  const { nonce, header, NonceProvider } = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_STORE_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    imgSrc: [
      "'self'",
      "better-i18n.com",
      "s3.better-i18n.com",
      "cdn.better-i18n.com",
      "cdn.shopify.com",
      "*.shopifycdn.com",
      "data:",
    ],
    connectSrc: [
      "'self'",
      "cdn.better-i18n.com",
      "https://api.github.com",
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      "https://cdn.shopify.com",
      "https://fonts.googleapis.com",
      "http://localhost:*",
    ],
    fontSrc: [
      "'self'",
      "https://fonts.gstatic.com",
    ],
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter context={remixContext} url={request.url} nonce={nonce} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get("user-agent"))) {
    await body.allReady;
  }

  responseHeaders.set("Content-Type", "text/html");
  responseHeaders.set("Content-Security-Policy", header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
