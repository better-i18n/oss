/**
 * Shared changelog parsing utilities.
 *
 * Extracted from the main changelog page so both the listing page and
 * individual changelog detail pages can reuse the same parsing logic.
 */

import type { useTranslations } from "@better-i18n/use-intl";

// ─── Types ───────────────────────────────────────────────────────────

/**
 * A locale code as it reaches this module — already validated against the
 * site's supported-locale list by `__root.tsx` before any route loader runs.
 * This used to be `"en" | "tr"`, which was never a real constraint: callers
 * cast into it with `(locale === "tr" ? "tr" : "en") as Locale`, silently
 * collapsing every other supported locale (de, fr, es, ja, it, ko, zh-hans, ...)
 * to English. `string` reflects what is actually known here — the real value,
 * not a fabricated one.
 */
export type Locale = string;
export type StatusTone = "new" | "updated" | "improved" | "fixed" | "security";

export interface ParsedListItem {
  badge: StatusTone | null;
  label: string | null;
  description: string;
}

export interface ParsedSection {
  title: string;
  items: ParsedListItem[];
  paragraphs: string[];
}

// ─── Badge Config ────────────────────────────────────────────────────

export const statusDefaults: Record<StatusTone, string> = {
  new: "NEW",
  updated: "UPDATED",
  improved: "IMPROVED",
  fixed: "FIXED",
  security: "SECURITY",
};

/**
 * One badge treatment for every tone.
 *
 * This was a five-hue palette (emerald / sky / blue / amber / rose). Two reasons
 * it is now neutral:
 *
 * 1. The distinction the colour drew is already carried by the badge's own WORD
 *    — NEW / FIXED / SECURITY. Hue repeated that information on a weaker
 *    channel, which is exactly what `rule/neutral-ink-accent-is-identity-only`
 *    reserves colour against: it is spent on pillar identity, link/focus and
 *    code tokens, because in those three places hue is the ONLY channel.
 * 2. Consistency was the real break. `Changelog.tsx` (the home-page band) already
 *    renders a neutral hairline chip for the same data, so one release looked
 *    like two different products depending on which surface you were on. The
 *    colour values below are copied from that chip verbatim rather than
 *    re-invented, so the two surfaces cannot drift again.
 *
 * `security` is the one tone that gets emphasis — but in INK, not hue: a darker
 * rule and darker text, still inside the neutral scale. It earns that because it
 * is the only tone a reader SCANS a long list for, rather than reads in order.
 *
 * The map stays keyed by tone (and `StatusTone` / `statusDefaults` stay) because
 * the type still drives labels and is wanted for filtering later — only the
 * colour mapping collapsed.
 */
const BADGE_NEUTRAL = "border-black/[0.07] bg-mist-50 text-mist-600";
const BADGE_SECURITY = "border-black/[0.14] bg-mist-50 text-mist-900";

export const statusClasses: Record<StatusTone, string> = {
  new: BADGE_NEUTRAL,
  updated: BADGE_NEUTRAL,
  improved: BADGE_NEUTRAL,
  fixed: BADGE_NEUTRAL,
  security: BADGE_SECURITY,
};

const statusAliases: Record<string, StatusTone> = {
  new: "new",
  added: "new",
  feature: "new",
  updated: "updated",
  update: "updated",
  improvement: "improved",
  improved: "improved",
  fix: "fixed",
  fixed: "fixed",
  bugfix: "fixed",
  security: "security",
};

// ─── Heading → Default Badge Map ────────────────────────────────────

const headingBadgeMap: Record<string, StatusTone> = {
  "new features": "new",
  "what's new": "new",
  new: "new",
  features: "new",
  improvements: "improved",
  improved: "improved",
  updates: "updated",
  updated: "updated",
  changes: "updated",
  "bug fixes": "fixed",
  "bug fixes & improvements": "fixed",
  fixes: "fixed",
  fixed: "fixed",
  security: "security",
  // Turkish
  "yeni özellikler": "new",
  yenilikler: "new",
  yeni: "new",
  "iyileştirmeler": "improved",
  güncellemeler: "updated",
  "hata düzeltmeleri": "fixed",
  düzeltmeler: "fixed",
  // German
  "neue funktionen": "new",
  neuigkeiten: "new",
  verbesserungen: "improved",
  fehlerbehebungen: "fixed",
  bugfixes: "fixed",
  // Spanish
  "nuevas funciones": "new",
  novedades: "new",
  mejoras: "improved",
  "correcciones de errores": "fixed",
  // French
  "nouvelles fonctionnalités": "new",
  "nouveautés": "new",
  "améliorations": "improved",
  "corrections de bugs": "fixed",
  // Portuguese
  "novas funcionalidades": "new",
  novidades: "new",
  melhorias: "improved",
  "correções de erros": "fixed",
  // Russian
  "новые функции": "new",
  новое: "new",
  улучшения: "improved",
  "исправления ошибок": "fixed",
  // Chinese
  "新功能": "new",
  "改进": "improved",
  "错误修复": "fixed",
  // Japanese
  "新機能": "new",
  "改善点": "improved",
  "バグ修正": "fixed",
  // Korean
  "새로운 기능": "new",
  "개선 사항": "improved",
  "버그 수정": "fixed",
};

