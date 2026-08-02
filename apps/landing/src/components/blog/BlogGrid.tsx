import type { ReactNode } from "react";

/**
 * The blog grid container.
 *
 * One clipped hairline box holding N cells — the same shape FrameworkSupport and
 * Alternatives use. Cells draw their own top/left rules and the inner grid is
 * shifted -1px up/left, so the leading rules are clipped by the container border
 * and the pattern survives every column-count change without nth-child math.
 */
export function BlogGrid({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-white">
      <div className="-mt-px -ml-px grid auto-rows-fr grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </div>
  );
}

/**
 * Empty / no-results state.
 *
 * No container: no box, no border, no fill, and no horizontal padding of its own
 * — the enclosing <Section> already supplies the gutter, so adding one here
 * double-indents the text against every other block on the page. An empty state
 * is a sentence and an exit, not a card; drawing a large bordered panel around
 * two lines of copy makes the absence of content look like a broken component.
 * Only vertical rhythm is set here.
 */
export function BlogEmptyState({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="py-2">
      <p className="text-[15px] font-medium tracking-[-0.015em] text-mist-900">{title}</p>
      <p className="mt-1.5 max-w-[46ch] text-[13px] leading-relaxed text-mist-600">
        {description}
      </p>
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}
