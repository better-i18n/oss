import { SpriteIcon } from "@/components/SpriteIcon";
import { NAV_ITEMS, type Workspace } from "./data";
import { Avatar } from "./atoms";

/**
 * Left rail: workspace/project switcher, section nav, usage, signed-in user.
 * Hidden under 900px — at that width the key table is the only pane that
 * still carries meaning, and a 200px rail would eat half of it.
 *
 * Section names and order mirror the real dashboard (see NAV_ITEMS).
 */

export function Sidebar({ workspace }: { workspace: Workspace }) {

  return (
    <div
      className="flex w-[200px] shrink-0 flex-col border-r border-black/[0.06] bg-mist-50 max-[900px]:hidden"
    >
      {/* Workspace + project switcher — cycles through customer projects */}
      <div className="flex h-[52px] shrink-0 items-center gap-2 border-b border-black/[0.05] px-3">
        {workspace.mark ? (
          <Avatar src={workspace.mark} initials={workspace.initials} size={24} />
        ) : (
          <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-mist-900 text-[11px] font-medium text-white">
            {workspace.initials}
          </span>
        )}
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-[12px] font-medium tracking-[-0.01em] text-mist-900">
            {workspace.name}
          </span>
          <span className="truncate font-mono text-[10px] text-mist-400">
            {workspace.project}
          </span>
        </span>
        <SpriteIcon
          name="chevron-bottom"
          className="ml-auto size-3 shrink-0 text-mist-400"
        />
      </div>

      {/* Sections */}
      <div className="flex flex-1 flex-col gap-0.5 px-2 py-3">
        {NAV_ITEMS.map((item) => (
          <div
            key={item.label}
            className={`flex h-8 items-center gap-2 rounded-md px-2 text-[13px] ${
              item.active
                ? "bg-black/[0.06] font-medium text-mist-900"
                : "text-mist-600"
            }`}
          >
            <SpriteIcon
              name={item.icon}
              className={`size-4 shrink-0 ${item.active ? "text-mist-900" : "text-mist-400"}`}
            />
            <span className="truncate">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Usage card — what the real sidebar puts above the user row
          (SidebarUsageCard). The product's version turns amber/rose near the
          limit; this one stays neutral, because an alarm state in a marketing
          hero would be telling the wrong story about the free tier. */}
      <div className="shrink-0 px-2 pb-1">
        <div className="rounded-lg bg-black/[0.03] px-2.5 py-2">
          <p className="text-[11px] leading-relaxed text-mist-600">
            <span className="font-medium tabular-nums text-mist-900">1500/5000</span> keys{" "}
            <span className="text-[10px] text-mist-400">(30%)</span>
          </p>
          <span className="mt-0.5 inline-block text-[10px] font-medium text-mist-700 underline underline-offset-2">
            Upgrade
          </span>
        </div>
      </div>

      {/* Signed-in user — avatar + name + email, exactly like HeaderUserMenu in
          the dashboard's sidebar footer. It does not show a role there, so it
          does not show one here either. */}
      <div className="flex shrink-0 items-center gap-2 border-t border-black/[0.05] px-3 py-2.5">
        <Avatar src="/team/ali-osman.jpg" initials="AO" size={24} title="Ali Osman" />
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-[12px] font-medium text-mist-900">
            Ali Osman
          </span>
          <span className="truncate text-[10px] text-mist-400">
            osman@better-i18n.com
          </span>
        </span>
        <SpriteIcon
          name="chevron-right"
          className="ml-auto size-3 shrink-0 text-mist-400"
        />
      </div>
    </div>
  );
}
