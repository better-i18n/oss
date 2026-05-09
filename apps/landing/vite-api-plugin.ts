import { BrevoClient } from "@getbrevo/brevo";
import type { Plugin, Connect } from "vite";

/**
 * Vite dev server plugin that handles /api/* routes locally using
 * Cloudflare's getPlatformProxy() — gives us real D1/R2 bindings
 * from wrangler.jsonc without running `wrangler dev`.
 *
 * Only active in dev mode. Production uses worker-entry.ts directly.
 */
export function apiDevPlugin(): Plugin {
  let proxy: Awaited<ReturnType<typeof import("wrangler").getPlatformProxy>> | null = null;

  return {
    name: "api-dev-proxy",
    apply: "serve",

    async configureServer(server) {
      const { getPlatformProxy } = await import("wrangler");
      proxy = await getPlatformProxy({ configPath: "./wrangler.jsonc" });
      console.log("[api-dev] Local D1/R2 bindings ready");

      server.middlewares.use(async (req: Connect.IncomingMessage, res, next) => {
        if (!req.url?.startsWith("/api/") || !proxy) return next();

        try {
          const url = new URL(req.url, `http://localhost:${server.config.server.port || 3001}`);

          const headers = new Headers();
          for (const [k, v] of Object.entries(req.headers)) {
            if (v) headers.set(k, Array.isArray(v) ? v[0] : v);
          }

          let body: BodyInit | undefined;
          if (req.method === "POST" || req.method === "PUT") {
            const buf = await readBody(req);
            body = new Uint8Array(buf).buffer as ArrayBuffer;
          }

          const request = new Request(url.toString(), {
            method: req.method,
            headers,
            body,
          });

          const env = proxy.env as Record<string, unknown>;
          const response = await handleApiRoute(request, url, env);

          res.statusCode = response.status;
          response.headers.forEach((v, k) => res.setHeader(k, v));
          const text = await response.text();
          res.end(text);
        } catch (err) {
          console.error("[api-dev] Error:", err);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Dev API error" }));
        }
      });
    },

    async buildEnd() {
      if (proxy) {
        await proxy.dispose();
        proxy = null;
      }
    },
  };
}

function readBody(req: Connect.IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

// --- Inline API handler ---
// Mirrors worker-entry.ts logic for local dev. Cannot share the same module
// because worker-entry.ts is bundled separately by esbuild for the CF Worker.

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

const MAX_CV_SIZE = 5 * 1024 * 1024; // keep in sync with worker-entry.ts
const ALLOWED_CV_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

async function handleApiRoute(
  request: Request,
  url: URL,
  env: Record<string, unknown>,
): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  const db = env.DB as D1Database;
  const uploads = env.UPLOADS as R2Bucket;
  const path = url.pathname;

  if (path === "/api/apply" && request.method === "POST") {
    try {
      const formData = await request.formData();
      const name = formData.get("name")?.toString()?.trim();
      const email = formData.get("email")?.toString()?.trim();
      const role = formData.get("role")?.toString()?.trim();
      const linkedin = formData.get("linkedin")?.toString()?.trim() || null;
      const message = formData.get("message")?.toString()?.trim() || null;
      const honeypot = formData.get("website")?.toString();
      const cv = formData.get("cv") as File | null;

      if (honeypot) return json({ ok: true });
      if (!name || !email || !role) return json({ error: "name, email, and role are required" }, 400);

      let r2Key: string | null = null;
      let filename: string | null = null;

      if (cv && cv.size > 0) {
        if (cv.size > MAX_CV_SIZE) return json({ error: "CV must be under 5MB" }, 400);
        if (!ALLOWED_CV_TYPES.has(cv.type)) return json({ error: "CV must be PDF or DOCX" }, 400);
        const ext = cv.name.split(".").pop() || "pdf";
        r2Key = `cv/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
        filename = cv.name;
        try {
          const buf = await cv.arrayBuffer();
          await uploads.put(r2Key, buf, {
            httpMetadata: { contentType: cv.type },
            customMetadata: { applicantName: name, role },
          });
        } catch (e) {
          console.error("[api-dev] R2 upload failed (non-blocking):", e);
          r2Key = null;
        }
      }

      await db
        .prepare(
          `INSERT INTO applications (role, name, email, linkedin, message, r2_key, filename, ip, country)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(role, name, email, linkedin, message, r2Key, filename, "127.0.0.1", "DEV")
        .run();

      console.log(`[api-dev] New application: ${name} (${role})`);

      const brevoKey = env.BREVO_API_KEY as string | undefined;
      const notifEmail = env.NOTIFICATION_EMAIL as string | undefined;
      if (brevoKey && notifEmail) {
        sendNotificationEmail(brevoKey, notifEmail, { name, email, role, linkedin, message, cvFilename: filename, cvR2Key: r2Key })
          .catch((err) => console.error("[api-dev] Email send failed:", err));
      } else {
        console.warn("[api-dev] BREVO_API_KEY or NOTIFICATION_EMAIL missing — skipping email");
      }

      return json({ ok: true });
    } catch (err) {
      console.error("[api-dev] Application error:", err);
      return json({ error: "Internal error" }, 500);
    }
  }

  if (path === "/api/comments" && request.method === "GET") {
    const slug = url.searchParams.get("slug");
    if (!slug) return json({ error: "slug required" }, 400);
    const { results } = await db
      .prepare("SELECT id, name, body, created_at, parent_id FROM comments WHERE post_slug = ? AND approved = 1 ORDER BY created_at ASC")
      .bind(slug)
      .all();
    return json({ comments: results || [] });
  }

  if (path === "/api/comments" && request.method === "POST") {
    try {
      const body = await request.json() as Record<string, unknown>;
      if (body.website) return json({ ok: true });
      const { slug, name, email, body: commentBody, parentId } = body as Record<string, string | number | undefined>;
      if (!slug || !name || !commentBody) return json({ error: "slug, name, body required" }, 400);
      await db
        .prepare("INSERT INTO comments (post_slug, name, email, body, parent_id, ip) VALUES (?, ?, ?, ?, ?, ?)")
        .bind(slug, name, email || null, commentBody, parentId || null, "127.0.0.1")
        .run();
      console.log(`[api-dev] New comment on ${slug} by ${name}`);
      return json({ ok: true, message: "Comment submitted for review" });
    } catch (err) {
      console.error("[api-dev] Comment error:", err);
      return json({ error: "Internal error" }, 500);
    }
  }

  return json({ error: "Not found" }, 404);
}

async function sendNotificationEmail(
  apiKey: string,
  toEmail: string,
  app: { name: string; email: string; role: string; linkedin: string | null; message: string | null; cvFilename: string | null; cvR2Key: string | null },
): Promise<void> {
  const textContent = [
    `Name: ${app.name}`,
    `Email: ${app.email}`,
    `Role: ${app.role}`,
    app.linkedin ? `LinkedIn: ${app.linkedin}` : null,
    app.cvFilename ? `Resume: ${app.cvFilename} (R2: ${app.cvR2Key})` : "Resume: not uploaded",
    app.message ? `\nMessage:\n${app.message}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const brevo = new BrevoClient({ apiKey });
  await brevo.transactionalEmails.sendTransacEmail({
    sender: { name: "Better i18n Hiring", email: "noreply@better-i18n.com" },
    to: [{ email: toEmail }],
    subject: `New application: ${app.role} — ${app.name}`,
    textContent,
    htmlContent: `<pre style="font-family:monospace;white-space:pre-wrap">${textContent}</pre>`,
    replyTo: { email: app.email, name: app.name },
  });
  console.log(`[api-dev] Notification email sent to ${toEmail}`);
}
