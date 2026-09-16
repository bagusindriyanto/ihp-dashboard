import type { z } from "zod"

export type SheetConfig<T extends z.ZodRawShape = z.ZodRawShape> = {
  sheetName: string
  range: string
  schema: z.ZodObject<T>
}

export type SpreadsheetConfig = {
  spreadsheetId: string
  sheets: {
    [sheetKey: string]: SheetConfig
  }
}
