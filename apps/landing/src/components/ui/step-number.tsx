/**
 * StepNumber — the index marker for any ordered sequence on the site.
 *
 * One treatment: a bordered `mist-50` square holding a two-digit tabular
 * number. Bordered rather than a filled dark disc, because a disc reads as a
 * badge — a thing with a status — while a sequence is just an index
 * (`rule/step-numbers-are-one-marker`). Two digits always, so "9 → 10" does not
 * change the marker's width mid-list.
 *
 * It replaced four different renderings of the same idea: this bordered box in
 * `MigrationSection`, a 10px `mist-300` bare number in `ProcessCompare` and the
 * integration setup list, an 11px `mist-400` bare number on five more pages, and
 * a monospace `mist-400` one in the SEO guides. Every one of them was written
 * inline at the call site, so "the step marker" had no single definition to
 * change.
 *
 * Deliberately no size or tone prop: a step marker is not restyled per surface,
 * the same reason `GuideMark` takes none. A surface that cannot fit it is the
 * thing that is wrong.
 *
 * Not a list item and not a layout: it renders one inline-flex span and nothing
 * else, so it drops into the `<li>`, grid cell or flex row the caller already
 * has (`rule/listed-items-are-not-cards` — the marker never brings a card with
 * it).
 *
 * `aria-hidden` on purpose, and this is the opposite call from `SupportMark`.
 * A support mark is a glyph that IS the cell's content, so it needs a name; a
 * step number restates ordering that the markup already carries — several of
 * these lists are a real `<ol>`, where a screen reader announces the position
 * itself and a spoken "01" before every title is duplication. The step's title
 * and description are the content.
 */
export function StepNumber({ n }: { n: number | string }) {
  /* Callers pass either a 1-based index or data that already reads "01". Both
     normalise here so the two-digit rule holds without every call site
     remembering to pad. */
  const label = String(n).padStart(2, "0");

  return (
    <span
      aria-hidden="true"
      className="flex size-6 shrink-0 items-center justify-center rounded-md border border-black/[0.06] bg-mist-50 text-[11px] font-medium tabular-nums text-mist-600"
    >
      {label}
    </span>
  );
}
