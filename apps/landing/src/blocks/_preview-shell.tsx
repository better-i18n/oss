import type { ReactNode } from "react";

export function PreviewShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-[#f8fafc] p-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(94,106,210,0.06), transparent 45%), radial-gradient(circle at 80% 80%, rgba(94,106,210,0.04), transparent 45%)",
        }}
      />
      <div className="relative w-full max-w-[340px] rounded-lg border border-[#e5e7eb] bg-white p-3 shadow-[0_8px_24px_-12px_rgba(15,15,15,0.12)]">
        <div className="flex items-center gap-1.5 border-b border-[#f1f5f9] pb-2">
          <span className="size-[6px] rounded-full bg-rose-400/60" />
          <span className="size-[6px] rounded-full bg-amber-400/60" />
          <span className="size-[6px] rounded-full bg-emerald-400/60" />
          <span className="ml-2 font-mono text-[9px] text-gray-400">{title}</span>
        </div>
        <div className="mt-2.5 space-y-1.5">{children}</div>
      </div>
    </div>
  );
}
