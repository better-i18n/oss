import { cva, type VariantProps } from "class-variance-authority";
import { IconCalendar1, IconCheckmark1, IconPencil } from "@central-icons-react/round-outlined-radius-2-stroke-2";
import * as React from "react";
import { cn } from "../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-x-1.5 py-1 px-2 text-[13px] rounded-full",
  {
    variants: {
      variant: {
        published:
          "bg-gray-100 text-gray-800 dark:bg-neutral-500/10 dark:text-neutral-200",
        draft:
          "bg-orange-100 text-orange-800 dark:bg-orange-500/10 dark:text-orange-500",
        scheduled:
          "bg-indigo-100 text-indigo-700 dark:bg-indigo-700/10 dark:text-indigo-400",
        default:
          "bg-gray-100 text-gray-800 dark:bg-neutral-500/10 dark:text-neutral-200",
        outline:
          "border border-gray-200 text-gray-700 dark:border-neutral-600 dark:text-neutral-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> {
  showIcon?: boolean;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, showIcon = false, children, ...props }, ref) => {
    const iconMap: Record<string, React.ElementType> = {
      published: IconCheckmark1,
      draft: IconPencil,
      scheduled: IconCalendar1,
      default: IconCheckmark1,
      outline: IconCheckmark1,
    };

    const Icon = (variant && iconMap[variant]) ? iconMap[variant] : iconMap.default;

    return (
      <div
        className={cn(badgeVariants({ variant, className }))}
        ref={ref}
        {...props}
      >
        {showIcon && <Icon className="shrink-0 size-3" />}
        {children}
      </div>
    );
  },
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
