"use client";
import * as React from "react";
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  Table as TableType,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./datatable-pagination";
import { DataTableFilters } from "./datatable-filters";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { DataTableColumnsToggle } from "./datatable-columns-toggle";

// Extend ColumnMeta to allow cellClassName
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData = unknown, TValue = unknown> {
    cellClassName?: string;
    filterVariant?: "text" | "select" | "disabled";
    headerClassName?: string;
    headerTitle?: string;
    headerIcon?: React.ReactNode;
    filterOptions?: {
      label: string;
      value: string;
    }[];
  }
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

const getCommonPinningStyles = (column: Column<any>): React.CSSProperties => {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left");
  const isFirstRightPinnedColumn =
    isPinned === "right" && column.getIsFirstColumn("right");

  return {
    boxShadow: isLastLeftPinnedColumn
      ? "-2px 0 2px -2px hsl(var(--border)) inset"
      : isFirstRightPinnedColumn
      ? "2px 0 2px -2px hsl(var(--border)) inset"
      : undefined,
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    position: isPinned ? "sticky" : "relative",
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
    // backgroundColor: "hsl(var(--background))",
  };
};

interface DataTableProps<TData, TValue> {
  columns?: ColumnDef<TData, TValue>[];
  data?: TData[];
  tableContext?: TableType<TData>;
  toolbar?: React.ReactNode | ((table: TableType<TData>) => React.ReactNode);
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactElement;
  hiddePaginationBar?: boolean;
  getRowCanExpand?: (row: Row<TData>) => boolean;
  defaultPaginationSize?: 10 | 20 | 30 | 40 | 50;
  hiddenColumnsToggle?: boolean;
  exportTableFn?: (data: TData[]) => React.ReactNode | void;
  canQuerySearchParams?: boolean;
  columnTitles?: any;
  className?: string;
}

/*************  ✨ Codeium Command ⭐  *************/
/**
 * DataTableGlobal is a component that renders a data table with advanced features
 * such as sorting, filtering, pagination, and column visibility toggling.
 * 
 * @template TData - The type of data being passed to the table.

/******  493cf095-15d1-4b11-a194-92fcc5231332  *******/
export const DataTable = <TData, TValue>({
  data = [],
  tableContext,
  columns = [],
  columnTitles,
  toolbar,
  className,
  exportTableFn,
  getRowCanExpand, // default: () => false
  renderSubComponent,
  hiddePaginationBar = false,
  hiddenColumnsToggle = false,
  defaultPaginationSize = 10,
  canQuerySearchParams = false,
}: DataTableProps<TData, TValue>) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [queryUpdate, setQueryUpdate] = React.useState<Record<string, any>>({});
  const [debounceTimer, setDebounceTimer] =
    React.useState<NodeJS.Timeout | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateSearchQuery = (updatedQuery: any) => {
    setQueryUpdate(updatedQuery);

    // Clear any existing debounce timer
    if (debounceTimer) clearTimeout(debounceTimer);

    // Set a new timer
    const newTimer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      Object.keys(updatedQuery).forEach((key) => {
        if (updatedQuery[key]) {
          params.set(key, updatedQuery[key]);
        } else {
          params.delete(key);
        }
      });

      const queryString = params.toString();
      const updatedPath = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(updatedPath);
    }, 500); // Delay of 500ms (adjust as needed)

    setDebounceTimer(newTimer);
  };

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const generatedTable = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getRowCanExpand,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: (e: any) => {
      if (canQuerySearchParams) {
        e().forEach((filter: any) => {
          updateSearchQuery({ [filter.id]: filter.value });
        });
      }
      setColumnFilters(e);
    },
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageSize: defaultPaginationSize,
      },
    },
  });

  // Use sempre o hook, e só sobrescreva se tableContext existir
  const table = tableContext ?? generatedTable;

  return (
    <div className="space-y-2 w-full">
      <div className="flex items-end gap-4">
        {exportTableFn &&
          (exportTableFn(
            table.getFilteredRowModel().rows.map((r) => r.original)
          ) ||
            null)}
        {typeof toolbar === "function" ? toolbar(table) : toolbar || null}

        {!hiddenColumnsToggle && !toolbar && (
          <DataTableColumnsToggle
            table={table}
            columnTitles={columnTitles}
          />
        )}
      </div>
      <div className={cn("border rounded-md overflow-clip", className)}>
        <Table className="relative">
          <TableHeader className="top-0 z-10 !sticky min-w-full">
            {table.getHeaderGroups().map((headerGroup, index) => (
              <TableRow
                key={index}
                // className="!border-b"
              >
                {headerGroup.headers.map((header, index) => (
                  <TableHead
                    className="relative bg-transparent backdrop-blur-md px-0"
                    key={index}
                    style={{
                      width: header.getSize(),
                      ...getCommonPinningStyles(header.column),
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex flex-col justify-between divide-x h-full">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanFilter() ? (
                          <div className="flex bg-muted-foreground/10 mt-auto p-0.5 border-t">
                            <DataTableFilters column={header.column} />
                          </div>
                        ) : null}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="">
            {table?.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <React.Fragment key={index}>
                  <TableRow
                    key={index}
                    className="hover:bg-muted/50"
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell
                        // className="bg-background"
                        key={index}
                        style={{ ...getCommonPinningStyles(cell.column) }}
                        className={cn(
                          // "bg-background/50 backdrop-blur-lg !border-b",
                          cell.column.columnDef.meta?.cellClassName
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {renderSubComponent && (
                    <AnimatePresence initial={false}>
                      {row.getIsExpanded() && row.getCanExpand() && (
                        <motion.tr
                          key="expanded-row"
                          // initial={{ opacity: 0, height: 0 }}
                          // animate={{ opacity: 1, height: "auto" }}
                          // exit={{ opacity: 0, height: 0 }}
                          // transition={{ duration: 0.1, ease: "easeInOut" }}
                          style={{ overflow: "hidden" }}
                          className="!bg-muted hover:bg-muted"
                        >
                          <TableCell
                            colSpan={row.getVisibleCells().length}
                            className="!p-0"
                            style={{ padding: 0, border: 0 }}
                          >
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.1, ease: "easeInOut" }}
                              style={{ overflow: "hidden" }}
                            >
                              {renderSubComponent({ row })}
                            </motion.div>
                          </TableCell>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllLeafColumns().length}
                  className="h-24 text-center"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {hiddePaginationBar ? null : <DataTablePagination table={table} />}
    </div>
  );
};
