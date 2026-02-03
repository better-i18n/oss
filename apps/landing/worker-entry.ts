// Custom Cloudflare Worker entry point that wraps TanStack Start
// and handles API routes directly

async function handleOgImage(request: Request): Promise<Response> {
  try {
    const { ImageResponse } = await import("workers-og");

    const url = new URL(request.url);
    const title = url.searchParams.get("title") || "Better i18n";
    const author = url.searchParams.get("author") || "";
    const date = url.searchParams.get("date") || "";

    const fontSize = title.length > 60 ? "48px" : "56px";

    const html = `
      <div style="height: 100%; width: 100%; display: flex; flex-direction: column; background-color: #fafafa; padding: 60px; font-family: Inter, sans-serif;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 40px; height: 40px; background-color: #0a0a0a; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 20px; font-weight: 600;">i</span>
          </div>
          <span style="font-size: 24px; font-weight: 600; color: #0a0a0a;">Better i18n</span>
          <span style="font-size: 24px; color: #737373; margin-left: 8px;">Blog</span>
        </div>
        <div style="display: flex; flex: 1; align-items: center;">
          <h1 style="font-size: ${fontSize}; font-weight: 600; color: #0a0a0a; line-height: 1.2; letter-spacing: -0.02em; max-width: 900px;">
            ${escapeHtml(title)}
          </h1>
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between;">
          ${author ? `<span style="font-size: 20px; color: #525252;">${escapeHtml(author)}</span>` : ""}
          ${date ? `<span style="font-size: 20px; color: #a3a3a3;">${escapeHtml(date)}</span>` : ""}
        </div>
      </div>
    `;

    return new ImageResponse(html, {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("OG Image generation error:", error);
    return Response.redirect("https://better-i18n.com/og-image.png", 302);
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Import the TanStack Start server (relative path from dist/worker-entry.js)
import tanstack from "./server/server.js";

export default {
  async fetch(
    request: Request,
    env: Record<string, unknown>,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);

    // Handle OG image generation directly before TanStack
    if (url.pathname === "/api/og") {
      return handleOgImage(request);
    }

    // Pass everything else to TanStack Start
    return tanstack.fetch(request, env, ctx);
  },
};
