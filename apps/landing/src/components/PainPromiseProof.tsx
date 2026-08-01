import {
  IconExclamationCircle,
  IconTarget,
  IconShield,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

interface PainPromiseProofProps {
  readonly title: string;
  readonly subtitle: string;
  readonly pain: { readonly label: string; readonly text: string };
  readonly promise: { readonly label: string; readonly text: string };
  readonly proof: { readonly label: string; readonly text: string };
}

/**
 * Pain → Promise → Proof, told by order and heading rather than by colour.
 *
 * Each card used to carry its own hue: red for the pain, emerald for the
 * promise, blue for the proof, on the card border AND a 48px filled icon plate.
 * Three decorative colours in one row, on a page whose rule reserves colour for
 * pillar identity, links and code tokens
 * (rule/neutral-ink-accent-is-identity-only) — and the hues were not even
 * carrying the distinction, the labels were. Now the labels do it alone: one
 * ink, one 22px neutral tile, no card.
 */
const SECTION_CONFIG = [
  { key: "pain", icon: <IconExclamationCircle className="size-3.5" /> },
  { key: "promise", icon: <IconTarget className="size-3.5" /> },
  { key: "proof", icon: <IconShield className="size-3.5" /> },
] as const;

export default function PainPromiseProof({
  title,
  subtitle,
  pain,
  promise,
  proof,
}: PainPromiseProofProps) {
  const sections = { pain, promise, proof };

  return (
    <section className="bg-white">
      <div className="section">
        <div className="mb-10">
          <h2 className="section-h2">{title}</h2>
          <p className="section-p mt-3">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-x-10 gap-y-9 md:grid-cols-3">
          {SECTION_CONFIG.map((config) => {
            const section = sections[config.key];
            return (
              <div key={config.key} className="flex flex-col">
                <span className="flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-600">
                  {config.icon}
                </span>
                <span className="mt-4 text-[11px] font-medium text-mist-400">
                  {section.label}
                </span>
                <p className="mt-1.5 text-[15px] leading-relaxed text-mist-900">
                  {section.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
