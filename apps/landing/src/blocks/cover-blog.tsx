import { z } from "zod";
import { defineBlock } from "./_define-block";

const CATEGORY_STYLES: Record<string, { accent: string; icon: string; bg: string }> = {
  comparison: { accent: "#5e6ad2", icon: "⇄", bg: "#f0f1ff" },
  engineering: { accent: "#059669", icon: "⌘", bg: "#ecfdf5" },
  tutorials: { accent: "#0284c7", icon: "→", bg: "#eff6ff" },
  seo: { accent: "#7c3aed", icon: "◎", bg: "#f5f3ff" },
  "thought leadership": { accent: "#b45309", icon: "✦", bg: "#fffbeb" },
  "product updates": { accent: "#0f766e", icon: "▲", bg: "#f0fdfa" },
  default: { accent: "#6366f1", icon: "◆", bg: "#f5f5f5" },
};

export const coverBlogBlock = defineBlock({
  slug: "cover-blog",
  displayName: "Blog cover with title",
  category: "cover",
  description: "Clean light cover showing the post title with category-colored accent.",
  schema: z.object({
    title: z.string().default("Blog Post"),
    category: z.string().default("default"),
    accentOverride: z.string().optional(),
  }),
  render: ({ title, category, accentOverride }) => {
    const cat = CATEGORY_STYLES[category.toLowerCase()] ?? CATEGORY_STYLES.default;
    const accent = accentOverride ?? cat.accent;

    return (
      <div
        className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-lg p-5"
        style={{ background: cat.bg }}
      >
        {/* Subtle grid */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `linear-gradient(${accent}08 1px, transparent 1px), linear-gradient(90deg, ${accent}08 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />

        {/* Corner decoration */}
        <div
          aria-hidden
          className="absolute -right-8 -top-8 size-32 rounded-full blur-3xl"
          style={{ background: `${accent}10` }}
        />

        {/* Top: category icon */}
        <div className="relative flex items-center gap-2">
          <span className="text-[14px]" style={{ color: accent, opacity: 0.4 }}>{cat.icon}</span>
          <div className="h-[1px] flex-1" style={{ background: `${accent}15` }} />
        </div>

        {/* Center: title */}
        <h3
          className="relative z-10 max-w-[90%] text-[13px] font-semibold leading-[1.35] tracking-[-0.2px]"
          style={{ color: "#1a1a1a" }}
        >
          {title}
        </h3>

        {/* Bottom: logo */}
        <div className="relative flex items-center justify-between">
          <img src="/brand/logo.svg" className="size-4 opacity-[0.12]" alt="" />
          <div className="h-[1px] flex-1 ml-2" style={{ background: `${accent}12` }} />
        </div>
      </div>
    );
  },
});
