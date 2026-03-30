/**
 * Shared changelog parsing utilities.
 *
 * Extracted from the main changelog page so both the listing page and
 * individual changelog detail pages can reuse the same parsing logic.
 */

import type { useTranslations } from "@better-i18n/use-intl";

// ─── Types ───────────────────────────────────────────────────────────

export type Locale = "en" | "tr";
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

export const statusClasses: Record<StatusTone, string> = {
  new: "border-emerald-300/50 bg-emerald-50 text-emerald-700",
  updated: "border-sky-300/50 bg-sky-50 text-sky-700",
  improved: "border-blue-300/50 bg-blue-50 text-blue-700",
  fixed: "border-amber-300/50 bg-amber-50 text-amber-700",
  security: "border-rose-300/50 bg-rose-50 text-rose-700",
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
    .map((segment, index) => {
      if (segment.startsWith("**") && segment.endsWith("**")) {
        return (
          <strong key={`${segment}-${index}`} className="font-medium text-mist-950">
            {segment.slice(2, -2)}
          </strong>
        );
      }
      return <span key={`${segment}-${index}`}>{segment}</span>;
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
  return new Date(date).toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", {
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
      {t(`badge.${tone}`, { defaultValue: statusDefaults[tone] })}
    </span>
  );
}
