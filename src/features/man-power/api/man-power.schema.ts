import { sheetsSerialToDate } from "@/lib/google-sheets/helper"
import z from "zod"

const sheetDateField = () =>
  z
    .number()
    .nullable()
    .transform((val) => {
      if (val === null) return null
      return sheetsSerialToDate(val)
    })

export const manPowerSchema = z
  .object({
    NIP: z.string().nullable(),
    Name: z.string().nullable(),
    Division: z.string().nullable(),
    Section: z.string().nullable(),
    Job: z.string().nullable(),
    "Join Date": sheetDateField(),
    "Masa Kerja (Bulan)": z.coerce.number().nullable(),
    Jobdesk: z.string().nullable(),
    Zona: z.string().nullable(),
    "Leader/Mentor": z.string().nullable(),
    Foreman: z.string().nullable(),
    "Labour Status": z.string().nullable(),
    ABSENSI: z.string().nullable(),
  })
  .transform((row) => ({
    nip: row.NIP,
    name: row.Name,
    division: row.Division,
    section: row.Section,
    job: row.Job,
    joinDate: row["Join Date"],
    monthTenure: row["Masa Kerja (Bulan)"],
    jobdesc: row.Jobdesk,
    zone: row.Zona,
    leader: row["Leader/Mentor"],
    foreman: row.Foreman,
    labourStatus: row["Labour Status"],
    absence: row.ABSENSI,
  }))

export const manPowerListSchema = z.array(manPowerSchema)

export type ManPower = z.output<typeof manPowerSchema>
