import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const linkVariants = cva(
  "transition-colors disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        underline:
          "text-indigo-700 underline underline-offset-2 hover:decoration-2 focus:outline-none focus:decoration-2 dark:text-indigo-400",
        "icon-link":
          "inline-flex items-center gap-x-0.5 text-[13px] text-indigo-700 underline underline-offset-2 hover:decoration-2 focus:outline-none focus:decoration-2 dark:text-indigo-400",
        default:
          "text-indigo-700 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300",
      },
    },
    defaultVariants: {
      variant: "underline",
    },
  },
);

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  asChild?: boolean;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, asChild, children, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      const childElement = children as React.ReactElement<{
        className?: string;
      }>;
      return React.cloneElement(childElement, {
        className: cn(
          linkVariants({ variant, className }),
          childElement.props.className,
        ),
        ...props,
      } as React.HTMLAttributes<HTMLElement>);
    }

    return (
      <a
        className={cn(linkVariants({ variant, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </a>
    );
  },
);
Link.displayName = "Link";

export { Link, linkVariants };
