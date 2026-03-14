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
      className="group flex h-full flex-col justify-between rounded-2xl border border-mist-200 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-mist-300 hover:shadow-md"
      aria-label={tool.fallbackTitle}
    >
      <div>
        <div className="mb-3 text-2xl" aria-hidden="true">
          {tool.icon}
        </div>
        <h3 className="text-base font-medium text-mist-950 group-hover:text-mist-800">
          {tool.fallbackTitle}
        </h3>
        <p className="mt-2 text-sm leading-6 text-mist-600">
          {tool.fallbackDescription}
        </p>
      </div>
      <div className="mt-5 flex items-center text-sm font-medium text-mist-700">
        <span>Open tool</span>
        <svg
          className="ml-2 h-4 w-4 text-mist-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-mist-600"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </Link>
  );
}
