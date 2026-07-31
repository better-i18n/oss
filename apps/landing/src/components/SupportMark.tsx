/**
 * SupportMark — the one "does this product have it" mark on the site.
 *
 * It is the same 18px hairline tile as `BentoRow` in `ui/page.tsx`: a bordered
 * white square holding a 10px stroke. Three states, no colour:
 *
 *   yes     check, mist-700   the capability exists
 *   partial minus, mist-500   it exists with limits (see each table's note)
 *   no      minus, mist-300   we are not claiming it exists
 *
 * There is deliberately no red cross. A red X editorialises against the other
 * product; the comparison set is written to state what each side has, and the
 * absence of ink already reads as absence. Colour therefore carries no
 * information here, which also keeps the tables readable for anyone who cannot
 * separate red from green.
 *
 * Why its own module rather than living in ComparisonTable: the compare hub
 * renders a matrix of its own, and a shared mark that two files re-implement
 * stops being shared. Keeping the non-component helper (`markState`) next to the
 * component here also keeps ComparisonTable exporting components only.
 */

/** The three things a comparison cell can say about a capability. */
export type MarkState = "yes" | "no" | "partial";

/**
 * Matrix data arrives either as booleans or as the glyphs `✓ / ✗ / ~` (the hub
 * matrix stores glyphs). Normalising in one place means the tile treatment does
 * not depend on how a given page happened to type its data. Anything else — a
 * price, "2 seats", a plan name — is real content and returns `undefined` so the
 * caller renders it as text.
 */
export function markState(value: boolean | string): MarkState | undefined {
  if (typeof value === "boolean") return value ? "yes" : "no";
  const v = value.trim();
  if (v === "✓") return "yes";
  if (v === "✗") return "no";
  if (v === "~") return "partial";
  return undefined;
}

const MARK_INK: Record<MarkState, string> = {
  yes: "text-mist-700",
  no: "text-mist-300",
  partial: "text-mist-500",
};

export function SupportMark({ state, label }: { state: MarkState; label: string }) {
  return (
    <span role="img" aria-label={label} className="inline-flex items-center justify-center">
      <span
        className={`flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border border-black/[0.06] bg-white ${MARK_INK[state]}`}
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {state === "yes" ? <path d="m5 13 4 4L19 7" /> : <path d="M6 12h12" />}
        </svg>
      </span>
    </span>
  );
}
