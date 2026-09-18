"use client"

import * as React from "react"
import {
  useTable,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type RowData,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table"
import { SearchX } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { dataTableFeatures, type DataTableFeatures } from "./features"
import { DataTableColumnToggle } from "./data-table-column-toggle"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableSkeleton } from "./data-table-skeleton"

export interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData>[]
  data: TData[]
  /** accessorKey kolom yang difilter via search box. Kosongkan untuk sembunyikan search. */
  searchKey?: string
  searchPlaceholder?: string
  isLoading?: boolean
  skeletonRows?: number
  initialPageSize?: number
  pageSizeOptions?: number[]
  initialSorting?: SortingState
  initialVisibility?: ColumnVisibilityState
  emptyTitle?: string
  emptyDescription?: string
}

/**
 * Reusable DataTable client-side (sorting + pagination + column toggle + filter satu kolom).
 * @example
 * const columns: ColumnDef<DataTableFeatures, Payment>[] = [
 *   { accessorKey: "email", header: ({ column }) => <DataTableColumnHeader column={column} title="Email" /> },
 * ];
 * <DataTable columns={columns} data={data} searchKey="email" />
 */
export function DataTable<TData extends RowData>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  isLoading = false,
  skeletonRows = 8,
  initialPageSize = 10,
  pageSizeOptions,
  initialSorting = [],
  initialVisibility = {},
  emptyTitle = "No results.",
  emptyDescription = "Try adjusting your search or filters.",
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<ColumnVisibilityState>(initialVisibility)
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

  const table = useTable({
    features: dataTableFeatures,
    data,
    columns,
    initialState: { pagination: { pageIndex: 0, pageSize: initialPageSize } },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  })

  if (isLoading) {
    return <DataTableSkeleton columns={columns.length} rows={skeletonRows} />
  }

  const rows = table.getRowModel().rows
  const showToolbar = Boolean(searchKey)

  return (
    <div className="flex flex-col gap-4">
      {showToolbar && (
        <div className="flex items-center gap-2">
          <Input
            placeholder={searchPlaceholder}
            value={
              (table.getColumn(searchKey!)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(searchKey!)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DataTableColumnToggle table={table} />
        </div>
      )}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Empty className="border-0">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <SearchX aria-hidden />
                      </EmptyMedia>
                      <EmptyTitle>{emptyTitle}</EmptyTitle>
                      <EmptyDescription>{emptyDescription}</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} pageSizeOptions={pageSizeOptions} />
    </div>
  )
}
