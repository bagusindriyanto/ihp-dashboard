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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useSheetData } from "@/hooks/use-sheet-data"
import type { AllTarget } from "@/features/all-target/schema"
import {
  summarizeAllTarget,
  type ChartPoint,
} from "@/features/all-target/chart-data"

const numberFormat = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 1,
})

const countChartConfig = {
  value: { label: "Jumlah baris", color: "var(--chart-1)" },
} satisfies ChartConfig

const targetChartConfig = {
  value: { label: "Rata-rata Target PA 1 jam", color: "var(--chart-2)" },
} satisfies ChartConfig

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

function MetricChartCard({
  title,
  description,
  data,
  config,
}: {
  title: string
  description: string
  data: ChartPoint[]
  config: ChartConfig
}) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <Empty className="h-72">
            <EmptyHeader>
              <EmptyTitle>Belum ada data chart</EmptyTitle>
              <EmptyDescription>
                Kategori terkait belum terisi.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ChartContainer config={config} className="h-72 w-full">
            <BarChart accessibilityLayer data={data} layout="vertical">
              <CartesianGrid horizontal={false} />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: number) => numberFormat.format(value)}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={110}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: string) =>
                  value.length > 16 ? `${value.slice(0, 15)}…` : value
                }
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="var(--color-value)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

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

  if (data.length === 0)
    return (
      <Empty className="h-full">
        <EmptyHeader>
          <EmptyTitle>Belum ada data All Target</EmptyTitle>
          <EmptyDescription>Sheet belum berisi baris data.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )

  const summary = summarizeAllTarget(data)

  return (
    <section className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold">All Target IHP</h1>
        <p className="text-sm text-muted-foreground">
          Ringkasan dari data target yang tersedia di Google Sheets.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Baris valid</CardDescription>
            <CardTitle className="text-2xl">
              {numberFormat.format(summary.rowCount)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Kode style unik</CardDescription>
            <CardTitle className="text-2xl">
              {numberFormat.format(summary.styleCount)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Target PA 1 jam terisi</CardDescription>
            <CardTitle className="text-2xl">
              {numberFormat.format(summary.targetCount)}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {numberFormat.format(
                (summary.targetCount / summary.rowCount) * 100
              )}
              % dari baris valid
            </p>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <MetricChartCard
          title="Group Style"
          description="Jumlah baris valid per group style, 8 teratas. Kategori kosong diabaikan."
          data={summary.groupChart}
          config={countChartConfig}
        />
        <MetricChartCard
          title="PRC"
          description="Jumlah baris valid per PRC, 8 teratas. Kategori kosong diabaikan."
          data={summary.prcChart}
          config={countChartConfig}
        />
        <div className="xl:col-span-2">
          <MetricChartCard
            title="Target PA 1 jam per jenis printing"
            description="Rata-rata dari baris dengan target dan jenis printing terisi, 8 tertinggi."
            data={summary.printingChart}
            config={targetChartConfig}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detail All Target</CardTitle>
          <CardDescription>
            Seluruh baris valid yang dimuat, tanpa batas 8 teratas.
          </CardDescription>
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
                  <TableRow key={index}>
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
