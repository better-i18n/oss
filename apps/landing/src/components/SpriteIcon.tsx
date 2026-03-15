import type { SVGProps } from "react";

/**
 * Map from sprite icon names to the original @central-icons-react component names.
 * Used for documentation and to ensure all sprite icons have correct IDs.
 */
export type SpriteIconName =
  | "arrow-right"
  | "checkmark"
  | "globe"
  | "rocket"
  | "code-brackets"
  | "group"
  | "zap"
  | "settings-gear"
  | "magnifying-glass"
  | "sparkles-soft"
  | "chevron-right"
  | "chart"
  | "shield-check"
  | "github"
  | "robot"
  | "api-connection"
  | "script"
  | "code"
  | "book"
  | "chevron-bottom";

interface SpriteIconProps extends SVGProps<SVGSVGElement> {
  readonly name: SpriteIconName;
}

/**
 * Renders an SVG icon from the sprite sheet via <use href="#sprite-{name}" />.
 * Drop-in replacement for @central-icons-react icons.
 *
 * Usage: <SpriteIcon name="arrow-right" className="w-4 h-4" />
 */
export function SpriteIcon({ name, ...props }: SpriteIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <use href={`#sprite-${name}`} />
    </svg>
  );
}
