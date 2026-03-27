/**
 * Content marketing analytics events.
 *
 * All events are consent-gated — they only fire if window.gtag exists
 * (which means analytics consent was granted and scripts are loaded).
 */

// ─── Safe Event Sender ──────────────────────────────────────────────

function sendEvent(eventName: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}

// ─── Blog Events ────────────────────────────────────────────────────

export function trackBlogView(params: {
  slug: string;
  title: string;
  category?: string;
  author?: string;
  locale: string;
}) {
  sendEvent("blog_view", {
    content_type: "blog",
    content_id: params.slug,
    content_title: params.title,
    content_category: params.category,
    content_author: params.author,
    content_locale: params.locale,
  });
}

export function trackBlogReadProgress(params: {
  slug: string;
  percent: number; // 25, 50, 75, 100
}) {
  sendEvent("blog_read_progress", {
    content_id: params.slug,
    percent_scrolled: params.percent,
  });
}

export function trackBlogShare(params: {
  slug: string;
  method: string; // "twitter" | "linkedin" | "clipboard"
}) {
  sendEvent("share", {
    content_type: "blog",
    content_id: params.slug,
    method: params.method,
  });
}

// ─── CTA Events ─────────────────────────────────────────────────────

export function trackCtaClick(params: {
  cta_id: string; // e.g., "blog_floating_cta", "blog_inline_cta", "changelog_signup"
  cta_text: string;
  page_type: string; // "blog" | "changelog" | "compare" | "pricing" | "feature"
  content_id?: string; // blog slug or changelog slug
}) {
  sendEvent("cta_click", params);
}

// ─── Changelog Events ───────────────────────────────────────────────

export function trackChangelogView(params: {
  slug?: string; // individual page slug (null for main listing)
  version?: string;
  locale: string;
}) {
  sendEvent("changelog_view", {
    content_type: "changelog",
    content_id: params.slug,
    content_version: params.version,
    content_locale: params.locale,
  });
}

export function trackChangelogEntryExpand(params: {
  slug: string;
  version?: string;
}) {
  sendEvent("changelog_entry_view", {
    content_id: params.slug,
    content_version: params.version,
  });
}

// ─── Tool Usage Events ──────────────────────────────────────────────

export function trackToolUsage(params: {
  tool_name: string; // "icu_playground" | "locale_explorer" | "translation_converter" | "cost_calculator" | "hreflang_generator"
  action: string; // "convert" | "generate" | "calculate" | "explore"
}) {
  sendEvent("tool_usage", params);
}

// ─── Page Engagement ────────────────────────────────────────────────

export function trackTimeOnPage(params: {
  page_type: string;
  content_id?: string;
  seconds: number; // fire at 30s, 60s, 120s, 300s thresholds
}) {
  sendEvent("engaged_time", params);
}

// ─── Search Events ──────────────────────────────────────────────────

export function trackSearch(params: {
  search_term: string;
  search_location: "blog" | "changelog" | "tools";
  results_count: number;
}) {
  sendEvent("search", params);
}
