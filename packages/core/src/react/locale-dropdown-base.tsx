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
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react";
import type { LanguageOption } from "../types.js";
import { getLanguageLabel, resolveFlag, type ResolvedFlag } from "../utils/locale-ui.js";

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

function FlagDisplay({ flag, label }: { flag: ResolvedFlag; label: string }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [flag.type === "url" ? flag.url : null]);

  if (flag.type === "url" && !hasError) {
    return (
      <img
        src={flag.url}
        alt={label}
        style={{ width: 18, height: 18, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
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
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, fontSize: 14, lineHeight: 1, flexShrink: 0 }}
          aria-hidden="true"
        >
          {emoji}
        </span>
      );
    }
  }

  return (
    <span style={{ color: "var(--better-locale-code-text, var(--_bl-muted))" }}>
      <GlobeIcon />
    </span>
  );
}

// ─── Theme CSS ──────────────────────────────────────────────────────

/**
 * Internal CSS custom properties (`--_bl-*`) provide dark-mode-aware
 * defaults. Consumer-set `--better-locale-*` properties always win.
 *
 * Supports: `.dark` class (Tailwind), `[data-theme="dark"]` attribute.
 * Does NOT use `prefers-color-scheme` — dark mode must be explicit via
 * site markup, so light-only sites aren't affected by OS dark mode.
 */
export const LOCALE_DROPDOWN_CSS = `[data-better-locale-dropdown]{position:relative;--_bl-text:#374151;--_bl-menu-bg:#fff;--_bl-border:#e5e7eb;--_bl-hover:#f3f4f6;--_bl-active:#eff0f1;--_bl-muted:#9ca3af;--_bl-shadow:0 8px 32px rgba(0,0,0,.12),0 2px 8px rgba(0,0,0,.06)}.dark [data-better-locale-dropdown],[data-theme=dark] [data-better-locale-dropdown]{--_bl-text:#d1d5db;--_bl-menu-bg:#1a1a1a;--_bl-border:rgba(255,255,255,.08);--_bl-hover:rgba(255,255,255,.06);--_bl-active:rgba(255,255,255,.09);--_bl-muted:#6b7280;--_bl-shadow:0 8px 32px rgba(0,0,0,.5),0 2px 8px rgba(0,0,0,.3)}@keyframes better-locale-pulse{0%,100%{opacity:1}50%{opacity:.4}}@keyframes better-locale-in{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:scale(1)}}[data-better-locale-menu]{animation:better-locale-in .15s cubic-bezier(.16,1,.3,1);transform-origin:top right}[data-better-locale-menu][data-placement=top]{transform-origin:bottom right}[data-better-locale-item]{position:relative}[data-better-locale-item]>*{position:relative;z-index:1}[data-better-locale-item]::before{content:'';position:absolute;inset:0;border-radius:8px;background:var(--better-locale-hover-bg,var(--_bl-hover));opacity:0;transform:scale(.97);transition:opacity .12s ease-out,transform .12s ease-out;z-index:0}[data-better-locale-item]:hover::before,[data-better-locale-item][data-focused]::before{opacity:1;transform:scale(1)}[data-better-locale-item][data-active]::before{opacity:1;transform:scale(1);background:var(--better-locale-active-bg,var(--_bl-active))}[data-better-locale-trigger]{position:relative}[data-better-locale-trigger]:not([disabled])::before{content:'';position:absolute;inset:0;border-radius:var(--better-locale-trigger-radius,8px);background:var(--better-locale-hover-bg,var(--_bl-hover));opacity:0;transform:scale(.97);transition:opacity .12s ease-out,transform .12s ease-out}[data-better-locale-trigger]:not([disabled]):hover::before{opacity:1;transform:scale(1)}[data-better-locale-trigger]>*{position:relative;z-index:1}`;

// ─── Styles ──────────────────────────────────────────────────────────

