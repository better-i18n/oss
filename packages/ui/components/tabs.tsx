"use client";

import { cn } from "../lib/utils";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

// Variants for TabsList
const tabsListVariants = cva("flex items-center shrink-0", {
  variants: {
    variant: {
      default: "bg-accent p-1",
      button: "",
      line: "border-b border-border",
    },
    shape: {
      default: "",
      pill: "",
    },
    size: {
      lg: "gap-2.5",
      md: "gap-2",
      sm: "gap-1.5",
      xs: "gap-1",
    },
  },
  compoundVariants: [
    { variant: "default", size: "lg", className: "p-1.5 gap-2.5" },
    { variant: "default", size: "md", className: "p-1 gap-2" },
    { variant: "default", size: "sm", className: "p-1 gap-1.5" },
    { variant: "default", size: "xs", className: "p-1 gap-1" },

    {
      variant: "default",
      shape: "default",
      size: "lg",
      className: "rounded-lg",
    },
    {
      variant: "default",
      shape: "default",
      size: "md",
      className: "rounded-lg",
    },
    {
      variant: "default",
      shape: "default",
      size: "sm",
      className: "rounded-md",
    },
    {
      variant: "default",
      shape: "default",
      size: "xs",
      className: "rounded-md",
    },

    { variant: "line", size: "lg", className: "gap-9" },
    { variant: "line", size: "md", className: "gap-8" },
    { variant: "line", size: "sm", className: "gap-4" },
    { variant: "line", size: "xs", className: "gap-4" },

    {
      variant: "default",
      shape: "pill",
      className: "rounded-full [&_[role=tab]]:rounded-full",
    },
    {
      variant: "button",
      shape: "pill",
      className: "rounded-full [&_[role=tab]]:rounded-full",
    },
  ],
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

// Variants for TabsTrigger
const tabsTriggerVariants = cva(
  "shrink-0 cursor-pointer whitespace-nowrap inline-flex justify-center items-center font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:shrink-0 [&_svg]:text-muted-foreground [&:hover_svg]:text-primary [&[data-state=active]_svg]:text-primary",
  {
    variants: {
      variant: {
        default:
          "text-muted-foreground data-[state=active]:bg-background hover:text-foreground data-[state=active]:text-foreground data-[state=active]:shadow-xs data-[state=active]:shadow-black/5",
        button:
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg text-accent-foreground hover:text-foreground data-[state=active]:bg-accent data-[state=active]:text-foreground",
        line: "border-b-2 text-muted-foreground border-transparent data-[state=active]:border-primary hover:text-primary data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:text-primary",
      },
      size: {
        lg: "gap-2.5 [&_svg]:size-5 text-sm",
        md: "gap-2 [&_svg]:size-4 text-sm",
        sm: "gap-1.5 [&_svg]:size-3.5 text-xs",
        xs: "gap-1 [&_svg]:size-3.5 text-xs",
      },
    },
    compoundVariants: [
      { variant: "default", size: "lg", className: "py-2.5 px-4 rounded-md" },
      { variant: "default", size: "md", className: "py-1.5 px-3 rounded-md" },
      { variant: "default", size: "sm", className: "py-1.5 px-2.5 rounded-sm" },
      { variant: "default", size: "xs", className: "py-1 px-2 rounded-sm" },

      { variant: "button", size: "lg", className: "py-3 px-4 rounded-lg" },
      { variant: "button", size: "md", className: "py-2.5 px-3 rounded-lg" },
      { variant: "button", size: "sm", className: "py-2 px-2.5 rounded-md" },
      { variant: "button", size: "xs", className: "py-1.5 px-2 rounded-md" },

      { variant: "line", size: "lg", className: "py-3" },
      { variant: "line", size: "md", className: "py-2.5" },
      { variant: "line", size: "sm", className: "py-2" },
      { variant: "line", size: "xs", className: "py-1.5" },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

// Variants for TabsContent
const tabsContentVariants = cva(
  "mt-2.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

// Context
type TabsContextType = {
  variant?: "default" | "button" | "line";
  size?: "lg" | "sm" | "xs" | "md";
};
const TabsContext = React.createContext<TabsContextType>({
  variant: "default",
  size: "md",
});

// Components
const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Root
    ref={ref}
    data-slot="tabs"
    className={cn("", className)}
    {...props}
  />
));
Tabs.displayName = TabsPrimitive.Root.displayName;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> &
    VariantProps<typeof tabsListVariants>
>(
  (
    {
      className,
      variant = "default",
      shape = "default",
      size = "md",
      ...props
    },
    ref,
  ) => {
    return (
      <TabsContext.Provider
        value={{ variant: variant || "default", size: size || "md" }}
      >
        <TabsPrimitive.List
          ref={ref}
          data-slot="tabs-list"
          className={cn(tabsListVariants({ variant, shape, size }), className)}
          {...props}
        />
      </TabsContext.Provider>
    );
  },
);
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const { variant, size } = React.useContext(TabsContext);

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      data-slot="tabs-trigger"
      className={cn(tabsTriggerVariants({ variant, size }), className)}
      {...props}
    />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> &
    VariantProps<typeof tabsContentVariants>
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    data-slot="tabs-content"
    className={cn(tabsContentVariants({ variant }), className)}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
