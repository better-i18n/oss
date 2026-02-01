"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { Button } from "./button";

interface EmptyStateProps {
  title: string;
  description: string;
  icons?: React.ComponentType<{ className?: string }>[];
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

function EmptyState({
  title,
  description,
  icons = [],
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-background border-gray-200 dark:border-neutral-700 text-center",
        "border rounded-lg p-20 w-full h-full flex flex-col items-center justify-center",
        className
      )}
    >
      {icons.length > 0 && (
        <div className="flex justify-center items-center mb-8">
          {icons.length >= 3 ? (
            <div className="flex items-center justify-center">
              {/* Left icon - rotated left, overlapping */}
              <div className="bg-white dark:bg-background size-12 grid place-items-center rounded-xl -rotate-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] ring-1 ring-gray-200/80 dark:ring-neutral-700 -mr-2 relative z-0">
                {React.createElement(icons[0], {
                  className: "w-5 h-5 text-gray-400 dark:text-neutral-500",
                })}
              </div>
              {/* Center icon - no rotation, on top */}
              <div className="bg-white dark:bg-background size-12 grid place-items-center rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] ring-1 ring-gray-200/80 dark:ring-neutral-700 relative z-10">
                {React.createElement(icons[1], {
                  className: "w-5 h-5 text-gray-400 dark:text-neutral-500",
                })}
              </div>
              {/* Right icon - rotated right, overlapping */}
              <div className="bg-white dark:bg-background size-12 grid place-items-center rounded-xl rotate-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] ring-1 ring-gray-200/80 dark:ring-neutral-700 -ml-2 relative z-0">
                {React.createElement(icons[2], {
                  className: "w-5 h-5 text-gray-400 dark:text-neutral-500",
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-background size-12 grid place-items-center rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] ring-1 ring-gray-200/80 dark:ring-neutral-700">
              {icons[0] &&
                React.createElement(icons[0], {
                  className: "w-5 h-5 text-gray-400 dark:text-neutral-500",
                })}
            </div>
          )}
        </div>
      )}
      <h2 className="text-gray-900 dark:text-white font-semibold text-lg">{title}</h2>
      <p className="text-sm text-gray-500 dark:text-neutral-400 mt-2 whitespace-pre-line max-w-sm mx-auto">
        {description}
      </p>
      {action && (
        <Button
          onClick={action.onClick}
          variant="outline"
          className="mt-8"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

export { EmptyState, type EmptyStateProps };
