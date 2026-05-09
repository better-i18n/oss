import { z } from "zod";
import { defineBlock } from "./_define-block";

export const coverGradientCaptionBlock = defineBlock({
  slug: "cover-gradient-caption",
  displayName: "Gradient cover with caption",
  category: "cover",
  description:
    "Two-color gradient with logo mark and a localized caption. For announcements, product posts, and brand content.",
  schema: z.object({
    from: z.string().default("#3b82f6"),
    to: z.string().default("#8b5cf6"),
    caption: z.string().optional().describe("Caption overlay text"),
    logoTone: z.enum(["light", "dark"]).default("light"),
  }),
  render: ({ from, to, caption, logoTone }) => (
    <div
      className="relative flex h-full w-full items-end overflow-hidden rounded-lg p-5"
      style={{ backgroundImage: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}
    >
      <div aria-hidden className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-white/15 blur-2xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-12 -left-10 size-40 rounded-full bg-white/10 blur-3xl" />
      <div className="relative">
        <img
          src="/brand/logo.svg"
          alt=""
          className={"mb-2 h-[18px] w-[18px] " + (logoTone === "light" ? "invert" : "")}
          style={{ opacity: 0.8 }}
        />
        {caption ? (
          <p
            className={
              "max-w-[240px] text-[18px] font-medium leading-[1.15] tracking-[-0.02em] " +
              (logoTone === "light" ? "text-white" : "text-gray-900")
            }
          >
            {caption}
          </p>
        ) : null}
      </div>
    </div>
  ),
});
