const DEFAULT_API_URL = "https://dash.better-i18n.com";

export interface ApiClientConfig {
  apiKey: string;
  apiUrl?: string;
}

export interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export function createApiClient(config: ApiClientConfig) {
  const baseUrl = (config.apiUrl || DEFAULT_API_URL).replace(/\/$/, "");

  async function request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<ApiResponse<T>> {
    const url = `${baseUrl}${path}`;
    const headers: Record<string, string> = {
      "x-api-key": config.apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        let errorMessage = `HTTP ${response.status}`;
        try {
          const parsed = JSON.parse(text);
          errorMessage = parsed.message || parsed.error || errorMessage;
        } catch {
          if (text) errorMessage = text;
        }
        return { ok: false, error: errorMessage, code: `HTTP_${response.status}` };
      }

      const data = (await response.json()) as T;
      return { ok: true, data };
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
        code: "NETWORK_ERROR",
      };
    }
  }

  return {
    get: <T>(path: string) => request<T>("GET", path),
    post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
    patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
    delete: <T>(path: string, body?: unknown) => request<T>("DELETE", path, body),
  };
}

export interface SessionInfo {
  user: { id: string; name: string; email: string; image?: string };
  session: { id: string; expiresAt: string };
}

export async function getSession(apiKey: string, apiUrl?: string): Promise<ApiResponse<SessionInfo>> {
  const client = createApiClient({ apiKey, apiUrl });
  return client.get<SessionInfo>("/api/auth/get-session");
}

export function createTrpcCaller(config: ApiClientConfig) {
  const baseUrl = (config.apiUrl || DEFAULT_API_URL).replace(/\/$/, "");
  const trpcUrl = `${baseUrl}/api/trpc`;
  const headers: Record<string, string> = {
    "x-api-key": config.apiKey,
    "Content-Type": "application/json",
  };

  async function query<T>(procedure: string, input?: unknown): Promise<ApiResponse<T>> {
    const params = input !== undefined
      ? `?input=${encodeURIComponent(JSON.stringify(input))}`
      : "";
    try {
      const res = await fetch(`${trpcUrl}/${procedure}${params}`, { headers });
      const body = await res.json() as { result?: { data?: T }; error?: { message?: string } };
      if (!res.ok || body.error) {
        return { ok: false, error: body.error?.message || `HTTP ${res.status}`, code: `HTTP_${res.status}` };
      }
      return { ok: true, data: body.result?.data as T };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : String(err), code: "NETWORK_ERROR" };
    }
  }

  async function mutate<T>(procedure: string, input: unknown): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(`${trpcUrl}/${procedure}`, {
        method: "POST",
        headers,
        body: JSON.stringify(input),
      });
      const body = await res.json() as { result?: { data?: T }; error?: { message?: string; data?: { code?: string } } };
      if (!res.ok || body.error) {
        const msg = body.error?.message || `HTTP ${res.status}`;
        return { ok: false, error: msg, code: body.error?.data?.code || `HTTP_${res.status}` };
      }
      return { ok: true, data: body.result?.data as T };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : String(err), code: "NETWORK_ERROR" };
    }
  }

  return { query, mutate };
}
