import { z } from "zod";
import { defineBlock } from "./_define-block";
import { L } from "./_linear";

const QUOTES = [
  { text: "Localization is not a feature. It is the foundation of trust.", author: "Core Philosophy" },
  { text: "The hardest part of going global isn't translation — it's making translation invisible.", author: "Engineering Notes" },
  { text: "A missing translation is a broken experience.", author: "UX Research" },
  { text: "Every untranslated string is a door left closed.", author: "Product Philosophy" },
  { text: "AI-native apps are multilingual by default, not by afterthought.", author: "Thought Leadership" },
  { text: "Shipping in one language isn't launching globally. It's launching locally at scale.", author: "Growth Insights" },
  { text: "Type-safe translations are the difference between a confident refactor and a silent regression.", author: "Engineering" },
  { text: "The CDN is the new translation runtime.", author: "Infrastructure" },
  { text: "If your i18n pipeline requires a deploy to ship a translation, it's already broken.", author: "Platform Design" },
  { text: "Context is the secret ingredient in AI translation.", author: "AI Research" },
  { text: "Localization debt compounds faster than technical debt.", author: "Engineering" },
  { text: "The best i18n system is the one developers forget is there.", author: "Developer Experience" },
  { text: "Internationalization is architecture. Localization is craft.", author: "Engineering Notes" },
  { text: "The gap between 'technically translated' and 'feels native' is where trust lives.", author: "Quality" },
  { text: "Treating translation as a batch job is like treating UX as a launch checklist.", author: "Product Philosophy" },
];

export const coverQuoteBlock = defineBlock({
  slug: "cover-quote",
  displayName: "Pull quote",
  category: "cover",
  description: "Typography-focused quote card.",
  schema: z.object({ quoteIndex: z.number().default(0), accentHue: z.number().default(265) }),
  render: ({ quoteIndex }) => {
    const q = QUOTES[quoteIndex % QUOTES.length];
    return (
      <div className="flex h-full w-full items-center overflow-hidden rounded-md" style={{ background: L.bg }}>
        {/* Accent bar */}
        <div className="absolute left-0 top-[18%] bottom-[18%] w-[2px]" style={{ background: `linear-gradient(to bottom, transparent, ${L.blue}, transparent)` }} />

        <div className="relative flex flex-col gap-3 px-6 py-5">
          <div className="select-none text-[28px] font-light leading-none" style={{ color: L.border }}>"</div>

          <blockquote className="text-[9px] font-medium leading-[1.5] tracking-[-0.1px] -mt-2" style={{ color: L.textSecondary }}>
            {q.text}
          </blockquote>

          <span className="text-[7px] tracking-[-0.1px]" style={{ color: L.textDim }}>{q.author}</span>
        </div>

        <div className="absolute bottom-2.5 right-3 opacity-[0.08]">
          <img src="/brand/logo.svg" className="size-4 invert" alt="" />
        </div>
      </div>
    );
  },
});

export { QUOTES };
