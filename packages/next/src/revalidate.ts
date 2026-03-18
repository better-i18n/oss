/**
 * Webhook-based revalidation handler for Next.js App Router.
 *
 * Creates a POST route handler that verifies Better i18n webhook signatures
 * and triggers Next.js cache revalidation when translations are published.
 *
 * @example
 * ```ts
 * // app/api/i18n/revalidate/route.ts
 * import { createRevalidateHandler } from '@better-i18n/next';
 *
 * export const POST = createRevalidateHandler({
 *   secret: process.env.BETTER_I18N_WEBHOOK_SECRET!,
 * });
 * ```
 */
import { revalidatePath, revalidateTag } from "next/cache";
import { createHmac, timingSafeEqual } from "crypto";

export interface RevalidateHandlerOptions {
  secret: string;
  revalidatePaths?: string[];
  revalidateTags?: string[];
  onRevalidate?: (payload: WebhookPayload) => Promise<void>;
}

export interface WebhookPayload {
  webhookConfigId?: string;
  eventType: string;
  timestamp: number;
  data: {
    org: string;
    project: string;
    languages: string[];
    publishedAt?: string;
    keysCount?: number;
  };
}

export function createRevalidateHandler(options: RevalidateHandlerOptions) {
  return async function POST(req: Request): Promise<Response> {
    const signature = req.headers.get("x-better-i18n-signature");
    if (!signature) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.text();

    const expected =
      "sha256=" +
      createHmac("sha256", options.secret).update(body).digest("hex");

    // Timing-safe comparison to prevent timing attacks
    let isValid = false;
    try {
      isValid = timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expected),
      );
    } catch {
      // Buffers have different lengths (signature mismatch)
      isValid = false;
    }

    if (!isValid) {
      return new Response("Invalid signature", { status: 401 });
    }

    const payload: WebhookPayload = JSON.parse(body);

    for (const path of options.revalidatePaths ?? ["/"]) {
      revalidatePath(path, "layout");
    }
    for (const tag of options.revalidateTags ?? ["i18n-messages"]) {
      revalidateTag(tag);
    }

    if (options.onRevalidate) {
      await options.onRevalidate(payload);
    }

    return Response.json({
      revalidated: true,
      paths: options.revalidatePaths ?? ["/"],
      tags: options.revalidateTags ?? ["i18n-messages"],
    });
  };
}
