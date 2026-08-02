/** Hero section for tool pages — eyebrow badge, two-tone title, description. */

interface ToolHeroProps {
  readonly title: string;
  readonly titleHighlight?: string; // Part rendered in text-mist-500
  readonly description: string;
  readonly subtitle?: string;
  readonly eyebrow?: string;
}

export function ToolHero({ title, titleHighlight, description, subtitle, eyebrow }: ToolHeroProps) {
  return (
    <div className="text-center py-16 sm:py-20">
      {eyebrow && (
        <div className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-mist-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-mist-600">
            {eyebrow}
          </span>
        </div>
      )}
      <h1 className="section-h2 mb-5">
        {title}
        {titleHighlight && (
          <span className="text-mist-500"> {titleHighlight}</span>
        )}
      </h1>
      <p className="text-lg/8 text-mist-700 max-w-2xl mx-auto">
        {description}
      </p>
      {subtitle && (
        <p className="mt-3 text-sm text-mist-500">{subtitle}</p>
      )}
    </div>
  );
}
