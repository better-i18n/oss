import { z } from "zod";
import { defineBlock } from "./_define-block";
import { L } from "./_linear";

const KW = [
  [{ kw: "react i18n library", pos: 1, vol: "12K" }, { kw: "next.js localization", pos: 2, vol: "8.2K" }, { kw: "i18n react tutorial", pos: 3, vol: "5.4K" }, { kw: "next-intl vs react-i18next", pos: 5, vol: "2.1K" }],
  [{ kw: "best i18n tool 2026", pos: 1, vol: "9.8K" }, { kw: "localization platform", pos: 2, vol: "7.3K" }, { kw: "translation management", pos: 4, vol: "11K" }, { kw: "crowdin alternative", pos: 3, vol: "3.7K" }],
  [{ kw: "expo localization", pos: 1, vol: "6.1K" }, { kw: "react native i18n", pos: 2, vol: "9.0K" }, { kw: "expo-localization guide", pos: 3, vol: "2.8K" }, { kw: "mobile translation tools", pos: 6, vol: "1.9K" }],
  [{ kw: "lokalise alternative", pos: 1, vol: "4.4K" }, { kw: "phrase vs crowdin", pos: 2, vol: "3.2K" }, { kw: "i18n cdn delivery", pos: 3, vol: "1.7K" }, { kw: "open source i18n", pos: 4, vol: "5.8K" }],
  [{ kw: "vue i18n tutorial", pos: 1, vol: "7.7K" }, { kw: "vue-i18n setup", pos: 2, vol: "5.5K" }, { kw: "nuxt localization", pos: 3, vol: "4.2K" }, { kw: "i18n vue composable", pos: 5, vol: "1.4K" }],
  [{ kw: "svelte i18n", pos: 1, vol: "3.9K" }, { kw: "sveltekit localization", pos: 2, vol: "2.8K" }, { kw: "paraglide js", pos: 3, vol: "1.2K" }, { kw: "svelte translation lib", pos: 4, vol: "900" }],
  [{ kw: "angular i18n guide", pos: 1, vol: "8.5K" }, { kw: "ngx-translate tutorial", pos: 2, vol: "6.1K" }, { kw: "angular localization", pos: 3, vol: "4.0K" }, { kw: "angular multilingual", pos: 7, vol: "2.3K" }],
  [{ kw: "remix i18n", pos: 1, vol: "3.3K" }, { kw: "remix localization", pos: 2, vol: "2.1K" }, { kw: "react router i18n", pos: 3, vol: "1.8K" }, { kw: "remix-i18next setup", pos: 5, vol: "1.1K" }],
  [{ kw: "internationalization seo", pos: 1, vol: "14K" }, { kw: "hreflang implementation", pos: 2, vol: "9.7K" }, { kw: "multilingual seo tips", pos: 3, vol: "6.8K" }, { kw: "international seo guide", pos: 4, vol: "5.2K" }],
  [{ kw: "flutter localization", pos: 1, vol: "11K" }, { kw: "flutter i18n arb", pos: 2, vol: "7.4K" }, { kw: "flutter gen-l10n", pos: 3, vol: "4.9K" }, { kw: "flutter multilingual", pos: 5, vol: "3.1K" }],
  [{ kw: "translation ai tools", pos: 1, vol: "16K" }, { kw: "ai localization", pos: 2, vol: "8.9K" }, { kw: "machine translation quality", pos: 3, vol: "6.1K" }, { kw: "deepl api integration", pos: 6, vol: "4.3K" }],
  [{ kw: "javascript localization", pos: 1, vol: "13K" }, { kw: "i18next configuration", pos: 2, vol: "10K" }, { kw: "i18next vs react-intl", pos: 3, vol: "5.6K" }, { kw: "formatjs tutorial", pos: 4, vol: "3.8K" }],
];

const TRENDS = [
  [22,35,28,51,64,88],[10,18,32,45,58,79],[30,25,40,55,48,72],[5,12,20,38,60,91],
  [40,38,50,62,70,85],[15,28,22,44,55,68],[50,44,60,72,68,90],[8,16,30,50,70,95],
];
const MO = ["N","D","J","F","M","A"];

function pc(p: number) {
  if (p === 1) return L.green;
  if (p <= 3) return L.blue;
  if (p <= 5) return "#d97706";
  return L.textDim;
}

export const coverSeoRankBlock = defineBlock({
  slug: "cover-seo-rank",
  displayName: "SEO ranking",
  category: "cover",
  description: "Keyword position cards with traffic trend.",
  schema: z.object({
    keywordSetIndex: z.number().default(0),
    trendIndex: z.number().default(0),
    accentHue: z.number().default(152),
    totalTraffic: z.string().default("24.8K"),
  }),
  render: ({ keywordSetIndex, trendIndex, totalTraffic }) => {
    const kws = KW[keywordSetIndex % KW.length];
    const trend = TRENDS[trendIndex % TRENDS.length];
    const mx = Math.max(...trend);

    return (
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-md" style={{ background: L.bg }}>
        <div className="flex w-full max-w-[290px] flex-col gap-2 px-4">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-medium tracking-[-0.1px]" style={{ color: L.textMuted }}>Organic Rankings</span>
            <div className="flex items-center gap-1">
              <span className="size-[4px] rounded-full" style={{ background: L.green, opacity: 0.7 }} />
              <span className="text-[7px]" style={{ fontFamily: "var(--font-mono)", color: L.textDim }}>{totalTraffic}/mo</span>
            </div>
          </div>

          <div className="flex flex-col gap-[3px]">
            {kws.map((k) => (
              <div key={k.kw} className="flex items-center justify-between rounded-[4px] px-2 py-[4px]" style={{ background: L.card, boxShadow: `inset 0 0 0 1px ${L.border}` }}>
                <div className="flex items-center gap-[6px] min-w-0">
                  <span className="shrink-0 text-[8px] font-medium" style={{ fontFamily: "var(--font-mono)", color: pc(k.pos) }}>#{k.pos}</span>
                  <span className="truncate text-[7px]" style={{ color: L.textMuted }}>{k.kw}</span>
                </div>
                <span className="shrink-0 text-[7px] ml-1" style={{ fontFamily: "var(--font-mono)", color: L.textDim }}>{k.vol}</span>
              </div>
            ))}
          </div>

          <div className="rounded-[4px] px-2 py-[5px]" style={{ background: L.card, boxShadow: `inset 0 0 0 1px ${L.border}` }}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[7px]" style={{ color: L.textDim }}>Traffic</span>
              <span className="text-[7px]" style={{ fontFamily: "var(--font-mono)", color: L.blue }}>↑ organic</span>
            </div>
            <div className="flex items-end gap-[2px]" style={{ height: 18 }}>
              {trend.map((v, i) => (
                <div key={i} className="flex-1 rounded-[1px]" style={{ height: `${(v / mx) * 16}px`, background: i === trend.length - 1 ? L.blue : L.borderSoft }} />
              ))}
            </div>
            <div className="mt-[2px] flex justify-between">
              {MO.map((m) => <span key={m} className="text-[5px]" style={{ fontFamily: "var(--font-mono)", color: L.textDim }}>{m}</span>)}
            </div>
          </div>
        </div>
      </div>
    );
  },
});
