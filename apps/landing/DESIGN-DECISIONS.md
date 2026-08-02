# Better i18n Landing — Design Decisions

Accepted product/design decisions for `oss/apps/landing`, written as code so any
agent (Claude, Composer, grok) can load the *why* and not just copy the style.

**Load this file before**: a new page, a redesign, a section audit, or any
"make it look better" task. Style questions are answered here first, taste second.

Origin: 2026-07-31 — the landing adopts the Helpway marketing design language
(`helpway/apps/marketing`) wholesale, in both style *and* page structure.
Reason: better-i18n's 57 SEO detail pages had no shared section grammar (7–13
ad-hoc `<section>` blocks per page, container/typography re-invented per file),
while Helpway's 8 pages share a 176-line contract (`ui/product-page.tsx`) and read
as one product. We adopt the contract, not just the colors.

---

## rule/the-motto
Scope: every change to this app, checked by the author before asking for review
Rule: five sentences, in this order of authority. They are the compressed form of
the rules below, and where a detailed rule seems to disagree, the motto wins.
1. **One container.** No hand-rolled `max-w` + `px` + `py` trio; `.section` or
   `.frame`. The page is already a frame.
2. **No box inside a box.** A list item has no border, fill or padding of its own
   — bare columns and gap. A TABLE is the exception: there the lines *are* the
   structure.
3. **The only transition is `<Divider />`.** No alternating background, no
   gradient, no margin standing in for a rule. The page is white; separation is a
   hairline.
4. **Colour exists only when it carries information.** Neutral ink; accent only
   for pillar identity, link/focus, and code tokens (there hue *is* the
   information). No decorative colour, no bold — hierarchy is size plus ink.
5. **Name a thing with its mark.** Vendor → `CompetitorMark`, framework →
   `FrameworkIcons` / `GuideMark`, locale → `LocaleFlag`. One size, one tile,
   everywhere.

Two invariants sit alongside it:
 (a) inline i18n `defaultValue` is **forbidden** — `useT` humanises a missing key
     and never reads it, so a fallback is dead code that hides the gap. Put the
     key on the CDN.
 (b) **no SEO loss** — copy, headings, structured data, `seo/pages.ts`,
     `llms-txt.ts` and URLs survive; what changes is the shell and the type.

Self-check before every PR: `npx tsc --noEmit` · `npx react-doctor@latest .
--diff main` (Correctness / State / Performance at zero) ·
`./scripts/audit/run-audit.sh --only <path>` (h1, zero placeholders, meta
lengths, canonical, hreflang, overflow, LCP).
Why: the rules below are long enough that an agent reads the one nearest its task
and misses the other nine. Five sentences fit in working memory, so they get
applied without being looked up.
Evidence: user, 2026-08-01. Known false positive in the audit: the `no JSON-LD` /
`JSON-LD parse error` lines are a TanStack 1.149 bug, not ours — do not chase them.

## rule/one-container
Scope: every marketing page and section
Rule: horizontal containment comes from `.frame` (no vertical rhythm) or
`<Section>` / `.section` (frame + rhythm) — both 1160px with vertical hairlines.
A page may not write `max-w-7xl px-6 py-20` (or any `max-w-*` + `px-*` + `py-*`
container trio) by hand.
Why: 96 route files each re-declared their own container, so no two sections
lined up and the frame rules broke across pages. One container = one column.
Evidence: `src/styles.css` (PAGE GRAMMAR block), `src/components/ui/page.tsx`
Bad: `<section className="py-20"><div className="mx-auto max-w-7xl px-6">`
Good: `<Section>` from `@/components/ui/page`
Exceptions: full-bleed bands (logo marquee, quote ground) use `<Section className="!p-0">`.

## rule/section-opens-with-header
Scope: every section on every page
Rule: a section's first children are `eyebrow` → `section-h2` → `section-p`,
via `<SectionHeader>`. Never start a section with a card grid, a table, or an h3.
Why: a 12-section SEO page stays readable only if every section starts with the
same sentence shape. This is what makes a long page feel deliberate rather than
accumulated.
Evidence: `helpway/apps/marketing/src/components/ui/product-page.tsx:SectionHeader`,
used identically by Inbox/HelpCenter/SupportTeams/Agencies pages.
Bad: `<Section><div className="grid grid-cols-3">…`
Good: `<Section><SectionHeader eyebrow={…} title={…} subtitle={…} /> …visual…`

## rule/divider-is-the-only-transition
Scope: between two sections
Rule: sections are separated by `<Divider />` — a full-bleed hairline whose 13px
corner ticks sit on the frame edges. No alternating background colors, no
gradient wipes, no extra margin as a separator.
Why: the tick marks are the signature that ties unrelated sections to the same
frame. Background alternation was how the old design faked separation, and it is
what made the page read as stacked cards.
Evidence: `src/styles.css` `.divider/.divider-inner`, `helpway .../page-router.tsx`
Exceptions: none.

## rule/weight-500-headings
Scope: all headings h1–h3
Rule: `font-weight: 500`. Hierarchy comes from size (`--text-hero`, `--text-h2`,
`--text-lead`) and ink weight (`mist-950` → `mist-600`), never from bold.
Why: at 14px base with `-0.025em` tracking, semibold/bold headings read as shouting
and break the quiet register the rest of the page relies on.
Bad: `text-4xl font-semibold` / `font-bold`
Good: `className="section-h2"` or `font-medium` + `--text-*`

