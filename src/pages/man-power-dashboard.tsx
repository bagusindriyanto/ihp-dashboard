import { useLayoutEffect, useMemo, useRef, useState } from "react"
import type { ReactNode } from "react"
import { SearchXIcon } from "lucide-react"
import { CalendarCheck, Clock, Users } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { useSheetData } from "@/hooks/use-sheet-data"
import type { ManPower } from "@/features/man-power/schema"
import { formatTenure } from "@/features/man-power/tenure"
import { dropEmptyRows, isZeroValue } from "@/lib/drop-empty-rows"

const isPresent = (value: string | null) =>
  (value ?? "").toLowerCase().trim() === "hadir"

/**
 * Rapikan kapitalisasi tiap kata. Kata full-kecil dikapitalkan
 * ("printing" → "Printing"), singkatan dipertahankan ("IHP", "TPR").
 */
const normalizeName = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((word) =>
      word === word.toLowerCase()
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word
    )
    .join(" ")

/** Urutan kategori masa kerja dari tersingkat ke terlama. Tak dikenal → paling kanan. */
const TENURE_ORDER = [
  "<=3 bulan",
  "3-6 bulan",
  "6-12 bulan",
  "1-2 tahun",
  "2-3 tahun",
  "3-6 tahun",
  ">6 tahun",
]

const tenureRank = (name: string) => {
  const rank = TENURE_ORDER.indexOf(name.toLowerCase().trim())
  return rank === -1 ? Number.MAX_SAFE_INTEGER : rank
}

type PieOutsideLabelProps = {
  cx?: number | string
  cy?: number | string
  midAngle?: number
  outerRadius?: number
  name?: string
  value?: number | string
  percent?: number
}

/**
 * Label garis-luar model elbow.
 * mode "full": 2 baris (nama, lalu angka + persen). mode "percent": persen saja.
 */
const makeElbowLabel =
  (mode: "full" | "percent") =>
  ({
    cx = 0,
    cy = 0,
    midAngle = 0,
    outerRadius = 0,
    name = "",
    value = 0,
    percent = 0,
  }: PieOutsideLabelProps) => {
    const radian = Math.PI / 180
    const centerX = Number(cx)
    const centerY = Number(cy)
    const radius = Number(outerRadius)
    const cos = Math.cos(-midAngle * radian)
    const sin = Math.sin(-midAngle * radian)
    const isRight = cos >= 0
    const startX = centerX + radius * cos
    const startY = centerY + radius * sin
    const midX = centerX + (radius + 8) * cos
    const midY = centerY + (radius + 8) * sin
    const endX = midX + (isRight ? 8 : -8)
    const endY = midY
    const textX = endX + (isRight ? 4 : -4)
    const pct = `${(percent * 100).toFixed(1)}%`
    return (
      <g>
        <circle cx={startX} cy={startY} r={2} fill="var(--muted-foreground)" />
        <path
          d={`M${startX},${startY} L${midX},${midY} L${endX},${endY}`}
          stroke="var(--muted-foreground)"
          strokeWidth={1.2}
          strokeOpacity={0.7}
          fill="none"
        />
        <text
          x={textX}
          y={endY}
          textAnchor={isRight ? "start" : "end"}
          dominantBaseline="central"
          className="fill-foreground"
          fontSize={12}
        >
          {mode === "full" ? (
            <>
              <tspan x={textX} dy="-0.55em" className="font-semibold">
                {name}
              </tspan>
              <tspan
                x={textX}
                dy="1.25em"
                className="fill-muted-foreground text-[11px]"
              >
                {`${value} (${pct})`}
              </tspan>
            </>
          ) : (
            pct
          )}
        </text>
      </g>
    )
  }

const elbowFullLabel = makeElbowLabel("full")

type SliceGeom = {
  name: string
  value: number | string
  percent: number
  cx: number
  cy: number
  midAngle: number
  outerRadius: number
}

type SliceSlot = {
  name: string
  value: number | string
  percent: number
  isRight: boolean
  ax: number
  ay: number
  mx: number
  my: number
  ex: number
  tx: number
  ty: number
}

/**
 * Sebar slot label vertikal per sisi supaya tak saling tumpuk
 * (ada yang naik, ada yang turun dari titik jangkarnya).
 */
