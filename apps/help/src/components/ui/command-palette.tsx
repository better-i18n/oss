import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useT } from "@/lib/i18n";
import {
  IconQuickSearch,
  IconArrowUp,
  IconArrowDown,
  IconArrowCornerDownLeft,
  IconCrossMedium,
  IconPin,
  IconHistory,
  IconSquareArrowTopRight,
  IconChevronRight,
  IconLoader,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

// ─── Utility ────────────────────────────────────────────────────────

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

// ─── Types ──────────────────────────────────────────────────────────

export type CommandItem = {
  id: string;
  label: string;
  groupId: string;
  subtitle?: string;
  href?: string;
  icon?: React.ReactNode;
  shortcut?: string[];
  pinned?: boolean;
  disabled?: boolean;
  keywords?: string[];
  onAction?: () => void;
};

export type CommandSource = {
  id: string;
  label: string;
  fetch: (query: string) => Promise<CommandItem[]> | CommandItem[];
  minQuery?: number;
};

type RecentEntry = Pick<CommandItem, "id" | "label" | "groupId" | "href" | "shortcut">;

export type CommandPaletteProps = {
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  sources: CommandSource[];
  placeholder?: string;
  storageKey?: string;
  showRecents?: boolean;
  maxRecents?: number;
  showPinnedFirst?: boolean;
  className?: string;
  debounceMs?: number;
  onItemExecuted?: (item: CommandItem) => void;
  renderItem?: (item: CommandItem, active: boolean) => React.ReactNode;
  portalContainer?: HTMLElement | null;
};

const DEFAULT_STORAGE_KEY = "help:cmd:recents";
const DEFAULT_DEBOUNCE = 120;
const DEFAULT_MAX_RECENTS = 8;

// ─── Fuzzy scoring ──────────────────────────────────────────────────

function fuzzyScore(query: string, text: string, keywords: string[] = []) {
  const q = query.trim().toLowerCase();
  const t = text.toLowerCase();
  if (!q) return { score: 0, indices: [] as number[] };

  let score = 0;
  const indices: number[] = [];

  const idx = t.indexOf(q);
  if (idx >= 0) {
    score += 100 + Math.max(0, 20 - idx);
    for (let i = 0; i < q.length; i++) indices.push(idx + i);
  } else {
    let tPos = 0;
    let chain = 0;
    for (let i = 0; i < q.length; i++) {
      const found = t.indexOf(q[i], tPos);
      if (found === -1) {
        score -= 5;
      } else {
        indices.push(found);
        if (found === tPos) chain += 2;
        else chain = 0;
        score += 2 + chain;
        tPos = found + 1;
        if (found === 0 || /\s|-|_|\/|\./.test(text[found - 1])) score += 3;
      }
    }
  }

  for (const k of keywords) {
    const kk = k.toLowerCase();
    if (kk.includes(q) || q.includes(kk)) score += 8;
  }

  return { score, indices: Array.from(new Set(indices)).sort((a, b) => a - b) };
}

// ─── Hooks ──────────────────────────────────────────────────────────

function useDebouncedValue<T>(value: T, delay = DEFAULT_DEBOUNCE) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

// ─── Component ──────────────────────────────────────────────────────

export function CommandPalette({
  open: controlledOpen,
  onOpenChange,
  sources,
  placeholder,
  storageKey = DEFAULT_STORAGE_KEY,
  showRecents = true,
  maxRecents = DEFAULT_MAX_RECENTS,
  showPinnedFirst = true,
  className,
  debounceMs = DEFAULT_DEBOUNCE,
  onItemExecuted,
  renderItem,
  portalContainer,
}: CommandPaletteProps) {
  const t = useT("common");
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const open = controlledOpen ?? uncontrolledOpen;

  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebouncedValue(query, debounceMs);

  const [loadingIds, setLoadingIds] = React.useState<Set<string>>(new Set());
  const [results, setResults] = React.useState<Record<string, CommandItem[]>>({});
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const listRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // Recents
  const [recents, setRecents] = React.useState<RecentEntry[]>([]);
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setRecents(JSON.parse(raw));
    } catch { /* localStorage parse failure — non-critical */ }
  }, [storageKey]);

  function setOpen(v: boolean) {
    if (controlledOpen === undefined) setUncontrolledOpen(v);
    onOpenChange?.(v);
  }

  // Fetch per source
  React.useEffect(() => {
    let cancelled = false;

    async function go() {
      const q = debouncedQuery;
      const nextResults: Record<string, CommandItem[]> = {};

      for (const src of sources) {
        if (q.length < (src.minQuery ?? 0)) {
          nextResults[src.id] = [];
          continue;
        }

        setLoadingIds(prev => {
          const copy = new Set(prev);
          copy.add(src.id);
          return copy;
        });

        try {
          const raw = await src.fetch(q);
          nextResults[src.id] = Array.isArray(raw) ? raw : [];
        } catch {
          nextResults[src.id] = [];
        } finally {
          setLoadingIds(prev => {
            const copy = new Set(prev);
            copy.delete(src.id);
            return copy;
          });
        }
      }

      if (!cancelled) {
        setResults(nextResults);
        setActiveId(null);
      }
    }

    go();
    return () => { cancelled = true; };
  }, [debouncedQuery, sources]);

  // Compute visible items
  const groups = React.useMemo(() => {
    const q = debouncedQuery.trim();
    const out: Array<{
      id: string;
      label: string;
      items: Array<CommandItem & { _score: number; _indices: number[] }>;
    }> = [];

    const sourceById = new Map(sources.map(s => [s.id, s]));
    const pinned: CommandItem[] = [];

    for (const [sid, items] of Object.entries(results)) {
      const srcMeta = sourceById.get(sid);
      if (!srcMeta) continue;
      let arr = (items ?? []).map(item => {
        const { score, indices } = fuzzyScore(q, item.label, item.keywords ?? []);
        return { ...item, _score: q ? score : 0, _indices: q ? indices : [] };
      });

      if (!q && showPinnedFirst) {
        for (const it of arr) if (it.pinned && !it.disabled) pinned.push(it);
        arr = arr.filter(i => !i.pinned);
      }

      if (q) arr.sort((a, b) => b._score - a._score || a.label.localeCompare(b.label));
      else arr.sort((a, b) => a.label.localeCompare(b.label));

      out.push({ id: sid, label: srcMeta.label, items: arr });
    }

    const finalGroups: typeof out = [];

    if (!debouncedQuery && showPinnedFirst && pinned.length) {
      finalGroups.push({
        id: "__pinned",
        label: t("commandPalette.groupPinned"),
        items: pinned.map(p => ({ ...p, _score: 0, _indices: [] })),
      });
    }

    if (!debouncedQuery && showRecents && recents.length) {
      finalGroups.push({
        id: "__recents",
        label: t("commandPalette.groupRecent"),
        items: recents.map(r => ({
          id: r.id,
          label: r.label,
          subtitle: t("commandPalette.recentlyViewed"),
          groupId: r.groupId,
          href: r.href,
          shortcut: r.shortcut,
          _score: 0,
          _indices: [],
        })),
      });
    }

    finalGroups.push(...out);
    return finalGroups;
  }, [results, sources, debouncedQuery, showPinnedFirst, showRecents, recents]);

  const flatItems = React.useMemo(() => groups.flatMap(g => g.items), [groups]);

  const activeIndex = React.useMemo(() => {
    if (!activeId) return -1;
    return flatItems.findIndex(i => i.id === activeId);
  }, [activeId, flatItems]);

  function moveActive(delta: number) {
    if (!flatItems.length) return;
    let next = activeIndex + delta;
    if (next < 0) next = flatItems.length - 1;
    if (next >= flatItems.length) next = 0;
    setActiveId(flatItems[next].id);
    const node = listRef.current?.querySelector<HTMLElement>(`[data-id="${flatItems[next].id}"]`);
    node?.scrollIntoView({ block: "nearest" });
  }

  function execute(item: CommandItem) {
    try {
      const entry: RecentEntry = {
        id: item.id,
        label: item.label,
        groupId: item.groupId,
        href: item.href,
        shortcut: item.shortcut,
      };
      const next = [entry, ...recents.filter(r => r.id !== entry.id)].slice(0, maxRecents);
      setRecents(next);
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch { /* recents save failure — non-critical */ }

    item.onAction?.();
    if (item.href) {
      if (item.href.startsWith("http")) window.open(item.href, "_blank", "noopener");
      else window.location.href = item.href;
    }
    onItemExecuted?.(item);
    setOpen(false);
  }

  // Focus input on open
  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 10);
    } else {
      setQuery("");
      setActiveId(null);
    }
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal container={portalContainer ?? undefined}>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm data-[state=open]:animate-[cmd-overlay-in_150ms_ease-out] data-[state=closed]:animate-[cmd-overlay-out_100ms_ease-in]" />
        <Dialog.Content
          aria-label="Command palette"
          className={cn(
            "fixed z-[101] inset-x-2 top-16 mx-auto w-[min(640px,100%-16px)] rounded-xl border border-mist-200 bg-[var(--color-card)] shadow-2xl shadow-mist-950/10",
            "data-[state=open]:animate-[cmd-content-in_200ms_ease-out] data-[state=closed]:animate-[cmd-content-out_150ms_ease-in]",
            "outline-none",
          )}
        >
          {/* Search header */}
          <div className="flex items-center gap-2 border-b border-mist-100 px-3 py-2.5">
            <IconQuickSearch className="size-4 shrink-0 text-mist-400" />
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded="true"
              aria-controls="cmd-listbox"
              aria-activedescendant={activeId ? `cmd-item-${activeId}` : undefined}
              placeholder={placeholder ?? t("commandPalette.placeholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") { e.preventDefault(); moveActive(1); }
                else if (e.key === "ArrowUp") { e.preventDefault(); moveActive(-1); }
                else if (e.key === "Enter") { e.preventDefault(); if (activeIndex >= 0) execute(flatItems[activeIndex]); }
              }}
              className="flex-1 bg-transparent text-sm text-mist-950 outline-none placeholder:text-mist-400"
            />
            <kbd className="hidden rounded-md border border-mist-200 bg-mist-50 px-1.5 py-0.5 text-[10px] font-medium text-mist-400 sm:inline">
              ESC
            </kbd>
            <Dialog.Close asChild>
              <button
                aria-label="Close"
                className="cursor-pointer rounded-md p-1 text-mist-400 transition-colors hover:bg-mist-100 hover:text-mist-600"
              >
                <IconCrossMedium className="size-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Results body */}
          <div
            id="cmd-listbox"
            role="listbox"
            aria-label="Search results"
            className={cn("max-h-[60vh] overflow-auto p-1.5", className)}
            ref={listRef}
          >
            {/* Loading indicator */}
            {loadingIds.size > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 text-xs text-mist-400">
                <IconLoader className="size-3 animate-spin" />
                {t("commandPalette.searching")}
              </div>
            )}

            {/* Groups */}
            {groups.map((g) => (
              <div key={g.id} className="py-0.5">
                {g.items.length > 0 && (
                  <div className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-mist-400">
                    {g.label}
                  </div>
                )}
                <div className="flex flex-col gap-0.5">
                  {g.items.map((item) => {
                    const active = item.id === activeId;
                    return (
                      <button
                        key={item.id}
                        id={`cmd-item-${item.id}`}
                        data-id={item.id}
                        role="option"
                        aria-selected={active}
                        disabled={item.disabled}
                        onMouseEnter={() => setActiveId(item.id)}
                        onFocus={() => setActiveId(item.id)}
                        onClick={() => !item.disabled && execute(item)}
                        className={cn(
                          "group flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                          active ? "bg-mist-100 text-mist-950" : "text-mist-700 hover:bg-mist-50",
                          item.disabled && "!cursor-not-allowed opacity-50",
                        )}
                      >
                        {renderItem ? renderItem(item, active) : (
                          <>
                            <div className="shrink-0 text-mist-400 group-aria-selected:text-mist-700">
                              {item.icon ?? <IconQuickSearch className="size-4" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="truncate">
                                {renderHighlighted(item.label, (item as ScoredItem)._indices)}
                              </div>
                              {item.subtitle && (
                                <div className="truncate text-xs text-mist-400 group-aria-selected:text-mist-500">
                                  {item.subtitle}
                                </div>
                              )}
                            </div>
                            {item.pinned && <IconPin className="size-3.5 text-mist-300" />}
                            {item.href && <IconSquareArrowTopRight className="size-3.5 text-mist-300" />}
                            {item.shortcut && (
                              <span className="ml-1 hidden items-center gap-1 text-[10px] text-mist-400 sm:flex">
                                {item.shortcut.map((s, i) => (
                                  <kbd key={i} className="rounded border border-mist-200 bg-mist-50 px-1 py-0.5">
                                    {s}
                                  </kbd>
                                ))}
                              </span>
                            )}
                            <IconChevronRight className="ml-0.5 size-3.5 text-mist-300 opacity-0 transition-opacity group-hover:opacity-100" />
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
                {g.items.length === 0 && debouncedQuery && (
                  <div className="px-3 py-2 text-xs text-mist-400">
                    {t("commandPalette.noMatchesIn", { group: g.label })}
                  </div>
                )}
              </div>
            ))}

            {/* Empty state */}
            {flatItems.length === 0 && !loadingIds.size && (
              <div className="px-3 py-10 text-center text-sm text-mist-400">
                <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-mist-100">
                  <IconHistory className="size-5 text-mist-400" />
                </div>
                {debouncedQuery
                  ? t("commandPalette.noResultsFor", { query: debouncedQuery })
                  : t("commandPalette.startTyping")}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-4 border-t border-mist-100 px-3 py-2 text-[11px] text-mist-400">
            <span className="flex items-center gap-1">
              <IconArrowCornerDownLeft className="size-3" /> {t("commandPalette.hintSelect")}
            </span>
            <span className="flex items-center gap-1">
              <IconArrowUp className="size-3" />
              <IconArrowDown className="size-3" /> {t("commandPalette.hintNavigate")}
            </span>
            <span className="hidden items-center gap-1 sm:flex">
              <kbd className="rounded border border-mist-200 bg-mist-50 px-1 py-0.5 text-[9px]">ESC</kbd> {t("commandPalette.hintClose")}
            </span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ─── Highlight helper ───────────────────────────────────────────────

type ScoredItem = CommandItem & { _indices?: number[] };

function renderHighlighted(label: string, indices?: number[]) {
  if (!indices?.length) return label;

  const out: React.ReactNode[] = [];
  for (let pos = 0; pos < label.length; pos++) {
    if (indices.includes(pos)) {
      let run = label[pos];
      let p = pos + 1;
      while (indices.includes(p) && p < label.length) { run += label[p]; p++; }
      out.push(
        <mark key={`m-${pos}`} className="rounded-sm bg-amber-100 px-0.5 text-inherit">
          {run}
        </mark>
      );
      pos = p - 1;
    } else {
      out.push(<React.Fragment key={`t-${pos}`}>{label[pos]}</React.Fragment>);
    }
  }
  return out;
}
