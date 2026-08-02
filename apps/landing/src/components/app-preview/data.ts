/**
 * Static data for the dashboard replica. Everything here is a real Better i18n
 * concept — namespace, key, locale, status, glossary, publish/CDN, MCP — because
 * a developer reading the hero will notice an invented feature faster than a
 * misaligned pixel. No invented product surface, no lorem.
 *
 * The numbers are internally consistent on purpose: the toolbar's "3 missing"
 * filter matches exactly the three `missing` rows below, and the status bar's
 * coverage is the kind of figure those rows would produce.
 */

import type { SpriteIconName } from "@/components/SpriteIcon";

export type KeyStatus = "translated" | "review" | "missing";

export type KeyRow = {
  /** Fully-qualified key, the way the dashboard and the CLI both print it. */
  key: string;
  /** Source-locale string (en). */
  source: string;
  status: KeyStatus;
};

export type NamespaceGroup = {
  name: string;
  rows: KeyRow[];
};

/** Nav entries mirror the dashboard's own sections. */
/* Section names and their order are copied from the real dashboard's sidebar
   (platform/apps/app/components/layout/sidebar-nav.tsx) — a preview that invents
   its own navigation teaches the wrong product. Icons are the closest match in
   our sprite; the dashboard uses @central-icons-react, which the landing does
   not ship. */
export const NAV_ITEMS: { label: string; icon: SpriteIconName; active?: boolean }[] = [
  { label: "Overview", icon: "chart" },
  { label: "Translations", icon: "code-brackets", active: true },
  { label: "Languages", icon: "globe" },
  { label: "Content", icon: "book" },
  { label: "Integrations", icon: "api-connection" },
  { label: "Sync", icon: "github" },
  { label: "AI Context", icon: "robot" },
  { label: "Settings", icon: "settings-gear" },
];

/**
 * The workspace switcher cycles through real customer projects. One static
 * workspace says "here is a screenshot"; a switcher that moves says "several
 * teams run their localisation in here", which is the claim the band under the
 * hero makes in logos.
 *
 * `mark` is used when the customer publishes a square mark; otherwise the
 * initial is rendered in the same 24px tile, so the row never changes shape.
 */
export type Workspace = {
  name: string;
  project: string;
  mark?: string;
  initials: string;
  /** Namespace highlighted in the key table while this workspace is active. */
  namespace: string;
};

export const WORKSPACES: Workspace[] = [
  { name: "Better I18N", project: "better-i18n/landing", initials: "B", namespace: "auth" },
  {
    name: "Carna",
    project: "carna/web",
    mark: "/logos/customers/carna-mark.png",
    initials: "C",
    namespace: "billing",
  },
];

/** The key currently open in the detail panel. */
export const SELECTED_KEY = "auth.login.title";

export const NAMESPACES: NamespaceGroup[] = [
  {
    name: "auth",
    rows: [
      { key: "auth.login.title", source: "Sign in to your account", status: "translated" },
      { key: "auth.login.subtitle", source: "Welcome back — enter your details", status: "translated" },
      { key: "auth.login.emailLabel", source: "Work email", status: "review" },
      { key: "auth.login.submit", source: "Sign in", status: "translated" },
      { key: "auth.forgotPassword", source: "Forgot your password?", status: "missing" },
    ],
  },
  {
    name: "hero",
    rows: [
      { key: "hero.title", source: "Translate with AI. Ship with confidence.", status: "translated" },
      { key: "hero.subtitle", source: "Context-aware AI translations, Git-native sync.", status: "translated" },
      { key: "hero.cta", source: "Get started", status: "translated" },
      { key: "hero.badge", source: "AI-Powered Translations", status: "review" },
    ],
  },
  {
    name: "nav",
    rows: [
      { key: "nav.pricing", source: "Pricing", status: "translated" },
      { key: "nav.docs", source: "Documentation", status: "translated" },
      { key: "nav.changelog", source: "Changelog", status: "missing" },
    ],
  },
  {
    name: "billing",
    rows: [
      { key: "billing.plan.pro", source: "Pro plan", status: "translated" },
      { key: "billing.seats.title", source: "Team seats", status: "review" },
      { key: "billing.invoice.download", source: "Download invoice", status: "translated" },
      { key: "billing.trialEnds", source: "Trial ends in {days} days", status: "missing" },
    ],
  },
];

/** Status ink: the one place a hue is allowed here, because it IS the status. */
export const STATUS_META: Record<KeyStatus, { label: string; text: string; dot: string }> = {
  translated: { label: "translated", text: "text-emerald-600", dot: "bg-emerald-500" },
  review: { label: "needs review", text: "text-amber-600", dot: "bg-amber-500" },
  missing: { label: "missing", text: "text-mist-400", dot: "bg-mist-300" },
};

export const MISSING_COUNT = NAMESPACES.reduce(
  (total, group) => total + group.rows.filter((row) => row.status === "missing").length,
  0,
);
