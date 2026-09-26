import type { AllTarget } from "./schema"

export type ChartPoint = { name: string; value: number }

const TOP_LIMIT = 8
const nameOrder = new Intl.Collator("id")

function topCounts(counts: Map<string, number>): ChartPoint[] {
  return Array.from(counts, ([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value || nameOrder.compare(a.name, b.name))
    .slice(0, TOP_LIMIT)
}

export function summarizeAllTarget(rows: AllTarget[]) {
  const styles = new Set<string>()
  const groupCounts = new Map<string, number>()
  const prcCounts = new Map<string, number>()
  const printingTargets = new Map<string, { sum: number; count: number }>()
  let targetCount = 0

  for (const row of rows) {
    const style = row.kodeStyle?.trim()
    const group = row.grupStyle?.trim()
    const prc = row.prc?.trim()
    const printing = row.jenisPrinting?.trim()
    const target = row.targetPaOneHours

    if (style) styles.add(style)
    if (group) groupCounts.set(group, (groupCounts.get(group) ?? 0) + 1)
    if (prc) prcCounts.set(prc, (prcCounts.get(prc) ?? 0) + 1)

    if (target !== null && Number.isFinite(target)) {
      targetCount += 1
      if (printing) {
        const previous = printingTargets.get(printing) ?? { sum: 0, count: 0 }
        printingTargets.set(printing, {
          sum: previous.sum + target,
          count: previous.count + 1,
        })
      }
    }
  }

  const printingChart = Array.from(printingTargets, ([name, totals]) => ({
    name,
    average: totals.sum / totals.count,
  }))
    .sort((a, b) => b.average - a.average || nameOrder.compare(a.name, b.name))
    .slice(0, TOP_LIMIT)
    .map(({ name, average }) => ({ name, value: Number(average.toFixed(1)) }))

  return {
    rowCount: rows.length,
    styleCount: styles.size,
    targetCount,
    groupChart: topCounts(groupCounts),
    prcChart: topCounts(prcCounts),
    printingChart,
  }
}
