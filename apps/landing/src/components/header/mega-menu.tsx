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

  // When closed we still render but mark data-state so exit animation runs.
  // After the animation duration the parent's open=false will already have
  // swapped state; we use `pointer-events-none` to neutralize closed panels
  // so they don't intercept clicks during the fade-out frame.
  return (
    <div
      data-state={open ? "open" : "closed"}
      onMouseEnter={onPanelEnter}
      onMouseLeave={onPanelLeave}
      className={cn(
        "absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50",
        // Visibility — when closed, panel should not block UI underneath
        open ? "pointer-events-auto" : "pointer-events-none",
        // Animation — drives off data-state, so enter+exit are both handled
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-1 data-[state=open]:duration-200",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-top-1 data-[state=closed]:duration-150",
        // Don't paint anything while idle-closed (skip first-render flash)
        !open && "opacity-0",
      )}
    >
      <div
        className={cn(
          "bg-mist-50 rounded-2xl border border-mist-200 p-2 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.25)]",
          widthClass,
        )}
      >
        <div className="bg-white rounded-xl border border-mist-200 shadow-sm overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────

interface MegaMenuSectionProps {
  label?: string;
  /** Removes the divider above this section */
  noDivider?: boolean;
  children: ReactNode;
}

export function MegaMenuSection({
  label,
  noDivider,
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
        <p className="px-1 mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-mist-500">
          {label}
        </p>
      )}
      {children}
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
      <div className="flex-shrink-0 size-11 rounded-xl bg-gradient-to-br from-mist-50 to-white border border-mist-200 shadow-[0_1px_0_rgba(15,23,42,0.04)] flex items-center justify-center text-mist-700 transition-all duration-200 group-hover/card:from-white group-hover/card:to-mist-50 group-hover/card:border-mist-300 group-hover/card:shadow-[0_4px_12px_-4px_rgba(15,23,42,0.12)]">
        {icon}
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-mist-950">{title}</span>
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
      <span className="flex size-7 items-center justify-center rounded-md bg-mist-50 border border-mist-200 text-mist-700 transition-colors group-hover/pill:bg-white group-hover/pill:border-mist-300 group-hover/pill:text-mist-950">
        {icon}
      </span>
      <span className="text-sm font-medium text-mist-800 group-hover/pill:text-mist-950 transition-colors">
        {label}
      </span>
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
