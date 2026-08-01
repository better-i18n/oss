import type { ReactNode } from "react";

/**
 * The one long-form prose scale on the site.
 *
 * Three surfaces render body content authored somewhere else: the blog
 * (`blog/$slug`), CMS feature pages (`features/$slug`), and the legal documents
 * (`LegalLayout`). Each had grown its own `prose-*` chain — `prose-slate
 * prose-lg` with `prose-a:text-blue-600` on the legal pages, a neutral chain on
 * the blog, a third variant on feature pages — so the same paragraph rendered at
 * three weights, and a link was blue in one place and ink in another.
 *
 * WHAT THIS ENCODES (see DESIGN-DECISIONS.md → rule/one-prose-scale)
 *   - Never `prose-slate` / `prose-lg` / `prose-invert`: those ship Tailwind
 *     Typography's own size and weight scale, which lands h2/h3 in bold next to
 *     our 500-weight headings (rule/weight-500-headings).
 *   - Headings are `font-display` at weight 500. `h2` additionally takes the
 *     page's own `--text-h2` size and a hairline rule above it, so a markdown
 *     document reads with the same section rhythm as an authored page: the rule
 *     replaces the `<Divider />` a hand-built page would use, without inventing
 *     one `<Section>` per heading (markdown is a single flow).
 *   - Links are ink, not colour: `text-mist-950` + `underline-offset-4` +
 *     `decoration-mist-300`, darkening to `mist-500` on hover
 *     (rule/neutral-ink-accent-is-identity-only).
 *   - Inline code matches the code figure: `mist-50` ground + a `black/[0.07]`
 *     hairline, no backtick pseudo-elements. Fenced blocks are stripped of
 *     Typography's frame (`prose-pre:*`) because `CodeBlock` draws its own.
 *   - Markers, rules, quote bars and images stay on the `mist` scale, so a
 *     document separates content with the same hairlines as the rest of the site.
 *
 * Width and vertical rhythm are deliberately NOT set here — they belong to the
 * page's `<Section>` / `<Frame>` — so this string drops into any layout without
 * fighting its container.
 */
export const PROSE_CLASS = [
  "prose max-w-none",

  // Headings: size + ink carry the hierarchy; weight stays 500.
  "prose-headings:font-display prose-headings:font-medium prose-headings:tracking-[-0.02em] prose-headings:text-mist-950 prose-headings:scroll-mt-24",
  // h2 = a section opening: page h2 size, hairline rule above, generous lead-in.
  "prose-h2:[font-size:var(--text-h2)] prose-h2:leading-[1.15] prose-h2:mt-14 prose-h2:pt-10 prose-h2:border-t prose-h2:border-black/[0.05]",
  // …except the first one: the `<Section>` above it already opened the block, so
  // a rule there would read as a second divider stacked on the first.
  "[&>h2:first-child]:mt-0 [&>h2:first-child]:border-t-0 [&>h2:first-child]:pt-0",
  "prose-h3:[font-size:var(--text-lead)] prose-h3:mt-10",

  // Body copy.
  "prose-p:text-mist-700 prose-p:leading-[1.8] prose-li:text-mist-700 prose-li:leading-[1.8]",
  "prose-strong:text-mist-900 prose-strong:font-medium",

  // Links: ink + hairline underline, never an accent hue.
  "prose-a:text-mist-950 prose-a:underline prose-a:underline-offset-4 prose-a:decoration-mist-300 hover:prose-a:decoration-mist-500",

  // Code: inline chip matches the code figure; fenced blocks own their frame.
  "prose-code:text-mist-900 prose-code:bg-mist-50 prose-code:border prose-code:border-black/[0.07] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[0.9em] prose-code:font-normal prose-code:before:content-none prose-code:after:content-none",
  "prose-pre:p-0 prose-pre:bg-transparent prose-pre:rounded-none prose-pre:my-0 prose-pre:border-0 prose-pre:shadow-none",

  // Structure.
  "prose-blockquote:border-l-2 prose-blockquote:border-mist-200 prose-blockquote:pl-6 prose-blockquote:text-mist-600 prose-blockquote:not-italic prose-blockquote:font-normal",
  "prose-hr:border-black/[0.07] prose-img:rounded-xl",

  // List markers: neutral, never the accent, never a filled dark disc. The two
  // CSS variables are the reliable lever — Typography colours bullets and
  // counters through `--tw-prose-bullets` / `--tw-prose-counters` (slate by
  // default, which renders visibly blue-grey), and a `marker:` utility only
  // reaches the elements it is applied to.
  "prose-ul:marker:text-mist-300 prose-ol:marker:text-mist-400",

  /* Typography's own colour variables, rebound to the mist scale. The
     `prose-p:` / `prose-a:` utilities above only reach the elements they name,
     so anything else the plugin colours — `<dl>/<dd>` (the legal definition
     lists), table borders, captions, list markers — stayed on the default slate
     ramp, which reads as blue-grey next to our neutrals. Rebinding the variables
     colours the whole tree in one place instead of adding a `prose-*` utility
     per element. */
  "[--tw-prose-body:var(--color-mist-700)] [--tw-prose-headings:var(--color-mist-950)]",
  "[--tw-prose-lead:var(--color-mist-600)] [--tw-prose-links:var(--color-mist-950)]",
  "[--tw-prose-bold:var(--color-mist-900)] [--tw-prose-quotes:var(--color-mist-600)]",
  "[--tw-prose-bullets:var(--color-mist-300)] [--tw-prose-counters:var(--color-mist-400)]",
  "[--tw-prose-captions:var(--color-mist-500)] [--tw-prose-code:var(--color-mist-900)]",
  "[--tw-prose-hr:rgba(0,0,0,0.07)] [--tw-prose-quote-borders:var(--color-mist-200)]",
  "[--tw-prose-th-borders:rgba(0,0,0,0.07)] [--tw-prose-td-borders:rgba(0,0,0,0.05)]",
].join(" ");

/**
 * Wrapper for body content that is already React (the legal documents are
 * hand-authored JSX, not HTML strings). Surfaces that render an HTML string pass
 * `PROSE_CLASS` to `BlogContent` instead, so both paths share one scale.
 */
export function ProseBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className ? `${PROSE_CLASS} ${className}` : PROSE_CLASS}>
      {children}
    </div>
  );
}
