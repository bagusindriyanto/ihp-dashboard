import {
  Card,
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
  type DataTableFeatures,
} from "@/components/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { SearchXIcon } from "lucide-react"
import { useSheetData } from "@/hooks/use-sheet-data"
import type { ManPower } from "@/features/man-power/schema"

const textCell = (key: keyof ManPower) => {
  const Cell = ({ row }: { row: { getValue: (id: string) => unknown } }) =>
    ((row.getValue(key) as ManPower[typeof key]) ?? "-") as string
  Cell.displayName = `ManPower${key}Cell`
  return Cell
}

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
    meta: { label: "Name" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: textCell("name"),
  },
  {
    accessorKey: "division",
    meta: { label: "Division" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Division" />
    ),
    cell: textCell("division"),
  },
  {
    accessorKey: "section",
    meta: { label: "Section" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Section" />
    ),
    cell: textCell("section"),
  },
  {
    accessorKey: "job",
    meta: { label: "Job" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Job" />
    ),
    cell: textCell("job"),
  },
  {
    accessorKey: "joinDate",
    meta: { label: "Join Date" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Join Date" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("joinDate") as ManPower["joinDate"]
      return value instanceof Date ? value.toLocaleDateString("id-ID") : "-"
    },
  },
  {
    accessorKey: "monthTenure",
    meta: { label: "Masa Kerja (Bulan)" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Masa Kerja (Bulan)" />
    ),
    cell: ({ row }) =>
      ((row.getValue("monthTenure") as ManPower["monthTenure"]) ?? "-") as
        number | string,
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Zona" />
    ),
    cell: textCell("zone"),
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
]

export default function ManPowerDashboard() {
  const { data, isPending, isError, dataUpdatedAt } = useSheetData(
    "manPower",
    "employees"
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
          <CardDescription>
            Terakhir diperbarui:{" "}
            {new Date(dataUpdatedAt).toLocaleString("id-ID") || "-"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data ?? []}
            searchKey="name"
            searchPlaceholder="Cari nama karyawan..."
            isLoading={isPending}
            initialPageSize={10}
          />
        </CardContent>
      </Card>
    </section>
  )
}
