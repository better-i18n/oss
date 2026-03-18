"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import type { LanguageOption } from "@better-i18n/core";
import {
  getLanguageLabel,
  resolveFlag,
  type ResolvedFlag,
} from "@better-i18n/core";
import { useSetLocale, useManifestLanguages } from "../client.js";
import type { I18nConfig } from "../types.js";

// ─── Inline SVG Icons ────────────────────────────────────────────────

function GlobeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" />
      <path d="M21 12H3" />
      <path d="M12 21C10.067 21 8.5 16.9706 8.5 12C8.5 7.02944 10.067 3 12 3C13.933 3 15.5 7.02944 15.5 12C15.5 16.9706 13.933 21 12 21Z" />
    </svg>
  );
}

function ChevronDownIcon({ style }: { style?: CSSProperties }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
    >
      <path d="M20 9L13.4142 15.5858C12.6332 16.3668 11.3669 16.3668 10.5858 15.5858L4 9" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 12l4.243 4.243L18.485 8" />
    </svg>
  );
}

// ─── Flag Component ──────────────────────────────────────────────────

function FlagDisplay({
  flag,
  label,
}: {
  flag: ResolvedFlag;
  label: string;
}) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [flag.type === "url" ? flag.url : null]);

  if (flag.type === "url" && !hasError) {
    return (
      <img
        src={flag.url}
        alt={label}
        style={{ width: 20, height: 16, borderRadius: 2, objectFit: "cover" }}
        loading="lazy"
        onError={() => setHasError(true)}
      />
    );
  }

  if (flag.type === "emoji" || (flag.type === "url" && hasError)) {
    const emoji = flag.type === "emoji" ? flag.emoji : null;
    if (emoji) {
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 20,
            height: 16,
            fontSize: 14,
            lineHeight: 1,
          }}
          aria-hidden="true"
        >
          {emoji}
        </span>
      );
    }
  }

  return (
    <span style={{ color: "var(--better-locale-code-text, #9ca3af)" }}>
      <GlobeIcon />
    </span>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────

const dropdownStyles = {
  trigger: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "var(--better-locale-trigger-padding, 6px 10px)",
    borderRadius: "var(--better-locale-trigger-radius, 8px)",
    border: "var(--better-locale-trigger-border, 1px solid transparent)",
    background: "var(--better-locale-trigger-bg, transparent)",
    color: "var(--better-locale-text, #374151)",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    transition: "background 0.15s, border-color 0.15s",
    lineHeight: 1,
    fontFamily: "inherit",
  } satisfies CSSProperties,
  triggerDisabled: {
    opacity: 0.7,
    cursor: "default",
  } satisfies CSSProperties,
  menu: {
    position: "absolute",
    right: 0,
    top: "calc(100% + 4px)",
    minWidth: 200,
    maxHeight: "70vh",
    overflowY: "auto",
    borderRadius: 12,
    border: "1px solid var(--better-locale-border, #e5e7eb)",
    background: "var(--better-locale-menu-bg, #ffffff)",
    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.12)",
    padding: 0,
    zIndex: 50,
    listStyle: "none",
    margin: 0,
  } satisfies CSSProperties,
  item: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    width: "100%",
    padding: "8px 14px",
    border: "none",
    background: "transparent",
    color: "var(--better-locale-text, #374151)",
    fontSize: 14,
    cursor: "pointer",
    transition: "background 0.1s",
    textAlign: "left" as const,
    fontFamily: "inherit",
    lineHeight: 1.2,
  } satisfies CSSProperties,
  itemActive: {
    background: "var(--better-locale-active-bg, #f9fafb)",
  } satisfies CSSProperties,
  itemHovered: {
    background: "var(--better-locale-hover-bg, #f3f4f6)",
  } satisfies CSSProperties,
  label: {
    flex: 1,
    textAlign: "left" as const,
  } satisfies CSSProperties,
  code: {
    fontSize: 10,
    fontFamily: "monospace",
    textTransform: "uppercase" as const,
    color: "var(--better-locale-code-text, #9ca3af)",
    letterSpacing: "0.05em",
  } satisfies CSSProperties,
  check: {
    color: "var(--better-locale-accent, currentColor)",
    flexShrink: 0,
  } satisfies CSSProperties,
  skeleton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid transparent",
    background: "transparent",
  } satisfies CSSProperties,
  skeletonBar: {
    width: 32,
    height: 16,
    borderRadius: 4,
    background: "#e5e7eb",
    animation: "better-locale-pulse 1.5s ease-in-out infinite",
  } satisfies CSSProperties,
} as const;

