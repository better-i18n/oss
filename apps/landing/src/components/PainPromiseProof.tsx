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

const SECTION_CONFIG = [
  {
    key: "pain",
    icon: <IconExclamationCircle className="size-6" />,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    borderColor: "border-red-100",
  },
  {
    key: "promise",
    icon: <IconTarget className="size-6" />,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    borderColor: "border-emerald-100",
  },
  {
    key: "proof",
    icon: <IconShield className="size-6" />,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    borderColor: "border-blue-100",
  },
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
    <section className="py-16 lg:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-12 lg:mb-16 text-center">
          <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1]">
            {title}
          </h2>
          <p className="mt-4 text-lg text-mist-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {SECTION_CONFIG.map((config) => {
            const section = sections[config.key];
            return (
              <div
                key={config.key}
                className={`relative rounded-2xl border ${config.borderColor} p-6 lg:p-8`}
              >
                <div
                  className={`size-12 rounded-xl ${config.iconBg} flex items-center justify-center ${config.iconColor} mb-5`}
                >
                  {config.icon}
                </div>
                <span className="text-xs font-medium uppercase tracking-wider text-mist-400">
                  {section.label}
                </span>
                <p className="mt-2 text-lg font-medium text-mist-950 leading-relaxed">
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
