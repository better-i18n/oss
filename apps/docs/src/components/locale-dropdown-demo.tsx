"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  createI18nCore,
  getLanguageLabel,
  resolveFlag,
} from "@better-i18n/core";
import type { LanguageOption, ResolvedFlag } from "@better-i18n/core";

// ─── Types ───────────────────────────────────────────────────────────

interface DropdownItem {
  language: LanguageOption;
  flag: ResolvedFlag;
  label: string;
}

// ─── Constants ───────────────────────────────────────────────────────

const GLOBE_SVG = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
);

const CHECK_SVG = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CHEVRON_SVG = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ─── Flag Component ──────────────────────────────────────────────────

function FlagDisplay({ flag }: { flag: ResolvedFlag }) {
  if (flag.type === "emoji") {
    return <span style={{ fontSize: 18, lineHeight: 1 }}>{flag.emoji}</span>;
  }
  if (flag.type === "url") {
    return (
      <img
        src={flag.url}
        alt=""
        style={{
          width: 20,
          height: 15,
          objectFit: "cover",
          borderRadius: 2,
        }}
      />
    );
  }
  return <span style={{ color: "var(--better-locale-code-text, #9ca3af)" }}>{GLOBE_SVG}</span>;
}

// ─── Demo Component ──────────────────────────────────────────────────

export function LocaleDropdownDemo() {
  const [languages, setLanguages] = useState<LanguageOption[]>([]);
  const [selected, setSelected] = useState<string>("en");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const core = createI18nCore({ project: "better-i18n/landing", defaultLocale: "en" });

    core
      .getLanguages()
      .then((langs) => {
        if (!cancelled) {
          setLanguages(langs);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Failed to fetch languages from CDN");
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const items: DropdownItem[] = languages.map((lang) => ({
    language: lang,
    flag: resolveFlag(lang),
    label: getLanguageLabel(lang),
  }));

  const selectedItem = items.find((i) => i.language.code === selected);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsOpen(true);
          setFocusedIndex(0);
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((i) => (i + 1) % items.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((i) => (i - 1 + items.length) % items.length);
          break;
        case "Home":
          e.preventDefault();
          setFocusedIndex(0);
          break;
        case "End":
          e.preventDefault();
          setFocusedIndex(items.length - 1);
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (focusedIndex >= 0 && items[focusedIndex]) {
            setSelected(items[focusedIndex].language.code);
            setIsOpen(false);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          break;
      }
    },
    [isOpen, focusedIndex, items],
  );

  if (error) {
    return (
      <div style={{ padding: "12px 16px", borderRadius: 8, background: "var(--color-fd-card, #f9fafb)", color: "var(--color-fd-muted-foreground, #6b7280)", fontSize: 14 }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "16px 0" }}>
      <div
        ref={containerRef}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        data-better-locale-dropdown
        style={{ position: "relative", display: "inline-block", width: "fit-content" }}
      >
        {/* Trigger */}
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) setFocusedIndex(-1);
          }}
          data-better-locale-trigger
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid var(--color-fd-border, #e5e7eb)",
            background: "var(--color-fd-card, #ffffff)",
            color: "var(--color-fd-foreground, #374151)",
            cursor: "pointer",
            fontSize: 14,
            fontFamily: "inherit",
            minWidth: 180,
            justifyContent: "space-between",
          }}
        >
          {isLoading ? (
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  width: 20,
                  height: 15,
                  borderRadius: 2,
                  background: "var(--color-fd-border, #e5e7eb)",
                  animation: "better-locale-pulse 1.5s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  width: 80,
                  height: 14,
                  borderRadius: 4,
                  background: "var(--color-fd-border, #e5e7eb)",
                  animation: "better-locale-pulse 1.5s ease-in-out infinite",
                }}
              />
            </span>
          ) : (
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {selectedItem && <FlagDisplay flag={selectedItem.flag} />}
              <span>{selectedItem?.label ?? selected}</span>
              <span
                style={{
                  fontSize: 11,
                  color: "var(--color-fd-muted-foreground, #9ca3af)",
                  textTransform: "uppercase",
                }}
              >
                {selected}
              </span>
            </span>
          )}
          <span
            style={{
              color: "var(--color-fd-muted-foreground, #9ca3af)",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 150ms",
              display: "flex",
            }}
          >
            {CHEVRON_SVG}
          </span>
        </button>

        {/* Menu */}
        {isOpen && !isLoading && (
          <ul
            role="listbox"
            data-better-locale-menu
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              minWidth: "100%",
              maxHeight: 280,
              overflowY: "auto",
              margin: 0,
              padding: "4px 0",
              listStyle: "none",
              borderRadius: 8,
              border: "1px solid var(--color-fd-border, #e5e7eb)",
              background: "var(--color-fd-card, #ffffff)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              zIndex: 50,
            }}
          >
            {items.map((item, index) => {
              const isActive = item.language.code === selected;
              const isFocused = index === focusedIndex;
              return (
                <li
                  key={item.language.code}
                  role="option"
                  aria-selected={isActive}
                  data-better-locale-item
                  {...(isActive ? { "data-active": "" } : {})}
                  {...(isFocused ? { "data-focused": "" } : {})}
                  onClick={() => {
                    setSelected(item.language.code);
                    setIsOpen(false);
                  }}
                  onMouseEnter={() => setFocusedIndex(index)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    cursor: "pointer",
                    fontSize: 14,
                    background: isActive
                      ? "var(--color-fd-accent, #f9fafb)"
                      : isFocused
                        ? "var(--color-fd-muted, #f3f4f6)"
                        : "transparent",
                    color: "var(--color-fd-foreground, #374151)",
                    transition: "background 100ms",
                  }}
                >
                  <FlagDisplay flag={item.flag} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--color-fd-muted-foreground, #9ca3af)",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.language.code}
                  </span>
                  {isActive && (
                    <span style={{ color: "var(--color-fd-primary, currentColor)", display: "flex" }}>
                      {CHECK_SVG}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Pulse animation for skeleton */}
      <style>{`
        @keyframes better-locale-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      <p
        style={{
          fontSize: 12,
          color: "var(--color-fd-muted-foreground, #9ca3af)",
          margin: 0,
          fontStyle: "italic",
        }}
      >
        Live data from CDN — <code>better-i18n/landing</code> project
        {!isLoading && ` · ${languages.length} languages`}
      </p>
    </div>
  );
}
