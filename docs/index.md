---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Better i18n"
  tagline: CDN-first localization. AI translation with human control. Developer-native workflows for modern teams.
  actions:
    - theme: brand
      text: Product Overview
      link: /product-overview
    - theme: alt
      text: Technical System Guide
      link: /technical-system-guide

features:
  - icon: "[GH]"
    title: CDN-First Delivery
    details: Upload translations, publish to the edge CDN, and optionally sync via GitHub PRs.
  - icon: "[AI]"
    title: AI With Human Control
    details: Fast AI translation with explicit approval for sensitive actions.
  - icon: "[Q]"
    title: Queue-Driven Sync
    details: Webhook + queue + worker pipeline for reliable, scalable sync.
  - icon: "[ORG]"
    title: Multi-Tenant by Design
    details: Organizations, roles, and project scoping built in from day one.
  - icon: "[CHAT]"
    title: Chat + Tools
    details: AI chat with tool calls and persistent history (server + IndexedDB).
  - icon: "[DEV]"
    title: Developer-Centric Stack
    details: Bun, tRPC, Drizzle, and Cloudflare Workers for fast iteration.
---
