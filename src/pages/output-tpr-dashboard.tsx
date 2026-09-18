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
import type { OutputTPR } from "@/features/output-tpr/schema"

const columns = [
  ["tanggal", "Tanggal"],
  ["week", "Week"],
  ["leader", "Leader"],
  ["idOperator", "ID Operator"],
  ["nama", "Nama"],
  ["line", "Line"],
  ["shift", "Shift"],
  ["spoGr", "SPO/GR"],
  ["spo", "SPO"],
  ["kodeStyle", "Kode Style"],
  ["style", "Style"],
  ["buyer", "Buyer"],
  ["passionBrand", "Passion Brand"],
  ["noProses", "No. Proses"],
  ["prc", "PRC"],
  ["part", "Part"],
  ["size", "Size"],
  ["emptyColumn1", "Empty 1"],
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
  ["emptyColumn2", "Empty 2"],
  ["totalMold", "Total Mold"],
  ["totalPcs", "Total PCS"],
  ["totalPcsJam", "Total PCS / Jam"],
  ["totalMP", "Total MP"],
  ["targetPAOneHours", "Target PA 1 Jam"],
  ["smv", "SMV"],
  ["totalJK", "Total JK"],
  ["targetShift", "Target Shift"],
  ["targetPerJam", "Target Per Jam"],
  ["efisiensiSMV", "Efisiensi SMV"],
  ["efisiensiPA", "Efisiensi PA"],
  ["remark", "Remark"],
] as const satisfies [keyof OutputTPR, string][]

export default function OutputTPRDashboard() {
  const { data, isPending, isError } = useSheetData("inputOutput", "outputTPR")

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
          <CardTitle>Output TPR</CardTitle>
          <CardDescription>Daftar data output TPR per jam</CardDescription>
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
                  <TableRow key={`${item.idOperator}-${item.tanggal}-${index}`}>
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
