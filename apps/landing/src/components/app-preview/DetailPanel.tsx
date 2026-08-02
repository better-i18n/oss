import { SpriteIcon } from "@/components/SpriteIcon";
import { SELECTED_KEY } from "./data";
import { LocaleChip } from "./atoms";

/**
 * Right pane: the selected key's detail — source string, target-locale value,
 * the glossary term that constrains it, the AI proposal awaiting approval, and
 * when it last reached the CDN.
 *
 * That chain (source → glossary → AI proposal → approve → publish → CDN) is the
 * actual product loop, so the pane doubles as an explanation of it.
 */
export function DetailPanel() {
  return (
    <div className="flex w-[260px] shrink-0 flex-col border-l border-black/[0.06] max-[900px]:hidden">
      {/* Header */}
      <div className="flex h-[52px] shrink-0 flex-col justify-center gap-0.5 border-b border-black/[0.06] px-3">
        <span className="text-[10px] text-mist-400">Selected key</span>
        <span className="truncate font-mono text-[11px] font-medium text-mist-900">
          {SELECTED_KEY}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 px-3 py-3">
        {/* Source */}
        <div>
          <div className="mb-1.5 flex items-center gap-1.5">
            <LocaleChip locale="en" />
            <span className="text-[10px] text-mist-400">source</span>
          </div>
          <div className="rounded-md border border-black/[0.06] bg-mist-50 px-2.5 py-2 text-[12px] leading-[1.5] text-mist-700">
            Sign in to your account
          </div>
        </div>

        {/* Target locale value */}
        <div>
          <div className="mb-1.5 flex items-center gap-1.5">
            <LocaleChip locale="tr" />
            <span className="text-[10px] text-mist-400">translation</span>
            <span className="ml-auto text-[10px] text-mist-400">32 / 60</span>
          </div>
          <div className="rounded-md border border-black/[0.12] bg-white px-2.5 py-2 text-[12px] leading-[1.5] text-mist-900">
            Hesabınıza giriş yapın
            <span aria-hidden className="ml-px inline-block h-[13px] w-px translate-y-[2px] bg-mist-900" />
          </div>
        </div>

        {/* Glossary constraint */}
        <div className="flex items-start gap-1.5 rounded-md border border-black/[0.06] bg-mist-50 px-2.5 py-2">
          <span aria-hidden className="mt-[5px] size-1.5 shrink-0 rounded-full bg-amber-500" />
          <span className="text-[11px] leading-[1.45] text-mist-600">
            Glossary: <span className="text-mist-900">&ldquo;Sign in&rdquo;</span> must
            translate as <span className="text-mist-900">&ldquo;Giriş yap&rdquo;</span>
          </span>
        </div>

        {/* AI proposal */}
        <div className="rounded-md border border-black/[0.06] bg-white px-2.5 py-2">
          <div className="flex items-center gap-1.5">
            <SpriteIcon name="sparkles-soft" className="size-3.5 shrink-0 text-mist-700" />
            <span className="text-[11px] font-medium text-mist-900">AI suggestion</span>
            <span className="ml-auto text-[10px] text-mist-400">240ms</span>
          </div>
          <p className="mt-1.5 text-[12px] leading-[1.5] text-mist-700">
            Hesabınıza giriş yapın
          </p>
          <p className="mt-1 text-[10px] text-mist-400">
            glossary applied · brand tone · 3 locales queued
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="flex h-6 items-center rounded-md bg-mist-900 px-2 text-[11px] font-medium text-white">
              Approve
            </span>
            <span className="flex h-6 items-center rounded-md border border-black/[0.1] bg-white px-2 text-[11px] text-mist-700">
              Edit
            </span>
            <span className="ml-auto text-[10px] text-mist-400">2 of 4</span>
          </div>
        </div>

        {/* Recent activity — fills the remaining height instead of leaving a void */}
        <div className="mt-auto border-t border-black/[0.05] pt-2.5">
          <span className="text-[10px] text-mist-400">Activity</span>
          <div className="mt-1.5 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <SpriteIcon name="checkmark" className="size-3 shrink-0 text-mist-400" />
              <span className="truncate text-[11px] text-mist-600">
                AI proposed 12 keys
              </span>
              <span className="ml-auto shrink-0 text-[10px] text-mist-400">2m</span>
            </div>
            <div className="flex items-center gap-1.5">
              <SpriteIcon name="github" className="size-3 shrink-0 text-mist-400" />
              <span className="truncate text-[11px] text-mist-600">
                Synced from main
              </span>
              <span className="ml-auto shrink-0 text-[10px] text-mist-400">18m</span>
            </div>
          </div>
        </div>
      </div>

      {/* Publish state */}
      <div className="flex h-8 shrink-0 items-center gap-1.5 border-t border-black/[0.06] bg-mist-50 px-3">
        <span aria-hidden className="size-1.5 rounded-full bg-emerald-500" />
        <span className="truncate text-[11px] text-mist-500">
          published to CDN · 2m ago
        </span>
      </div>
    </div>
  );
}
