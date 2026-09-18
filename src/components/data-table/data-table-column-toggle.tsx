"use client"

import { Settings2 } from "lucide-react"
import type { ReactTable, RowData } from "@tanstack/react-table"
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

/** Dropdown untuk toggle visibilitas kolom (hanya kolom yang getCanHide()). */
export function DataTableColumnToggle<TData extends RowData>({
  table,
}: {
  table: ReactTable<DataTableFeatures, TData>
}) {
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
            Columns
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={table.getIsAllColumnsVisible()}
            onCheckedChange={(value) => table.toggleAllColumnsVisible(!!value)}
          >
            Toggle all
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
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
