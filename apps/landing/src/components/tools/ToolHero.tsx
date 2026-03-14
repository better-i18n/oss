/** Hero section for tool pages — title, description, and optional subtitle. */

interface ToolHeroProps {
  readonly title: string;
  readonly description: string;
  readonly subtitle?: string;
}

export function ToolHero({ title, description, subtitle }: ToolHeroProps) {
  return (
    <section className="border-b border-mist-200 bg-white py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          {subtitle && (
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-mist-500">
              {subtitle}
            </p>
          )}
          <h1 className="font-display text-4xl/[1.06] font-medium tracking-[-0.03em] text-mist-950 sm:text-5xl/[1.04]">
            {title}
          </h1>
          <p className="mt-4 text-lg/7 text-mist-700">{description}</p>
        </div>
      </div>
    </section>
  );
}
