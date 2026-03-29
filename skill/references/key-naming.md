---
title: Key Naming — Conventions, Namespaces, and Best Practices
---

# Key Naming Conventions

Consistent key naming prevents the `key-naming` doctor warning and makes translations easier to manage across large teams.

---

## Recommended convention: camelCase keys, dot-separated namespaces

```
{namespace}.{section}.{element}
```

```json
{
  "auth": {
    "loginPage": {
      "title": "Welcome back",
      "subtitle": "Sign in to continue",
      "emailLabel": "Email address",
      "passwordLabel": "Password",
      "submitButton": "Sign in",
      "forgotPassword": "Forgot password?"
    },
    "errors": {
      "invalidCredentials": "Invalid email or password",
      "accountLocked": "Account locked. Try again in {minutes} minutes."
    }
  }
}
```

**Rules:**
1. **camelCase** for key segments — `loginPage`, not `login_page` or `login-page`
2. **Lowercase first letter** — `title`, not `Title`
3. **Namespace = feature or page** — `auth`, `home`, `settings`, `checkout`
4. **Never mix conventions** in the same namespace — the `key-naming` doctor rule flags mixed camelCase + snake_case

---

## Namespace design

| Namespace | Contents |
|---|---|
| `common` | Shared UI strings: `save`, `cancel`, `back`, `loading`, `error` |
| `auth` | Login, signup, password reset, OAuth screens |
| `home` | Landing page, hero, features |
| `settings` | User settings, preferences, billing |
| `errors` | HTTP error pages (404, 500), generic error messages |
| `navigation` | Nav items, menu labels, breadcrumbs |
| `{featureName}` | Feature-specific strings |

**Namespace depth:** Keep namespaces at 1 level (`auth`, not `features.auth`). The `namespace-structure` doctor rule warns on inconsistent depth.

---

## Key granularity

**Too coarse (avoid):**
```json
{
  "auth": {
    "loginScreen": "Welcome back. Sign in to your account. Email address Password Sign in Forgot password?"
  }
}
```

**Too fine (avoid):**
```json
{
  "auth": {
    "welcomeBackWord": "Welcome",
    "backWord": "back",
    "periodSymbol": "."
  }
}
```

**Just right:**
```json
{
  "auth": {
    "loginTitle": "Welcome back",
    "loginSubtitle": "Sign in to your account",
    "emailLabel": "Email address",
    "passwordLabel": "Password",
    "submitButton": "Sign in",
    "forgotPasswordLink": "Forgot password?"
  }
}
```

---

## Placeholder naming

Use **camelCase** for placeholder names. Be consistent — the `placeholder-mismatch` doctor rule compares placeholder names between source and all target translations.

```json
{
  "greeting": "Hello, {firstName}!",
  "lastSeen": "Last seen {relativeTime}",
  "inviteCount": "You have {inviteCount, plural, one {# pending invite} other {# pending invites}}"
}
```

**Avoid generic names:** Use `{firstName}` not `{name}` — specific names make translator intent clearer.

---

## Non-translatable keys

Mark keys that should never be translated (brand names, proper nouns, code strings) with `nc: true` (no-change) when creating via MCP:

```json
// MCP createKeys
{ "n": "brandName", "ns": "common", "v": "better-i18n", "nc": true }
```

These keys are excluded from translation coverage calculations and won't be flagged as `missing-translations`.

---

## Key stability

Once a key is used in production, **never rename it without a migration plan**. Renaming creates:
1. A new phantom key in the dashboard
2. The old key becomes an orphan (`orphan-keys` doctor warning)
3. Missing translations for the new key until translated

**Safe rename workflow:**
1. Create the new key in better-i18n
2. Translate it
3. Publish
4. Update source code to use new key name
5. Delete old key via MCP `deleteKeys` + publish

---

## Anti-patterns

| Anti-pattern | Problem | Fix |
|---|---|---|
| `"btn1"`, `"text2"`, `"label3"` | Non-descriptive, breaks for translators | Use semantic names: `"submitButton"`, `"emailLabel"` |
| `"AUTH_LOGIN_TITLE"` | SCREAMING_SNAKE_CASE looks wrong in context | Use camelCase: `"loginTitle"` |
| `"home.hero.heading.main.text"` | Too deep (5 levels) | Max 3 levels: `"home.heroTitle"` |
| Mixing `loginPage` and `login_page` in same namespace | Triggers `key-naming` warning | Pick one, apply everywhere |
| Duplicating `common.save` as `auth.saveButton` | Creates redundant keys | Reference `common.save` everywhere |
| Very long key values as key names | e.g. `"Click here to learn more"` as a key | Use semantic: `"learnMoreLink"` |

---

## Namespace `default` (root-level keys)

For projects with no namespace structure, use the `default` namespace (stored as `"translations"` in CDN paths):

```json
// locales/en.json (flat, no namespaces)
{
  "appTitle": "My App",
  "loginButton": "Sign in",
  "homeTitle": "Welcome"
}
```

In flat-key projects, pass `namespace: null` to MCP tools.