// ─── Inline Renderer ─────────────────────────────────────────────────

export function renderInline(text: string) {
  return text
    .split(/(\*\*.+?\*\*)/g)
    .filter(Boolean)
    // Key by content + running offset: the array is derived from one string and
    // never reordered, so a positional key is stable, but react-doctor is right
    // that a bare index says nothing about identity.
    .map((segment, index, all) => {
      const key = `${all.slice(0, index).join("").length}-${segment}`;
      if (segment.startsWith("**") && segment.endsWith("**")) {
        return (
          <strong key={key} className="font-medium text-mist-950">
            {segment.slice(2, -2)}
          </strong>
        );
      }
      return <span key={key}>{segment}</span>;
    });
}

// ─── List Item Parser ────────────────────────────────────────────────

export function parseListItem(line: string): ParsedListItem {
  let text = line.trim().replace(/^-+\s*/, "");
  let badge: StatusTone | null = null;

  const bracketMatch = text.match(/^\\?\[([a-z-]+)\]\s*/i);
  if (bracketMatch) {
    const normalized = statusAliases[bracketMatch[1].toLowerCase()];
    if (normalized) {
      badge = normalized;
      text = text.slice(bracketMatch[0].length).trim();
    }
  } else {
    const prefixMatch = text.match(
      /^(new|added|feature|updated|update|improvement|improved|fix|fixed|bugfix|security):\s*/i,
    );
    if (prefixMatch) {
      badge = statusAliases[prefixMatch[1].toLowerCase()];
      text = text.slice(prefixMatch[0].length).trim();
    }
  }

  // Pattern 1: **label**: description (colon outside bold)
  const emphOutside = text.match(/^\*\*(.+?)\*\*:\s*(.+)$/);
  if (emphOutside) {
    return {
      badge,
      label: emphOutside[1].trim(),
      description: emphOutside[2].trim(),
    };
  }

  // Pattern 2: **label:** description (colon inside bold — common markdown style)
  const emphInside = text.match(/^\*\*(.+?):\*\*\s*(.+)$/);
  if (emphInside) {
    return {
      badge,
      label: emphInside[1].trim(),
      description: emphInside[2].trim(),
    };
  }

  const plainLabelMatch = text.match(/^([^:]{2,80}):\s*(.+)$/);
  if (plainLabelMatch) {
    return {
      badge,
      label: plainLabelMatch[1].trim(),
      description: plainLabelMatch[2].trim(),
    };
  }

  return { badge, label: null, description: text };
}

// ─── Section Parser ──────────────────────────────────────────────────

export function parseSections(body: string | null): ParsedSection[] {
  if (!body) return [];

  const sections: ParsedSection[] = [];
  const lines = body.split("\n");

  let currentSection: ParsedSection | null = null;
  let listBuffer: ParsedListItem[] = [];
  let sectionDefaultBadge: StatusTone | null = null;

  function ensureSection() {
    if (!currentSection) {
      currentSection = { title: "", items: [], paragraphs: [] };
    }
  }

  function flushList() {
    if (!currentSection || listBuffer.length === 0) return;
    for (const item of listBuffer) {
      if (!item.badge && sectionDefaultBadge) {
        item.badge = sectionDefaultBadge;
      }
    }
    currentSection.items.push(...listBuffer);
    listBuffer = [];
  }

  function pushSection() {
    if (!currentSection) return;
    flushList();
    if (
      currentSection.title ||
      currentSection.items.length > 0 ||
      currentSection.paragraphs.length > 0
    ) {
      sections.push(currentSection);
    }
    currentSection = null;
    sectionDefaultBadge = null;
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushList();
      continue;
    }

    if (/^#\s+/.test(line)) continue;

    if (/^##\s+/.test(line)) {
      pushSection();
      const headingText = line.replace(/^##\s+/, "").trim();
      sectionDefaultBadge = headingBadgeMap[headingText.toLowerCase()] ?? null;
      currentSection = { title: headingText, items: [], paragraphs: [] };
      continue;
    }

    if (/^###\s+/.test(line)) {
      flushList();
      ensureSection();
      currentSection?.paragraphs.push(line.replace(/^###\s+/, "").trim());
      continue;
    }

    if (/^-+\s+/.test(line)) {
      ensureSection();
      listBuffer.push(parseListItem(line));
      continue;
    }

    ensureSection();
    flushList();
    currentSection?.paragraphs.push(line);
  }

  pushSection();
  return sections;
}

// ─── Date Formatter ──────────────────────────────────────────────────

export function formatReleaseDate(date: string | null | undefined, locale: Locale) {
  if (!date) return null;
  // Intl accepts bare BCP-47 language codes directly (verified: en, de, fr,
  // es, pt, ja, tr, it, nl, ko, zh-hans all resolve to a sensible regional
  // format) — no need to hand-map a subset and silently default the rest to
  // English.
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Badge Component ─────────────────────────────────────────────────

export function StatusBadge({
  tone,
  t,
}: {
  tone: StatusTone;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <span
      className={`mr-1.5 mb-[3px] inline-flex h-4 items-center rounded border px-1 align-middle font-mono text-[9px] font-medium uppercase ${statusClasses[tone]}`}
    >
      {t(`badge.${tone}`)}
    </span>
  );
}
