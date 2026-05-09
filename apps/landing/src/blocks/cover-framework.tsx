import { z } from "zod";
import { defineBlock } from "./_define-block";
import { L } from "./_linear";

const FRAMEWORK_THEMES = [
  { name: "Next.js", tokens: ["createI18n()", "middleware()", "getMessages()"], code: 'import { createI18n } from "@better-i18n/next"' },
  { name: "React", tokens: ["useT()", "<Provider>", 'useLocale()'], code: 'import { useT } from "@better-i18n/react"' },
  { name: "Expo", tokens: ["initBetterI18n()", "changeLanguage()", "storageAdapter()"], code: 'import { initBetterI18n } from "@better-i18n/expo"' },
  { name: "Remix", tokens: ["createRemixI18n()", "loader()", "getLocale()"], code: 'import { createRemixI18n } from "@better-i18n/remix"' },
  { name: "Vue", tokens: ["useI18n()", "<i18n-t>", '$t("key")'], code: 'import { createI18n } from "vue-i18n"' },
  { name: "Hono", tokens: ["betterI18n()", 'c.get("t")', 'c.get("locale")'], code: 'import { betterI18n } from "@better-i18n/server"' },
  { name: "Svelte", tokens: ['$t("key")', "<T>", "locale.set()"], code: 'import { init, t } from "svelte-i18n"' },
  { name: "Angular", tokens: ["TranslateModule", "translate.get()", "{{ | translate }}"], code: 'import { TranslateModule } from "@ngx-translate/core"' },
  { name: "Flutter", tokens: ["AppLocalizations.of()", "arb files", "gen-l10n"], code: 'import "package:flutter_gen/gen_l10n/..."' },
  { name: "Hydrogen", tokens: ["Localizer()", "getLocale()", "markets"], code: 'import { Localizer } from "@better-i18n/remix"' },
];

export const coverFrameworkBlock = defineBlock({
  slug: "cover-framework",
  displayName: "Framework integration",
  category: "cover",
  description: "Framework-themed cover with API tokens.",
  schema: z.object({ frameworkIndex: z.number().default(0), accentHue: z.number().default(200) }),
  render: ({ frameworkIndex }) => {
    const fw = FRAMEWORK_THEMES[frameworkIndex % FRAMEWORK_THEMES.length];
    return (
      <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-md" style={{ background: L.bg }}>
        <span className="text-[14px] font-medium tracking-[-0.15px]" style={{ color: L.text }}>{fw.name}</span>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-[5px] max-w-[260px]">
          {fw.tokens.map((t) => (
            <span key={t} className="rounded-[3px] px-[6px] py-[2px] text-[7px]" style={{ fontFamily: "var(--font-mono)", background: L.elevated, color: L.textMuted, boxShadow: `inset 0 0 0 1px ${L.border}` }}>
              {t}
            </span>
          ))}
        </div>

        <div className="mt-3 w-full max-w-[260px] px-4">
          <div className="rounded-[4px] px-2 py-[5px]" style={{ background: L.card, boxShadow: `inset 0 0 0 1px ${L.border}` }}>
            <code className="block truncate text-[7px]" style={{ fontFamily: "var(--font-mono)", color: L.textDim }}>{fw.code}</code>
          </div>
        </div>

        <div className="absolute bottom-2.5 left-3 opacity-[0.06]">
          <img src="/brand/logo.svg" className="size-4 invert" alt="" />
        </div>
      </div>
    );
  },
});

export { FRAMEWORK_THEMES };
