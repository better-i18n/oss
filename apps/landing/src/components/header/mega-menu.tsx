/**
 * MegaMenu — composable header dropdown system.
 *
 * Hover-trigger pattern with delayed-close (100ms grace period) so the user
 * can move from trigger → panel without the panel closing under their cursor.
 *
 * State drives a `data-state="open" | "closed"` DOM attribute that
 * tailwindcss-animate utilities key off for enter/exit animations.
 *
 * Usage:
 *   <MegaMenu label="Product">
 *     <MegaMenuPanel widthClass="w-[640px]">
 *       <MegaMenuSection label="WHO IT'S FOR">
 *         <MegaMenuCard ... />
 *       </MegaMenuSection>
 *       <MegaMenuFooter primary={...} secondary={...} />
 *     </MegaMenuPanel>
 *   </MegaMenu>
 */

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Link, type LinkProps } from "@tanstack/react-router";
import { cn } from "@better-i18n/ui/lib/utils";
import { SpriteIcon } from "@/components/SpriteIcon";

// ─── Context ─────────────────────────────────────────────────────────

interface MegaMenuContext {
  open: boolean;
  onTriggerEnter: () => void;
  onTriggerLeave: () => void;
  onPanelEnter: () => void;
  onPanelLeave: () => void;
}

const Ctx = createContext<MegaMenuContext | null>(null);

function useMegaMenu() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("MegaMenu subcomponent used outside <MegaMenu>");
  return ctx;
}

// ─── Root ────────────────────────────────────────────────────────────

interface MegaMenuProps {
  label: string;
  children: ReactNode;
}

const CLOSE_DELAY_MS = 120;

export function MegaMenu({ label, children }: MegaMenuProps) {
  const [open, setOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  }, [cancelClose]);

  const onTriggerEnter = useCallback(() => {
    cancelClose();
    setOpen(true);
  }, [cancelClose]);

  const ctxValue: MegaMenuContext = {
    open,
    onTriggerEnter,
    onTriggerLeave: scheduleClose,
    onPanelEnter: cancelClose,
    onPanelLeave: scheduleClose,
  };

  return (
    <Ctx.Provider value={ctxValue}>
      <div className="relative">
        <MegaMenuTrigger label={label} />
        {children}
      </div>
    </Ctx.Provider>
  );
}

// ─── Trigger ─────────────────────────────────────────────────────────

function MegaMenuTrigger({ label }: { label: string }) {
  const { open, onTriggerEnter, onTriggerLeave } = useMegaMenu();

  return (
    <button
      type="button"
      aria-haspopup="true"
      aria-expanded={open}
      onMouseEnter={onTriggerEnter}
      onMouseLeave={onTriggerLeave}
      onFocus={onTriggerEnter}
      onBlur={onTriggerLeave}
      className="inline-flex items-center gap-1 text-sm/7 font-medium text-mist-950 hover:text-mist-600"
      data-state={open ? "open" : "closed"}
    >
      {label}
      <SpriteIcon
        name="chevron-bottom"
        className={cn(
          "w-4 h-4 text-mist-600 transition-transform duration-200",
          open && "rotate-180 text-mist-950",
        )}
      />
    </button>
  );
}

// ─── Panel ───────────────────────────────────────────────────────────

interface MegaMenuPanelProps {
  /** Tailwind width class (e.g., "w-[640px]") */
  widthClass?: string;
  children: ReactNode;
}

