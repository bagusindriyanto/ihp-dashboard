"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface DataTableSkeletonProps {
  columns?: number
  rows?: number
  showToolbar?: boolean
  className?: string
}

/** Loading placeholder dengan bentuk tabel. */
export function DataTableSkeleton({
  columns = 5,
  rows = 8,
  showToolbar = true,
  className,
}: DataTableSkeletonProps) {
  return (
    <div
      className={cn("flex flex-col gap-4", className)}
      aria-busy="true"
      aria-label="Loading table"
    >
      {showToolbar && (
        <div className="flex items-center gap-2 py-4">
          <Skeleton className="h-8 w-full max-w-sm" />
          <Skeleton className="ml-auto hidden h-8 w-24 lg:block" />
        </div>
      )}
      <div className="overflow-hidden rounded-md border">
        <div className="flex gap-2 border-b bg-muted/50 p-2">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-5 flex-1" />
          ))}
        </div>
        <div className="flex flex-col gap-2 p-2">
          {Array.from({ length: rows }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
