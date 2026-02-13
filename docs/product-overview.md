# Better i18n - Product Overview

Date: 2025-12-19

## 1) What this is

Better i18n is an AI-powered localization platform for engineering teams. It delivers translations via a global CDN, discovers translation keys from your codebase, and keeps everything in sync. It pairs AI translation with human approval so teams can move fast without losing quality. GitHub integration is available for PR-based workflows.

## 2) The problem it solves

- i18n files are scattered across repos and hard to keep consistent.
- New keys and changes are missed in manual workflows.
- Translation cycles are slow (export -> translate -> import -> review).
- AI-only translation creates quality and trust issues without approval gates.

## 3) Vision

Make localization feel like code review: fast, auditable, and tightly integrated with GitHub. The default path should be automated, but always reviewable.

## 4) Strategy: CDN-first, GitHub optional

Current product direction prioritizes a low-friction start:

- CDN-first: users can upload JSON, edit, and publish without GitHub
- GitHub optional: connect repos only if version control and PR workflows are needed

Why this matters:

- Lower barrier to entry (no GitHub account required)
- Faster time-to-value (upload -> edit -> use)
- Flexible for teams with different workflows

## 5) Positioning vs Crowdin and similar TMS

Similar:
- Central place to manage translations
- Multi-language coverage, approval workflows, and status tracking

Different (and the point):
- CDN-first: translations delivered via edge network, no repo required to start.
- PR-native: translation updates land as PRs or direct commits.
- AI-native: built-in translation suggestions and batch processing.
- Engineering workflow: teams keep their normal tools and review flows.

Think of Better i18n as a developer-first, CDN-native alternative that prioritizes speed, AI automation, and code-centric review over heavy TMS workflows — with optional GitHub integration for teams that want PR-based sync.

### TMS vs i18n libraries (short)

- TMS (Crowdin, Lokalise, Smartling): workflow + translation ops + vendor collaboration
- i18n libs (i18next, FormatJS, Lingui): in-app localization runtime
- Better i18n sits between: repo-native workflows with AI + review, not a full enterprise TMS

## 6) Target users

- Product and engineering teams with GitHub-based delivery
- Teams with frequent UI changes and fast release cycles
- Companies that want AI acceleration but require human control

## 7) What it does (in scope)

- Connect GitHub repositories and detect translation files
- Import and track translation keys over time
- Manage target languages per project
- AI-assisted translation proposals and batch translation
- Human-in-the-loop approval for sensitive actions
- Create PRs or push updates to a branch
- Track sync jobs and activity logs
- UI editor with auto-sync, draft, and publish states
- CDN-first import/export and hosted JSON delivery

## 8) What it does NOT try to be (out of scope for now)

- Full enterprise TMS with complex vendor workflows
- Dedicated translation memory/glossary management
- Offline desktop translator tooling
- On-prem heavy customization for regulated orgs

## 9) Key advantages

- CDN-first delivery with optional GitHub workflow (PRs, branches, reviews)
- AI-native but human-controlled
- Fast sync via queue-based workers
- Multi-tenant by design (orgs, teams, RBAC)
- Clear audit trail (sync jobs + activity logs)
- Simple setup (Bun + Cloudflare + Neon)
- CDN-first onboarding (upload JSON, publish, consume via URL)

## 10) Typical user journey

1) Create org and project
2) Import translations (drag/drop JSON) and pick namespace handling
3) Edit translations in the table
4) Publish to CDN and consume via URL
5) (Optional) Connect GitHub and enable PR-based sync

## 11) Success metrics

- Time to first translation after repo connect
- Translation coverage by language
- PR creation and merge success rate
- AI acceptance rate vs manual edits
- Sync job error rate

## 12) Current product boundaries

This product is optimized for engineering teams who want fast, CDN-delivered translations with AI assistance. It does not attempt to replace the full set of capabilities in traditional translation suites. The core focus is CDN-first delivery with AI-powered automation, optional GitHub integration, and a high-signal UI for reviewers.