export function MegaMenuPanel({
  widthClass = "w-[640px]",
  children,
}: MegaMenuPanelProps) {
  const { open, onPanelEnter, onPanelLeave } = useMegaMenu();

  // Single-layer panel (no nested borders). Children inherit our data-state
  // via `group-data-[state=open]:*` selectors so each item can stagger in.
  return (
    <div
      data-state={open ? "open" : "closed"}
      onMouseEnter={onPanelEnter}
      onMouseLeave={onPanelLeave}
      className={cn(
        "group/panel absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50",
        open ? "pointer-events-auto" : "pointer-events-none",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-1 data-[state=open]:duration-200",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-top-1 data-[state=closed]:duration-150",
        !open && "opacity-0",
      )}
    >
      <div
        className={cn(
          // Single white panel — strong layered shadow + faint top highlight
          // simulates depth without a second visible border ring.
          "bg-white rounded-2xl border border-mist-200 overflow-hidden",
          "shadow-[0_1px_0_0_rgba(255,255,255,0.5)_inset,0_24px_64px_-24px_rgba(15,23,42,0.22),0_8px_24px_-12px_rgba(15,23,42,0.08)]",
          widthClass,
        )}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────

interface MegaMenuSectionProps {
  label?: string;
  /** Removes the divider above this section */
  noDivider?: boolean;
  /** Tailwind class for inner item layout (e.g., "grid grid-cols-2 gap-1") */
  layoutClass?: string;
  children: ReactNode;
}

/**
 * Stagger animation — runs on each direct child of the inner grid.
 * Drives off the panel's data-state via `group/panel` — re-fires every
 * time the panel reopens because Tailwind only injects animation
 * properties when `data-state="open"` is active.
 *
 * Timing: 300ms duration + 30ms stagger = items wave in over ~450ms total.
 * `fill-mode-both` keeps items at opacity-0 during the delay so they don't
 * flash into view before their turn.
 */
const STAGGER_CHILD =
  "[&>*]:opacity-0 " +
  "[&>*]:group-data-[state=open]/panel:animate-in " +
  "[&>*]:group-data-[state=open]/panel:fade-in-0 " +
  "[&>*]:group-data-[state=open]/panel:slide-in-from-top-1 " +
  "[&>*]:group-data-[state=open]/panel:duration-300 " +
  "[&>*]:group-data-[state=open]/panel:fill-mode-both " +
  "[&>*:nth-child(1)]:[animation-delay:40ms] " +
  "[&>*:nth-child(2)]:[animation-delay:70ms] " +
  "[&>*:nth-child(3)]:[animation-delay:100ms] " +
  "[&>*:nth-child(4)]:[animation-delay:130ms] " +
  "[&>*:nth-child(5)]:[animation-delay:160ms] " +
  "[&>*:nth-child(6)]:[animation-delay:190ms]";

export function MegaMenuSection({
  label,
  noDivider,
  layoutClass,
  children,
}: MegaMenuSectionProps) {
  return (
    <div
      className={cn(
        "px-3 py-3",
        !noDivider && "border-t border-mist-100 first:border-t-0",
      )}
    >
      {label && (
        <p
          className={cn(
            "px-1 mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-mist-500",
            // Label fades in just before its items start cascading
            "opacity-0 group-data-[state=open]/panel:animate-in group-data-[state=open]/panel:fade-in-0 group-data-[state=open]/panel:duration-200 group-data-[state=open]/panel:fill-mode-both",
          )}
        >
          {label}
        </p>
      )}
      <div className={cn(layoutClass, STAGGER_CHILD)}>{children}</div>
    </div>
  );
}

// ─── Card (persona / featured item) ──────────────────────────────────

interface MegaMenuCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const cardClassName =
  "group/card flex items-start gap-3 p-3 rounded-lg hover:bg-mist-50 transition-colors";

function CardInner({ icon, title, description }: MegaMenuCardProps) {
  return (
    <>
      <div
        className={cn(
          // Base — soft inset gradient that reads as "raised" without a hard border
          "flex-shrink-0 size-11 rounded-xl flex items-center justify-center text-mist-700",
          "bg-gradient-to-br from-mist-50 to-white border border-mist-200",
          "shadow-[0_1px_0_rgba(15,23,42,0.04)]",
          // Smooth multi-property transition
          "transition-[transform,box-shadow,background,border-color,color] duration-300 ease-out",
          // Hover — gradient flips, border darkens, icon container lifts slightly
          "group-hover/card:from-white group-hover/card:to-mist-50",
          "group-hover/card:border-mist-300 group-hover/card:text-mist-950",
          "group-hover/card:shadow-[0_6px_16px_-6px_rgba(15,23,42,0.18)]",
          "group-hover/card:scale-[1.04] group-hover/card:-rotate-1",
        )}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-mist-950 transition-transform duration-200 group-hover/card:translate-x-0.5">
            {title}
          </span>
          <SpriteIcon
            name="arrow-right"
            className="size-3 text-mist-400 -translate-x-1 opacity-0 transition-all duration-200 group-hover/card:translate-x-0 group-hover/card:opacity-100 group-hover/card:text-mist-700"
          />
        </div>
        <div className="text-xs text-mist-600 leading-relaxed mt-0.5">
          {description}
        </div>
      </div>
    </>
  );
}

/**
 * Internal navigation card — wraps TanStack Router `<Link>`.
 *
 * Note: We loosen `to`/`params` typing because TanStack Router's strict
 * path-derived param types can't survive Pick<>. Consumers are still type-
 * checked at the Link's own use site if they import LinkProps directly.
 */
type InternalLinkProps = {
  to: LinkProps["to"];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: Record<string, any>;
};

export function MegaMenuCard(props: MegaMenuCardProps & InternalLinkProps) {
  const { icon, title, description, to, params } = props;
  return (
    <Link
      to={to}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      params={params as any}
      className={cardClassName}
    >
      <CardInner icon={icon} title={title} description={description} />
    </Link>
  );
}

/**
 * External link card — wraps a plain `<a>` (e.g., for cal.com, docs.).
 */
export function MegaMenuCardExternal(
  props: MegaMenuCardProps & {
    href: string;
    target?: string;
    rel?: string;
  },
) {
  const { icon, title, description, href, target, rel } = props;
  return (
    <a href={href} target={target} rel={rel} className={cardClassName}>
      <CardInner icon={icon} title={title} description={description} />
    </a>
  );
}

// ─── Pill (compact item) ─────────────────────────────────────────────

interface MegaMenuPillProps {
  icon: ReactNode;
  label: string;
}

const pillClassName =
  "group/pill flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-mist-50 transition-colors";

function PillInner({ icon, label }: MegaMenuPillProps) {
  return (
    <>
      <span
        className={cn(
          "flex size-7 items-center justify-center rounded-md text-mist-700",
          "bg-mist-50 border border-mist-200",
          "transition-[transform,background,border-color,color] duration-200 ease-out",
          "group-hover/pill:bg-white group-hover/pill:border-mist-300 group-hover/pill:text-mist-950",
          "group-hover/pill:scale-[1.08]",
        )}
      >
        {icon}
      </span>
      <span className="flex-1 text-sm font-medium text-mist-800 group-hover/pill:text-mist-950 transition-colors">
        {label}
      </span>
      <SpriteIcon
        name="arrow-right"
        className="size-3 text-mist-400 -translate-x-1 opacity-0 transition-all duration-200 group-hover/pill:translate-x-0 group-hover/pill:opacity-100 group-hover/pill:text-mist-700"
      />
    </>
  );
}

export function MegaMenuPill(props: MegaMenuPillProps & InternalLinkProps) {
  const { icon, label, to, params } = props;
  return (
    <Link
      to={to}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      params={params as any}
      className={pillClassName}
    >
      <PillInner icon={icon} label={label} />
    </Link>
  );
}

export function MegaMenuPillExternal(
  props: MegaMenuPillProps & { href: string; target?: string; rel?: string },
) {
  const { icon, label, href, target, rel } = props;
  return (
    <a href={href} target={target} rel={rel} className={pillClassName}>
      <PillInner icon={icon} label={label} />
    </a>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────

interface MegaMenuFooterProps {
  primary: ReactNode;
  secondary?: ReactNode;
}

export function MegaMenuFooter({ primary, secondary }: MegaMenuFooterProps) {
  return (
    <div className="px-4 py-3 border-t border-mist-100 bg-mist-50/40 flex items-center justify-between gap-4">
      <div className="text-sm font-medium text-mist-950">{primary}</div>
      {secondary && (
        <div className="text-sm text-mist-600">{secondary}</div>
      )}
    </div>
  );
}
