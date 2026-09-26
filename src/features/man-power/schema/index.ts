import { sheetsSerialToDate } from "@/lib/google-sheets/helper"
import { z } from "zod"

/**Schema untuk data tanggal yang nullable */
const sheetDateField = () =>
  z
    .number()
    .nullable()
    .transform((val) => {
      if (val === null) return null
      return sheetsSerialToDate(val)
    })

/*
- pastikan ketika menulis schema, urutan nama field harus sama persis dengan urutan kolom di google sheets
- gunakan camelCase untuk nama field
- tidak boleh ada spasi atau karakter khusus di nama field
*/
export const manPowerSchema = z.object({
  nip: z.string().nullable(),
  name: z.string().nullable(),
  division: z.string().nullable(),
  section: z.string().nullable(),
  job: z.string().nullable(),
  joinDate: sheetDateField(),
  monthTenure: z.coerce.number().nullable(),
  tenure: z.string().nullable(),
  tenureCategory: z.string().nullable(),
  jobdesc: z.string().nullable(),
  zone: z.string().nullable(),
  leader: z.string().nullable(),
  foreman: z.string().nullable(),
  labourStatus: z.string().nullable(),
  absence: z.string().nullable(),
})

export type ManPower = z.infer<typeof manPowerSchema>
