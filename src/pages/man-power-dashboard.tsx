import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Spinner } from "@/components/ui/spinner"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { SearchXIcon } from "lucide-react"
import { useSheetData } from "@/hooks/use-sheet-data"
import type { ManPower } from "@/features/man-power/schema"

const columns = [
  ["nip", "NIP"],
  ["name", "Name"],
  ["division", "Division"],
  ["section", "Section"],
  ["job", "Job"],
  ["joinDate", "Join Date"],
  ["monthTenure", "Masa Kerja (Bulan)"],
  ["jobdesc", "Jobdesk"],
  ["zone", "Zona"],
  ["leader", "Leader/Mentor"],
  ["foreman", "Foreman"],
  ["labourStatus", "Labour Status"],
  ["absence", "Absensi"],
] as const satisfies [keyof ManPower, string][]

export default function ManPowerDashboard() {
  const { data, isPending, isError } = useSheetData("manPower", "employees")

  if (isPending)
    return (
      <section className="flex h-full items-center justify-center">
        <Spinner className="size-10 text-primary" />
      </section>
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
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh] overflow-auto rounded-md border">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-secondary">
                <TableRow>
                  <TableHead className="text-right">#</TableHead>
                  {columns.map(([, label]) => (
                    <TableHead key={label}>{label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((person, index) => (
                  <TableRow key={person.nip ?? index}>
                    <TableCell className="text-right">{index + 1}</TableCell>
                    {columns.map(([key]) => (
                      <TableCell key={key}>
                        {person[key] instanceof Date
                          ? person[key].toLocaleDateString("id-ID")
                          : (person[key] ?? "-")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </section>
  )
}
