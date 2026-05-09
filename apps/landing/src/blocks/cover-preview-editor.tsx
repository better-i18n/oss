import { z } from "zod";
import { defineBlock } from "./_define-block";
import { PreviewShell } from "./_preview-shell";

export const coverPreviewEditorBlock = defineBlock({
  slug: "cover-preview-editor",
  displayName: "Translation key editor",
  category: "cover",
  description:
    "Mock key editor showing a translation key with source text and target language translations.",
  schema: z.object({
    keyPath: z.string().default("hero.title"),
    source: z.string().default("Start localizing — free"),
    translations: z
      .array(z.object({ lang: z.string(), text: z.string(), status: z.enum(["approved", "draft", "missing"]).default("approved") }))
      .default([
        { lang: "de", text: "Jetzt lokalisieren — kostenlos", status: "approved" },
        { lang: "fr", text: "Commencez à localiser — gratuit", status: "draft" },
        { lang: "ja", text: "ローカライズを始めましょう — 無料", status: "approved" },
      ]),
  }),
  render: ({ keyPath, source, translations }) => (
    <PreviewShell title="better-i18n.com / editor">
      <div className="rounded-md bg-gray-50 px-2 py-1.5">
        <div className="font-mono text-[8px] text-gray-400 mb-0.5">key</div>
        <div className="font-mono text-[9px] text-gray-800">{keyPath}</div>
      </div>
      <div className="rounded-md bg-gray-50 px-2 py-1.5">
        <div className="flex items-center gap-1 mb-0.5">
          <span className="font-mono text-[8px] text-gray-400">en</span>
          <span className="text-[7px] text-gray-300">source</span>
        </div>
        <div className="text-[9px] text-gray-700">{source}</div>
      </div>
      {translations.map((t) => (
        <div key={t.lang} className="flex items-start gap-2 rounded-md px-2 py-1.5 hover:bg-gray-50">
          <span className="shrink-0 font-mono text-[8px] text-gray-400 mt-0.5">{t.lang}</span>
          <span className="flex-1 text-[9px] text-gray-600">{t.text}</span>
          <span className={"shrink-0 size-[5px] rounded-full mt-1 " + (t.status === "approved" ? "bg-emerald-400" : t.status === "draft" ? "bg-amber-400" : "bg-gray-300")} />
        </div>
      ))}
    </PreviewShell>
  ),
});
