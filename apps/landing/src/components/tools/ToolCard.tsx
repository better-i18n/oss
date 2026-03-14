/** Card component for the Tools Hub grid. Links to individual tool pages. */

import { Link } from "@tanstack/react-router";
import type { ToolMeta } from "@/lib/tools/types";

interface ToolCardProps {
  readonly tool: ToolMeta;
  readonly locale: string;
}

export function ToolCard({ tool, locale }: ToolCardProps) {
  return (
    <Link
      to={`/$locale/${tool.href}` as never}
      params={{ locale }}
      className="group block rounded-2xl border border-mist-200 bg-white p-6 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      aria-label={tool.fallbackTitle}
    >
      <div className="mb-4 flex size-11 items-center justify-center rounded-xl border border-mist-100 bg-mist-50 text-mist-700 shadow-sm">
        {tool.icon}
      </div>
      <h3 className="font-display text-lg/[1.3] font-medium text-mist-950 mb-2">
        {tool.fallbackTitle}
      </h3>
      <p className="text-sm/6 text-mist-600">{tool.fallbackDescription}</p>
      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-mist-700 group-hover:text-mist-950 transition-colors">
        Try it free
        <span className="transition-transform group-hover:translate-x-0.5">→</span>
      </div>
    </Link>
  );
}
