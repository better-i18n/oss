# AI Visibility Content Strategy Design

**Date**: 2026-03-02
**Status**: Approved
**Goal**: Maximize AI visibility (Google AI Overviews, ChatGPT, Perplexity citations) for better-i18n.com through strategic content production

---

## Context

### Current State

- **Gap topics**: 500 topics identified via competitive gap analysis (Crowdin, Lokalise, Poedit, GNU)
- **better-i18n.com visibility**: 0 across all 500 topics
- **Existing infrastructure**: Comprehensive SEO setup (JSON-LD schemas, llms.txt, hreflang, sitemap, OG images)
- **Existing content**: 90+ prerendered marketing pages, 30+ /i18n/ hub pages, CMS-driven blog, 4 competitor comparison pages
- **Tech stack**: TanStack Start, Cloudflare Workers, Better i18n Content CMS

### Key Competitors (from gap analysis)

| Competitor | Strongest Mentions (per topic) |
|-----------|-------------------------------|
| Lokalise | Up to 61 mentions |
| Crowdin | Up to 47 mentions |
| GNU | Up to 13 mentions |
| Poedit | Up to 16 mentions |

### Decision Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Primary goal | AI Visibility (not organic traffic) | AI referral converts at 14.2% vs 2.8% organic |
| Topic scope | Core i18n/L10n only (~50-60 topics) | Focused topical authority > broad thin coverage |
| Production capacity | 10+/week (AI-heavy) | Maximize speed with human editorial review |
| Publication channels | Blog + existing /i18n/ hub | Zero infrastructure development needed |
| Strategy approach | Strategic Pillars + Quick Wins | Balance speed with topical depth |

---

## Strategy: Strategic Pillars + Quick Wins

### Approach

1. Start with low-difficulty quick wins to generate early organic signals
2. Build 5 pillar pages as topical authority anchors
3. Expand with cluster content around each pillar
4. Amplify through cross-platform brand signals

### Why This Approach

- Quick wins produce early indexing signals that boost pillar page authority
- Pillar + cluster structure is the #1 predictor of AI citations (topical authority)
- AI-heavy production capacity (10+/week) allows completing all phases in 10 weeks
- Existing /i18n/ hub and CMS infrastructure requires zero new development

---

## Topic Selection and Prioritization

### Data Source

Filtered from `gap_topics_better-i18n_com_us.csv`: **147 core i18n/localization topics** (out of 500 total).

### Tier 1: Quick Wins (Difficulty <= 40)

16 topics, low competition, immediate ranking potential.

| # | Topic | Difficulty | Volume | Content Type | Target URL |
|---|-------|-----------|--------|-------------|-----------|
| 1 | Django Localization and Translation | 16 | 1,263 | Hub page | /i18n/django |
| 2 | Machine Translation Post-Editing (MTPE) | 19 | 2,714 | Blog post | /blog/mtpe-guide |
| 3 | Smartling Translation and Pricing | 23 | 418 | Compare page | /compare/smartling |
| 4 | Multilingual Ruby Translations | 24 | 861 | Hub page | /i18n/ruby |
| 5 | Angular Localization and Internationalization | 25 | 1,072 | Hub page | /i18n/angular (expand) |
| 6 | ResX and Resource File Editors | 25 | 874 | Blog post | /blog/resx-file-format |
| 7 | i18n JavaScript Localization | 26 | 1,365 | Hub page | /i18n/javascript |
| 8 | Salesforce Language Translation Tools | 26 | 905 | Blog post | /blog/salesforce-localization |
| 9 | Android Localization and Internationalization | 27 | 955 | Hub page | /i18n/android |
| 10 | Webflow Localization and Multilingual Support | 27 | 607 | Blog post | /blog/webflow-localization |
| 11 | ICU Library and Data Management | 28 | 251 | Blog post | /blog/icu-message-format |
| 12 | XTMs and Cloud Translation Services | 29 | 1,031 | Compare page | /compare/xtm |
| 13 | Flutter Localization and Internationalization | 31 | 2,261 | Hub page | /i18n/flutter (expand) |
| 14 | iOS Localization and Internationalization | 31 | 971 | Hub page | /i18n/ios |
| 15 | database localization and data localization | 31 | 1,425 | Blog post | /blog/database-localization |
| 16 | React and Next.js Internationalization Tools | 33 | 7,662 | Hub page | /i18n/react + /i18n/nextjs (expand) |

**Total volume**: ~24,634

### Tier 2: 5 Pillar Pages

Deep, authoritative content (3000-4000 words each).

| # | Pillar Topic | Difficulty | Volume | Target URL |
|---|-------------|-----------|--------|-----------|
| P1 | Multilingual SEO and Website Localization | 64 | 11,979 | /i18n/multilingual-seo (expand) |
| P2 | Internationalization and Localization (Complete Guide) | 65 | 11,073 | /i18n/complete-guide |
| P3 | AI-based Translation Tools | 68 | 3,530 | /blog/ai-translation-tools |
| P4 | Website and Software Localization | 59 | 8,369 | /i18n/software-localization (expand) |
| P5 | Translation Tools Comparison (Mega Guide) | 72 | 3,329 | /blog/translation-tools-compared |

