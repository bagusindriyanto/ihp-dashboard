import { manPowerSchema } from "@/features/man-power/schema"
import { allTargetSchema } from "@/features/all-target/schema"
import type { SpreadsheetConfig } from "./sheet-config.types"
import { outputPrintingSchema } from "@/features/output-printing/schema"
import { outputTPRSchema } from "@/features/output-tpr/schema"
import { outputDirbonSchema } from "@/features/output-dirbon/schema"

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

  targetIHP: {
    spreadsheetId: "1Gd0OqDAIS6Ed08QJpdaEz6TF5-ZUNsq9hpA4diiNmkQ",
    sheets: {
      allTarget: {
        sheetName: "DATABASE ALL TARGET",
        range: "B4:U",
        schema: allTargetSchema,
      },
    },
  },

  inputOutput: {
    spreadsheetId: "1Z5k7RuMQa-zlJr8dk2eUQ5NlVlpkDJCtMAk5HPoJeJE",
    sheets: {
      outputPrinting: {
        sheetName: "Output Printing/Jam",
        range: "A4:AJ100",
        schema: outputPrintingSchema,
      },
      outputTPR: {
        sheetName: "Output TPR/Jam",
        range: "A3:AO100",
        schema: outputTPRSchema,
      },
      outputDirbon: {
        sheetName: "OUTPUT DIRBON/JAM",
        range: "A4:AO100",
        schema: outputDirbonSchema,
      },
    },
  },
} as const satisfies Record<string, SpreadsheetConfig>
