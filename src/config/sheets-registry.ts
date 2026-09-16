import { manPowerSchema } from "@/features/man-power/schema"
import type { SpreadsheetConfig } from "./sheet-config.types"

export const SHEETS_REGISTRY = {
  manPower: {
    spreadsheetId: "1R--Xp5ZlyaXUFg68K6TuExzVhBS_vtN9xZqtBFEW60E",
    sheets: {
      employees: {
        sheetName: "DATA MP (UPDATED)",
        range: "D2:V",
        schema: manPowerSchema,
      },
    },
  },
} as const satisfies Record<string, SpreadsheetConfig>
