"use client";

import { cn } from "../lib/utils";

interface LoadingSkeletonProps {
  rows?: number;
  height?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const heightClasses = {
  sm: "h-10",
  md: "h-14",
  lg: "h-24",
  xl: "h-48",
};

export function LoadingSkeleton({
  rows = 3,
  height = "md",
  className,
}: LoadingSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {[...Array(rows)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "bg-gray-100 dark:bg-background rounded-lg animate-pulse",
            heightClasses[height]
          )}
        />
      ))}
    </div>
  );
}
