import assert from "node:assert/strict"
import test from "node:test"
import { summarizeAllTarget } from "./chart-data.ts"

test("merangkum kategori dan mengabaikan target kosong", () => {
  const summary = summarizeAllTarget([
    {
      kodeStyle: " S1 ",
      grupStyle: " A ",
      prc: "P1",
      jenisPrinting: "Foil",
      targetPaOneHours: 10,
    },
    {
      kodeStyle: "S1",
      grupStyle: "A",
      prc: "P2",
      jenisPrinting: "Foil",
      targetPaOneHours: 20,
    },
    {
      kodeStyle: "S2",
      grupStyle: null,
      prc: "P1",
      jenisPrinting: "Foil",
      targetPaOneHours: null,
    },
    {
      kodeStyle: null,
      grupStyle: "B",
      prc: null,
      jenisPrinting: "Screen",
      targetPaOneHours: 0,
    },
  ])

  assert.equal(summary.rowCount, 4)
  assert.equal(summary.styleCount, 2)
  assert.equal(summary.targetCount, 3)
  assert.deepEqual(summary.groupChart, [
    { name: "A", value: 2 },
    { name: "B", value: 1 },
  ])
  assert.deepEqual(summary.prcChart, [
    { name: "P1", value: 2 },
    { name: "P2", value: 1 },
  ])
  assert.deepEqual(summary.printingChart, [
    { name: "Foil", value: 15 },
    { name: "Screen", value: 0 },
  ])
})
