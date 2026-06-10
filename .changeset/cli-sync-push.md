---
"@better-i18n/cli": minor
---

`sync --push` creates the missing keys in Better i18n after comparison (confirm prompt, `-y` to skip, `-p org/project` override). Fixed the crash when a project has never been published: the empty CDN manifest now produces a clear "publish once and retry" warning instead of `Cannot read properties of undefined` errors, and sync now prints the next step when it finds missing keys.
