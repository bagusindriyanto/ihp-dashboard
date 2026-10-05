import { useMemo, useState } from "react"
import {
  useTable,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type RowData,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table"
import { Search, SearchX, X } from "lucide-react"
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
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { Button } from "@/components/ui/button"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableSkeleton } from "./data-table-skeleton"

export type DataTableProps<TData extends RowData, TKey extends keyof TData> = {
  columns: ColumnDef<DataTableFeatures, TData>[]
  data: TData[]
  /** accessorKey kolom yang difilter via search box. Kosongkan untuk sembunyikan search. */
  searchKey?: TKey
  searchPlaceholder?: string
  /** Filter multi-select per kolom (OR dalam kolom, AND antar kolom). */
  facetedFilters?: { key: TKey; title: string }[]
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
export function DataTable<TData extends RowData, TKey extends keyof TData>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  facetedFilters = [],
  isLoading = false,
  skeletonRows = 10,
  initialPageSize = 10,
  pageSizeOptions,
  initialSorting = [],
  initialVisibility = {},
  emptyTitle = "Tidak ada hasil",
  emptyDescription = "Coba sesuaikan pencarian atau filter Anda.",
}: DataTableProps<TData, TKey>) {
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
  const showToolbar = Boolean(searchKey) || facetedFilters.length > 0
  const hasActiveFilter = table.state.columnFilters.length > 0

  // Opsi unik per kolom filter, diambil dari data (buang null/kosong).
  const facetedOptions = useMemo(() => {
    const map = new Map<string, string[]>()
    for (const filter of facetedFilters) {
      const values = new Set<string>()
      for (const row of data) {
        const value = row[filter.key]
        if (typeof value === "string" && value.trim() !== "") values.add(value)
      }
      map.set(
        String(filter.key),
        [...values].sort((a, b) => a.localeCompare(b, "id"))
      )
    }
    return map
  }, [data, facetedFilters])

  const handleFacetedChange = (key: string, next: string[]) => {
    table.getColumn(key)?.setFilterValue(next.length > 0 ? next : undefined)
    table.firstPage()
  }

  const handleResetFilters = () => {
    table.resetColumnFilters()
    table.firstPage()
  }

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
        <div className="flex flex-wrap items-center gap-2">
          {searchKey && (
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
          )}
          {facetedFilters.map((filter) => {
            const key = String(filter.key)
            const selected =
              (table.getColumn(key)?.getFilterValue() as
                string[] | undefined) ?? []
            return (
              <DataTableFacetedFilter
                key={key}
                title={filter.title}
                options={facetedOptions.get(key) ?? []}
                selected={selected}
                onChange={(next) => handleFacetedChange(key, next)}
              />
            )
          })}
          {hasActiveFilter && (
            <Button variant="ghost" size="sm" onClick={handleResetFilters}>
              <X data-icon="inline-start" aria-hidden />
              Reset
            </Button>
          )}
          <DataTableColumnToggle table={table} />
        </div>
      )}
      <div className="overflow-hidden rounded-md border [&_thead]:bg-accent/15">
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
