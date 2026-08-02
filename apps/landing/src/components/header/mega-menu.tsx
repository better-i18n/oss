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
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Link, type LinkProps } from "@tanstack/react-router";
import { cn } from "@better-i18n/ui/lib/utils";
import { SpriteIcon } from "@/components/SpriteIcon";
import { IconArrowUpRight } from "@central-icons-react/round-outlined-radius-2-stroke-2";

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

  // Memoised: a fresh object here re-renders every panel item on each parent
  // render, and the panels hold dozens of rows.
  const ctxValue = useMemo<MegaMenuContext>(
    () => ({
      open,
      onTriggerEnter,
      onTriggerLeave: scheduleClose,
      onPanelEnter: cancelClose,
      onPanelLeave: scheduleClose,
    }),
    [open, onTriggerEnter, scheduleClose, cancelClose],
  );

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
      className="nav-link"
      data-state={open ? "open" : "closed"}
    >
      {label}
      <SpriteIcon
        name="chevron-bottom"
        className={cn("nav-chevron", open && "rotate-180")}
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
          // Single white panel on a hairline border. Depth comes from the
          // layered --shadow-dropdown, never from a heavier border or a ring.
          "overflow-hidden rounded-2xl border border-black/[0.08] bg-white",
          "shadow-[var(--shadow-dropdown)]",
          widthClass,
        )}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Split panel + rail ──────────────────────────────────────────────

/**
 * Two-column panel: primary content on the left, a tinted rail of secondary
 * links on the right.
 *
 * Why this exists: stacking a card section (icon tile + two-line description)
 * on top of a pill section (bare 13px row) put two densities in one panel, so
 * the same menu read as "one big area and one small one". The split makes the
 * hierarchy the *layout's* job — left column is the primary offer, right rail is
 * navigation — and lets every row inside the rail share one uniform density.
 */
export function MegaMenuSplit({
  children,
  railWidth = "300px",
}: {
  children: ReactNode;
  railWidth?: string;
}) {
  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: `minmax(0,1fr) ${railWidth}` }}
    >
      {children}
    </div>
  );
}

/** The tinted secondary column. Holds only <MegaMenuRailGroup> children. */
export function MegaMenuRail({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 border-l border-black/[0.06] bg-mist-50 px-3 py-4 max-lg:hidden">
      {children}
    </div>
  );
}

/** A labelled group of uniform rail rows. */
export function MegaMenuRailGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="mb-1.5 px-2 text-[11px] font-medium text-mist-400">{label}</p>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

const railRowClass =
  "group/rail flex items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors hover:bg-black/[0.04]";

