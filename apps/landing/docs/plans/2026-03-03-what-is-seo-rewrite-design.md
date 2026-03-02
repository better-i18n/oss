# What-Is Page SEO Rewrite — Design

## Problem

SEO audit for `/en/what-is` (targeting "i18n" vol:3.6k, "l10n vs i18n") reveals:

| Issue | Current | Target |
|---|---|---|
| H1 missing keywords | No "i18n" in H1 | Add "i18n" to H1 |
| Content length | 460 words | 800+ words (top-10 avg: 802) |
| Readability | Score 2 | ~46 (match rivals) |
| No markups | None | Comparison table |
| Missing semantics | 13 terms absent | Weave into content |
| "i18n" keyword stuffing | Over-used | Reduce, use variations |

## Approach

Full educational rewrite — restructure the page as a comprehensive guide (like `what-is-internationalization.tsx`) with definition sections, comparison table, technical coverage grid, and a condensed product pitch.

## Page Structure

### 1. Hero
- **H1:** "What is i18n? Internationalization & Localization Explained"
- **Subtitle:** 2 sentences, readable, sets context

### 2. "What Does i18n Mean?"
- Definition of internationalization numeronym
- Explains what it means for software developers and source code
- Etymology callout box: `i18n = i + (18 letters) + n`
- **Semantic keywords hit:** source code, software developers, number of letters

### 3. "What Does l10n Mean?"
- Definition of localization numeronym
- Adapting software product for target market
- Etymology callout box: `l10n = l + (10 letters) + n`
- **Semantic keywords hit:** software product, target market, translated text, cultural adaptation

### 4. "i18n vs l10n: Key Differences" — Comparison Table
- HTML `<table>` with rows: Full name, Scope, Timing, Focus, Who, Example
- Featured snippet target for "l10n vs i18n"
- **Addresses:** markups gap, comparison keyword

### 5. "What Does Internationalization Cover?"
- Grid of 4-6 cards covering technical aspects
- User interface design, date and time formatting, character encoding, locale-specific formats, products or services adaptation
- **Semantic keywords hit:** user interface, date and time, character encoding, locale specific, date formatting, time formats, products or services

### 6. "How Better i18n Simplifies the Process"
- Condensed product pitch (3 benefit cards)
- Continuous Localization, AI Translation, Git-Based Localization
- Keep current content, no expansion needed

### 7. Use Cases (keep current)
- SaaS, Mobile, E-commerce cards

### 8. Related Pages (keep current)
- `<RelatedPages>` component

## Readability Fixes
- Short sentences (15-20 words max)
- Transition words between sections
- Definition-first structure (answer the query immediately)
- Scannable table and lists instead of dense paragraphs
- Break paragraphs after 2-3 sentences

## Keyword Strategy
- Reduce "i18n" repetitions — use "internationalization" as variation
- H1 contains "i18n" (primary keyword)
- Use "l10n vs i18n" naturally in comparison section heading
- Semantic keywords distributed across sections 2-5

## Implementation Scope
1. Rewrite `src/routes/$locale/what-is.tsx` component
2. Create new translation keys via MCP (`updateKeys` / `createKeys`)
3. Update meta title translation to include "i18n"
4. Publish translations via MCP

## Estimated Output
- Word count: ~850-900 words
- Readability: ~40-50 (Flesch-Kincaid)
- All 13 semantic terms covered
- H1 contains both target keywords
- Comparison table for markup/featured snippet
