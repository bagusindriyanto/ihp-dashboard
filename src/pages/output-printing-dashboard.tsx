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
import type { OutputPrinting } from "@/features/output-printing/schema"

const columns = [
  ["date", "Date"],
  ["week", "Week"],
  ["idOperator", "ID Operator"],
  ["nama", "Nama"],
  ["meja", "Meja"],
  ["jenisPrinting", "Manual/Oval"],
  ["shift", "Shift"],
  ["leader", "Leader"],
  ["spoGr", "SPO/GR"],
  ["spo", "SPO"],
  ["kodeStyle", "Kode Style"],
  ["style", "Style"],
  ["prc", "PRC"],
  ["part", "Part"],
  ["buyer", "Buyer"],
  ["passionBrand", "Passion Brand"],
  ["kategoriPrint", "Kategori Print"],
  ["size", "Size"],
  ["unit", "Unit"],
  ["pcsOrLbr", "PCS / LBR"],
  ["outputSatu", "1"],
  ["outputDua", "2"],
  ["outputTiga", "3"],
  ["outputEmpat", "4"],
  ["outputLima", "5"],
  ["outputEnam", "6"],
  ["outputTujuh", "7"],
  ["outputDelapan", "8"],
  ["outputSembilan", "9"],
  ["outputSepuluh", "10"],
  ["total", "Total"],
  ["totalPcs", "Total PCS"],
  ["jam", "Jam"],
  ["angkatan", "Angkatan"],
  ["menit", "Menit"],
  ["remarks", "Remark"],
] as const satisfies [keyof OutputPrinting, string][]

export default function OutputPrintingDashboard() {
  const { data, isPending, isError } = useSheetData(
    "inputOutput",
    "outputPrinting"
  )

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
          <CardTitle>Output Printing</CardTitle>
          <CardDescription>Daftar data output printing per jam</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh] overflow-auto rounded-md border">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-secondary">
                <TableRow>
                  <TableHead className="text-right">#</TableHead>
                  {columns.map(([, label]) => (
                    <TableHead key={label} className="whitespace-nowrap">
                      {label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-right">{index + 1}</TableCell>
                    {columns.map(([key]) => (
                      <TableCell key={key} className="whitespace-nowrap">
                        {item[key] instanceof Date
                          ? item[key].toLocaleDateString("id-ID")
                          : (item[key] ?? "-")}
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
