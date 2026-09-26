# Menggunakan Chart shadcn/ui dan Shadcn Space

Panduan ini menjelaskan cara membuat chart baru dan menyesuaikan chart dari Shadcn Space di proyek ini. Chart shadcn/ui memakai **Recharts** untuk bentuk grafik, sedangkan `ChartContainer`, tooltip, dan legend dari shadcn/ui menyediakan konfigurasi warna dan tampilan. Shadcn Space menyediakan contoh chart siap pakai yang tetap bisa diubah sebagai kode proyek.

## Kondisi Proyek

Proyek ini memakai React + Vite, Tailwind CSS v4, `pnpm`, dan Recharts v3. Komponen chart sudah tersedia di [`src/components/ui/chart.tsx`](../src/components/ui/chart.tsx);

| Resource                      | Lokasi                                                                                                          |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Komponen dasar chart          | [`src/components/ui/chart.tsx`](../src/components/ui/chart.tsx)                                                 |
| Token warna chart             | [`src/index.css`](../src/index.css), `--chart-1` sampai `--chart-5`                                             |
| Contoh bar chart Shadcn Space | [`sales-overview-chart.tsx`](../src/components/shadcn-space/blocks/dashboard-shell-01/sales-overview-chart.tsx) |
| Contoh pie chart Shadcn Space | [`earning-report-chart.tsx`](../src/components/shadcn-space/blocks/dashboard-shell-01/earning-report-chart.tsx) |
| Halaman yang memakai keduanya | [`src/pages/analytics-dashboard.tsx`](../src/pages/analytics-dashboard.tsx)                                     |
| Contoh chart lain             | [`src/pages/crm-dashboard.tsx`](../src/pages/crm-dashboard.tsx)                                                 |

## Membuat Chart Baru dengan shadcn/ui

Siapkan data, buat `ChartConfig`, lalu letakkan satu komponen Recharts di dalam `ChartContainer`. Nama `dataKey` harus sama dengan field data dan key pada konfigurasi jika ingin memakai `var(--color-<key>)`.

```tsx
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type RevenuePoint = {
  month: string
  revenue: number
  expense: number
}

const exampleData: RevenuePoint[] = [
  { month: "Jan", revenue: 120, expense: 80 },
  { month: "Feb", revenue: 150, expense: 95 },
  { month: "Mar", revenue: 135, expense: 90 },
]

const chartConfig = {
  revenue: { label: "Pendapatan", color: "var(--chart-1)" },
  expense: { label: "Pengeluaran", color: "var(--chart-2)" },
} satisfies ChartConfig

export function RevenueChart({ chartData }: { chartData: RevenuePoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pendapatan dan pengeluaran</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
            <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function RevenueExample() {
  return <RevenueChart chartData={exampleData} />
}
```

Berikan tinggi atau rasio yang jelas pada `ChartContainer`, misalnya `h-64`, `min-h-50`, atau `aspect-video`, agar ukuran grafik dapat dihitung. `ChartConfig` mengubah warna menjadi variabel CSS seperti `--color-revenue`; gunakan variabel itu pada `fill` atau `stroke` seri Recharts. Untuk line chart, ganti `BarChart`/`Bar` dengan `LineChart`/`Line` dan gunakan `stroke="var(--color-revenue)"`.

Data tidak harus ditulis langsung di komponen chart. `RevenueChart` di atas menerima `chartData` sebagai prop, sehingga sumber data dapat diganti tanpa mengubah bentuk grafik.

## Data dari TanStack Query

Untuk API selain Google Sheets, gunakan `useQuery()` dan petakan respons ke bentuk yang diminta chart. Contoh di bawah mengasumsikan endpoint `/api/revenue/monthly` ada dan mengembalikan array `{ period, totalRevenue, totalExpense }`; ganti endpoint dan tipe respons sesuai API sebenarnya. Letakkan contoh ini di file yang sama dengan `RevenueChart` di atas, atau impor `RevenueChart` dari filenya.

```tsx
import { useQuery } from "@tanstack/react-query"

type RevenueResponse = {
  period: string
  totalRevenue: number
  totalExpense: number
}

async function fetchMonthlyRevenue(): Promise<RevenueResponse[]> {
  const response = await fetch("/api/revenue/monthly")
  if (!response.ok) throw new Error("Gagal memuat pendapatan")
  return response.json() as Promise<RevenueResponse[]>
}

export function RevenueFromApi() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["revenue", "monthly"],
    queryFn: fetchMonthlyRevenue,
  })

  if (isPending) return <p>Memuat chart…</p>
  if (isError) return <p>Chart gagal dimuat.</p>
  if (data.length === 0) return <p>Belum ada data.</p>

  const chartData = data.map((row) => ({
    month: row.period,
    revenue: row.totalRevenue,
    expense: row.totalExpense,
  }))

  return <RevenueChart chartData={chartData} />
}
```

`queryKey` harus membedakan parameter yang mengubah hasil, misalnya bulan atau filter. `fetch()` tidak otomatis menganggap respons HTTP gagal sebagai error, jadi periksa `response.ok`. Type assertion pada `response.json()` hanya membantu TypeScript; jika format API tidak terjamin, validasi respons di batas API sebelum dipakai chart. Saat refetch, TanStack Query dapat mempertahankan data lama; tentukan sendiri apakah chart tetap ditampilkan bersama indikator pembaruan.

