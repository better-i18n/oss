// Custom Cloudflare Worker entry point that wraps TanStack Start

// Import the TanStack Start server (relative path from dist/worker-entry.js)
import tanstack from "./server/server.js";

export default {
  async fetch(
    request: Request,
    env: Record<string, unknown>,
    ctx: ExecutionContext
  ): Promise<Response> {
    return tanstack.fetch(request, env, ctx);
  },
};
