/**
 * TEMPORARY: Cloudflare account migration. Delete this file and its call in
 * worker-entry.ts once better-i18n.com is an active zone in "Better i18n Org".
 *
 * Until then the zone still lives in the old account, where the
 * better-i18n-migration-proxy worker forwards every request to this worker on
 * the new account. The proxy adds signed headers carrying the real host, client
 * IP and country. Without restoring them, this worker would see the proxy's
 * workers.dev host and build redirects and canonical URLs against it.
 *
 * Requests without a valid MIGRATION_PROXY_SECRET pass through unchanged.
 */

const PROXY_HEADERS = [
  "x-bi18n-proxy-auth",
  "x-bi18n-client-ip",
  "x-bi18n-client-country",
  "x-bi18n-original-host",
] as const;

export function unwrapMigrationProxy(
  request: Request,
  env: Record<string, unknown>,
): Request {
  const secret = env.MIGRATION_PROXY_SECRET;
  const given = request.headers.get("x-bi18n-proxy-auth");
  if (typeof secret !== "string" || !secret || given !== secret) return request;

  const headers = new Headers(request.headers);
  const ip = headers.get("x-bi18n-client-ip");
  const country = headers.get("x-bi18n-client-country");
  const host = headers.get("x-bi18n-original-host");
  if (ip) {
    headers.set("cf-connecting-ip", ip);
    headers.set("x-forwarded-for", ip);
  }
  if (country) headers.set("cf-ipcountry", country);
  for (const name of PROXY_HEADERS) headers.delete(name);

  const url = new URL(request.url);
  if (host) url.host = host;
  return new Request(url.toString(), new Request(request, { headers }));
}
