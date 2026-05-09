import { z } from "zod";
import { defineBlock } from "./_define-block";
import { PreviewShell } from "./_preview-shell";

export const coverPreviewAiBlock = defineBlock({
  slug: "cover-preview-ai",
  displayName: "AI translation preview",
  category: "cover",
  description:
    "Mock AI translation panel showing source text being translated with context and glossary hints.",
  schema: z.object({
    sourceLang: z.string().default("en"),
    targetLang: z.string().default("de"),
    sourceText: z.string().default("Start localizing your app today"),
    translatedText: z.string().default("Beginnen Sie noch heute mit der Lokalisierung"),
    model: z.string().default("GPT-4.1"),
    context: z.array(z.string()).default(["glossary: 3 terms", "instructions: formal tone"]),
  }),
  render: ({ sourceLang, targetLang, sourceText, translatedText, model, context }) => (
    <PreviewShell title="better-i18n.com / ai-translate">
      <div className="flex items-center gap-1.5">
        <span className="rounded bg-violet-50 px-1.5 py-0.5 font-mono text-[8px] text-violet-600">✦ {model}</span>
        {context.map((c) => (
          <span key={c} className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[7px] text-gray-500">{c}</span>
        ))}
      </div>
      <div className="rounded-md bg-gray-50 px-2 py-1.5">
        <div className="flex items-center gap-1 mb-0.5">
          <span className="font-mono text-[8px] font-medium text-gray-500">{sourceLang}</span>
          <span className="text-[7px] text-gray-300">source</span>
        </div>
        <div className="text-[9px] text-gray-700">{sourceText}</div>
      </div>
      <div className="flex items-center gap-1 px-1">
        <div className="h-[1px] flex-1 bg-gray-200" />
        <span className="text-[8px] text-gray-400">→</span>
        <div className="h-[1px] flex-1 bg-gray-200" />
      </div>
      <div className="rounded-md border border-emerald-200 bg-emerald-50/50 px-2 py-1.5">
        <div className="flex items-center gap-1 mb-0.5">
          <span className="font-mono text-[8px] font-medium text-emerald-600">{targetLang}</span>
          <span className="size-[4px] rounded-full bg-emerald-400" />
        </div>
        <div className="text-[9px] text-gray-700">{translatedText}</div>
      </div>
    </PreviewShell>
  ),
});
