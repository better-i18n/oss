import { cn } from "@better-i18n/ui/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "beginner" | "intermediate" | "advanced";
  className?: string;
}

const variantStyles = {
  default: "bg-mist-100 text-mist-700",
  beginner: "bg-emerald-50 text-emerald-700",
  intermediate: "bg-amber-50 text-amber-700",
  advanced: "bg-rose-50 text-rose-700",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
