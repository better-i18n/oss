# Landing audits — what runs automatically, and what does not

Be precise about which of these is a gate and which is a habit. Two of the four
run themselves; two only run when a person types them. Writing "CI checks this"
next to a check nobody runs is how the `Title` / `Description` placeholders
survived on live pages for months.

## Runs automatically on every pull request

| Check | Command | Where |
|---|---|---|
| i18n key gate | `bun run audit:keys` | `.github/workflows/ci.yml` → job `landing-i18n` |
| Locale script sanity | `bun run audit:locales` | not wired yet — run by hand |

`audit:keys` (`check-keys.ts`) reads source and the live CDN. It fails the build on:

1. a `t("…")` key that does not exist in the source language (`en`) on the CDN —
   the exact condition under which `useT` humanises a key and prints `Title`;
2. a key **family** (`` t(`faq.${id}.question`) ``) that matches nothing;
3. a namespace used by a page whose loader does not load it — the key exists,
   but the page never receives it, and the screen looks identical.

It needs no browser, so it costs a few seconds and cannot fail for reasons
unrelated to i18n.

**Baseline.** `check-keys.baseline.json` holds findings that already existed when
the gate landed. They are real, not suppressed noise — each was confirmed absent
from the CDN by hand. New findings fail; known ones are listed on every run.
After fixing some, run `bun run audit:keys --update-baseline` and commit the
smaller file. The number only goes down.

**Coverage holes are printed, not hidden.** Call sites the scanner cannot read
(`t(item.key)`, `useT(namespace)`) are counted per file at the end of each run.
They are not failures — they are the part of the surface this gate does not
protect, and they are named so nobody assumes otherwise.

## Does NOT run in CI — run by hand before deploying

CI has no Playwright or Puppeteer, and these two need a real page:

| Check | Command | What it catches |
|---|---|---|
| Page audit | `./scripts/audit/run-audit.sh --only <path>` | thin body, missing description, rendered-DOM regressions |
| Soft navigation | `node scripts/audit/check-soft-navigation.js` | client-side navigation that reloads the document |

Run both **before** triggering `deploy-landing.yml` (which is
`workflow_dispatch` — a human starts it, so a human can run these first):

```bash
bun run dev                                  # :3001
./scripts/audit/run-audit.sh --only /en/pricing/
node scripts/audit/check-soft-navigation.js
# only then: gh workflow run deploy-landing.yml
```

Known false positive in `run-audit.sh`: every page reports "no JSON-LD / JSON-LD
parse error". That is TanStack Router 1.149 (upstream PR #6653, fixed in
1.160.0), not our markup. Ignore that line until the router is upgraded.
