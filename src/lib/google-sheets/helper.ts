import type { SheetRow, SheetValue } from "./types"

const cleanCell = (cell: SheetValue): SheetValue => {
  const NA_PATTERN =
    /^#(?:N\/A|REF|VALUE|DIV\/0|NAME\?|NULL|NUM|ERROR)(?: ?!?|!? ?)(?:\(.*\))?$/i

  if (cell === null) return null
  if (typeof cell === "string") {
    const trimmed = cell.trim()
    if (trimmed === "") return null
    if (NA_PATTERN.test(trimmed)) return null
  }
  return cell
}

const dedupeHeaders = (rawHeaders: string[]): string[] => {
  const seen = new Map<string, number>()

  return rawHeaders.map((header, idx) => {
    const base = header || `col_${idx}` // handle header kosong juga
    const count = seen.get(base) ?? 0
    seen.set(base, count + 1)
    return count === 0 ? base : `${base}_${count}`
    // "Nama", "Nama" -> "Nama", "Nama_1"
  })
}

/**
 * Konversi Google Sheets serial date number ke JavaScript Date.
 * Epoch Sheets: 30 Desember 1899 (bukan 31, karena bug historis Lotus 1-2-3
 * yang dipertahankan Google Sheets & Excel untuk kompatibilitas)
 */
export const sheetsSerialToDate = (serial: number): Date => {
  const SHEETS_EPOCH = Date.UTC(1899, 11, 30) // bulan 0-indexed, jadi 11 = Desember
  const MS_PER_DAY = 24 * 60 * 60 * 1000

  const ms = SHEETS_EPOCH + serial * MS_PER_DAY
  return new Date(ms)
}

export const parseValuesToRows = (values: SheetValue[][]): SheetRow[] => {
  if (!values || values.length <= 1) return []

  const headerRow = values[0].map((header) => String(header ?? "").trim())
  const dataRows = values.slice(1)

  const headers = dedupeHeaders(headerRow)

  return dataRows.map((row) =>
    Object.fromEntries(headers.map((header, i) => [header, cleanCell(row[i])]))
  )
}
