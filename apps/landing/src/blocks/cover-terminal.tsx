import { z } from "zod";
import { defineBlock } from "./_define-block";
import { L } from "./_linear";

type Line = { text: string; color?: string; dim?: boolean; prompt?: boolean };

const V: { title: string; lines: Line[] }[] = [
  { title: "scan", lines: [
    { text: "$ better-i18n scan", prompt: true },
    { text: "  Scanning 24 source files...", color: L.textDim },
    { text: "  ✓ 127 keys found", color: L.green },
    { text: "  ✓ 3 new keys", color: L.green },
    { text: "  ! 2 unused", color: "#d97706" },
    { text: "" },
    { text: "  run sync --push to upload", dim: true },
  ]},
  { title: "sync", lines: [
    { text: "$ better-i18n sync --push", prompt: true },
    { text: "  Comparing local ↔ remote...", color: L.textDim },
    { text: "  → 14 keys pushed", color: L.blue },
    { text: "  ✓ synced 340ms", color: L.green },
    { text: "" },
    { text: "$ better-i18n sync --pull", prompt: true },
    { text: "  ✓ 89 translations (DE, FR, JA)", color: L.green },
  ]},
  { title: "doctor", lines: [
    { text: "$ better-i18n doctor", prompt: true },
    { text: "" },
    { text: "  ✓ API key", color: L.green },
    { text: "  ✓ CDN 42ms", color: L.green },
    { text: "  ! JA missing", color: "#d97706" },
    { text: "  ✓ 0 phantom keys", color: L.green },
    { text: "" },
    { text: "  1 warning", dim: true },
  ]},
  { title: "push", lines: [
    { text: "$ better-i18n push --locale=de", prompt: true },
    { text: "  Uploading...", color: L.textDim },
    { text: "  ✓ de.json → CDN (12 keys)", color: L.green },
    { text: "  ✓ cache purged", color: L.green },
    { text: "" },
    { text: "  cdn.better-i18n.com/de.json", dim: true },
  ]},
  { title: "init", lines: [
    { text: "$ better-i18n init", prompt: true },
    { text: "  ? Framework   Next.js", color: L.textSecondary },
    { text: "  ? Project     proj_abc123", color: L.textSecondary },
    { text: "  ✓ better-i18n.config.ts", color: L.green },
    { text: "  ✓ SDK added", color: L.green },
    { text: "" },
    { text: "  run scan to detect keys", dim: true },
  ]},
  { title: "typegen", lines: [
    { text: "$ better-i18n typegen", prompt: true },
    { text: "  Fetching schema...", color: L.textDim },
    { text: "  ✓ types/i18n.d.ts", color: L.green },
    { text: "    241 keys · 4 namespaces", color: L.cyan },
    { text: "" },
    { text: '  t("key") is now type-safe', dim: true },
  ]},
  { title: "publish", lines: [
    { text: "$ better-i18n publish --all", prompt: true },
    { text: "  ✓ en (4.2KB unchanged)", color: L.green },
    { text: "  ✓ de (4.0KB updated)", color: L.green },
    { text: "  ✓ fr (3.8KB updated)", color: L.green },
    { text: "  3/12 locales changed", color: L.blue },
  ]},
  { title: "diff", lines: [
    { text: "$ better-i18n diff", prompt: true },
    { text: "" },
    { text: "  + hero.title", color: L.green },
    { text: "  + hero.subtitle", color: L.green },
    { text: "  ~ cta.button", color: "#d97706" },
    { text: "  - old.key", color: L.red },
    { text: "" },
    { text: "  3 changes pending", dim: true },
  ]},
  { title: "export", lines: [
    { text: "$ better-i18n export --xliff", prompt: true },
    { text: "  241 keys → XLIFF", color: L.textDim },
    { text: "  ✓ export/en.xlf", color: L.green },
    { text: "  ✓ export/de.xlf", color: L.green },
    { text: "" },
    { text: "  ready for external TMS", dim: true },
  ]},
];

export const coverTerminalBlock = defineBlock({
  slug: "cover-terminal",
  displayName: "Terminal CLI preview",
  category: "cover",
  description: "Dark terminal showing better-i18n CLI.",
  schema: z.object({ variantIndex: z.number().default(0), accentHue: z.number().default(152) }),
  render: ({ variantIndex }) => {
    const v = V[variantIndex % V.length];
    return (
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-md" style={{ background: L.bg }}>
        <div className="w-full max-w-[300px] rounded-md" style={{ background: L.card, boxShadow: L.inset }}>
          <div className="flex items-center gap-[6px] px-3 py-[7px]" style={{ borderBottom: `1px solid ${L.border}` }}>
            <span className="size-[6px] rounded-full" style={{ background: "#ff5f57", opacity: 0.6 }} />
            <span className="size-[6px] rounded-full" style={{ background: "#febc2e", opacity: 0.6 }} />
            <span className="size-[6px] rounded-full" style={{ background: "#28c840", opacity: 0.6 }} />
            <span className="mx-auto text-[8px] tracking-[-0.1px]" style={{ fontFamily: "var(--font-mono)", color: L.textDim }}>{v.title}</span>
          </div>
          <div className="flex flex-col gap-[1px] px-3 py-2" style={{ fontFamily: "var(--font-mono)" }}>
            {v.lines.map((l, i) => (
              <div key={i} className="text-[8px] leading-[1.5]" style={{ color: l.dim ? L.textDim : l.color ?? L.textMuted, opacity: l.dim ? 0.5 : 1 }}>
                {l.text || " "}
              </div>
            ))}
            <div className="mt-0.5 flex items-center gap-1 text-[8px]" style={{ color: L.textDim }}>
              <span>$</span>
              <span className="inline-block h-[9px] w-[4px] rounded-[1px]" style={{ background: L.textMuted, opacity: 0.4 }} />
            </div>
          </div>
        </div>
      </div>
    );
  },
});

export { V as TERMINAL_VARIANTS };
