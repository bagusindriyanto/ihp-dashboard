import { createFilterStore } from "@/store/create-filter-store"

export type ManPowerFilters = {
  search: string
  dateRange: {
    start: Date | null
    end: Date | null
  }
}

const manPowerInitialFilters: ManPowerFilters = {
  search: "",
  dateRange: { start: null, end: null },
}

export const useManPowerStore = createFilterStore<ManPowerFilters>(
  manPowerInitialFilters
)
