/**
 * Buang baris yang kolom kuncinya kosong (null/undefined/string kosong).
 * `isExtraEmpty` untuk aturan tambahan per sheet (misal NIP "0" di manpower).
 */
export const dropEmptyRows = <T extends object>(
  rows: T[],
  key: keyof T,
  isExtraEmpty: (value: unknown) => boolean = () => false
) =>
  rows.filter((row) => {
    const value: unknown = row[key]
    if (value === null || value === undefined) return false
    if (typeof value === "string" && value.trim() === "") return false
    if (isExtraEmpty(value)) return false
    return true
  })

/** Predikat tambahan: nilai "0"/0 dianggap kosong (misal NIP manpower). */
export const isZeroValue = (value: unknown) => String(value).trim() === "0"
