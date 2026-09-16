import { SHEETS } from "@/config/sheet-config"
import { fetchSheet } from "@/lib/google-sheets/fetch"
import { manPowerListSchema } from "./man-power.schema"
import z, { ZodError } from "zod"

export const fetchManPower = async () => {
  try {
    const data = await fetchSheet({
      spreadsheetId: SHEETS.manPower.spreadsheetId,
      ...SHEETS.manPower.mp,
    })

    return manPowerListSchema.parse(data)
  } catch (err) {
    if (err instanceof ZodError) {
      console.error("Schema mismatch:", z.treeifyError(err))
    }
    throw err
  }
}
