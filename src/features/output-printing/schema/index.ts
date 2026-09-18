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
export const outputPrintingSchema = z.object({
  date: sheetDateField(),
  week: z.coerce.number().nullable(),
  idOperator: z.string().nullable(),
  nama: z.string().nullable(),
  meja: z.string().nullable(),
  jenisPrinting: z.string().nullable(),
  shift: z.coerce.number().nullable(),
  leader: z.string().nullable(),
  spoGr: z.string().nullable(),
  spo: z.string().nullable(),
  kodeStyle: z.string().nullable(),
  style: z.string().nullable(),
  prc: z.string().nullable(),
  part: z.string().nullable(),
  buyer: z.string().nullable(),
  passionBrand: z.string().nullable(),
  kategoriPrint: z.string().nullable(),
  size: z.string().nullable(),
  unit: z.string().nullable(),
  pcsOrLbr: z.coerce.number().nullable(),
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
  total: z.coerce.number().nullable(),
  totalPcs: z.coerce.number().nullable(),
  jam: z.coerce.number().nullable(),
  angkatan: z.coerce.number().nullable(),
  menit: z.coerce.number().nullable(),
  remarks: z.string().nullable(),
})

export type OutputPrinting = z.infer<typeof outputPrintingSchema>
