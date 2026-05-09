import { z } from "zod";
import { defineBlock } from "./_define-block";
import { PreviewShell } from "./_preview-shell";

export const coverPreviewCdnBlock = defineBlock({
  slug: "cover-preview-cdn",
  displayName: "CDN publish status",
  category: "cover",
  description:
    "Mock CDN delivery panel showing published locales, cache status, and latency metrics.",
  schema: z.object({
    locales: z
      .array(z.object({ code: z.string(), size: z.string(), status: z.enum(["live", "pending", "stale"]) }))
      .default([
        { code: "en", size: "4.2KB", status: "live" },
        { code: "de", size: "4.0KB", status: "live" },
        { code: "fr", size: "3.8KB", status: "pending" },
        { code: "ja", size: "3.1KB", status: "live" },
      ]),
    p50: z.string().default("28ms"),
    cacheHit: z.string().default("96%"),
  }),
  render: ({ locales, p50, cacheHit }) => (
    <PreviewShell title="better-i18n.com / cdn">
      <div className="grid grid-cols-2 gap-1.5">
        <div className="rounded-md bg-gray-50 px-2 py-1">
          <div className="text-[7px] uppercase tracking-wide text-gray-400">P50 latency</div>
          <div className="mt-0.5 font-mono text-[10px] font-semibold text-emerald-600">{p50}</div>
        </div>
        <div className="rounded-md bg-gray-50 px-2 py-1">
          <div className="text-[7px] uppercase tracking-wide text-gray-400">Cache hit</div>
          <div className="mt-0.5 font-mono text-[10px] font-semibold text-blue-600">{cacheHit}</div>
        </div>
      </div>
      {locales.map((l) => (
        <div key={l.code} className="flex items-center gap-2 px-1">
          <span className="w-[18px] shrink-0 font-mono text-[8px] uppercase text-gray-400">{l.code}</span>
          <span className="flex-1 font-mono text-[8px] text-gray-500">{l.code}.json</span>
          <span className="font-mono text-[7px] text-gray-400">{l.size}</span>
          <span className={"size-[5px] shrink-0 rounded-full " + (l.status === "live" ? "bg-emerald-400" : l.status === "pending" ? "bg-amber-400" : "bg-gray-300")} />
        </div>
      ))}
    </PreviewShell>
  ),
});
