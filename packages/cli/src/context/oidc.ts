/**
 * GitHub Actions OIDC Token Fetcher
 *
 * Detects GitHub Actions environment and fetches an OIDC identity token
 * for zero-secret authentication with the Better i18n API.
 *
 * How it works:
 * 1. GitHub Actions injects ACTIONS_ID_TOKEN_REQUEST_URL + TOKEN
 * 2. We request a JWT from that URL with our audience ("better-i18n")
 * 3. The JWT is signed by GitHub's JWKS — API can verify without shared secrets
 *
 * References:
 * - https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect
 */

const DEFAULT_AUDIENCE = "better-i18n";

/**
 * Check if running in GitHub Actions with OIDC support.
 *
 * OIDC requires:
 * - `GITHUB_ACTIONS=true` (running in GA)
 * - `ACTIONS_ID_TOKEN_REQUEST_URL` (OIDC endpoint available)
 * - `ACTIONS_ID_TOKEN_REQUEST_TOKEN` (bearer token for the endpoint)
 *
 * The last two are only present when the workflow has `permissions: id-token: write`.
 */
export function isGitHubActionsWithOidc(): boolean {
  return (
    process.env.GITHUB_ACTIONS === "true" &&
    !!process.env.ACTIONS_ID_TOKEN_REQUEST_URL &&
    !!process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN
  );
}

/**
 * Fetch a GitHub Actions OIDC token for the given audience.
 *
 * @param audience - Token audience claim (default: "better-i18n")
 * @returns JWT string, or null if OIDC is unavailable or the request fails
 */
export async function fetchGitHubOidcToken(
  audience: string = DEFAULT_AUDIENCE,
): Promise<string | null> {
  const requestUrl = process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
  const requestToken = process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;

  if (!requestUrl || !requestToken) {
    return null;
  }

  try {
    // Append audience as query parameter
    const url = new URL(requestUrl);
    url.searchParams.set("audience", audience);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${requestToken}`,
        Accept: "application/json; api-version=2.0",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { value?: string };
    return data.value ?? null;
  } catch {
    return null;
  }
}