// ─── Types ───────────────────────────────────────────────────────────

export interface LocaleDropdownRenderContext {
  language: LanguageOption;
  isActive: boolean;
  flag: ResolvedFlag;
  label: string;
}

export interface LocaleDropdownProps {
  /** i18n config — required for fetching languages from CDN. */
  config: I18nConfig;
  /** Current locale (read from `useLocale()` from next-intl or pass manually). */
  locale: string;
  /** Pre-fetched languages for SSR pass-through (skips client-side CDN fetch). */
  languages?: LanguageOption[];
  /** Display variant. @default "styled" */
  variant?: "styled" | "unstyled";
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  /** @default true */
  showFlag?: boolean;
  /** @default true */
  showNativeName?: boolean;
  /** @default true */
  showLocaleCode?: boolean;
  renderTrigger?: (ctx: {
    language: LanguageOption | undefined;
    isOpen: boolean;
    isLoading: boolean;
    flag: ResolvedFlag | null;
    label: string;
  }) => ReactNode;
  renderItem?: (ctx: LocaleDropdownRenderContext) => ReactNode;
}

// ─── Component ───────────────────────────────────────────────────────

/**
 * Styled locale dropdown for Next.js with cookie-based locale switching.
 *
 * Uses `useSetLocale()` for locale changes and `useManifestLanguages()` for
 * the language list. Works with both `BetterI18nProvider` (instant switching)
 * and standalone mode (cookie + router.refresh).
 *
 * @example
 * ```tsx
 * import { LocaleDropdown } from "@better-i18n/next/client";
 * import { useLocale } from "next-intl";
 *
 * function Header() {
 *   const locale = useLocale();
 *   return (
 *     <LocaleDropdown
 *       config={{ project: "acme/app", defaultLocale: "en" }}
 *       locale={locale}
 *     />
 *   );
 * }
 * ```
 */