const styles = {
  trigger: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "var(--better-locale-trigger-padding, 6px 10px)",
    borderRadius: "var(--better-locale-trigger-radius, 8px)",
    border: "var(--better-locale-trigger-border, 1px solid transparent)",
    background: "var(--better-locale-trigger-bg, transparent)",
    color: "var(--better-locale-text, var(--_bl-text))",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    lineHeight: 1,
    fontFamily: "inherit",
  } satisfies CSSProperties,
  triggerDisabled: {
    opacity: 0.7,
    cursor: "default",
  } satisfies CSSProperties,
  menu: {
    minWidth: 210,
    maxHeight: "70vh",
    overflowY: "auto",
    borderRadius: 14,
    border: "1px solid var(--better-locale-border, var(--_bl-border))",
    background: "var(--better-locale-menu-bg, var(--_bl-menu-bg))",
    boxShadow: "var(--_bl-shadow)",
    padding: "6px",
    zIndex: 50,
    listStyle: "none",
    margin: 0,
  } satisfies CSSProperties,
  item: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    padding: "7px 10px",
    border: "none",
    background: "transparent",
    color: "var(--better-locale-text, var(--_bl-text))",
    fontSize: 14,
    cursor: "pointer",
    textAlign: "left" as const,
    fontFamily: "inherit",
    lineHeight: 1.2,
    borderRadius: 8,
    boxSizing: "border-box" as const,
  } satisfies CSSProperties,
  itemActive: { fontWeight: 500 } satisfies CSSProperties,
  itemHovered: {} satisfies CSSProperties,
  label: { flex: 1, textAlign: "left" as const } satisfies CSSProperties,
  code: {
    fontSize: 10,
    fontFamily: "monospace",
    textTransform: "uppercase" as const,
    color: "var(--better-locale-code-text, var(--_bl-muted))",
    letterSpacing: "0.05em",
  } satisfies CSSProperties,
  check: { color: "var(--better-locale-accent, currentColor)", flexShrink: 0 } satisfies CSSProperties,
  skeleton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid transparent",
    background: "transparent",
  } satisfies CSSProperties,
  skeletonFlag: {
    width: 18,
    height: 18,
    borderRadius: "50%",
    background: "var(--better-locale-border, var(--_bl-border))",
    animation: "better-locale-pulse 1.5s ease-in-out infinite",
    flexShrink: 0,
  } satisfies CSSProperties,
  skeletonText: {
    width: 56,
    height: 14,
    borderRadius: 4,
    background: "var(--better-locale-border, var(--_bl-border))",
    animation: "better-locale-pulse 1.5s ease-in-out infinite",
  } satisfies CSSProperties,
} as const;

// ─── Public API Constants ────────────────────────────────────────────

/**
 * Data attribute names used by `LocaleDropdownBase`.
 *
 * Use these when building custom styled components on top of `variant="unstyled"`,
 * or when writing CSS selectors targeting the dropdown's DOM structure.
 *
 * @example
 * ```css
 * [data-better-locale-trigger] { ... }
 * [data-better-locale-item][data-active] { font-weight: 600; }
 * ```
 *
 * @example
 * ```tsx
 * <LocaleDropdownBase variant="unstyled" />
 * // then target with DATA_ATTRS.trigger, DATA_ATTRS.item, etc.
 * ```
 */
export const DATA_ATTRS = {
  /** Root wrapper element. */
  root: "data-better-locale-dropdown",
  /** Trigger button (or custom trigger wrapper). */
  trigger: "data-better-locale-trigger",
  /** Floating menu list. */
  menu: "data-better-locale-menu",
  /** Each language option `<li>`. */
  item: "data-better-locale-item",
  /** Present on the active (selected) item. */
  active: "data-active",
  /** Present on the keyboard-focused item. */
  focused: "data-focused",
  /** `"top"` or `"bottom"` — resolved placement direction on the menu. */
  placement: "data-placement",
} as const;

/**
 * CSS custom property names consumed by `LocaleDropdownBase` in styled mode.
 *
 * Set these on any ancestor element to theme the dropdown without touching its markup.
 *
 * @example
 * ```tsx
 * <div style={{ [CSS_VARS.hoverBg]: "oklch(0.95 0 0)", [CSS_VARS.accent]: "#7c3aed" }}>
 *   <LocaleDropdown />
 * </div>
 * ```
 */