function RailInner({ icon, label }: { icon?: ReactNode; label: string }) {
  return (
    <>
      {icon && (
        <span className="flex size-4 shrink-0 items-center justify-center text-mist-400 transition-colors group-hover/rail:text-mist-600">
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1 truncate text-[13px] text-mist-700 transition-colors group-hover/rail:text-mist-900">
        {label}
      </span>
    </>
  );
}

/** Rail row → internal route. One density for every secondary link. */
export function MegaMenuRailLink(
  props: { icon?: ReactNode; label: string } & InternalLinkProps,
) {
  const { icon, label, to, params } = props;
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Link to={to} params={params as any} className={railRowClass}>
      <RailInner icon={icon} label={label} />
    </Link>
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
 * Per-item stagger animation classes — applied DIRECTLY to each Card/Pill
 * (not via parent [&>*] selector, which doesn't compose with group-data-*
 * variants reliably in Tailwind JIT).
 *
 * Each item picks its delay from the array using its position index.
 * Re-fires on every open because Tailwind only injects animation properties
 * when data-state="open" is active on the panel.
 */
export const STAGGER_DELAYS = [
  "[animation-delay:40ms]",
  "[animation-delay:70ms]",
  "[animation-delay:100ms]",
  "[animation-delay:130ms]",
  "[animation-delay:160ms]",
  "[animation-delay:190ms]",
  "[animation-delay:220ms]",
  "[animation-delay:250ms]",
];

export const ITEM_ENTER =
  "group-data-[state=open]/panel:animate-in " +
  "group-data-[state=open]/panel:fade-in-0 " +
  "group-data-[state=open]/panel:slide-in-from-top-1 " +
  "group-data-[state=open]/panel:duration-300 " +
  "group-data-[state=open]/panel:fill-mode-both";

export function MegaMenuSection({
  label,
  noDivider,
  layoutClass,
  children,
}: MegaMenuSectionProps) {
  return (
    <div
      className={cn(
        "px-1.5 py-2",
        !noDivider && "border-t border-black/[0.06] first:border-t-0",
      )}
    >
      {label && (
        <p
          className={cn(
            // 11px, medium, subtle — no uppercase, no letter-spacing. Caps +
            // wide tracking read as a UI chrome label; this should read as quiet prose.
            "mb-2 px-3 text-[11px] font-medium text-mist-400",
            "group-data-[state=open]/panel:animate-in group-data-[state=open]/panel:fade-in-0 group-data-[state=open]/panel:duration-200 group-data-[state=open]/panel:fill-mode-both",
          )}
        >
          {label}
        </p>
      )}
      <div className={layoutClass}>{children}</div>
    </div>
  );
}

// ─── Card (persona / featured item) ──────────────────────────────────

interface MegaMenuCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  /**
   * Render the icon as-is instead of inside the tinted tile. Use for icons that
   * already carry their own shape and colour — product tiles, brand marks.
   */
  plainIcon?: boolean;
}

const cardClassName =
  "group/card flex items-start gap-3.5 rounded-xl p-3 transition-colors hover:bg-black/[0.03]";

function staggerClasses(index?: number) {
  if (index === undefined) return "";
  const delay = STAGGER_DELAYS[Math.min(index, STAGGER_DELAYS.length - 1)];
  return cn(ITEM_ENTER, delay);
}

function CardInner({ icon, title, description, plainIcon }: MegaMenuCardProps) {
  return (
    <>
      {plainIcon ? (
        <span className="shrink-0 pt-0.5">{icon}</span>
      ) : (
      <div
        className={cn(
          // Flat tinted tile on a hairline. No gradient, no lift, no rotation —
          // the row's own hover tint is the whole feedback.
          "flex size-10 flex-shrink-0 items-center justify-center rounded-[10px] text-mist-600",
          "border border-black/[0.06] bg-[var(--color-canvas)]",
          "transition-[background,border-color,color] duration-150",
          "group-hover/card:border-black/[0.08] group-hover/card:bg-[#ebebea] group-hover/card:text-mist-900",
        )}
      >
        {icon}
      </div>
      )}
      <div className="min-w-0 flex-1 pt-0.5">
        <span className="block text-sm font-medium leading-tight tracking-[-0.015em] text-mist-900">
          {title}
        </span>
        <div className="mt-1 text-[13px] leading-snug text-mist-400">
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
  /** Position in the stagger sequence (0-based). Optional — omit to skip stagger. */
  index?: number;
};

export function MegaMenuCard(props: MegaMenuCardProps & InternalLinkProps) {
  const { icon, title, description, plainIcon, to, params, index } = props;
  return (
    <Link
      to={to}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      params={params as any}
      className={cn(cardClassName, staggerClasses(index))}
    >
      <CardInner icon={icon} title={title} description={description} plainIcon={plainIcon} />
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
  const { icon, title, description, plainIcon, href, target, rel } = props;
  return (
    <a href={href} target={target} rel={rel} className={cardClassName}>
      <CardInner icon={icon} title={title} description={description} plainIcon={plainIcon} />
    </a>
  );
}

// ─── Pill (compact item) ─────────────────────────────────────────────

interface MegaMenuPillProps {
  icon: ReactNode;
  label: string;
  /**
   * Drop the tinted icon tile and show the glyph inline. Use when the icon is a
   * weak signal (generic industry/utility glyphs) — a tile promotes it to the
   * same weight as a product mark, which is exactly what it shouldn't have.
   */
  bareIcon?: boolean;
}

const pillClassName =
  "group/pill flex items-center gap-3 rounded-[10px] px-3 py-2.5 transition-colors hover:bg-black/[0.03]";

function PillInner({
  icon,
  label,
  external,
  bareIcon,
}: MegaMenuPillProps & { external?: boolean }) {
  return (
    <>
      {bareIcon ? (
        <span className="flex size-4 shrink-0 items-center justify-center text-mist-400 transition-colors group-hover/pill:text-mist-600">
          {icon}
        </span>
      ) : (
      <span
        className={cn(
          "flex size-7 items-center justify-center rounded-md text-mist-600",
          "border border-black/[0.06] bg-[var(--color-canvas)]",
          "transition-[background,border-color,color] duration-150",
          "group-hover/pill:border-black/[0.08] group-hover/pill:bg-[#ebebea] group-hover/pill:text-mist-900",
        )}
      >
        {icon}
      </span>
      )}
      <span className="flex-1 text-[13px] font-medium text-mist-700 transition-colors group-hover/pill:text-mist-900">
        {label}
      </span>
      {/* Only off-site links earn an affordance icon; internal ones stay quiet. */}
      {external && (
        <IconArrowUpRight className="size-3 -translate-y-0.5 translate-x-0.5 text-mist-400 opacity-0 transition-[opacity,transform,color] duration-200 group-hover/pill:translate-x-0 group-hover/pill:translate-y-0 group-hover/pill:opacity-100 group-hover/pill:text-mist-600" />
      )}
    </>
  );
}

export function MegaMenuPill(props: MegaMenuPillProps & InternalLinkProps) {
  const { icon, label, bareIcon, to, params, index } = props;
  return (
    <Link
      to={to}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      params={params as any}
      className={cn(pillClassName, staggerClasses(index))}
    >
      <PillInner icon={icon} label={label} bareIcon={bareIcon} />
    </Link>
  );
}

export function MegaMenuPillExternal(
  props: MegaMenuPillProps & {
    href: string;
    target?: string;
    rel?: string;
    /** Show external-link arrow on hover (good for off-site links) */
    external?: boolean;
    index?: number;
  },
) {
  const { icon, label, bareIcon, href, target, rel, external, index } = props;
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={cn(pillClassName, staggerClasses(index))}
    >
      <PillInner icon={icon} label={label} external={external} bareIcon={bareIcon} />
    </a>
  );
}

/**
 * Button variant of MegaMenuPill — for actions that don't navigate
 * (e.g., open in-page widget, copy to clipboard, toggle modal).
 */
export function MegaMenuPillButton(
  props: MegaMenuPillProps & { onClick: () => void; index?: number },
) {
  const { icon, label, bareIcon, onClick, index } = props;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(pillClassName, "text-left w-full", staggerClasses(index))}
    >
      <PillInner icon={icon} label={label} bareIcon={bareIcon} />
    </button>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────

interface MegaMenuFooterProps {
  primary: ReactNode;
  secondary?: ReactNode;
}

export function MegaMenuFooter({ primary, secondary }: MegaMenuFooterProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-black/[0.06] bg-mist-50 px-5 py-3.5">
      <div className="text-[13px] font-medium text-mist-600">{primary}</div>
      {secondary && <div className="text-[13px] text-mist-400">{secondary}</div>}
    </div>
  );
}
