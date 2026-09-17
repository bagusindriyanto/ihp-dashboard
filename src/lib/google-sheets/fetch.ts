import type { z } from "zod"
import { buildSheetUrl } from "./client"
import type { SheetValue } from "./types"
import { getColumnsFromSchema, parseValuesToRows } from "./helper"

type GoogleSheetResponse = {
  values?: SheetValue[][]
}

type FetchSheetParams = {
  spreadsheetId: string
  sheetName: string
  range: string
}

const fetchSheet = async ({
  spreadsheetId,
  sheetName,
  range,
}: FetchSheetParams): Promise<SheetValue[][]> => {
  const url = buildSheetUrl(spreadsheetId, sheetName, range)
  const res = await fetch(url)

  if (!res.ok) {
    const detail = await res.text().catch(() => "")
    let message = `Gagal fetch "${sheetName}" (${res.status})`
    try {
      const body = JSON.parse(detail)
      message = body?.error?.message || message
    } catch {
      // ignore non-JSON error body
    }
    throw new Error(message)
  }

  const data: GoogleSheetResponse = await res.json()
  return data.values ?? []
}

export const fetchAndValidateSheet = async <T extends z.ZodRawShape>({
  schema,
  ...params
}: FetchSheetParams & { schema: z.ZodObject<T> }) => {
  const columns = getColumnsFromSchema(schema)
  const rawRows = await fetchSheet(params)
  const parsedRows = parseValuesToRows(rawRows, columns)

  const valid: z.infer<z.ZodObject<T>>[] = []
  const errors: { index: number; issues: z.core.$ZodIssue[] }[] = []

  parsedRows.forEach((row, index) => {
    const result = schema.safeParse(row)

    if (result.success) {
      valid.push(result.data)
    } else {
      errors.push({ index, issues: result.error.issues })
    }
  })

  return { data: valid, invalidCount: errors.length, errors }
}
