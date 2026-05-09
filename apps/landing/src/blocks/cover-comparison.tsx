import { z } from "zod";
import { defineBlock } from "./_define-block";
import { L } from "./_linear";

const FEATURE_SETS = [
  ["AI Translation", "CDN Delivery", "MCP Tools", "GitHub Sync"],
  ["Auto Scan Keys", "Instant Publish", "Type Safety", "Webhooks"],
  ["Namespace Support", "Plural Rules", "Context AI", "REST API"],
  ["Zero Config CDN", "Key History", "AI Glossary", "Version Pinning"],
  ["One-click Deploy", "Locale Fallback", "ICU Format", "Diff Review"],
  ["Source Editing", "Dead Key Detect", "AI Rephrase", "Audit Logs"],
  ["Flat & Nested JSON", "Key Dedup", "AI Context", "Import/Export"],
  ["Multi-branch Sync", "CI/CD Hooks", "Link Sharing", "Priority Queue"],
];

export const coverComparisonBlock = defineBlock({
  slug: "cover-comparison",
  displayName: "Comparison table",
  category: "cover",
  description: "Two-panel dark comparison: Others vs Better i18n.",
  schema: z.object({
    features: z.array(z.string()).default(FEATURE_SETS[0]),
    accentHue: z.number().default(188),
    competitorLabel: z.string().default("Others"),
  }),
  render: ({ features, competitorLabel }) => (
    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-md" style={{ background: L.bg }}>
      <div className="flex w-full max-w-[300px] gap-2 px-4">
        {/* Left */}
        <div className="flex-1 rounded-md" style={{ background: L.card, boxShadow: L.inset }}>
          <div className="px-2.5 py-[6px]" style={{ borderBottom: `1px solid ${L.border}` }}>
            <div className="flex items-center gap-1.5">
              <span className="size-[5px] rounded-full" style={{ background: L.red, opacity: 0.6 }} />
              <span className="text-[8px] tracking-[-0.1px]" style={{ color: L.textDim }}>{competitorLabel}</span>
            </div>
          </div>
          <div className="flex flex-col gap-[5px] px-2.5 py-2">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-1.5 text-[7.5px]">
                <span style={{ color: L.red, opacity: 0.6 }}>✕</span>
                <span className="line-through" style={{ color: L.textDim, textDecorationColor: L.borderSoft }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Right */}
        <div className="flex-1 rounded-md" style={{ background: L.elevated, boxShadow: L.inset }}>
          <div className="px-2.5 py-[6px]" style={{ borderBottom: `1px solid ${L.border}` }}>
            <div className="flex items-center gap-1.5">
              <span className="size-[5px] rounded-full" style={{ background: L.blue }} />
              <span className="text-[8px] font-medium tracking-[-0.1px]" style={{ color: L.blue }}>better i18n</span>
            </div>
          </div>
          <div className="flex flex-col gap-[5px] px-2.5 py-2">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-1.5 text-[7.5px]">
                <span style={{ color: L.green }}>✓</span>
                <span style={{ color: L.textSecondary }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
});

export { FEATURE_SETS };
