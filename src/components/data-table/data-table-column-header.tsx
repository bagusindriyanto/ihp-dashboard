"use client"

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import type { Column, RowData } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { DataTableFeatures } from "./features"

interface DataTableColumnHeaderProps<TData extends RowData> {
  column: Column<DataTableFeatures, TData>
  title: string
  className?: string
}

/** Header kolom sortable. Non-sortable render teks biasa. */
export function DataTableColumnHeader<TData extends RowData>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData>) {
  if (!column.getCanSort()) {
    return <span className={cn("font-medium", className)}>{title}</span>
  }

  const sorted = column.getIsSorted()
  const Icon =
    sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowUpDown

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={column.getToggleSortingHandler()}
      aria-sort={
        sorted === "asc"
          ? "ascending"
          : sorted === "desc"
            ? "descending"
            : "none"
      }
      className={cn("-ml-2 h-8 data-[state=open]:bg-accent", className)}
    >
      {title}
      <Icon data-icon="inline-end" aria-hidden />
    </Button>
  )
}
