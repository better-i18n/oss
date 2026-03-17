import { createAPIFileRoute } from "@tanstack/react-start/api";

const ROBOTS_TXT = `User-agent: *
Allow: /

Sitemap: https://help.better-i18n.com/sitemap.xml
`;

export const APIRoute = createAPIFileRoute("/api/robots")({
  GET: () => {
    return new Response(ROBOTS_TXT, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  },
});
