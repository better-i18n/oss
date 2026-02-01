
import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../components/badge";
import { Link } from "../components/link";
import { IconChevronRight } from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { cn } from "./utils";

/**
 * Helper to create a basic column definition
 */
export function createColumn<TData, TValue>({
  accessorKey,
  header,
  cell,
  enableSorting = false,
  minWidth,
}: {
  accessorKey?: keyof TData;
  header: string;
  cell?: (props: { getValue: () => TValue; row: { original: TData } }) => React.ReactNode;
  enableSorting?: boolean;
  minWidth?: string;
}): ColumnDef<TData, TValue> {
  return {
    accessorKey: accessorKey as string,
    header,
    cell: cell
      ? ({ getValue, row }) => cell({ getValue, row })
      : undefined,
    enableSorting,
    meta: minWidth ? { minWidth } : undefined,
  };
}

/**
 * Helper to create a column with custom renderer
 */
export function createCustomColumn<TData, TValue>({
  id,
  header,
  cell,
  enableSorting = false,
  minWidth,
}: {
  id?: string;
  header: string;
  cell: (props: { row: { original: TData } }) => React.ReactNode;
  enableSorting?: boolean;
  minWidth?: string;
}): ColumnDef<TData, TValue> {
  return {
    id: id || header.toLowerCase().replace(/\s+/g, "-"),
    header,
    cell: ({ row }) => cell({ row }),
    enableSorting,
    meta: minWidth ? { minWidth } : undefined,
  };
}

/**
 * Helper to render a status badge in table cells
 */
export function renderStatusBadge(status: "published" | "draft" | "scheduled") {
  return <Badge variant={status} showIcon />;
}

/**
 * Helper to render a details link (icon-link variant) in table cells
 */
export function renderDetailsLink(href: string, text = "Details") {
  return (
    <Link href={href} variant="icon-link">
      {text}
      <IconChevronRight className="shrink-0 size-4" />
    </Link>
  );
}

/**
 * Helper to render an image thumbnail cell
 */
export function renderImageThumbnail({
  src,
  alt,
  className,
}: {
  src?: string | null;
  alt?: string;
  className?: string;
}) {
  if (!src) {
    return (
      <span
        className={cn(
          "flex shrink-0 justify-center items-center w-20 h-15 bg-gray-200 text-gray-500 rounded-md dark:bg-neutral-700 dark:text-neutral-500",
          className
        )}
      >
        <svg
          className="shrink-0 size-6"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "relative w-20 h-15 shrink-0 bg-gray-100 rounded-md dark:bg-neutral-700",
        className
      )}
    >
      <img
        className="absolute inset-0 size-full object-cover rounded-md"
        src={src}
        alt={alt || ""}
      />
    </span>
  );
}

