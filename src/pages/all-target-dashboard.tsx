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
import type { AllTarget } from "@/features/all-target/schema"

const columns = [
  ["kodeStyle", "Kode Style"],
  ["style", "Style"],
  ["grupStyle", "Group Style"],
  ["part", "Part"],
  ["prc", "PRC"],
  ["jenisPrinting", "Jenis Printing"],
  ["targetKomitmenTenHours", "Target Komitmen 10 Jam"],
  ["targetKomitmenOneHours", "Target Komitmen 1 Jam"],
  ["proporsiMeja", "Proporsi Meja"],
  ["paCosting", "PA Costing"],
  ["paAktual", "PA Aktual"],
  ["targetByOB", "Target By OB"],
  ["cycle", "Cycle"],
  ["targetCycle", "Target Cycle"],
  ["targetPaOneHours", "Target PA 1 Jam"],
  ["targetPaSevenHours", "Target PA 7 Jam"],
  ["targetPaTenHours", "Target PA 10 Jam"],
] as const satisfies [keyof AllTarget, string][]

export default function AllTargetDashboard() {
  const { data, isPending, isError } = useSheetData("targetIHP", "allTarget")

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
          <CardTitle>All Target IHP</CardTitle>
          <CardDescription>Daftar data all target IHP</CardDescription>
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
                {data.map((target, index) => (
                  <TableRow key={target.kodeStyle ?? index}>
                    <TableCell className="text-right">{index + 1}</TableCell>
                    {columns.map(([key]) => (
                      <TableCell key={key}>{target[key] ?? "-"}</TableCell>
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