const resolveLabelSlots = (geoms: SliceGeom[], height: number): SliceSlot[] => {
  const radian = Math.PI / 180
  const minGap = 30
  const minY = 14
  const maxY = Math.max(height - 14, minY + minGap)
  const inbox = geoms.map((geom) => {
    const cos = Math.cos(-geom.midAngle * radian)
    const sin = Math.sin(-geom.midAngle * radian)
    const isRight = cos >= 0
    return {
      geom,
      cos,
      sin,
      isRight,
      ax: geom.cx + geom.outerRadius * cos,
      ay: geom.cy + geom.outerRadius * sin,
    }
  })
  const slots: SliceSlot[] = []
  for (const isRight of [true, false]) {
    const side = inbox
      .filter((s) => s.isRight === isRight)
      .sort((a, b) => a.ay - b.ay)
    const tys = side.map((s) => s.ay)
    let cursor = minY
    for (let i = 0; i < side.length; i++) {
      cursor = Math.max(cursor, side[i].ay)
      tys[i] = cursor
      cursor += minGap
    }
    let ceiling = maxY
    for (let i = side.length - 1; i >= 0; i--) {
      tys[i] = Math.min(tys[i], ceiling)
      ceiling -= minGap
    }
    side.forEach((s, i) => {
      const ty = tys[i]
      const mx = s.ax + 10 * s.cos
      const my = s.ay + 10 * s.sin
      const ex = mx + (isRight ? 10 : -10)
      slots.push({
        name: s.geom.name,
        value: s.geom.value,
        percent: s.geom.percent,
        isRight,
        ax: s.ax,
        ay: s.ay,
        mx,
        my,
        ex,
        tx: ex + (isRight ? 5 : -5),
        ty,
      })
    })
  }
  return slots
}

type SegmentLabelProps = {
  value?: ReactNode
  x?: number | string
  y?: number | string
  width?: number | string
  height?: number | string
}

/** Angka tengah segmen stacked bar, kosong bila nol. */
const segmentLabel = (className: string) =>
  function SegmentLabel({ value, x, y, width, height }: SegmentLabelProps) {
    if (Number(value) === 0) return ""
    return (
      <text
        x={Number(x) + Number(width) / 2}
        y={Number(y) + Number(height) / 2}
        textAnchor="middle"
        dominantBaseline="central"
        className={className}
        fontSize={11}
      >
        {value}
      </text>
    )
  }