### Tier 3: Cluster Content (8-10 per pillar)

| Pillar | Cluster Topics | Count |
|--------|---------------|-------|
| P1 (Multilingual SEO) | SEO localization, hreflang best practices, multilingual PPC, content localization for SEO, locale-specific keyword research, international link building, multilingual schema markup, geo-targeting strategies | 8 |
| P2 (i18n & L10n) | Game localization, e-learning localization, video/audio localization, transcreation, cultural adaptation, localization careers, localization QA, language adaptation, content localization, script translation | 10 |
| P3 (AI Translation) | MTPE workflows, translation models & LLMs, MT quality issues, modern MT tools, automation in translation, AI-powered TMS, neural MT vs rule-based, translation memory + AI | 8 |
| P4 (Software L10n) | Website localization, localization workflow management, TMS management, localizer technology, proxy-based translation, CMS localization, mobile app localization, API-first localization, CI/CD for localization, localization testing | 10 |
| P5 (Tool Comparison) | CAT tools comparison, platform competitors, automation tools, translation QA tools, Crowdin deep review, Lokalise deep review, open-source alternatives, enterprise TMS review, developer-first tools | 9 |

---

## Content Architecture: AI-First Framework

### Hub Pages (/i18n/*) — 2000-3000 words

```
H1: [Framework/Topic] Localization Guide

H2: What is [Topic]?              <- 40-60 word direct answer (AI snippet target)
    [200 word explanation]

H2: How to Set Up [Topic]         <- Step-by-step HowTo (schema markup)
    [Code examples + explanation]

H2: Best Practices                <- Listicle format (AI-friendly)
    [Numbered best practices]

H2: [Topic] with better-i18n     <- Product tie-in (soft, non-promotional)
    [Integration guide]

H2: Common Issues                 <- FAQ format (FAQPage schema)
    H3: Q1?
    H3: Q2?
    H3: Q3?

H2: Comparison with Alternatives  <- Unbiased comparison table
```

### Blog Posts — 1500-2500 words

```
H1: [Descriptive Title with Primary Keyword]

H2: TL;DR / Key Takeaways        <- First 30% = AI citation zone
    [3-5 bullet point summary]

H2: [Main Topic Deep Dive]
    [Statistics-heavy, cited paragraphs]

H2: [Practical How-To Section]
    [Code/workflow examples]

H2: [Comparison/Alternatives]     <- Unbiased, showing trade-offs
    [Table format]

H2: FAQ                           <- FAQPage schema
```

### Pillar Pages — 3000-4000 words

```
H1: The Complete Guide to [Topic]

[Executive summary - 100 words]   <- AI snippet target

H2: [Subtopic 1]                  <- Each independently citable
    [Internal link to cluster article]

H2: [Subtopic 2]
    ...

H2: Tools and Platforms           <- better-i18n naturally included
H2: Getting Started Checklist
H2: FAQ
```

---

## AI Optimization Rules

Applied to ALL content:

1. **Passage-First Writing**: First paragraph under each H2 (40-60 words) must directly answer the implied question
2. **Statistics Density**: Minimum 1 statistic per 500 words (with cited source)
3. **Authoritative Citations**: Minimum 3 external source citations per article
4. **Schema Markup**: FAQPage + Article/TechArticle + BreadcrumbList (existing infrastructure)
5. **Internal Linking**: Minimum 3 internal links per page (cluster <-> pillar)
6. **Freshness Signal**: "Last updated: [date]" visible on every page
7. **Author Attribution**: Person schema with LinkedIn link on all blog posts
8. **Code Examples**: Working code snippets on all framework hub pages
9. **Answer Positioning**: Direct answers in first 30% of content (44.2% of AI citations come from there)
10. **Unbiased Comparisons**: Include real trade-offs and limitations (AI systems prefer fair comparisons)

---

## Content Integrity Rules (CRITICAL)

These rules are non-negotiable and override all other content guidelines:

### 1. No Fabricated Information

- **NEVER invent statistics, benchmarks, or performance claims** that are not verifiable
- All numbers must come from: (a) our own product documentation, (b) published third-party research with citations, or (c) clearly labeled estimates with methodology
- If a statistic cannot be verified, do not include it. Remove the sentence rather than guess.

### 2. Only Claim What We Actually Offer

- Feature descriptions must match what exists in the product today (refer to docs.better-i18n.com)
- Do not promise upcoming features as current capabilities
- Do not exaggerate performance, speed, or capability metrics
- When comparing with competitors, only state facts that can be verified on their public websites/docs

### 3. Legal Risk Avoidance

- **No false or misleading claims about competitors** (defamation risk)
- No unverifiable "X% better than Y" claims in comparison pages
- Use neutral, factual language: "offers", "supports", "includes" — not "best", "fastest", "only"
- Comparison tables: use checkmarks for feature presence, not subjective quality ratings
- Include disclaimer on comparison pages: "Information accurate as of [date]. Check vendor websites for latest details."

### 4. Content Sources

