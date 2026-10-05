import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronDown } from "lucide-react"

type DataTableFacetedFilterProps = {
  title: string
  options: string[]
  selected: string[]
  onChange: (next: string[]) => void
}

/** Dropdown multi-select untuk satu kolom (dipakai via prop `facetedFilters` DataTable). */
export function DataTableFacetedFilter({
  title,
  options,
  selected,
  onChange,
}: DataTableFacetedFilterProps) {
  const toggle = (option: string) =>
    onChange(
      selected.includes(option)
        ? selected.filter((value) => value !== option)
        : [...selected, option],
    )

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" size="sm">
            {title}
            {selected.length > 0 && (
              <Badge variant="secondary">{selected.length}</Badge>
            )}
            <ChevronDown data-icon="inline-end" aria-hidden />
          </Button>
        }
      />
      <PopoverContent align="start" className="w-56 p-0">
        <div className="flex items-center justify-between px-2.5 pt-2">
          <span className="text-sm font-medium">{title}</span>
          {selected.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => onChange([])}>
              Hapus
            </Button>
          )}
        </div>
        <div className="max-h-60 overflow-y-auto p-1.5 dark:[color-scheme:dark]">
          {options.length > 0 ? (
            <div className="flex flex-col gap-0.5">
              {options.map((option) => {
                const checked = selected.includes(option)
                return (
                  <div
                    key={option}
                    onClick={() => toggle(option)}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1.5 text-sm hover:bg-muted"
                  >
                    <Checkbox
                      checked={checked}
                      onClick={(event) => event.stopPropagation()}
                      onCheckedChange={() => toggle(option)}
                      aria-label={option}
                    />
                    <span className="flex-1 truncate">{option}</span>
                    {checked && <Check aria-hidden />}
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="px-1.5 py-4 text-center text-sm text-muted-foreground">
              Tidak ada opsi
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
