import type { ReactNode } from "react";

/**
 * The blog grid container.
 *
 * Cells draw their own top/left rules and the inner grid is shifted -1px up/left,
 * so the leading rules land outside the clip and disappear — the pattern survives
 * every column-count change without nth-child math.
 *
 * There is no border on this container. It used to carry
 * `rounded-xl border border-black/[0.07]`, which framed a grid whose cells are
 * already hairlined: measured on `/en/blog/`, a card in the top-left read 1px of
 * container border plus its own 1px top and left rule. Two frames around one
 * thing is rule/one-container, and the outer one is the one that goes.
 *
 * `overflow-hidden` stays — it is the clip, not a frame. Without it the -1px
 * shift stops hiding the first row's top rule and the first column's left rule,
 * and the grid grows an edge on two sides only.
 *
 * NOT <FeatureGrid>, and this is the reason: that primitive bleeds the grid a
 * full cell-inset to the left (`-(inset + 1px)`) and relies on every child
 * carrying `.feat-cell`, whose matching padding puts the content back on the
 * measure. The children here arrive from the caller as finished cards with
 * their own padding, so the bleed shifted them 29px left with nothing to
 * compensate and the clip ate the first column's avatars and first characters.
 * A 1px shift is all this grid needs, because its cells own their rules.
 */
export function BlogGrid({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden bg-white">
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
