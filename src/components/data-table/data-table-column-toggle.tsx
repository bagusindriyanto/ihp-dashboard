import type { ReactTable, RowData } from "@tanstack/react-table"
import { Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { DataTableFeatures } from "./features"

type DataTableColumnToggleProps<TData extends RowData> = {
  table: ReactTable<DataTableFeatures, TData>
}

/** Dropdown untuk toggle visibilitas kolom (hanya kolom yang getCanHide()). */
export function DataTableColumnToggle<TData extends RowData>({
  table,
}: DataTableColumnToggleProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="ml-auto hidden lg:flex"
          >
            <Settings2 data-icon="inline-start" aria-hidden />
            Atur Kolom
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-fit">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Atur visibilitas kolom</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={table.getIsAllColumnsVisible()}
            onCheckedChange={(value) => table.toggleAllColumnsVisible(!!value)}
          >
            Semua kolom
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide()
            )
            .map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.columnDef.meta?.label ?? column.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
