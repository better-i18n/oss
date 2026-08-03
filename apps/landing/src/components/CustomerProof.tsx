import { useRef } from "react";
import { CUSTOMERS, type Customer } from "@/lib/customers";
import { useDemoLoop } from "@/components/features/use-demo-loop";

/**
 * The customer wall beside the closing ask.
 *
 * The closing band used to put the logos in a row under the buttons, which left
 * the whole right half of the band empty and made the proof read as a footnote
 * to the CTA. It is not a footnote: at the point where someone is deciding, who
 * already runs on this is the argument. So it moves to its own column and gets
 * the space the band was wasting.
 *
 * Only six fit at that width without shrinking the marks into illegibility, and
 * there are thirteen customers. Rather than pick six and retire the rest, the
 * column rotates through them a group at a time. A group swap rather than a
 * marquee, because a reader who glances at proof needs it to hold still long
 * enough to be read — a continuous scroll is decoration, a held group is
 * evidence.
 *
 * `useDemoLoop` is the same hook the feature cards use: it stops while the
 * element is off-screen and freezes on the first group under
 * `prefers-reduced-motion`, so the logos are never a battery drain and never a
 * motion problem.
 */

/** How many marks read comfortably in one column at the closing band's width. */
const PER_GROUP = 6;
const HOLD_MS = 3600;

/**
 * Balanced groups, not "fill six then whatever is left".
 *
 * Thirteen customers chunked at six give 6/6/1, and the third beat showed a
 * single logo in a column sized for six — the rotation read as a bug. Deciding
 * how many GROUPS there are first, then spreading the customers across them,
 * gives 5/4/4: every beat looks like the same kind of thing.
 */
const GROUP_COUNT = Math.ceil(CUSTOMERS.length / PER_GROUP);

const GROUPS: ReadonlyArray<ReadonlyArray<Customer>> = Array.from(
  { length: GROUP_COUNT },
  (_, i) =>
    CUSTOMERS.filter((_customer, index) => index % GROUP_COUNT === i),
);

/**
 * Hoisted, not built in the body.
 *
 * `useDemoLoop` keys its timer effect on the beats array. Rebuilding that array
 * on every render hands the effect a new identity each time, so it tears down
 * and restarts before any beat can elapse — the loop looks dead rather than
 * broken. The groups are constant, so the beats are too.
 */
const BEATS = GROUPS.map(() => ({ durationMs: HOLD_MS }));

export function CustomerProof({ label }: { label: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { beatIndex } = useDemoLoop({ beats: BEATS, ref: rootRef });
  const group = GROUPS[beatIndex % GROUPS.length] ?? GROUPS[0]!;

  return (
    <div ref={rootRef}>
      <p className="text-[11px] font-medium text-mist-400">{label}</p>

      {/* A fixed two-column grid, not a wrapping row: the group changes under
          the reader, and a layout that reflows on every swap reads as a glitch
          rather than a rotation. Six slots, always six slots. */}
      <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-5">
        {group.map((customer) => (
          <a
            key={customer.name}
            href={customer.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex h-6 items-center gap-2 grayscale transition-opacity duration-500 hover:opacity-100 ${
              customer.wordmark ? "opacity-55" : "opacity-75"
            }`}
          >
            {customer.wordmark ? (
              <img
                src={customer.wordmark}
                alt={`${customer.name} — Better I18N customer`}
                width={customer.width ?? 96}
                height={customer.height ?? 18}
                loading="lazy"
                className="w-auto"
                style={{ height: customer.height ?? 18 }}
              />
            ) : (
              <>
                <img
                  src={customer.mark}
                  alt=""
                  width={customer.markSize ?? 18}
                  height={customer.markSize ?? 18}
                  loading="lazy"
                  className="shrink-0"
                  style={{
                    width: customer.markSize ?? 18,
                    height: customer.markSize ?? 18,
                    ...(customer.invert ? { filter: "invert(1)" } : null),
                  }}
                />
                <span className="text-[13px] font-medium tracking-[-0.01em] text-mist-700">
                  {customer.name}
                </span>
              </>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
