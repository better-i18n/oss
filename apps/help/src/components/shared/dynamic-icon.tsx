import { getIconComponent } from "@/lib/icons";

interface DynamicIconProps {
  name: string | null;
  className?: string;
}

/**
 * Renders an icon dynamically from a CMS icon name.
 * Falls back to a generic document icon if the name is not found.
 */
export function DynamicIcon({ name, className }: DynamicIconProps) {
  const IconComp = getIconComponent(name);
  if (!IconComp) {
    // Fallback: simple circle
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <circle cx="12" cy="12" r="10" />
      </svg>
    );
  }
  return <IconComp className={className} />;
}
