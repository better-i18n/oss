import * as AvatarPrimitive from "@radix-ui/react-avatar";
import Avvvatars from "avvvatars-react";
import * as React from "react";

import { cn } from "../lib/utils";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-xs",
      className,
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

interface AvatarFallbackProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> {
  value?: string;
  size?: number;
}

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(({ className, value, children, size, ...props }, ref) => {
  // If value is provided, use avvvatars shape style for fallback
  if (value) {
    // Use provided size or calculate from className (e.g., size-6 = 24px, size-5 = 20px)
    // Tailwind size classes: size-6 = 1.5rem = 24px, size-5 = 1.25rem = 20px
    let calculatedSize = size;
    if (!calculatedSize) {
      const sizeMatch = className?.match(/(?:^|\s)size-(\d+)/) || [];
      if (sizeMatch[1]) {
        calculatedSize = parseInt(sizeMatch[1], 10) * 4; // size-6 = 24, size-5 = 20
      } else {
        calculatedSize = 40; // Default fallback
      }
    }

    return (
      <AvatarPrimitive.Fallback
        ref={ref}
        className={cn(
          "flex h-full w-full items-center justify-center overflow-hidden bg-muted",
          className,
        )}
        {...props}
      >
        <div className="h-full w-full flex items-center justify-center relative">
          <Avvvatars
            value={value}
            style={children ? "shape" : "character"}
            radius={4}
            size={calculatedSize}
          />
          {children && (
            <div
              className="absolute inset-0 flex items-center justify-center font-bold text-white select-none pointer-events-none"
              style={{ fontSize: calculatedSize * 0.35 }}
            >
              {children}
            </div>
          )}
        </div>
      </AvatarPrimitive.Fallback>
    );
  }

  // Default fallback behavior (for text/children)
  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center bg-muted",
        className,
      )}
    >
      {children}
    </AvatarPrimitive.Fallback>
  );
});
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarFallback, AvatarImage };
