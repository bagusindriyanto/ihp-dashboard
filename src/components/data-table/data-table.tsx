import { useState } from "react"
import {
  useTable,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type RowData,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table"
import { Search, SearchX } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
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

export type DataTableProps<TData extends RowData> = {
  columns: ColumnDef<DataTableFeatures, TData>[]
  data: TData[]
  /** accessorKey kolom yang difilter via search box. Kosongkan untuk sembunyikan search. */
  searchKey?: keyof TData[][number]
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
  skeletonRows = 10,
  initialPageSize = 10,
  pageSizeOptions,
  initialSorting = [],
  initialVisibility = {},
  emptyTitle = "Tidak ada hasil",
  emptyDescription = "Coba sesuaikan pencarian atau filter Anda.",
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] =
    useState<ColumnVisibilityState>(initialVisibility)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

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

  const rows = table.getRowModel().rows
  const showToolbar = Boolean(searchKey)

  if (isLoading) {
    return (
      <DataTableSkeleton
        columns={columns.length}
        rows={skeletonRows}
        showToolbar={showToolbar}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {showToolbar && (
        <div className="flex items-center gap-2">
          <InputGroup className="max-w-sm">
            <InputGroupInput
              placeholder={searchPlaceholder}
              value={
                (table
                  .getColumn(String(searchKey))
                  ?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table
                  .getColumn(String(searchKey))
                  ?.setFilterValue(event.target.value)
              }
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            {table.getColumn(String(searchKey))?.getFilterValue() ? (
              <InputGroupAddon align="inline-end">
                {table.getFilteredRowModel().rows.length} hasil
              </InputGroupAddon>
            ) : null}
          </InputGroup>
          <DataTableColumnToggle table={table} />
        </div>
      )}
      <div className="overflow-hidden rounded-md border">
        <Table containerClassName="no-scrollbar">
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
