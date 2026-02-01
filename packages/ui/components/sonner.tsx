"use client";

import {
  IconCircleInfo,
  IconCircleX,
  IconCrossMedium,
  IconExclamationTriangle,
  IconLoadingCircle,
  IconSquareBehindSquare6,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="system"
      className="toaster group"
      position="bottom-right"
      gap={16}
      icons={{
        success: <IconSquareBehindSquare6 className="size-4 text-emerald-500" />,
        info: <IconCircleInfo className="size-4 text-blue-500" />,
        warning: <IconExclamationTriangle className="size-4 text-amber-500" />,
        error: <IconCircleX className="size-4 text-red-500" />,
        loading: <IconLoadingCircle className="size-4 animate-spin text-gray-500" />,
        close: <IconCrossMedium className="size-3" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-lg min-w-80 p-4 flex items-start gap-3",
          title: "text-gray-900 dark:text-white font-semibold text-sm",
          description: "text-gray-600 dark:text-gray-400 text-sm mt-1",
          actionButton:
            "bg-primary text-primary-foreground text-sm font-medium px-3 py-1.5 rounded-md",
          cancelButton:
            "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium px-3 py-1.5 rounded-md",
          closeButton:
            "absolute top-3 right-3 p-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
        },
      }}
      {...props}
    />
  );
};

export { toast } from "sonner";
export { Toaster };