export const CSS_VARS = {
  /** Text color for trigger and menu items. */
  text: "--better-locale-text",
  /** Menu panel background. */
  menuBg: "--better-locale-menu-bg",
  /** Menu panel border color. */
  border: "--better-locale-border",
  /** Item hover background. */
  hoverBg: "--better-locale-hover-bg",
  /** Active (selected) item background. */
  activeBg: "--better-locale-active-bg",
  /** Muted text color (locale code badge, chevron). */
  codeText: "--better-locale-code-text",
  /** Checkmark / accent color. */
  accent: "--better-locale-accent",
  /** Trigger button padding. */
  triggerPadding: "--better-locale-trigger-padding",
  /** Trigger button border-radius. */
  triggerRadius: "--better-locale-trigger-radius",
  /** Trigger button border. */
  triggerBorder: "--better-locale-trigger-border",
  /** Trigger button background. */
  triggerBg: "--better-locale-trigger-bg",
} as const;

// ─── Types ───────────────────────────────────────────────────────────

export interface LocaleDropdownTriggerContext {
  language: LanguageOption | undefined;
  isOpen: boolean;
  isLoading: boolean;
  flag: ResolvedFlag | null;
  label: string;
}

export interface LocaleDropdownRenderContext {
  language: LanguageOption;
  isActive: boolean;
  flag: ResolvedFlag;
  label: string;
}

export interface LocaleDropdownBaseProps {
  /** Current active locale code. */
  locale: string;
  /** Available languages list. */
  languages: LanguageOption[];
  /** Called when user selects a new locale. */
  onLocaleChange: (locale: string) => void;
  /** Show loading skeleton. @default false */
  isLoading?: boolean;
  /** Display variant. "styled" = inline styles + CSS vars, "unstyled" = data attributes only. @default "styled" */
  variant?: "styled" | "unstyled";
  /** Additional className on the root wrapper. */
  className?: string;
  /** Additional className on the trigger button. */
  triggerClassName?: string;
  /** Additional className on the dropdown menu. */
  menuClassName?: string;
  /** Show flag icon/emoji. @default true */
  showFlag?: boolean;
  /** Show native language name. @default true */
  showNativeName?: boolean;
  /** Show locale code badge (e.g., "EN"). @default true */
  showLocaleCode?: boolean;
  /** Menu placement. "auto" detects available viewport space. @default "auto" */
  placement?: "auto" | "top" | "bottom";
  /** Custom render for the trigger button. */
  renderTrigger?: (ctx: LocaleDropdownTriggerContext) => ReactNode;
  /** Custom render for each menu item. */
  renderItem?: (ctx: LocaleDropdownRenderContext) => ReactNode;
}

// ─── Component ───────────────────────────────────────────────────────

/**
 * Headless-friendly locale dropdown UI.
 *
 * Pure presentational component — no routing hooks, no framework assumptions.
 * Pass `locale`, `languages`, and `onLocaleChange` from your adapter.
 *
 * Full CSS customization via `--better-locale-*` custom properties.
 *
 * @example
 * ```tsx
 * // Minimal usage
 * <LocaleDropdownBase
 *   locale={locale}
 *   languages={languages}
 *   onLocaleChange={navigate}
 * />
 *
 * // Headless — bring your own styles
 * <LocaleDropdownBase
 *   locale={locale}
 *   languages={languages}
 *   onLocaleChange={navigate}
 *   variant="unstyled"
 *   renderItem={({ language, isActive }) => <MyItem ... />}
 * />
 * ```
 */
