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
export const outputTPRSchema = z.object({
  tanggal: sheetDateField(),
  week: z.coerce.number().nullable(),
  leader: z.string().nullable(),
  idOperator: z.string().nullable(),
  nama: z.string().nullable(),
  line: z.string().nullable(),
  shift: z.coerce.number().nullable(),
  spoGr: z.string().nullable(),
  spo: z.string().nullable(),
  kodeStyle: z.string().nullable(),
  style: z.string().nullable(),
  buyer: z.string().nullable(),
  passionBrand: z.string().nullable(),
  noProses: z.string().nullable(),
  prc: z.string().nullable(),
  part: z.string().nullable(),
  size: z.string().nullable(),
  emptyColumn1: z.string().nullable(),
  outputSatu: z.coerce.number().nullable(),
  outputDua: z.coerce.number().nullable(),
  outputTiga: z.coerce.number().nullable(),
  outputEmpat: z.coerce.number().nullable(),
  outputLima: z.coerce.number().nullable(),
  outputEnam: z.coerce.number().nullable(),
  outputTujuh: z.coerce.number().nullable(),
  outputDelapan: z.coerce.number().nullable(),
  outputSembilan: z.coerce.number().nullable(),
  outputSepuluh: z.coerce.number().nullable(),
  emptyColumn2: z.string().nullable(),
  totalMold: z.coerce.number().nullable(),
  totalPcs: z.coerce.number().nullable(),
  totalPcsJam: z.coerce.number().nullable(),
  totalMP: z.coerce.number().nullable(),
  targetPAOneHours: z.coerce.number().nullable(),
  smv: z.coerce.number().nullable(),
  totalJK: z.coerce.number().nullable(),
  targetShift: z.coerce.number().nullable(),
  targetPerJam: z.coerce.number().nullable(),
  efisiensiSMV: z.coerce.number().nullable(),
  efisiensiPA: z.coerce.number().nullable(),
  remark: z.string().nullable(),
})

export type OutputTPR = z.infer<typeof outputTPRSchema>
