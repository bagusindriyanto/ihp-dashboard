import { z } from "zod"

/*
- pastikan ketika menulis schema, urutan nama field harus sama persis dengan urutan kolom di google sheets
- gunakan camelCase untuk nama field
- tidak boleh ada spasi atau karakter khusus di nama field
*/
export const allTargetSchema = z.object({
  style: z.string().nullable(),
  grupStyle: z.string().nullable(),
  part: z.string().nullable(),
  prc: z.string().nullable(),
  jenisPrinting: z.string().nullable(),
  kodeStylePrc: z.string().nullable(),
  partPrc: z.string().nullable(),
  stylePrc: z.string().nullable(),
  kodeStyle: z.string().nullable(),
  targetKomitmenTenHours: z.coerce.number().nullable(),
  targetKomitmenOneHours: z.coerce.number().nullable(),
  proporsiMeja: z.string().nullable(),
  paCosting: z.coerce.number().nullable(),
  paAktual: z.coerce.number().nullable(),
  targetByOB: z.coerce.number().nullable(),
  cycle: z.coerce.number().nullable(),
  targetCycle: z.coerce.number().nullable(),
  targetPaOneHours: z.coerce.number().nullable(),
  targetPaSevenHours: z.coerce.number().nullable(),
  targetPaTenHours: z.coerce.number().nullable(),
})

export type AllTarget = z.infer<typeof allTargetSchema>