## rule/white-page-hairline-separation
Scope: page background and surfaces
Rule: the page is white. Separation is done with hairlines
(`rgba(0,0,0,0.07)`), not with a tinted canvas and floating cards. Elevation is
near-invisible: `--shadow-xs` / `--shadow-card` only.
Why: the previous design put every page on `bg-mist-100` (#eef0f1) with white
`rounded-2xl` cards + `shadow-lg`; that reads as a dashboard, not a document, and
it fights the frame rules.
Evidence: `src/styles.css` `@layer base body`, `MarketingLayout.tsx` default
`bgClassName="bg-white"`, `FrameLines`
Exceptions: `bg-mist-50` (#fafaf9) as a *subtle* surface inside a section is fine.

## rule/neutral-ink-accent-is-identity-only
Scope: color usage
Rule: the palette is neutral greys. Accent color appears only in
`<PillarBadge>` (ai / sync / mcp / content) plus link and focus states. No
`blue-500/600/700` on borders, headings, icons or fills.
Why: color was carrying no information — it was decoration on 31 sites. Reserving
it for pillar identity makes "which product surface am I reading about" legible at
a glance, the same job Helpway's inbox/outreach/helpcenter colors do.
Evidence: `src/components/ui/page.tsx PILLAR_META`
Bad: `border-blue-600 text-blue-600` on a generic feature card
Good: `<PillarBadge pillar="sync" label={t("pillar.sync")} />`
Exceptions: code-block tokens, where hue carries the information rather than
decorating it — three pillar hues only, see `rule/code-blocks-carry-three-hues`.
Do not "restore neutrality" there; grey tokens measured as unhighlighted.

## rule/token-names-are-stable
Scope: `src/styles.css` `@theme`
Rule: the `mist-*` scale keeps its names; only its *values* are rebound. New code
prefers the semantic aliases (`--color-ink`, `--color-muted-ink`, `--color-hairline`).
Why: `mist-*` utilities occur 2689× across 132 files. Renaming would have meant a
mechanical edit of every file with no visual gain; rebinding moved the whole site
in one commit. Steps were mapped from measured usage (950 = body text + dark
buttons, 700 = paragraphs, 200 = the default border, 50 = card surface), so
contrast survives: `mist-500` = #787878 (4.6:1 AA), `mist-400` = #929292 is
**11–12px meta only**.
Evidence: `src/styles.css` `@theme` comment block

## rule/seo-content-is-load-bearing
Scope: any restructure of a detail page
Rule: restyling may change containers, order, and section *count* (target 4–6),
but must not delete indexed copy, headings that carry keywords, structured data,
`seo/pages.ts` entries, `llms-txt.ts` sections, or route URLs.
Why: this app is an SEO + AI-visibility engine, not only a brochure; a section
merge is a container change, not a content cut.
Evidence: `CLAUDE.md` (Purpose), `src/seo/pages.ts`, `src/seo/llms-txt.ts`
Bad: dropping three thin sections to hit the 4–6 target
Good: merging three thin sections into one `<Section>` keeping all prose

## rule/pillar-pages-get-bespoke-visuals
Scope: detail pages
Rule: ~8–10 pillar pages (nextjs, react, complete-guide, multilingual-seo,
features, pricing, compare/index, for-developers) get a purpose-built visual per
section — a diagram built from DOM + SVG, like Helpway's connector/flow visuals.
Every other page composes the four repeatable archetypes: `FeatureRow` +
`FeatureColumn`, `BentoList` + `BentoRow`, comparison table, code block.
Why: Helpway's per-page quality comes from bespoke visuals, and 57 bespoke pages
is ~7× the effort that produced Helpway's entire landing. A tiered budget is the
only version of this that both ships and stays consistent.
Evidence: measured — `AgenciesPage.tsx` 711L / `InboxPage.tsx` 774L are mostly
per-page diagram code (`BranchConnector`, `DrillConnector`, `MiniChannel`).
Decision: user, 2026-07-31.

## rule/verify-rendered-not-source
Scope: any claim that a restyle "looks right"
Rule: do not call a visual change verified from source. Render it (dev server +
screenshot, or `npx impeccable detect`) or hand it to the user for a look.
Why: token rebinding touches 132 files at once; source review cannot see the result.

---

## rule/menu-leads-with-products
Scope: header Product mega menu
Rule: the first section lists **products** (Better I18N, Better Content) with a
`<ProductTile>` identity mark; personas ("Who it's for") come second, industries
third. Product tiles are the one place a saturated colour is allowed in chrome.
Why: the menu previously opened with four persona cards, so a first-time visitor
had to infer what is actually sold. Products first answers "what is this?" before
"is it for me?" — the reference implementation does the same with its three
product folders.
Evidence: `src/components/Header.tsx` (Product menu), `src/components/ui/product-tile.tsx`
Decision: user, 2026-07-31.

## rule/menu-one-secondary-density
Scope: every header mega-menu panel
Rule: a panel has exactly two densities — a primary left column (product/lead
cards: 40px mark, 14px title, 13px description) and a tinted right rail
(`<MegaMenuRail>`) where every secondary link is the same 13px row with a 16px
bare glyph. Never stack a card section on top of a pill section in the same
panel, and never give a secondary link a description.
Why: the Product panel previously ran Products (cards) → Who it's for (cards
with two-line descriptions) → By industry (bare rows). Three stacked densities
read as "one big area and one small one" — the hierarchy was carried by item
size instead of by layout, so nothing looked deliberate. Splitting it makes
position carry the hierarchy and lets all secondary links share one scale.
Evidence: `src/components/header/mega-menu.tsx` (`MegaMenuSplit`, `MegaMenuRail`,
`MegaMenuRailLink`), applied to all three panels in `src/components/Header.tsx`
Bad: `<MegaMenuSection label="By industry">` under a card section
Good: `<MegaMenuSplit><MegaMenuSection …/><MegaMenuRail>…</MegaMenuRail></MegaMenuSplit>`
Exceptions: the panel footer bar (`MegaMenuFooter`) spans full width below the split.

## rule/pillar-page-shape
Scope: pillar detail pages (`features`, `i18n/nextjs`, `i18n/react`,
`i18n/complete-guide`, `i18n/multilingual-seo`, `pricing`, `compare/`, `for-developers`)
Rule: the page is `PageHero` (pillar badge → hero headline → lede → 2 CTAs →
one bespoke hero visual) → `Divider` → 4–6 `Section`s that each open with
`SectionHeader` and carry one purpose-built visual → `ClosingCta`. Set
`MarketingLayout showCTA={false}` so the page owns its closing ask.
Why: this is the reference implementation's product-page shape, and it is what
makes a long page read as authored rather than accumulated. The first
implementation is `routes/$locale/features/index.tsx` — copy that shape.
Evidence: `helpway/apps/marketing/src/pages/InboxPage.tsx`,
`routes/$locale/features/index.tsx` (PipelineVisual, GlossaryVisual,
GitFlowVisual, ScanVisual)

## rule/interior-hairlines-only
Scope: every grid, list or table of cells inside a `Section`
Rule: cells are separated by INTERIOR hairlines only. Each cell carries
`border-t border-l border-black/[0.05]`, the grid is shifted `-mt-px -ml-px`, and
the wrapper is a bare `overflow-hidden` — no border, no radius — which clips the
first row's and first column's rules. Never add an outer
`rounded-xl border border-black/[0.07]` around such a grid: `.section` already
contains it, so the border reads as a box inside a box on top of the interior
rules. Never use nth-child arithmetic (`:first-child`, `divide-x`) to place the
rules in a responsive grid — the count changes per breakpoint and a rule then
doubles or disappears.
Why: the previous design separated everything with cards; the sweep replaced the
cards with a bordered container, which was still one box too many. Twice the ink
the split needs. The `-1px` shift + bare clip box is the only version that is
correct at 1, 2, 3 and 4 columns without per-breakpoint rules.
Evidence: `FrameworkSupport.tsx:178-190` (original), `UseCases.tsx`,
`Testimonials.tsx`, `MetricsBadges.tsx` (`StatColumns`), `FrameworkComparison.tsx`
(`HAIRLINE_GRID`), `framework/SdkFlow.tsx`
Bad: `<div className="overflow-hidden rounded-xl border border-black/[0.07]"><div className="-mt-px -ml-px grid …">`
Good: `<div className="overflow-hidden"><div className="-mt-px -ml-px grid …">`
Exceptions: a *figure* — a bespoke visual, a code block, a product mockup — is a
single object rather than a set of cells, so it keeps its own
`rounded-xl border border-black/[0.07]` shell. See `PipelineVisual`,
`RequestFlowVisual`, `CodeBlock`.
Decision: user, 2026-07-31 ("buralarda çok border olmasına gerek yok içeride").

## rule/no-package-we-do-not-ship
Scope: every page, code sample, FAQ answer and `structuredDataOptions.dependencies`
Rule: a code sample may only `import` from, and `dependencies` may only list,
packages that exist in `oss/packages/`. Before writing an install line or an
import for a framework page, check that directory. If there is no SDK for that
framework, document the real path — `@better-i18n/core` (zero dependencies, no
framework import on the main path) feeding that ecosystem's own i18n runtime —
and say plainly that no wrapper is needed and why.
Why: five pages documented packages that do not exist —
`@better-i18n/vue`, `@better-i18n/nuxt`, `@better-i18n/svelte`,
`@better-i18n/angular`, `@better-i18n/js`. The audience for those pages is
developers, and the first thing they do is run the install line, which 404s. That
costs more credibility than having no page for the framework at all. Stating a
limitation (the CLI scanner's default extensions are `.tsx/.jsx/.ts/.js`, so it
does not read `.vue` SFCs) reads as competence; a fabricated import reads as a lie.
Evidence: `oss/packages/` listing, `packages/core/package.json` (`dependencies: {}`),
`packages/cli/src/analyzer/file-collector.ts:29`, `packages/core/src/cdn.ts:796-799`;
fixed in `i18n/{vue,nuxt,svelte,angular,javascript}.tsx`
Bad: `import { useI18n } from '@better-i18n/vue'`
Good: `import { createI18nCore } from '@better-i18n/core'` + `import { useI18n } from 'vue-i18n'`
Decision: user, 2026-07-31 (chose "Dürüst konumlandırma: core + framework'ün kendi i18n'i").

## rule/one-architecture-story
Scope: any explanation of how the SDK behaves at runtime
Rule: the read path, the fallback chain, the publish path and the platform
numbers live in ONE component (`framework/SdkFlow.tsx` → `<CoreSdkFlow>`). A page
passes only what is page-specific: the first hop's name, what the framework layer
does with the messages, and where it calls the client from. Pages do not restate
the architecture inline.
Why: the same four hops and the same five fallback layers apply to all 17
framework pages. Inlined per page, they drift — and a drifted architecture
diagram is worse than none, because it is quoted as documentation. The numbers
(60s client TTL, `max-age=60`, HTTP 200 always, 0 dependencies, 5 fallback
layers) are platform behaviour, so a platform change must be one edit.
Evidence: `framework/SdkFlow.tsx` (`CoreSdkFlow`), used by
`i18n/{vue,nuxt,svelte,angular,javascript}.tsx`
Decision: user, 2026-07-31 ("sdklarin calisma mantigini flowlarla anlatabiliriz").

## rule/no-inline-i18n-fallback
Scope: every `t()` call in this app
Rule: call `t("key")` and nothing else. Never pass `defaultValue`. If a string is
missing, create the key on the CDN (`createKeys` + `publishTranslations`).
Why: not a style preference — `useT` **humanizes an unresolved key and never
reads `defaultValue`**. So `t("vsLabel", { defaultValue: "Better I18N vs {name}" })`
renders the literal text "Vs Label" on screen. The fallback is dead code that also
hides the missing key from anyone reading the source, which is how "Title",
"Description", "Vs Label" and "Disclaimer" shipped to production on the comparison
pages. A key that exists is visible in `listKeys`, gets translated into all 22
languages, and cannot silently degrade.
Evidence: `ComparisonTable.tsx:554` (`vsLabel` + defaultValue) rendering "Vs Label"
in the browser while SSR was correct; user report 2026-08-01 ("bunlar neden eski
lan description falan diyor").
Bad: `t("heading", { defaultValue: "Related Guides" })`
Good: `t("heading")` — plus the key created in the `seeAlso` namespace.
Exceptions: none.

## rule/client-messages-must-cover-every-key-the-page-renders
Scope: `src/lib/page-namespaces.ts` (`PAGE_NAMESPACE_MAP`, `resolveDynamicConfig`)
Rule: when a page renders a key, that key's namespace/subtree must be in the
page's config. Adding a cross-page section (sibling links, a shared disclaimer)
means adding its subtree too — and verifying in the BROWSER, not in the SSR HTML.
Why: the same filter runs on the server and in the embedded
`<script id="__i18n_messages__">`, but a page can render correctly server-side and
degrade after hydration when a subtree was dropped. On `/compare/{competitor}` the
config carried only that competitor's subtree, so the five sibling `vsLabel`s in
`<OtherComparisons>` humanized to "Vs Label" the moment React took over.
Evidence: aside DOM count 7 placeholders vs 2 in SSR HTML on
`/en/compare/crowdin/`, 2026-08-01.
Exceptions: none — a smaller payload is not worth a wrong page.

## rule/competitor-marks-are-real-logos
Scope: any surface that names a competitor (comparison pages, hub matrix,
Alternatives, OtherComparisons)
Rule: show the vendor's own mark from `public/logos/` via `<CompetitorMark>`. Do
not recolour, crop, or restyle it; the constant is the tile (same size, same
hairline, white ground), never the logo. Every comparison surface carries
`compare.disclaimer`. Removing a file from `public/logos/` degrades that vendor to
a monogram automatically.
Why: on a page whose whole job is comparison, a letter tile reads as being coy
about who we mean. The real mark is more honest, faster to scan, and markets them
well — the posture the whole comparison set is written in.
Evidence: `src/components/icons/CompetitorMarks.tsx`; assets sourced from each
vendor's own site favicon / brand asset; user decision 2026-08-01 ("urunelrin
gercek logolari yok ... saygi duyalim").
Exceptions: a vendor asking us to stop — delete the asset, monogram takes over.

## rule/one-prose-scale
Scope: every surface that renders body content authored elsewhere — blog posts
(`blog/$slug`), CMS feature pages (`features/$slug`), the legal documents
(`LegalLayout` → terms / privacy / cookies)
Rule: the `prose-*` chain lives in ONE place, `src/components/ProseBody.tsx`
(`PROSE_CLASS` for HTML-string surfaces, `<ProseBody>` for JSX ones). A page may
not write its own chain. The standard is:
`prose max-w-none` + `prose-headings:font-display prose-headings:font-medium`
(weight 500, never Typography's bold) + `prose-h2:[font-size:var(--text-h2)]
prose-h2:pt-10 prose-h2:border-t prose-h2:border-black/[0.05]` (a markdown h2 is
a section opening, so the hairline does the job `<Divider />` does on an authored
page) + `prose-a:text-mist-950 prose-a:underline-offset-4
prose-a:decoration-mist-300` (ink, never a hue) + `prose-code:bg-mist-50
prose-code:border prose-code:border-black/[0.07]` (matches the code figure) +
`prose-pre:*` reset to nothing (the code block owns its frame) +
`prose-ul:marker:text-mist-300 prose-ol:marker:text-mist-400`.
BANNED: `prose-slate`, `prose-lg`, `prose-invert`, any `prose-a:text-blue-*`.
`prose-slate`/`prose-lg` re-import Typography's own size and weight scale, which
is what made legal h2s bold and oversized next to 500-weight headings.
Why: the same paragraph rendered at three different weights on three surfaces,
and links were blue in the legal documents and ink everywhere else. Width and
vertical rhythm are deliberately NOT in the chain — they belong to
`<Section>`/`<Frame>`, so the string drops into any layout.
Evidence: `src/components/ProseBody.tsx`; was inlined at `blog/$slug.tsx:354`,
`features/$slug.tsx` and `LegalLayout.tsx:62` (`prose-slate prose-lg
prose-a:text-blue-600`)
Decision: user, 2026-08-01 (legal headings "çok bold", links "MAVİ").

## rule/code-blocks-are-tokenised-at-build
Scope: every code sample on the marketing site
Rule: code is highlighted by `src/components/CodeBlock.tsx` — a synchronous,
dependency-free tokenizer (`HighlightedCode` for a bare block, `CodeBlock` for
the framed figure). No Shiki, Prism, highlight.js or any runtime highlighter, and
no new dependency for this job. An unknown language renders as escaped plaintext
rather than being guessed at. Token *colour* is a separate decision — see
`rule/code-blocks-carry-three-hues`.
Why: these pages are SSG with a CWV budget. TanStack, on the same stack, measured
a docs page transferring ~1.1 MiB of script with "roughly 358 KiB tied to syntax
highlighting alone" (Shiki + WASM + themes + grammars) and answered it by
building a narrow highlighter: `@tanstack/highlight` is 1.7 KB gzipped empty,
3.9 KB with TSX, ~8 KB with all 25 languages, synchronous, "tokens carry stable
semantic classes instead of theme colors". Our snippet set is a few dozen
hand-authored samples in four languages, so a ~90-line tokenizer covers it and
ships nothing to the browser at all.
Evidence: TanStack/tanstack.com — `src/blog/introducing-tanstack-markdown-and-highlight.md`,
`src/components/landing/HighlightLanding.tsx:28,101,157`, `package.json`
(`"@tanstack/highlight": "^0.0.9"`); ours: `src/components/CodeBlock.tsx`, used by
`blog/BlogContent.tsx`, `analytics.tsx`, `content.tsx`, `i18n/nextjs.tsx`
Exceptions: the dark-ground snippets on `i18n/for-developers.tsx`,
`integrations.tsx` and `developers/DeveloperIDESupport.tsx` are still unhighlighted
— they need a dark token map, listed under Coverage gaps.
Decision: user, 2026-08-01 ("runtime'da ağır bir highlighter YÜKLEMEYECEKSİN").

## rule/code-blocks-carry-three-hues
Scope: token colour inside a code block (`TOKEN_INK` in `src/components/CodeBlock.tsx`)
Rule: exactly three hues, all already in the design system, at the 700 step —
keyword `violet-700` (the `ai` pillar hue), string `green-700` (`sync`), number
`orange-700` (`content`). Everything else stays grey: comment `mist-400`,
punctuation `mist-300`, plain `mist-700`. No fourth hue, no new token, no
background tint per token, no theme switch.
Why: this is a deliberate exception to
`rule/neutral-ink-accent-is-identity-only`, and it follows that rule's own
reasoning rather than breaking it. Colour is banned elsewhere because it was
decoration "carrying no information". In a code block the opposite holds: hue IS
the information — it is what separates a string from an identifier at a glance.
The all-grey version was not restrained, it was unhighlighted: measured on
`/en/i18n/nextjs/`, **56 of 72 tokens in one block resolved to `mist-300`**, which
reads as plain text with noise, and the reported bug was literally "kod
bloklarında renklendirme yok" on a page where highlighting was already running.
What keeps it from becoming a rainbow theme: three hues only, all reused from
`PILLAR_META`, the 700 step so 12px mono stays AA on white, and
comment/punctuation/plain left grey so hue marks *meaning* instead of every second
character.
Evidence: `src/components/CodeBlock.tsx` (`TOKEN_INK` + the COLOUR block above it);
verified rendered — 1606 token spans across the site's blocks resolve to
violet/green/orange/grey, with `import`/`from`/`export`/`const`/`await` violet,
string literals green, comments grey.
Bad: `TOKEN_INK.keyword = "text-mist-950"` (grey-on-grey, i.e. unhighlighted);
adding a fourth hue for operators or types
Good: the three-hue map above, with everything structural left grey
Decision: user, 2026-08-01 (changed `TOKEN_INK` directly after measuring the
all-grey result).

## rule/tools-grammar-stops-at-the-tool
Scope: `src/routes/$locale/tools/*` (8 routes, they bypass `MarketingLayout`)
Rule: the page grammar governs the **shell**; the tool's own working surface is
exempt. Concretely —

*Shell (grammar applies, no exceptions):* hero, section openings, the transitions
between sections, prose around the tool, related links, the closing CTA. White
ground, hairline separation (`border-black/[0.07]`), weight-500 headings,
`<Divider />` as the only transition, `.btn` for buttons, no `max-w-* px-* py-*`
triples.

*Instrument (grammar yields):* the input/output panels, result tables, code
output, segmented controls, file drop zones. These may keep denser padding, their
own internal rules, and monospace surfaces, because a reference table that obeys
marketing rhythm becomes unreadable.

Two things bind even inside the instrument:
1. **Inline code chips follow the prose scale** — `bg-mist-50` + `border
   border-black/[0.07]` + `rounded-md px-1.5 py-0.5`, the same treatment
   `ProseBody` gives `prose-code`. Not `bg-mist-100` / `bg-mist-200`.
2. **Hue is reserved for tool STATE, never for decoration.** A validation warning
   or an error may be amber/red, because the hue is the message. A "Save up to
   40%" badge, an RTL/LTR label, or a "Recommended" chip may not, because the
   text already carries the meaning and the colour is ornament.

Why: tools are interactive apps, not documents — forcing `<Section>` rhythm into a
locale reference table or an ICU playground trades legibility for consistency
nobody asked for. But the page *around* the tool is a marketing page, and it was
drifting: tinted `bg-mist-100` canvases, hand-rolled buttons and off-scale code
chips made `/tools/*` read as a different product.
Evidence: 21 tinted surfaces across 6 tool files (2026-08-01 sweep);
`hreflang-generator.tsx:282` (`border-mist-200 bg-mist-100` panel),
`icu-playground.tsx` (4 off-scale code chips), `cost-calculator.tsx:275`
(`h-px bg-mist-200` rule).
Bad: `<code className="rounded bg-mist-200 px-1">`, `bg-green-100` savings badge
Good: `<code className="rounded-md border border-black/[0.07] bg-mist-50 px-1.5 py-0.5">`,
amber kept on `hreflang-generator` validation warnings
Exceptions: the instrument surfaces listed above.
Decision: user delegated 2026-08-01 ("grammar'ı SAYFA KABUĞUNA uygula … aracın
kendi UI'ında okunabilirliği bozacak şekilde zorlamayı deneme").

## rule/listed-items-are-not-cards
Scope: any list of repeated items rendered from `.map()` — link lists, release
lists, quote lists, related-post lists, competitor lists
Rule: the items get NO border, NO fill and NO padding of their own. They are bare
columns separated by `gap` alone. Hierarchy inside an item comes from type size and
ink, exactly like the prose around it.
Why: the page is already a bordered frame (`FrameLines` + `.section` vertical
rules), and `.section` already supplies the padding. Giving each item its own
border and inset stacks a third box inside the second one, and the eye reads the
borders before it reads the content. Applied one by one to the changelog band,
testimonials, related posts and the comparison hub — each time the section got
quieter and easier to scan without losing any structure.
Evidence: `Changelog.tsx`, `Testimonials.tsx`, `blog/$slug.tsx` (related),
`compare/index.tsx` (competitor list); user decision 2026-08-01 ("bu tarz
kartlarda da border olmasın, zaten border içinde bir tasarım üstünde çalışıyoruz").
Bad: `<Link className="rounded-xl border border-black/[0.07] p-5">` inside a `.map()`
Good: `<div className="grid gap-8 sm:grid-cols-2">` + `<Link className="flex flex-col gap-2.5">`
Exceptions: a **table** keeps its rules — there the lines are the structure, not
decoration (the comparison matrix). A hairline cell grid is still correct when the
cells form a matrix of equal units (framework support, feature grids), not when
they are a list of links.

## rule/name-a-thing-with-its-mark
Scope: anywhere a third-party product, framework or locale is named
Rule: put its real mark next to the name, at one size, on a neutral ground —
`<CompetitorMark>` for vendors, `FrameworkIcons` for frameworks, `<LocaleFlag>`
for locales. Same tile, same size everywhere; the mark is never resized or
recoloured per surface.
Why: a name is a string, a mark is recognisable at a glance — in a matrix header,
a menu row or a comparison card the mark is what lets someone find their own stack
without reading. It also stops each surface from inventing its own treatment.
Evidence: comparison matrix headers and cards, Alternatives, OtherComparisons, the
navbar Integrations menu, the app-preview locale chips; user decision 2026-08-01
("bu marklar çok beğendim, diğer yerleri de böyle").
Exceptions: none — if we have no licensed asset, `CompetitorMark` falls back to a
monogram in the same tile.

## rule/how-it-works-is-a-converging-flow
Scope: any section that answers "how does this work" — product pillar heroes,
persona pages, feature explainers
Rule: use `FlowHero` (`src/components/visuals/FlowHero.tsx`). Inputs sit around the
edge as `FlowCard`s, the platform sits in the centre, one accent pulse runs edge →
centre. Do not build a new diagram per page: pass different cards. A hero takes it
through `PageHero`'s existing `visual` slot; a mid-page section renders it inside
`<Section>` under a `SectionHeader`.
Why: every page invented its own answer — a row of five emoji tiles joined by grey
bars, a screenshot of our own docs, a dashboard mock. None of them said what the
product does, and each one had to be maintained separately. The converging diagram
is the shape the reference implementation uses for its product heroes, and it is
legible in one glance: many sources, one place, one direction.
Constraints: pure SVG/CSS (no JS, free at SSG time), animation off under
`prefers-reduced-motion` with the finished frame visible, one accent hue, and no
externally hosted imagery.
Evidence: `content.tsx` (`ContentFlow`), `for-product-teams` (`ProductWorkflow`),
`what-is` (`I18nFlowHero`); user decision 2026-08-01 ("böyle döşeyelim her yere").
Exceptions: a **before/after** comparison is a different question and uses
`ProcessCompare` (two lanes on one rail), not this.

## Coverage gaps (no decision yet — do not invent one)

- ~~**~150 strings hardcoded in page files, awaiting keys.**~~ **Closed for
  `i18n/{nextjs,nuxt,svelte,angular,javascript}.tsx`** (2026-08-01): 64 keys
  created under `marketing` → `i18n.{nextjs,nuxt,svelte,angular,javascript}.*`
  and published (source language only). The local `COPY` / `SECTION_EYEBROWS`
  constants are gone; `PUBLISH_TIMELINE` on the Next.js page survives but now
  holds key *suffixes*, not copy. No `defaultValue` was introduced — fallbacks
  stay forbidden, the CDN `source_text` is the only source of truth.
  Key path scheme, for the next page: `page-namespaces.ts` resolves
  `/i18n/{slug}` to `marketing.i18n.{camelSlug}`, so a new key must live under
  that subtree or the namespace filter will drop it before the page sees it
  (`tanstack-start` → `i18n.tanstackStart`, and note the authored-name exception
  for `localization-vs-internationalization` → `i18n.l10nVsI18n`).

- ~~**`i18n/vue.tsx` holds ~40 strings inline.**~~ **Closed** (2026-08-01): 54
  keys under `i18n.vue.*`, published. `FEATURES` / `SETUP_STEPS` / `LIBRARIES`
  still exist as module constants but now carry key *ids* and code samples only —
  the prose is resolved with `t()` in the component. Eight FAQ pairs moved to
  `i18n.vue.faq.items.<id>.{question,answer}`.

- ~~**`i18n.expo` does not exist.**~~ **Closed** (2026-08-01): 37 keys under
  `i18n.expo.*`, published; the page went from 0 `t()` calls to 21.

- ~~**Four pages render entirely from literals.**~~ **Closed** (2026-08-01):
  98 keys created and published — `i18n.vite` (25), `i18n.tanstackStart` (24),
  `i18n.remixHydrogen` (25), `i18n.server` (24). With `i18n.expo` (37) and
  `i18n.vue` (54) that is **six** framework pages moved off literals in one pass.
  All six follow the same shape: code samples and `fileName` stay in the route
  file (code is not copy), each setup step / FAQ item carries a stable `id`, and
  a module-scope `FEATURE_KEYS` list is mapped through `t()` inside the component.

  Two traps worth remembering, both cost a debug cycle here:
  (1) inserting an import "after the last `import` line" is wrong in these files —
  the code samples contain `import …` at column 0 inside template literals, so the
  anchor must be the last import *before* `export const Route`;
  (2) `getSync` timed out on two of the four publishes while the job itself
  succeeded — verify a publish by reading
  `cdn.better-i18n.com/better-i18n/landing/en/marketing.json` and counting the
  subtree, not by trusting the sync call to return.

- **Still open — inline section eyebrows.** `eyebrow="Setup"`, `"Capabilities"`,
  `"In a component"`, `"Works with"`, `"Two ways"`, `"Formatting"`,
  `"Switching locale"`, `"In a template"` are still literals in
  `i18n/{nuxt,svelte,angular,javascript}.tsx`, and `react`, `flutter`, `ios`,
  `vite`, `tanstack-start`, `remix-hydrogen`, `server`, `django`, `ruby`,
  `android` still fall back to `FrameworkComparison`'s default `"Example"` on
  every code section. `FrameworkComparison` already accepts per-section
  `eyebrow`/`icon`, so this is key creation + prop passing, not a component change.

- **Still open — the two buyer's-guide pages hold their body copy as literals.**
  `i18n/best-library.tsx` and `i18n/best-tms.tsx` were brought onto the grammar
  (2026-08-01: hero chip, ink-weight "recommended" marker instead of emerald, the
  four shadowed related-topic cards replaced by one hairline container, `.section`
  instead of `mx-auto max-w-3xl`, `.btn btn-dark btn-lg` closing CTA), and
  `best-tms` gained the `i18n.bestTms.platforms.*` header that closed its
  `heading jump` — the vendor list used to start at `h3` directly under the `h1`.
  What did **not** change: the section titles, the six "what to look for" cards
  and the six FAQ pairs on each page are still English literals in the route
  file, and both files call `useTranslations("marketing")` directly rather than
  `useT`. That is ~40 strings per page, i.e. the same job the six framework pages
  went through, and it is key creation — not a design decision.

  Their FAQ lists are also still hand-rolled (`border-b border-mist-100` +
  `text-base` h3) instead of `FaqList` / `FaqSection`. Worth unifying, but the
  FAQ JSON-LD is generated from the same literals, so the copy move and the
  component move should happen in one change, not two.

- ~~**No Locize comparison page.**~~ **Closed** (2026-08-01): `/compare/locize/`
  shipped on the `compare/crowdin.tsx` skeleton. Locize had published their own
  "Locize vs. Better i18n" page while we had nothing, so that query was theirs
  alone. Their page is unusually fair — it opens with what we do well and cites
  our own docs for the gaps — and the decision taken here is that **the only
  credible reply to a fair page is a fair page**: four of fourteen matrix rows
  resolve to an em dash on *our* side (translator tooling, translation memory,
  non-JSON formats in the platform, data residency), the MCP row on the compare
  index now reads ✓ for them, and `compare.locize.fits.*` is a whole section
  telling the reader to choose Locize when i18next lineage, non-JSON formats,
  translator workflow or EU residency is what decides it. Claiming a translation
  memory we do not have is a thirty-second fact-check away from costing the page
  its credibility, which is worth more than the row.

  New rule this establishes, worth keeping: **when a competitor's comparison of
  us is accurate, confirm it in our own words instead of countering it.** The
  page still converts — it just converts on the reader trusting the matrix.

- **Still open — `ComparisonRelatedTopics` is a link list with hairline cells.**
  Every `/compare/*` page ends with it, and under
  `rule/listed-items-are-not-cards` its three link cells should be bare gap
  columns like `SeeAlso` now is. It lives in `ComparisonTable.tsx`, which is
  owned elsewhere, so the seven compare pages still render a bordered link grid
  at the bottom while their own sections do not. One edit in that file closes it
  for all seven. `OtherComparisons` in the same file is the same shape.

- **Phantom NULL-namespace keys are still being created by something.** Eight
  showed up under `developerFeatures.*` (BETTER-260 class: a row whose `key`
  is the full dotted path and whose `namespace_id` is NULL, shadowing the real
  key so the CDN file ships without it — which is why `UseCases` rendered from
  `defaultValue` for four cards). Deleted and republished on 2026-08-01, and
  `listKeys` still flags `meta.home.description`, `meta.privacy.description` and
  `meta.features.description` as phantoms in the `default` namespace. They are
  harmless today because the real `meta.*` keys win, but the generator that
  writes them has not been found. Worth a platform-side fix, not a landing fix.

- **Data-quality bug found while creating keys**: a key literally named
  `marketing.Expo i18n` exists (the key *name* is the English text). `createKeys`
  surfaced it as a duplicate-source-text warning. It should be renamed or deleted;
  nothing reads it by that path.

- **Better Content has no landing page.** The menu entry points at
  `docs.better-i18n.com/content` as a stopgap. If Content is a product in the
  nav, it needs a page (`/$locale/content/`) with the pillar-page treatment.

- **Hero for the home page**: whether the `.wallpaper` gradient hero survives in
  any form, or is replaced by the flat left-aligned `PageHero`. Recommendation on
  file is flat; not yet ratified.
- **Motion**: `framer-motion` is used in 12 files (`Stagger`, demo loops). No rule
  yet for how much motion the Helpway register tolerates.
- ~~**Tools pages** (`tools/*`, 8 routes, bypass `MarketingLayout`): interactive
  apps, not documents. No decision on whether the page grammar applies to them.~~
  **Closed** (2026-08-01) — see `rule/tools-grammar-stops-at-the-tool`: grammar
  binds the shell, yields inside the instrument, with inline code chips and the
  hue-is-state-not-decoration limit binding everywhere.
- **Dark mode**: deliberately disabled (`@custom-variant dark (&:where(.force-dark))`).
  No plan to re-enable; if that changes, every hairline value needs a dark pair.
- **Dark-ground code samples**: `i18n/for-developers.tsx`, `integrations.tsx` and
  `developers/DeveloperIDESupport.tsx` print snippets as `text-mist-100` on a dark
  panel. They are the only code blocks the tokenizer does not cover, because the
  three hues in `rule/code-blocks-carry-three-hues` are the 700 steps, picked for
  AA on white — violet/green/orange-700 on a near-black panel is the inverse
  problem. Either give `CodeBlock` a dark token map (the 300/400 steps of the same
  three hues) or move those three panels onto the light figure — no decision yet.
- **`changelog/$slug` + `careers/$slug` + `integrations/$slug` bodies**: these CMS
  templates render their content without `prose`/`BlogContent` at all, so
  `rule/one-prose-scale` does not reach them yet. Whether they should adopt it
  depends on whether their content is long-form (changelog entries) or structured
  data (job posts, integration cards) — unaudited.

CLOSED 2026-08-01: *Blog / changelog templates: prose scale* → `rule/one-prose-scale`.
*Legal pages: no section grammar* → the three documents now render through
`LegalLayout` on `MarketingLayout` (white ground, `<Section>` container, hairline
nav rail) plus `rule/one-prose-scale`. The **content** of the legal pages is still
`t(key, { defaultValue })` on ~200 strings — that is an i18n gap, not a design one,
and it is tracked as such (the fallbacks are load-bearing until those keys exist).