export function LocaleDropdownBase({
  locale,
  languages,
  onLocaleChange,
  isLoading = false,
  variant = "styled",
  className,
  triggerClassName,
  menuClassName,
  showFlag = true,
  showNativeName = true,
  showLocaleCode = true,
  placement: placementProp = "auto",
  renderTrigger,
  renderItem,
}: LocaleDropdownBaseProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const { refs, floatingStyles, placement: resolvedPlacement } = useFloating({
    open: isOpen,
    strategy: "fixed",
    placement: placementProp === "top" ? "top-end" : "bottom-end",
    middleware: [offset(4), flip({ padding: 16 }), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  const isStyled = variant === "styled";
  const currentLanguage = useMemo(
    () => languages.find((l) => l.code === locale),
    [languages, locale],
  );
  const currentLabel = currentLanguage ? getLanguageLabel(currentLanguage) : locale.toUpperCase();
  const currentFlag = currentLanguage ? resolveFlag(currentLanguage) : null;
  const canToggle = languages.length > 1;

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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
          setFocusIndex((prev) => (prev < languages.length - 1 ? prev + 1 : 0));
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusIndex((prev) => (prev > 0 ? prev - 1 : languages.length - 1));
          break;
        case "Enter":
        case " ": {
          e.preventDefault();
          const lang = languages[focusIndex];
          if (lang) { onLocaleChange(lang.code); setIsOpen(false); setFocusIndex(-1); }
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
    [isOpen, focusIndex, languages, onLocaleChange],
  );

  // Scroll focused item into view
  useEffect(() => {
    if (focusIndex >= 0 && menuRef.current) {
      const items = menuRef.current.querySelectorAll("[data-better-locale-item]");
      items[focusIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [focusIndex]);

  // Loading skeleton
  if (isLoading) {
    if (renderTrigger) {
      return (
        <div data-better-locale-dropdown className={className}>
          {renderTrigger({ language: undefined, isOpen: false, isLoading: true, flag: null, label: "" })}
          {isStyled && <style>{LOCALE_DROPDOWN_CSS}</style>}
        </div>
      );
    }
    return (
      <div data-better-locale-dropdown className={className}>
        <div
          aria-busy="true"
          data-better-locale-trigger
          className={triggerClassName}
          style={isStyled ? styles.skeleton : undefined}
        >
          <span style={isStyled ? styles.skeletonFlag : undefined} />
          <span style={isStyled ? styles.skeletonText : undefined} />
        </div>
        {isStyled && <style>{LOCALE_DROPDOWN_CSS}</style>}
      </div>
    );
  }

  const handleTriggerClick = () => {
    if (!canToggle) return;
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      ref={containerRef}
      data-better-locale-dropdown
      className={className}
      style={!className ? { position: "relative", display: "inline-block" } : { position: "relative" }}
    >
      {/* Trigger */}
      {renderTrigger ? (
        <div
          ref={refs.setReference}
          onClick={handleTriggerClick}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          data-better-locale-trigger
          className={triggerClassName}
        >
          {renderTrigger({ language: currentLanguage, isOpen, isLoading: false, flag: currentFlag, label: currentLabel })}
        </div>
      ) : (
        <button
          ref={refs.setReference}
          type="button"
          onClick={handleTriggerClick}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label="Select language"
          disabled={!canToggle}
          data-better-locale-trigger
          className={triggerClassName}
          style={isStyled ? { ...styles.trigger, ...(!canToggle ? styles.triggerDisabled : {}) } : undefined}
        >
          {showFlag && currentFlag && <FlagDisplay flag={currentFlag} label={currentLabel} />}
          {showNativeName && <span>{currentLabel}</span>}
          {canToggle && (
            <ChevronDownIcon
              style={{ transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", color: "var(--better-locale-code-text, var(--_bl-muted))" }}
            />
          )}
        </button>
      )}

      {/* Menu */}
      {isOpen && canToggle && (
        <ul
          ref={(node: HTMLUListElement | null) => {
            refs.setFloating(node);
            menuRef.current = node;
          }}
          role="listbox"
          aria-label="Available languages"
          data-better-locale-menu
          data-placement={resolvedPlacement.startsWith("top") ? "top" : "bottom"}
          className={menuClassName}
          style={isStyled ? { ...styles.menu, ...floatingStyles } : floatingStyles}
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
                  onClick={() => { onLocaleChange(language.code); setIsOpen(false); }}
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
                onClick={() => { onLocaleChange(language.code); setIsOpen(false); }}
                onMouseEnter={() => setFocusIndex(index)}
                style={
                  isStyled
                    ? { ...styles.item, ...(isActive ? styles.itemActive : {}), ...(isFocused ? styles.itemHovered : {}) }
                    : undefined
                }
              >
                {showFlag && <FlagDisplay flag={flag} label={label} />}
                <span style={isStyled ? styles.label : undefined}>
                  {showNativeName ? label : language.code.toUpperCase()}
                </span>
                {showLocaleCode && (
                  <span style={isStyled ? styles.code : undefined}>{language.code}</span>
                )}
                {isActive && (
                  <span style={isStyled ? styles.check : undefined}><CheckIcon /></span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {isStyled && <style>{LOCALE_DROPDOWN_CSS}</style>}
    </div>
  );
}
