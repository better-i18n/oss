import { Card as FumadocsCard, Cards } from 'fumadocs-ui/components/card';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ComponentProps, ReactNode } from 'react';

type CardProps = Omit<ComponentProps<typeof FumadocsCard>, 'icon'> & {
  icon?: string | ReactNode;
};

export function Card({ icon, ...props }: CardProps) {
  let iconElement: ReactNode = undefined;

  if (icon && typeof icon === 'string') {
    const IconComponent = (LucideIcons as unknown as Record<string, LucideIcon>)[icon];
    if (IconComponent) {
      iconElement = <IconComponent className="size-4" />;
    }
  } else if (icon) {
    iconElement = icon;
  }

  return <FumadocsCard {...props} icon={iconElement} />;
}

export { Cards };
