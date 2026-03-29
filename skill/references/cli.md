---
title: CLI — @better-i18n/cli
---

> **Docs:** https://docs.better-i18n.com/cli.mdx · [scan](https://docs.better-i18n.com/cli/scan.mdx) · [check](https://docs.better-i18n.com/cli/check.mdx) · [sync](https://docs.better-i18n.com/cli/sync.mdx) · [doctor](https://docs.better-i18n.com/cli/doctor.mdx) · [Configuration](https://docs.better-i18n.com/cli/configuration.mdx)

# CLI

```bash
npm install -g @better-i18n/cli
# or per-project:
npm install --save-dev @better-i18n/cli
```

The CLI has four primary commands: `scan`, `sync`, `check`, and `doctor`. Each addresses a different part of the localization workflow.

---

## `scan` — find hardcoded strings in source code

AST-based static analysis. Detects user-facing text that isn't wrapped in `t()`.

```bash
better-i18n scan
better-i18n scan --dir src/
better-i18n scan --format eslint       # ESLint-compatible output
better-i18n scan --format json         # machine-readable
better-i18n scan --ci                  # exit 1 if any issues found (CI gate)
better-i18n scan --staged              # only scan git-staged files (pre-commit hook)
better-i18n scan --fix                 # auto-wrap detected strings with t()
better-i18n scan --max-issues 50       # fail after N issues (default: no limit)
better-i18n scan --verbose
```

**Detected patterns:**
- JSX text nodes: `<h1>Hello</h1>`
- JSX attribute strings: `placeholder="Enter email"`
- Ternary locale checks: `locale === 'en' ? 'Hello' : 'Merhaba'`
- Toast/alert messages: `toast.success("Saved!")`
- String variables (user-facing): `const title = "Dashboard"`

**Pre-commit hook example (lint-staged):**
```json
{
  "*.{ts,tsx}": "better-i18n scan --staged --ci"
}
```

---

## `sync` — compare local keys with remote (cloud)

Fetches your CDN manifest and compares extracted `t()` keys in source with what's in Better i18n cloud.

```bash
better-i18n sync
better-i18n sync --dir src/
better-i18n sync --summary            # metrics only, no key list
better-i18n sync --format json
better-i18n sync --verbose
```

**Output:** Two lists:
1. **Missing in remote** — keys in your code but not yet uploaded to Better i18n
2. **Possibly unused** — keys in remote that aren't detected in code

---

## `check` — interactive or non-interactive key coverage check

```bash
better-i18n check                      # interactive menu: Missing / Unused / Both
better-i18n check:missing              # non-interactive: missing keys only
better-i18n check:unused               # non-interactive: unused keys only
better-i18n check:missing --ci         # exit 1 if any missing keys found
better-i18n check:missing --format json
```

---

## `doctor` — full i18n health analysis

Produces a **health score (0–100)** across five categories. The most comprehensive diagnostic.

```bash
better-i18n doctor
better-i18n doctor --dir src/
better-i18n doctor --ci                         # exit 1 if score < threshold (default: 70)
better-i18n doctor --ci --threshold 80          # custom pass threshold
better-i18n doctor --report --api-key bi18n_... # upload report to dashboard
better-i18n doctor --skip-code                  # skip AST hardcoded-string analysis
better-i18n doctor --skip-health                # skip translation coverage rules
better-i18n doctor --skip-sync                  # skip remote key comparison
better-i18n doctor --format json
better-i18n doctor --verbose
```

### Health score algorithm

```
overall = 100
         − (error_count × 3.0)
         − Σ min(warning_count_per_rule × 0.15, 20)
         clamped to [0, 100]
```

Each rule's warning contribution is capped at 20 points to prevent a single rule from dominating. Pass threshold: **70** (configurable).

### Rule categories and rules

**Coverage**
| Rule | Severity | Description |
|---|---|---|
| `missing-translations` | error | Key exists but one or more target translations are absent |
| `missing-in-remote` | warning | Key found in code but not uploaded to Better i18n |

**Performance**
| Rule | Severity | Description |
|---|---|---|
| `orphan-keys` | warning | Key in translation files but not detected in source code |
| `unused-remote-key` | info | Key exists in remote cloud but not detected in code |

**Quality**
| Rule | Severity | Description |
|---|---|---|
| `placeholder-mismatch` | error | `{name}` count or names differ between source and target translation |
| `empty-translations` | warning | Translation value is an empty string |

**Structure**
| Rule | Severity | Description |
|---|---|---|
| `key-naming` | warning | Mixed naming conventions in same namespace (camelCase + snake_case) |
| `namespace-structure` | info | Inconsistent namespace depth |
| `file-format` | error | Malformed JSON or encoding issues in translation files |

**Code** (requires source code analysis)
| Rule | Severity | Description |
|---|---|---|
| `jsx-text` | warning | Hardcoded text in JSX elements |
| `jsx-attribute` | warning | Hardcoded text in JSX props (placeholder, aria-label, etc.) |
| `ternary-locale` | error | `locale === 'en' ? '...' : '...'` pattern instead of `t()` |
| `toast-message` | warning | Hardcoded strings in toast / alert / notification calls |
| `string-variable` | warning | User-facing strings assigned to variables without `t()` |

### CI integration

```yaml
# .github/workflows/i18n.yml
- name: i18n health check
  run: better-i18n doctor --ci --threshold 75
  env:
    BETTER_I18N_API_KEY: ${{ secrets.BETTER_I18N_API_KEY }}
```

### Upload report to dashboard

```bash
better-i18n doctor --report --api-key $BETTER_I18N_API_KEY
```

Reports are visible in the project's analytics panel at https://better-i18n.com.

---

## Configuration file

```json
// better-i18n.config.json (project root)
{
  "project": "acme/dashboard",
  "apiKey": "bi18n_...",
  "dir": "src",
  "localesDir": "public/locales",
  "defaultLocale": "en",
  "threshold": 75
}
```

Or in `package.json`:

```json
{
  "better-i18n": {
    "project": "acme/dashboard",
    "dir": "src"
  }
}
```