export function LocaleDropdown({
  config,
  locale,
  languages: languagesProp,
  variant = "styled",
  className,
  triggerClassName,
  menuClassName,
  showFlag = true,
  showNativeName = true,
  showLocaleCode = true,
  renderTrigger,
  renderItem,
}: LocaleDropdownProps) {
  const setLocale = useSetLocale(config);
  const { languages: fetchedLanguages, isLoading } = useManifestLanguages(config);

  const languages = languagesProp ?? fetchedLanguages;
  const isReady = languagesProp ? true : !isLoading && languages.length > 0;

  const [isOpen, setIsOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const isStyled = variant === "styled";

  const currentLanguage = useMemo(
    () => languages.find((l) => l.code === locale),
    [languages, locale],
  );
  const currentLabel = currentLanguage
    ? getLanguageLabel(currentLanguage)
    : locale.toUpperCase();
  const currentFlag = currentLanguage ? resolveFlag(currentLanguage) : null;
  const canToggle = languages.length > 1;

  const handleSelect = useCallback(
    (newLocale: string) => {
      setLocale(newLocale);
      setIsOpen(false);
      setFocusIndex(-1);
    },
    [setLocale],
  );

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsOpen(true);
          setFocusIndex(0);
        }
        return;
      }

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setFocusIndex(-1);
          break;
        case "ArrowDown":
          e.preventDefault();
          setFocusIndex((prev) =>
            prev < languages.length - 1 ? prev + 1 : 0,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusIndex((prev) =>
            prev > 0 ? prev - 1 : languages.length - 1,
          );
          break;
        case "Enter":
        case " ": {
          e.preventDefault();
          const lang = languages[focusIndex];
          if (lang) handleSelect(lang.code);
          break;
        }
        case "Home":
          e.preventDefault();
          setFocusIndex(0);
          break;
        case "End":
          e.preventDefault();
          setFocusIndex(languages.length - 1);
          break;
      }
    },
    [isOpen, focusIndex, languages, handleSelect],
  );

  // Scroll focused item into view
  useEffect(() => {
    if (focusIndex >= 0 && menuRef.current) {
      const items = menuRef.current.querySelectorAll("[data-better-locale-item]");
      items[focusIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [focusIndex]);

  // Loading skeleton
  if (!isReady) {
    if (renderTrigger) {
      return (
        <div data-better-locale-dropdown className={className}>
          {renderTrigger({
            language: undefined,
            isOpen: false,
            isLoading: true,
            flag: null,
            label: "",
          })}
        </div>
      );
    }
    return (
      <div data-better-locale-dropdown className={className}>
        <button
          type="button"
          disabled
          aria-busy="true"
          data-better-locale-trigger
          className={triggerClassName}
          style={isStyled ? dropdownStyles.skeleton : undefined}
        >
          <span style={{ color: "var(--better-locale-code-text, #9ca3af)" }}>
            <GlobeIcon />
          </span>
          <span style={isStyled ? dropdownStyles.skeletonBar : undefined} />
        </button>
        {isStyled && (
          <style>{`@keyframes better-locale-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      data-better-locale-dropdown
      className={className}
      style={{ position: "relative", display: "inline-block" }}
    >
      {/* Trigger */}
      {renderTrigger ? (
        <div
          onClick={() => canToggle && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          data-better-locale-trigger
          className={triggerClassName}
        >
          {renderTrigger({
            language: currentLanguage,
            isOpen,
            isLoading: false,
            flag: currentFlag,
            label: currentLabel,
          })}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => canToggle && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label="Select language"
          disabled={!canToggle}
          data-better-locale-trigger
          className={triggerClassName}
          style={
            isStyled
              ? {
                  ...dropdownStyles.trigger,
                  ...(!canToggle ? dropdownStyles.triggerDisabled : {}),
                }
              : undefined
          }
        >
          {showFlag && currentFlag && (
            <FlagDisplay flag={currentFlag} label={currentLabel} />
          )}
          {showNativeName && <span>{currentLabel}</span>}
          {canToggle && (
            <ChevronDownIcon
              style={{
                transition: "transform 0.2s",
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                color: "var(--better-locale-code-text, #9ca3af)",
              }}
            />
          )}
        </button>
      )}

      {/* Menu */}
      {isOpen && canToggle && (
        <ul
          ref={menuRef}
          role="listbox"
          aria-label="Available languages"
          data-better-locale-menu
          className={menuClassName}
          style={isStyled ? dropdownStyles.menu : undefined}
        >
          {languages.map((language, index) => {
            const label = getLanguageLabel(language);
            const isActive = language.code === locale;
            const isFocused = index === focusIndex;
            const flag = resolveFlag(language);

            if (renderItem) {
              return (
                <li
                  key={language.code}
                  role="option"
                  aria-selected={isActive}
                  data-better-locale-item
                  data-active={isActive || undefined}
                  data-focused={isFocused || undefined}
                  onClick={() => handleSelect(language.code)}
                  onMouseEnter={() => setFocusIndex(index)}
                  style={{ cursor: "pointer" }}
                >
                  {renderItem({ language, isActive, flag, label })}
                </li>
              );
            }

            return (
              <li
                key={language.code}
                role="option"
                aria-selected={isActive}
                data-better-locale-item
                data-active={isActive || undefined}
                data-focused={isFocused || undefined}
                onClick={() => handleSelect(language.code)}
                onMouseEnter={() => setFocusIndex(index)}
                style={
                  isStyled
                    ? {
                        ...dropdownStyles.item,
                        ...(isActive ? dropdownStyles.itemActive : {}),
                        ...(isFocused ? dropdownStyles.itemHovered : {}),
                      }
                    : undefined
                }
              >
                {showFlag && <FlagDisplay flag={flag} label={label} />}
                <span style={isStyled ? dropdownStyles.label : undefined}>
                  {showNativeName ? label : language.code.toUpperCase()}
                </span>
                {showLocaleCode && (
                  <span style={isStyled ? dropdownStyles.code : undefined}>
                    {language.code}
                  </span>
                )}
                {isActive && (
                  <span style={isStyled ? dropdownStyles.check : undefined}>
                    <CheckIcon />
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {isStyled && isOpen && (
        <style>{`@keyframes better-locale-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
      )}
    </div>
  );
}