/** Hitung kemunculan tiap nilai kolom, null/kosong jadi "-". Urut terbanyak dulu. */
const countBy = (rows: ManPower[], key: keyof ManPower) => {
  const counts = new Map<string, number>()
  for (const row of rows) {
    const raw = row[key]
    const name = typeof raw === "string" && raw.trim() !== "" ? raw : "-"
    counts.set(name, (counts.get(name) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([name, value], index) => ({
      name,
      value,
      fill: `var(--chart-${(index % 5) + 1})`,
    }))
    .sort((a, b) => b.value - a.value)
}

const pieConfig = (groups: { name: string; fill: string }[]) =>
  ({
    value: { label: "Orang" },
    ...Object.fromEntries(
      groups.map((group) => [
        group.name,
        { label: group.name, color: group.fill },
      ])
    ),
  }) satisfies ChartConfig

const kpiIconClass = "rounded-full p-3 outline"

export default function ManPowerDashboard() {
  const { data, isPending, isError } = useSheetData("manPower", "employees")

  const divisionWrapRef = useRef<HTMLDivElement>(null)
  const [divisionBox, setDivisionBox] = useState({ w: 0, h: 0 })

  useLayoutEffect(() => {
    const el = divisionWrapRef.current
    if (!el) return
    const measure = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      setDivisionBox((prev) => (prev.w === w && prev.h === h ? prev : { w, h }))
    }
    measure()
    if (typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const stats = useMemo(() => {
    const rows = dropEmptyRows(data ?? [], "nip", isZeroValue)
    const total = rows.length
    const present = rows.filter((row) => isPresent(row.absence)).length
    const months = rows
      .map((row) => row.monthTenure)
      .filter((value): value is number => typeof value === "number")
    const avgMonths =
      months.length > 0
        ? months.reduce((sum, value) => sum + value, 0) / months.length
        : null
    return {
      total,
      present,
      rate: total > 0 ? (present / total) * 100 : 0,
      avgLabel: formatTenure(avgMonths),
      attendance: [
        { name: "Hadir", value: present, fill: "var(--chart-2)" },
        {
          name: "Tidak Hadir",
          value: total - present,
          fill: "var(--color-zinc-200)",
        },
      ],
      labour: countBy(rows, "labourStatus"),
      shift: countBy(rows, "shift"),
      division: countBy(rows, "division"),
      foreman: (() => {
        const counts = new Map<string, number>()
        for (const row of rows) {
          if (typeof row.foreman !== "string" || row.foreman.trim() === "")
            continue
          counts.set(row.foreman, (counts.get(row.foreman) ?? 0) + 1)
        }
        return [...counts.entries()]
          .map(([foreman, jumlah]) => ({ foreman, jumlah }))
          .sort((a, b) => b.jumlah - a.jumlah)
      })(),
      zoneStacks: (() => {
        const map = new Map<
          string,
          { zona: string; Hadir: number; TidakHadir: number }
        >()
        for (const row of rows) {
          if (typeof row.zone !== "string" || row.zone.trim() === "") continue
          const entry = map.get(row.zone) ?? {
            zona: row.zone,
            Hadir: 0,
            TidakHadir: 0,
          }
          if (isPresent(row.absence)) entry.Hadir += 1
          else entry.TidakHadir += 1
          map.set(row.zone, entry)
        }
        return [...map.values()]
          .map((entry) => ({
            ...entry,
            rate: `${((entry.Hadir / (entry.Hadir + entry.TidakHadir)) * 100).toFixed(1)}%`,
          }))
          .sort((a, b) => b.Hadir + b.TidakHadir - (a.Hadir + a.TidakHadir))
      })(),
      sectionStacks: (() => {
        const map = new Map<
          string,
          { section: string; Hadir: number; TidakHadir: number }
        >()
        for (const row of rows) {
          if (typeof row.section !== "string" || row.section.trim() === "")
            continue
          const section = normalizeName(row.section)
          const entry = map.get(section) ?? {
            section,
            Hadir: 0,
            TidakHadir: 0,
          }
          if (isPresent(row.absence)) entry.Hadir += 1
          else entry.TidakHadir += 1
          map.set(section, entry)
        }
        return [...map.values()]
          .map((entry) => ({
            ...entry,
            rate: `${((entry.Hadir / (entry.Hadir + entry.TidakHadir)) * 100).toFixed(1)}%`,
          }))
          .sort((a, b) => b.Hadir + b.TidakHadir - (a.Hadir + a.TidakHadir))
      })(),
      tenure: countBy(rows, "kategoriMasaKerja")
        .sort((a, b) => tenureRank(a.name) - tenureRank(b.name))
        .map((group, index) => ({
          kategori: group.name,
          jumlah: group.value,
          fill: `var(--chart-${(index % 5) + 1})`,
        })),
    }
  }, [data])

  /**
   * Geometri slice donat Divisi, replika rumus recharts Pie
   * (startAngle 0, searah +, padding 2°, cx/cy 50% area offset).
   */
  const divisionSlots = useMemo(() => {
    const groups = stats.division
    const total = groups.reduce((sum, g) => sum + g.value, 0)
    if (total <= 0 || divisionBox.w <= 0) return []
    const { w, h } = divisionBox
    const outer = 0.85 * (Math.min(w - 64, h) / 2)
    const cx = w / 2
    const cy = h / 2
    const nonZero = groups.filter((g) => g.value !== 0).length
    const realTotal = 360 - nonZero * 2
    let cursor = 0
    const geoms: SliceGeom[] = groups.map((g, i) => {
      const start = i === 0 ? 0 : cursor + (g.value !== 0 ? 2 : 0)
      const end = start + (g.value / total) * realTotal
      const midAngle = (start + end) / 2
      cursor = end
      return {
        name: g.name,
        value: g.value,
        percent: g.value / total,
        cx,
        cy,
        midAngle,
        outerRadius: outer,
      }
    })
    return resolveLabelSlots(geoms, h)
  }, [stats.division, divisionBox])

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

  if (isPending)
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[0, 1, 2].map((key) => (
            <Skeleton key={key} className="h-36 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <Skeleton className="h-80 rounded-2xl xl:col-span-3" />
          <Skeleton className="h-80 rounded-2xl xl:col-span-5" />
          <Skeleton className="h-80 rounded-2xl xl:col-span-4" />
        </div>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <Skeleton className="h-80 rounded-2xl xl:col-span-3" />
          <Skeleton className="h-80 rounded-2xl xl:col-span-4" />
          <Skeleton className="h-80 rounded-2xl xl:col-span-5" />
        </div>
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    )

  if (stats.total === 0)
    return (
      <Empty className="h-full">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchXIcon />
          </EmptyMedia>
          <EmptyTitle>Belum Ada Data</EmptyTitle>
          <EmptyDescription>
            Data man power masih kosong di sheet sumber.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )

  const rateLabel = `${stats.rate.toFixed(1)}%`

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* KPI row */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="h-full rounded-2xl py-6 ring-0">
          <CardContent className="flex items-center justify-between px-6">
            <div className="flex flex-col gap-1">
              <p className="text-lg font-medium text-card-foreground">
                Total Manpower
              </p>
              <p className="text-2xl font-medium text-card-foreground">
                {stats.total}{" "}
                <span className="text-base text-muted-foreground">orang</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Total karyawan terdaftar
              </p>
            </div>
            <div className={kpiIconClass}>
              <Users />
            </div>
          </CardContent>
        </Card>
        <Card className="h-full rounded-2xl py-6 ring-0">
          <CardContent className="flex items-center justify-between px-6">
            <div className="flex flex-col gap-1">
              <p className="text-lg font-medium text-card-foreground">
                Kehadiran
              </p>
              <p className="text-2xl font-medium text-card-foreground">
                {rateLabel}
              </p>
              <p className="text-sm text-muted-foreground">
                {stats.present} dari {stats.total} hadir
              </p>
            </div>
            <div className={kpiIconClass}>
              <CalendarCheck />
            </div>
          </CardContent>
        </Card>
        <Card className="h-full rounded-2xl py-6 ring-0">
          <CardContent className="flex items-center justify-between px-6">
            <div className="flex flex-col gap-1">
              <p className="text-lg font-medium text-card-foreground">
                Rata-rata Masa Kerja
              </p>
              <p className="text-2xl font-medium text-card-foreground">
                {stats.avgLabel}
              </p>
              <p className="text-sm text-muted-foreground">
                Masa kerja rata-rata karyawan
              </p>
            </div>
            <div className={kpiIconClass}>
              <Clock />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 1: tumpukan shift/labour + zona + section (3:5:4) */}
      {/* Stacked bar: kehadiran per zona (angka absolut) */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Tumpukan: shift atas + labour bawah */}
        <div className="col-span-1 xl:col-span-3">
          <div className="flex h-full flex-col gap-6">
            <Card className="flex w-full flex-1 flex-col justify-between gap-2 py-4">
              <CardHeader className="px-5 pb-0">
                <CardTitle className="text-base font-medium">Shift</CardTitle>
                <CardDescription className="text-xs">
                  Sebaran shift karyawan
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col px-3">
                <ChartContainer
                  config={pieConfig(stats.shift)}
                  className="h-56 w-full"
                >
                  <PieChart margin={{ top: 8, right: 32, bottom: 8, left: 32 }}>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={stats.shift}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="56%"
                      outerRadius="90%"
                      paddingAngle={2}
                      stroke="var(--background)"
                      strokeWidth={2}
                      labelLine={false}
                      label={elbowFullLabel}
                      cx="50%"
                      cy="50%"
                    ></Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="flex w-full flex-1 flex-col justify-between gap-2 py-4">
              <CardHeader className="px-5 pb-0">
                <CardTitle className="text-base font-medium">
                  Labour Status
                </CardTitle>
                <CardDescription className="text-xs">
                  Sebaran status labour
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col px-3">
                <ChartContainer
                  config={pieConfig(stats.labour)}
                  className="h-56 w-full"
                >
                  <PieChart margin={{ top: 8, right: 32, bottom: 8, left: 32 }}>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={stats.labour}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="56%"
                      outerRadius="90%"
                      paddingAngle={2}
                      stroke="var(--background)"
                      strokeWidth={2}
                      labelLine={false}
                      label={elbowFullLabel}
                      cx="50%"
                      cy="50%"
                    ></Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="col-span-1 xl:col-span-5">
          <Card className="flex h-full w-full flex-col justify-between gap-6 py-6">
            <CardHeader className="px-6">
              <CardTitle className="text-lg font-medium">
                Kehadiran per Zona
              </CardTitle>
              <CardDescription>
                Jumlah karyawan hadir vs tidak hadir di tiap zona. Persentase di
                ujung bar adalah tingkat kehadiran tiap zona.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6">
              <ChartContainer
                config={
                  {
                    Hadir: { label: "Hadir", color: "var(--chart-2)" },
                    TidakHadir: {
                      label: "Tidak Hadir",
                      color: "var(--color-zinc-200)",
                    },
                  } satisfies ChartConfig
                }
                className="h-[34rem] w-full"
              >
                <BarChart
                  accessibilityLayer
                  data={stats.zoneStacks}
                  layout="vertical"
                  margin={{ top: 8, right: 44, bottom: 12, left: 0 }}
                >
                  <CartesianGrid
                    horizontal={false}
                    strokeDasharray="3 3"
                    stroke="rgba(144, 164, 174, 0.3)"
                  />
                  <XAxis
                    type="number"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    fontSize={12}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="zona"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    fontSize={12}
                    width={150}
                  />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="TidakHadir"
                    stackId="zona"
                    fill="var(--color-TidakHadir)"
                    barSize={26}
                  >
                    <LabelList
                      dataKey="TidakHadir"
                      position="center"
                      content={segmentLabel("fill-black")}
                    />
                  </Bar>
                  <Bar
                    dataKey="Hadir"
                    stackId="zona"
                    fill="var(--color-Hadir)"
                    radius={[0, 4, 4, 0]}
                    barSize={26}
                  >
                    <LabelList
                      dataKey="Hadir"
                      position="center"
                      content={segmentLabel("fill-primary-foreground")}
                    />
                    <LabelList
                      dataKey="rate"
                      position="right"
                      className="fill-muted-foreground"
                      fontSize={11}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Section */}
        <div className="col-span-1 xl:col-span-4">
          <Card className="flex h-full w-full flex-col justify-between gap-6 py-6">
            <CardHeader className="px-6">
              <CardTitle className="text-lg font-medium">
                Kehadiran per Section
              </CardTitle>
              <CardDescription>
                Jumlah karyawan hadir vs tidak hadir di tiap section. Persentase
                di ujung bar adalah tingkat kehadiran tiap section.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6">
              <ChartContainer
                config={
                  {
                    Hadir: { label: "Hadir", color: "var(--chart-2)" },
                    TidakHadir: {
                      label: "Tidak Hadir",
                      color: "var(--color-zinc-200)",
                    },
                  } satisfies ChartConfig
                }
                className="h-[34rem] w-full"
              >
                <BarChart
                  accessibilityLayer
                  data={stats.sectionStacks}
                  layout="vertical"
                  margin={{ top: 8, right: 44, bottom: 12, left: 0 }}
                >
                  <CartesianGrid
                    horizontal={false}
                    strokeDasharray="3 3"
                    stroke="rgba(144, 164, 174, 0.3)"
                  />
                  <XAxis
                    type="number"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    fontSize={12}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="section"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    fontSize={12}
                    width={150}
                  />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="TidakHadir"
                    stackId="section"
                    fill="var(--color-TidakHadir)"
                    barSize={26}
                  >
                    <LabelList
                      dataKey="TidakHadir"
                      position="center"
                      content={segmentLabel("fill-black")}
                    />
                  </Bar>
                  <Bar
                    dataKey="Hadir"
                    stackId="section"
                    fill="var(--color-Hadir)"
                    radius={[0, 4, 4, 0]}
                    barSize={26}
                  >
                    <LabelList
                      dataKey="Hadir"
                      position="center"
                      content={segmentLabel("fill-primary-foreground")}
                    />
                    <LabelList
                      dataKey="rate"
                      position="right"
                      className="fill-muted-foreground"
                      fontSize={11}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Row 2: divisi + tenure + foreman (3+4+5) */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="col-span-1 xl:col-span-3">
          <Card className="flex h-full w-full flex-col gap-2 py-4">
            <CardHeader className="px-5 pb-0">
              <CardTitle className="text-base font-medium">Divisi</CardTitle>
              <CardDescription className="text-xs">
                Sebaran divisi karyawan
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col px-3">
              <div ref={divisionWrapRef} className="relative">
                <ChartContainer
                  config={pieConfig(stats.division)}
                  className="h-72 w-full"
                >
                  <PieChart margin={{ top: 0, right: 32, bottom: 0, left: 32 }}>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={stats.division}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="45%"
                      outerRadius="85%"
                      paddingAngle={2}
                      stroke="var(--background)"
                      strokeWidth={2}
                      labelLine={false}
                      label={false}
                      cx="50%"
                      cy="50%"
                    />
                  </PieChart>
                </ChartContainer>
                {divisionBox.w > 0 && (
                  <svg
                    className="pointer-events-none absolute inset-0 size-full"
                    aria-hidden
                  >
                    {divisionSlots.map((slot) => (
                      <g key={slot.name}>
                        <circle
                          cx={slot.ax}
                          cy={slot.ay}
                          r={2}
                          fill="var(--muted-foreground)"
                        />
                        <path
                          d={`M${slot.ax},${slot.ay} L${slot.mx},${slot.my} L${slot.ex},${slot.ty}`}
                          stroke="var(--muted-foreground)"
                          strokeWidth={1.2}
                          strokeOpacity={0.7}
                          fill="none"
                        />
                        <text
                          x={slot.tx}
                          y={slot.ty}
                          textAnchor={slot.isRight ? "start" : "end"}
                          dominantBaseline="central"
                          className="fill-foreground"
                          fontSize={12}
                        >
                          <tspan
                            x={slot.tx}
                            dy="-0.55em"
                            className="font-semibold"
                          >
                            {slot.name}
                          </tspan>
                          <tspan
                            x={slot.tx}
                            dy="1.25em"
                            className="fill-muted-foreground text-[11px]"
                          >
                            {`${slot.value} (${(slot.percent * 100).toFixed(1)}%)`}
                          </tspan>
                        </text>
                      </g>
                    ))}
                  </svg>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-1 xl:col-span-4">
          <Card className="flex h-full w-full flex-col justify-between gap-2 py-4">
            <CardHeader className="px-5 pb-0">
              <CardTitle className="text-base font-medium">
                Distribusi Masa Kerja
              </CardTitle>
              <CardDescription className="text-xs">
                Jumlah karyawan per kategori masa kerja
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3">
              <ChartContainer
                config={{
                  jumlah: { label: "Orang", color: "var(--chart-2)" },
                }}
                className="h-72 w-full"
              >
                <BarChart
                  accessibilityLayer
                  data={stats.tenure}
                  margin={{ top: 8, right: 12, bottom: 0, left: -10 }}
                >
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="rgba(144, 164, 174, 0.3)"
                  />
                  <XAxis
                    dataKey="kategori"
                    tickLine={false}
                    tickMargin={6}
                    axisLine={false}
                    fontSize={10}
                    interval={0}
                    angle={0}
                    textAnchor="middle"
                    height={30}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    fontSize={11}
                    allowDecimals={false}
                    domain={[
                      0,
                      (dataMax: number) =>
                        dataMax + Math.max(4, Math.round(dataMax * 0.08)),
                    ]}
                  />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="jumlah" fill="var(--color-jumlah)" radius={4}>
                    <LabelList
                      dataKey="jumlah"
                      position="top"
                      className="fill-foreground font-medium"
                      fontSize={11}
                      offset={6}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Foreman */}
        <div className="col-span-1 xl:col-span-5">
          <Card className="flex h-full w-full flex-col justify-between gap-6 py-6">
            <CardHeader className="px-6">
              <CardTitle className="text-lg font-medium">
                Komposisi Tim setiap Foreman
              </CardTitle>
              <CardDescription>Jumlah karyawan di tiap foreman</CardDescription>
            </CardHeader>
            <CardContent className="px-6">
              <ChartContainer
                config={{
                  jumlah: { label: "Orang", color: "var(--chart-2)" },
                }}
                className="h-72 w-full"
              >
                <BarChart
                  accessibilityLayer
                  data={stats.foreman}
                  margin={{ top: 8, right: 12, bottom: 0, left: 0 }}
                >
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="rgba(144, 164, 174, 0.3)"
                  />
                  <XAxis
                    dataKey="foreman"
                    tickLine={false}
                    tickMargin={6}
                    axisLine={false}
                    fontSize={12}
                    interval={0}
                    angle={0}
                    textAnchor="middle"
                    height={30}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    fontSize={12}
                    allowDecimals={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="jumlah" fill="var(--color-jumlah)" radius={4}>
                    <LabelList
                      dataKey="jumlah"
                      position="top"
                      className="fill-foreground"
                      fontSize={12}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
