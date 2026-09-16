import { useQuery } from "@tanstack/react-query"
import type { z } from "zod"
import type { SheetConfig } from "@/config/sheet-config.types"
import { SHEETS_REGISTRY } from "@/config/sheets-registry"
import { fetchAndValidateSheet } from "@/lib/google-sheets/fetch"

type Registry = typeof SHEETS_REGISTRY
type SpreadsheetKey = keyof Registry
type SheetKey<T extends SpreadsheetKey> = keyof Registry[T]["sheets"]
type SheetShape<T extends SpreadsheetKey, U extends SheetKey<T>> =
  Registry[T]["sheets"][U] extends SheetConfig<infer Shape> ? Shape : never

export const fetchData = async <T extends z.ZodRawShape>(
  spreadsheetId: string,
  sheetConfig: SheetConfig<T>
) => {
  try {
    const { data, invalidCount, errors } = await fetchAndValidateSheet({
      spreadsheetId,
      ...sheetConfig,
    })

    if (invalidCount > 0) {
      if (data.length === 0) {
        throw new Error(`${invalidCount} baris tidak sesuai schema`, {
          cause: errors,
        })
      }

      console.warn(
        `${invalidCount} baris dilewati karena tidak sesuai schema`,
        errors
      )
    }

    return data
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Kesalahan tidak dikenal"
    throw new Error(`Gagal memuat data: ${message}`, { cause: err })
  }
}

export const useSheetData = <T extends SpreadsheetKey, U extends SheetKey<T>>(
  spreadsheetKey: T,
  sheetKey: U
) => {
  const spreadsheetConfig = SHEETS_REGISTRY[spreadsheetKey]
  const sheets: Registry[T]["sheets"] = spreadsheetConfig.sheets
  const sheetConfig = sheets[sheetKey] as SheetConfig<SheetShape<T, U>>

  return useQuery({
    queryKey: ["sheet", spreadsheetKey, sheetKey],
    queryFn: () => fetchData(spreadsheetConfig.spreadsheetId, sheetConfig),
  })
}
