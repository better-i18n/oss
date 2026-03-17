/**
 * Dynamic icon resolver for content model icon names.
 * Maps string icon names from CMS to actual icon components.
 */
import * as Icons from "@central-icons-react/round-outlined-radius-2-stroke-2";

type IconComponent = (props: { className?: string }) => React.ReactElement | null;

/**
 * Get an icon component by name from the central-icons package.
 * Returns null if the icon name is not found.
 */
export function getIconComponent(name: string | null): IconComponent | null {
  if (!name) return null;
  const IconComp = (Icons as unknown as Record<string, IconComponent>)[name];
  return IconComp ?? null;
}
