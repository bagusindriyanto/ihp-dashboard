/**
 * FilterFn multi-select: nilai filter berupa array string.
 * Cocok OR dalam satu kolom, array kosong/undefined = tidak memfilter.
 */
export function facetedFilterFn(
  row: { getValue: (columnId: string) => unknown },
  columnId: string,
  filterValue: unknown,
) {
  if (!Array.isArray(filterValue) || filterValue.length === 0) return true
  return filterValue.includes(row.getValue(columnId))
}
