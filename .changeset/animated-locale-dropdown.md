---
"@better-i18n/use-intl": patch
---

Animated locale dropdown with ElevenLabs-style hover effects

- Round flags (18×18, border-radius 50%) instead of rectangular
- Dropdown menu entrance animation (scale + fade, 150ms cubic-bezier spring)
- Item hover: CSS ::before pseudo-element with scale(0.97→1) + opacity animation
- Trigger button: same spring hover effect via CSS pseudo-element
- Deeper shadow and 14px border-radius for a more modern menu
- Menu padding 6px for proper item breathing room
- Active item: bold weight, persistent background via [data-active] CSS selector
- All animations handled via CSS — zero JS overhead, respects prefers-reduced-motion if added by consumer
