"use client";

import {
  type ColumnDef,
  type ExpandedState,
  type OnChangeFn,
  type Row,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import { cn } from "../lib/utils";
import { Frame } from "./frame";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Skeleton } from "./skeleton";
import { EmptyState } from "./empty-state";
import { Button } from "./button";
import { IconChevronRightSmall } from "@central-icons-react/round-outlined-radius-2-stroke-2";

export interface CustomColumnMeta {
  minWidth?: string;
}

/**
 * Reusable table expander button component
 * Ensures consistent chevron icon sizing across all expandable tables
 */
export function TableExpanderButton<TData>({
  row,
  className,
}: {
  row: Row<TData>;
  className?: string;
}) {
  const canExpand = row.getCanExpand();

  if (!canExpand) {
    return <div className={cn("w-5 h-5 shrink-0", className)} />;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("h-5 w-5 p-0 shrink-0", className)}
      onClick={() => row.toggleExpanded()}
    >
      <IconChevronRightSmall
        className={cn(
          "h-3.5 w-3.5 transition-transform",
          row.getIsExpanded() && "rotate-90",
        )}
      />
    </Button>
  );
}

export interface EmptyStateConfig {
  title: string;
  description: string;
  icons?: React.ComponentType<{ className?: string }>[];
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  className?: string;
  getRowCanExpand?: (row: Row<TData>) => boolean;
  renderExpandedRow?: (row: Row<TData>) => React.ReactNode;
  expanded?: ExpandedState;
  onExpandedChange?: OnChangeFn<ExpandedState>;
  emptyState?: EmptyStateConfig;
  isLoading?: boolean;
  skeletonRows?: number;
}

function DataTable<TData, TValue>({
  columns,
  data,
  className,
  getRowCanExpand,
  renderExpandedRow,
  expanded,
  onExpandedChange,
  emptyState,
  isLoading = false,
  skeletonRows = 5,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    state: {
      expanded: expanded || {},
    },
    onExpandedChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: getRowCanExpand || (() => false),
  });

  return (
    <Frame className={cn("w-full", className)}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // Loading skeleton rows
            Array.from({ length: skeletonRows }).map((_, rowIndex) => (
              <TableRow key={`skeleton-${rowIndex}`}>
                {columns.map((_, colIndex) => (
                  <TableCell key={`skeleton-${rowIndex}-${colIndex}`}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <React.Fragment key={row.id}>
                <TableRow>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                {row.getIsExpanded() && renderExpandedRow && (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="p-0 whitespace-normal"
                      style={{ width: "100%", minWidth: "100%" }}
                    >
                      {renderExpandedRow(row)}
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          ) : emptyState ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="p-8">
                <EmptyState
                  title={emptyState.title}
                  description={emptyState.description}
                  icons={emptyState.icons}
                  action={emptyState.action}
                  className="mx-auto max-w-md border-0"
                />
              </TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Frame>
  );
}

export { DataTable };
