import { z } from "zod";
import { defineBlock } from "./_define-block";
import { PreviewShell } from "./_preview-shell";

export const coverPreviewDashboardBlock = defineBlock({
  slug: "cover-preview-dashboard",
  displayName: "Translation dashboard preview",
  category: "cover",
  description:
    "Mock dashboard showing language translation progress bars with completion percentages.",
  schema: z.object({
    languages: z
      .array(z.object({ code: z.string(), name: z.string(), pct: z.number() }))
      .default([
        { code: "en", name: "English", pct: 100 },
        { code: "de", name: "German", pct: 94 },
        { code: "fr", name: "French", pct: 87 },
        { code: "ja", name: "Japanese", pct: 62 },
      ]),
    keyCount: z.number().default(241),
  }),
  render: ({ languages, keyCount }) => (
    <PreviewShell title="better-i18n.com / translations">
      <div className="flex items-center justify-between px-1 pb-1">
        <span className="text-[9px] font-medium text-gray-700">{keyCount} keys</span>
        <span className="text-[8px] text-gray-400">{languages.filter((l) => l.pct === 100).length}/{languages.length} complete</span>
      </div>
      {languages.map((l) => (
        <div key={l.code} className="flex items-center gap-2 px-1">
          <span className="w-[18px] shrink-0 font-mono text-[8px] uppercase text-gray-400">{l.code}</span>
          <span className="w-[44px] shrink-0 truncate text-[8px] text-gray-500">{l.name}</span>
          <div className="h-[4px] flex-1 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${l.pct}%`,
                background: l.pct === 100 ? "#059669" : l.pct > 80 ? "#3b82f6" : "#f59e0b",
              }}
            />
          </div>
          <span className={"w-[24px] shrink-0 text-right font-mono text-[8px] " + (l.pct === 100 ? "text-emerald-600" : "text-gray-400")}>
            {l.pct}%
          </span>
        </div>
      ))}
    </PreviewShell>
  ),
});
