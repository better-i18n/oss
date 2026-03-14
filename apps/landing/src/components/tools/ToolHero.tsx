/** Hero section for tool pages — eyebrow badge, two-tone title, description. */

interface ToolHeroProps {
  readonly title: string;
  readonly titleHighlight?: string; // Part rendered in text-mist-500
  readonly description: string;
  readonly eyebrow?: string;
}

export function ToolHero({ title, titleHighlight, description, eyebrow }: ToolHeroProps) {
  return (
    <div className="text-center py-16 sm:py-20">
      {eyebrow && (
        <div className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-mist-200 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-mist-600">
            {eyebrow}
          </span>
        </div>
      )}
      <h1 className="font-display text-4xl/[1.06] font-medium tracking-[-0.03em] text-mist-950 sm:text-5xl mb-5">
        {title}
        {titleHighlight && (
          <span className="text-mist-500"> {titleHighlight}</span>
        )}
      </h1>
      <p className="text-lg/8 text-mist-700 max-w-2xl mx-auto">
        {description}
      </p>
    </div>
  );
}
