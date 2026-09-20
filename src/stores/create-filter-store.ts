// store/createFilterStore.ts
import { create, type StoreApi, type UseBoundStore } from "zustand"

type FilterState<T extends Record<string, unknown>> = {
  filters: T
  pagination: {
    page: number
    pageSize: number
  }
  setFilter: <K extends keyof T>(key: K, value: T[K]) => void
  setFilters: (partial: Partial<T>) => void
  resetFilters: () => void
}

export function createFilterStore<T extends Record<string, unknown>>(
  initialFilters: T
): UseBoundStore<StoreApi<FilterState<T>>> {
  return create<FilterState<T>>()((set) => ({
    filters: initialFilters,
    pagination: { page: 1, pageSize: 10 },

    setFilter: (key, value) =>
      set((state) => ({
        filters: { ...state.filters, [key]: value },
        pagination: { ...state.pagination, page: 1 },
      })),

    setFilters: (partial) =>
      set((state) => ({
        filters: { ...state.filters, ...partial },
        pagination: { ...state.pagination, page: 1 },
      })),

    resetFilters: () =>
      set({
        filters: initialFilters,
        pagination: { page: 1, pageSize: 10 },
      }),
  }))
}
