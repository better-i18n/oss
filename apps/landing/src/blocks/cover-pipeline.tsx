import { z } from "zod";
import { defineBlock } from "./_define-block";
import { L } from "./_linear";

const PIPELINE_VARIANTS = [
  { steps: ["Scan", "AI", "Review", "CDN"], done: 2 },
  { steps: ["Import", "Merge", "Validate", "Publish"], done: 3 },
  { steps: ["Detect", "Translate", "QA", "Ship"], done: 4 },
  { steps: ["GitHub", "Sync", "Build", "Purge"], done: 2 },
];

export const coverPipelineBlock = defineBlock({
  slug: "cover-pipeline",
  displayName: "Workflow pipeline",
  category: "cover",
  description: "Minimal horizontal pipeline.",
  schema: z.object({ variantIndex: z.number().default(0), accentHue: z.number().default(220) }),
  render: ({ variantIndex }) => {
    const v = PIPELINE_VARIANTS[variantIndex % PIPELINE_VARIANTS.length];
    return (
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-md" style={{ background: L.bg }}>
        <div className="flex w-full max-w-[280px] flex-col gap-3 px-4">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-medium tracking-[-0.1px]" style={{ color: L.textMuted }}>Pipeline</span>
            <span className="rounded-[2px] px-1 py-[1px] text-[7px]" style={{ fontFamily: "var(--font-mono)", background: L.elevated, color: L.textDim }}>
              {v.done}/{v.steps.length}
            </span>
          </div>

          <div className="flex items-center">
            {v.steps.map((step, i) => {
              const done = i < v.done;
              const active = i === v.done;
              const color = done ? L.green : active ? L.blue : L.borderSoft;
              return (
                <div key={step} className="flex items-center" style={{ flex: 1 }}>
                  <div className="flex flex-col items-center">
                    <div
                      className="flex size-5 items-center justify-center rounded-full"
                      style={{ background: done ? `${L.green}15` : "transparent", border: `1.5px solid ${color}` }}
                    >
                      {done && <span className="text-[7px]" style={{ color: L.green }}>✓</span>}
                      {active && <span className="size-[4px] rounded-full" style={{ background: L.blue }} />}
                    </div>
                    <span className="mt-1 text-[7px] tracking-[-0.1px]" style={{ fontFamily: "var(--font-mono)", color: done ? L.textMuted : L.textDim }}>{step}</span>
                  </div>
                  {i < v.steps.length - 1 && (
                    <div className="h-[1px] flex-1 mx-1" style={{ background: done ? L.borderSoft : L.border }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
});

export { PIPELINE_VARIANTS };
