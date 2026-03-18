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
import { useLocation, useNavigate } from "react-router";
import type { LanguageOption } from "@better-i18n/core";
import {
  getLanguageLabel,
  resolveFlag,
  type ResolvedFlag,
} from "@better-i18n/core";
import { useLanguages, useLocale } from "./hooks.js";

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
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
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
      <path d="M6 9l6 6 6-6" />
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
      <path d="M20 6L9 17l-5-5" />
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
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid var(--better-locale-border, #e5e7eb)",
    background: "var(--better-locale-menu-bg, #ffffff)",
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
    padding: "4px 0",
    zIndex: 50,
    listStyle: "none",
    margin: 0,
  } satisfies CSSProperties,
  item: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    width: "100%",
    padding: "10px 16px",
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
    color: "var(--better-locale-accent, #10b981)",
    flexShrink: 0,
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
  /** Default locale (no URL prefix). @default "en" */
  defaultLocale?: string;
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
 * Styled locale dropdown for Remix / React Router with URL-based locale switching.
 *
 * Uses `useLanguages()` and `useLocale()` from Remix provider context, and
 * React Router's `useNavigate()` for SPA navigation.
 *
 * @example
 * ```tsx
 * import { LocaleDropdown } from "@better-i18n/remix/react";
 *
 * function Header() {
 *   return <LocaleDropdown />;
 * }
 * ```
 */
export function LocaleDropdown({
  defaultLocale = "en",
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
  const locale = useLocale();
  const languages = useLanguages();
  const location = useLocation();
  const navigateTo = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const isStyled = variant === "styled";
  const isLoading = languages.length === 0;

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
      // URL manipulation from the existing LanguageSwitcher pattern
      const nonDefaultCodes = languages
        .filter((l) => !l.isDefault)
        .map((l) => l.code);
      const regex = new RegExp(`^/(${nonDefaultCodes.join("|")})`);
      const pathWithoutLocale = location.pathname.replace(regex, "") || "/";
      const isDefault = newLocale === defaultLocale;
      navigateTo(
        (isDefault ? "" : `/${newLocale}`) +
          pathWithoutLocale +
          location.search,
      );
      setIsOpen(false);
      setFocusIndex(-1);
    },
    [languages, location.pathname, location.search, defaultLocale, navigateTo],
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

  // Loading state
  if (isLoading) {
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
          style={
            isStyled
              ? {
                  ...dropdownStyles.trigger,
                  ...dropdownStyles.triggerDisabled,
                }
              : undefined
          }
        >
          <span style={{ color: "var(--better-locale-code-text, #9ca3af)" }}>
            <GlobeIcon />
          </span>
          <span>{locale.toUpperCase()}</span>
        </button>
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
    </div>
  );
}
