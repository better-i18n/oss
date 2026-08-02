import { SpriteIcon } from "@/components/SpriteIcon";
import { LocaleChip } from "./atoms";
import {
  MISSING_COUNT,
  NAMESPACES,
  SELECTED_KEY,
  STATUS_META,
  type Workspace,
} from "./data";

/**
 * Middle pane: toolbar → column header → namespace tree with key rows →
 * status bar.
 *
 * The row list deliberately overflows its clipped area (16 rows + 4 group
 * headers against ~508px) so the table ends mid-row the way a real scrollable
 * grid does. That is what keeps the 620px panel from ending in dead space —
 * padding it out with blank rows would read as an empty project.
 */
export function KeyTable({ workspace }: { workspace: Workspace }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      {/* Toolbar */}
      <div className="flex h-[52px] shrink-0 items-center gap-2 border-b border-black/[0.06] px-3">
        {/* Search */}
        <div className="flex h-7 w-full max-w-[220px] items-center gap-1.5 rounded-md border border-black/[0.08] bg-white px-2">
          <SpriteIcon name="magnifying-glass" className="size-3.5 shrink-0 text-mist-400" />
          <span className="truncate text-[12px] text-mist-400">Search keys…</span>
        </div>

        {/* Target locale */}
        <div className="flex h-7 shrink-0 items-center gap-1.5 rounded-md border border-black/[0.08] bg-white px-2">
          <LocaleChip locale="tr" />
          <span className="text-[12px] text-mist-700">Turkish</span>
          <SpriteIcon name="chevron-bottom" className="size-3 shrink-0 text-mist-400" />
        </div>

        {/* Active filter — matches the missing rows in the table exactly */}
        <div className="flex h-7 shrink-0 items-center gap-1.5 rounded-md border border-black/[0.08] bg-mist-50 px-2">
          <span aria-hidden className="size-1.5 rounded-full bg-mist-300" />
          <span className="text-[12px] text-mist-600">{MISSING_COUNT} missing</span>
        </div>

        <div className="ml-auto flex h-7 shrink-0 items-center gap-1.5 rounded-md bg-mist-900 px-2.5 text-[12px] font-medium text-white">
          Publish
        </div>
      </div>

      {/* Column header */}
      <div className="flex h-7 shrink-0 items-center gap-3 border-b border-black/[0.05] bg-mist-50 px-3 text-[10px] text-mist-400">
        <span className="w-[210px] shrink-0">Key</span>
        <span className="min-w-0 flex-1">Source · English</span>
        <span className="w-[92px] shrink-0">Status</span>
      </div>

      {/* Namespace tree + rows */}
      <div className="min-h-0 flex-1 overflow-hidden">
        {/* The active workspace's namespace leads the tree, so switching projects
            visibly changes what the table is showing rather than only relabelling
            the rail. */}
        {[...NAMESPACES].sort((a, b) =>
          a.name === workspace.namespace ? -1 : b.name === workspace.namespace ? 1 : 0,
        ).map((group) => (
          <div key={group.name}>
            {/* Namespace header */}
            <div className="flex h-[26px] items-center gap-1.5 border-b border-black/[0.04] bg-black/[0.015] px-3">
              <SpriteIcon name="chevron-bottom" className="size-3 shrink-0 text-mist-400" />
              <span className="font-mono text-[11px] font-medium text-mist-700">
                {group.name}
              </span>
              <span className="text-[10px] text-mist-400">
                {group.rows.length} keys
              </span>
            </div>

            {group.rows.map((row) => {
              const status = STATUS_META[row.status];
              const isSelected = row.key === SELECTED_KEY;

              return (
                <div
                  key={row.key}
                  className={`relative flex h-[30px] items-center gap-3 border-b border-black/[0.04] px-3 ${
                    isSelected ? "bg-black/[0.04]" : ""
                  }`}
                >
                  {isSelected && (
                    <span className="absolute inset-y-0 left-0 w-[2px] bg-mist-900" />
                  )}
                  <span
                    className={`w-[210px] shrink-0 truncate pl-3 font-mono text-[12px] ${
                      isSelected ? "text-mist-900" : "text-mist-700"
                    }`}
                  >
                    {row.key}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[12px] text-mist-600">
                    {row.source}
                  </span>
                  <span className="flex w-[92px] shrink-0 items-center gap-1.5">
                    <span aria-hidden className={`size-1.5 rounded-full ${status.dot}`} />
                    <span className={`text-[11px] ${status.text}`}>{status.label}</span>
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Status bar */}
      <div className="flex h-8 shrink-0 items-center gap-3 border-t border-black/[0.06] bg-mist-50 px-3">
        <span className="text-[11px] text-mist-500">
          52 keys · 9 locales · 88% coverage
        </span>
        <span className="ml-auto flex items-center gap-1.5 text-[11px] text-mist-400">
          <span aria-hidden className="size-1.5 rounded-full bg-emerald-500" />
          MCP connected · 12 tools
        </span>
      </div>
    </div>
  );
}