## Data dari `useSheetData()`

[`useSheetData()`](../src/hooks/use-sheet-data.ts) **sudah memakai `useQuery()`**. Untuk data Google Sheets yang terdaftar, panggil hook ini langsung. Contoh berikut memakai `targetIHP.allTarget` yang sudah ada, lalu menampilkan hingga 10 baris dengan `kodeStyle` dan `targetPaOneHours` terisi. Ini contoh tampilan per baris, bukan agregasi per style.

```tsx
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useSheetData } from "@/hooks/use-sheet-data"

const targetChartConfig = {
  target: { label: "Target PA 1 jam", color: "var(--chart-1)" },
} satisfies ChartConfig

export function TargetPaChart() {
  const { data, isPending, isError } = useSheetData("targetIHP", "allTarget")

  if (isPending) return <p>Memuat chart…</p>
  if (isError) return <p>Data Sheets gagal dimuat.</p>

  const chartData = data
    .filter((row) => row.kodeStyle && row.targetPaOneHours != null)
    .slice(0, 10)
    .map((row) => ({
      style: row.kodeStyle ?? "",
      target: row.targetPaOneHours ?? 0,
    }))

  if (chartData.length === 0) return <p>Belum ada data chart.</p>

  return (
    <ChartContainer config={targetChartConfig} className="h-64 w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="style" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="target" fill="var(--color-target)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
```

Schema Sheets menentukan tipe field; nilai `null` perlu difilter atau ditangani sebelum menjadi seri numerik. Untuk chart agregat, kelompokkan dan hitung nilai berdasarkan dimensi yang diinginkan terlebih dahulu. Lihat [`docs/google-sheets.md`](./google-sheets.md) untuk menambah sumber Sheets baru.

## Memakai Chart dari Shadcn Space

Lihat [katalog Charts Component](https://shadcnspace.com/blocks/dashboard-ui/charts-component), pilih chart, lalu gunakan **nama atau perintah instalasi yang ditampilkan pada chart tersebut**. Jangan menebak nama item registry. Proyek sudah mengonfigurasi `@shadcn-space`, sehingga pola perintah untuk item yang dipilih adalah:

```bash
pnpm dlx shadcn@latest add @shadcn-space/<nama-item-dari-katalog>
```

Sebelum menambahkan item, cek file yang akan dibuat dan perubahan pada komponen yang sudah ada. Jangan menyetujui penimpaan `src/components/ui/chart.tsx` tanpa meninjau perubahan lokal.

Untuk chart yang sudah ada, cara tercepat adalah membuka `sales-overview-chart.tsx` (bar chart) atau `earning-report-chart.tsx` (donut chart), lalu menyesuaikan:

1. `chartData`: ganti data contoh dengan data feature. Pastikan nilai numerik memang bertipe angka.
2. `chartConfig`: samakan key dengan `dataKey` seri, atau dengan kategori `nameKey` pada pie chart. Sesuaikan label dan warna.
3. Grafik Recharts: sesuaikan `Bar`, `Pie`, sumbu, tooltip, dan ukuran container dengan data sebenarnya.
4. Teks pendamping: perbarui judul, total, persentase, label tengah donut, dan daftar ringkasan. Pada contoh Shadcn Space saat ini, beberapa angka ringkasan masih ditulis langsung, terpisah dari `chartData`.
5. Impor dan pakai komponen pada halaman feature, mengikuti [`analytics-dashboard.tsx`](../src/pages/analytics-dashboard.tsx).

## Masalah yang Sering Muncul

| Gejala                                   | Periksa                                                                                                                                           |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Grafik kosong atau ukurannya salah       | `ChartContainer` memiliki tinggi/rasio dan parent tidak berukuran nol.                                                                            |
| Seri tidak muncul                        | `dataKey` cocok dengan field data; nilainya angka untuk seri numerik.                                                                             |
| Warna tidak muncul                       | Key `chartConfig` cocok dengan `--color-<key>` pada `fill`/`stroke`. Gunakan token `var(--chart-1)` tanpa pembungkus `hsl(...)` pada Recharts v3. |
| Tooltip atau legend kosong               | Komponen berada di dalam chart Recharts dan `ChartContainer`; key konfigurasi cocok dengan seri/kategori.                                         |
| Angka chart berbeda dari kartu ringkasan | Hitung total dan persentase dari sumber data yang sama, bukan dari angka contoh yang ditulis langsung.                                            |
| Item Shadcn Space tidak ditemukan        | Periksa nama item pada katalog dan entri `@shadcn-space` di `components.json`; item Pro mungkin membutuhkan akses.                                |

Referensi: [Chart shadcn/ui](https://ui.shadcn.com/docs/components/base/chart), [Charts Component Shadcn Space](https://shadcnspace.com/blocks/dashboard-ui/charts-component), [CLI Shadcn Space](https://shadcnspace.com/docs/getting-started/how-to-use-shadcn-cli), [Queries TanStack Query](https://tanstack.com/query/latest/docs/framework/react/guides/queries), dan [Query Functions TanStack Query](https://tanstack.com/query/latest/docs/framework/react/guides/query-functions).
