import type { z } from "zod"
import type { SheetRow, SheetValue } from "./types"

const cleanCell = (cell: SheetValue): Exclude<SheetValue, undefined> => {
  const NA_PATTERN =
    /^#(?:N\/A|REF|VALUE|DIV\/0|NAME\?|NULL|NUM|ERROR)(?: ?!?|!? ?)(?:\(.*\))?$/i

  if (cell === null || cell === undefined) return null
  if (typeof cell === "string") {
    const trimmed = cell.trim()
    if (trimmed === "") return null
    if (NA_PATTERN.test(trimmed)) return null
  }
  return cell
}

export const getColumnsFromSchema = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
): (keyof T & string)[] => {
  return Object.keys(schema.shape) as (keyof T & string)[]
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

export const parseValuesToRows = (
  rawRows: SheetValue[][],
  columns: string[]
): SheetRow[] => {
  if (!rawRows) return []

  return rawRows.map((row) =>
    Object.fromEntries(columns.map((column, i) => [column, cleanCell(row[i])]))
  )
}
