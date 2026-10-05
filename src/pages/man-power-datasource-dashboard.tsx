import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  DataTable,
  DataTableColumnHeader,
  facetedFilterFn,
  type DataTableFeatures,
} from "@/components/data-table"
import { useMemo } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { SearchXIcon } from "lucide-react"
import { useSheetData } from "@/hooks/use-sheet-data"
import type { ManPower } from "@/features/man-power/schema"
import { formatTenure } from "@/features/man-power/tenure"
import { dropEmptyRows, isZeroValue } from "@/lib/drop-empty-rows"
import { SourceSheetLink } from "@/components/source-sheet-link"
import { SHEETS_REGISTRY } from "@/config/sheets-registry"

const textCell = (key: keyof ManPower) => {
  const Cell = ({ row }: { row: { getValue: (id: string) => unknown } }) =>
    ((row.getValue(key) as ManPower[typeof key]) ?? "-") as string
  Cell.displayName = `ManPower${key}Cell`
  return Cell
}

const tenureCell = ({ row }: { row: { getValue: (id: string) => unknown } }) =>
  formatTenure(row.getValue("monthTenure") as number | null)
tenureCell.displayName = "ManPowerTenureCell"

const columns: ColumnDef<DataTableFeatures, ManPower>[] = [
  {
    accessorKey: "nip",
    meta: { label: "NIP" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="NIP" />
    ),
    cell: textCell("nip"),
  },
  {
    accessorKey: "name",
    meta: { label: "Nama" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama" />
    ),
    cell: textCell("name"),
  },
  {
    accessorKey: "division",
    meta: { label: "Divisi" },
    filterFn: facetedFilterFn,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Divisi" />
    ),
    cell: textCell("division"),
  },
  {
    accessorKey: "section",
    meta: { label: "Section" },
    filterFn: facetedFilterFn,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Section" />
    ),
    cell: textCell("section"),
  },
  {
    accessorKey: "job",
    meta: { label: "Job" },
    filterFn: facetedFilterFn,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Job" />
    ),
    cell: textCell("job"),
  },
  {
    accessorKey: "jobdesc",
    meta: { label: "Jobdesk" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jobdesk" />
    ),
    cell: textCell("jobdesc"),
  },
  {
    accessorKey: "zone",
    meta: { label: "Zona" },
    filterFn: facetedFilterFn,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Zona" />
    ),
    cell: textCell("zone"),
  },
  {
    accessorKey: "monthTenure",
    meta: { label: "Masa Kerja" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Masa Kerja" />
    ),
    cell: tenureCell,
  },
  {
    accessorKey: "kategoriMasaKerja",
    meta: { label: "Kategori Masa Kerja" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kategori Masa Kerja" />
    ),
    cell: textCell("kategoriMasaKerja"),
  },
  {
    accessorKey: "leader",
    meta: { label: "Leader/Mentor" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Leader/Mentor" />
    ),
    cell: textCell("leader"),
  },
  {
    accessorKey: "foreman",
    meta: { label: "Foreman" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Foreman" />
    ),
    cell: textCell("foreman"),
  },
  {
    accessorKey: "labourStatus",
    meta: { label: "Labour Status" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Labour Status" />
    ),
    cell: textCell("labourStatus"),
  },
  {
    accessorKey: "absence",
    meta: { label: "Absensi" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Absensi" />
    ),
    cell: textCell("absence"),
  },
  {
    accessorKey: "lokasiAbsen",
    meta: { label: "Lokasi Absensi" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lokasi Absensi" />
    ),
    cell: textCell("lokasiAbsen"),
  },
  {
    accessorKey: "shift",
    meta: { label: "Shift" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Shift" />
    ),
    cell: textCell("shift"),
  },
]

export default function ManPowerDashboard() {
  const { data, isPending, isError } = useSheetData("manPower", "employees")
  const employees = useMemo(
    () => dropEmptyRows(data ?? [], "nip", isZeroValue),
    [data]
  )

  if (isError)
    return (
      <Empty className="h-full">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchXIcon />
          </EmptyMedia>
          <EmptyTitle>Data Gagal Dimuat</EmptyTitle>
          <EmptyDescription>
            Silahkan coba beberapa saat lagi atau refresh halaman.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )

  return (
    <section className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Man Power</CardTitle>
          <CardDescription>Daftar data man power</CardDescription>
          <CardAction>
            <SourceSheetLink
              spreadsheetId={SHEETS_REGISTRY.manPower.spreadsheetId}
            />
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={employees}
            searchKey="name"
            searchPlaceholder="Cari nama karyawan..."
            facetedFilters={[
              { key: "division", title: "Divisi" },
              { key: "section", title: "Section" },
              { key: "job", title: "Job" },
              { key: "zone", title: "Zona" },
            ]}
            isLoading={isPending}
            initialPageSize={20}
          />
        </CardContent>
      </Card>
    </section>
  )
}