Approved sources for claims:
- **better-i18n docs** (docs.better-i18n.com) — our own features and capabilities
- **better-i18n changelog** — what we have shipped
- **Competitor public documentation** — for factual feature comparisons only
- **Published research** (Gartner, CSA Research, Nimdzi, GALA) — industry statistics with citation
- **Official framework docs** (React, Next.js, Vue, etc.) — for i18n setup instructions
- **MDN, W3C specs** — for web standards

NOT approved:
- Unverified blog posts or opinion pieces presented as facts
- "Industry reports" without a named publisher
- Internal metrics that cannot be independently verified
- Competitor pricing that may be outdated (always link to their pricing page instead)

---

## Timeline

### Phase 1: Quick Wins (Week 1-2)

| Week | Content | Count | Channel |
|------|---------|-------|---------|
| 1 | Django, Ruby, JavaScript, Angular (expand), Android, iOS, Flutter (expand) hub pages | 7 | /i18n/ hub |
| 1 | React/Next.js hub expansion (2x current depth) | 2 | /i18n/ hub |
| 2 | MTPE guide, ResX format, ICU message format, Database localization, Salesforce, Webflow | 6 | Blog |
| 2 | Smartling comparison, XTM comparison | 2 | /compare/ |

**Phase 1 total**: ~17 content pieces

### Phase 2: Pillar Pages (Week 3-5)

| Week | Pillar | Words | Target URL |
|------|--------|-------|-----------|
| 3 | P1: Multilingual SEO Strategy Guide | 3,500 | /i18n/multilingual-seo |
| 3 | P2: Complete Guide to i18n & L10n | 4,000 | /i18n/complete-guide |
| 4 | P3: AI Translation Tools in 2026 | 3,000 | Blog |
| 4 | P4: Software Localization Guide | 3,500 | /i18n/software-localization |
| 5 | P5: Translation Tools Compared (Mega Guide) | 3,000 | Blog |

**Phase 2 total**: 5 pillars, ~17,000 words

### Phase 3: Cluster Expansion (Week 5-10)

8-10 cluster articles per pillar. ~45 content pieces total.

### Phase 4: Authority Amplification (Week 10+, Ongoing)

- Create/optimize G2 and Capterra profiles
- Reddit participation (r/webdev, r/reactjs, r/nextjs) with i18n expertise
- Dev.to cross-posting of framework hub content
- GitHub i18n starter template repositories
- AI citation monitoring via Profound/Gauge

---

## Measurement

### KPIs

| KPI | Tool | Phase 1 Target (Week 4) | Phase 3 Target (Week 12) |
|-----|------|------------------------|------------------------|
| Indexed pages | Google Search Console | +17 | +67 |
| Organic impressions | GSC | +500/week | +5,000/week |
| AI citations | Manual test (50 prompts) | 2-3 mentions | 10+ mentions |
| Domain authority signal | Ahrefs | Baseline | +5 DR |
| Quick win rankings | Ahrefs/Semrush | 5 topics in top 20 | 15 topics in top 10 |

### AI Citation Testing Protocol

Weekly test with 50 prompts across ChatGPT, Perplexity, and Google AI Overviews:
- "What is the best i18n tool for [framework]?"
- "How to set up localization in [framework]?"
- "Compare [competitor] vs alternatives"
- "What is [i18n concept]?"
- Record: cited (yes/no), position, context of citation

---

## Technical Requirements

### New Routes Needed

**Hub pages** (route files in `src/routes/$locale/i18n/`):
- `django.tsx`, `ruby.tsx`, `javascript.tsx`, `android.tsx`, `ios.tsx`, `complete-guide.tsx`

**Compare pages** (route files in `src/routes/$locale/compare/`):
- `smartling.tsx`, `xtm.tsx`

**Existing pages to expand**:
- `angular.tsx`, `flutter.tsx`, `react.tsx`, `nextjs.tsx`
- `multilingual-seo.tsx`, `software-localization.tsx` (under /i18n/)

### CMS Content

Blog posts will be created in the Better i18n Content CMS under the `blog-posts` model. No code changes needed for blog content.

### Schema Markup

All existing schema builders in `src/lib/structured-data.ts` will be used:
- `getArticleSchema()` / `getTechArticleSchema()` for blog posts and framework guides
- `getFAQSchema()` for FAQ sections
- `getHowToSchema()` for step-by-step guides
- `getBreadcrumbSchema()` for all pages
- `getComparisonSchema()` for comparison pages

### Sitemap and llms.txt

New pages must be added to `MARKETING_PAGES` in `src/seo/pages.ts` for sitemap generation and prerendering. The llms.txt generator in `src/seo/llms-txt.ts` should be updated to include new sections.

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| AI-generated thin content penalty | Medium | High | Human editorial review on every piece; minimum word counts enforced |
| Topic cannibalization (hub vs blog) | Low | Medium | Clear URL hierarchy; hub = evergreen guide, blog = timely/opinionated |
| Slow indexing of new pages | Medium | Medium | Internal linking from existing high-authority pages; sitemap submission |
| Competitor content refresh | Medium | Low | Quarterly content refresh schedule; freshness signals |
| AI crawler blocking | Low | High | robots.txt already allows all AI bots; monitor access logs |
