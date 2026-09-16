# Mengambil Data Google Sheets dan Membuat Schema Feature

Panduan ini membantu kamu menghubungkan data Google Sheets ke halaman dashboard. Contoh utamanya memakai feature `man-power` yang sudah ada, jadi kamu bisa membuka file sumber sambil mengikuti penjelasannya. Untuk AI Agent, bagian terakhir merangkum urutan kerja dan batasan yang perlu diperhatikan.

## Gambaran Alur

```text
Halaman → hook query → fungsi API feature → fetchSheet → Google Sheets API
                                             ↓
Halaman ← data hasil schema ← validasi Zod ← baris hasil parsing
```

Ada dua tanggung jawab utama: `src/lib/google-sheets/` mengurus cara membaca Sheets secara umum, sedangkan `src/features/` menentukan bentuk data yang dibutuhkan setiap feature.

| File                                                                     | Tanggung jawab                                                            |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| [sheet-config.ts](../src/config/sheet-config.ts)                         | Menyimpan ID spreadsheet, nama tab, dan range yang dibaca                 |
| [client.ts](../src/lib/google-sheets/client.ts)                          | Membuat URL request dan membaca API key dari environment                  |
| [fetch.ts](../src/lib/google-sheets/fetch.ts)                            | Menjalankan request, menangani error HTTP, dan mengembalikan `SheetRow[]` |
| [helper.ts](../src/lib/google-sheets/helper.ts)                          | Mengubah array sel menjadi objek dan menyediakan konversi tanggal         |
| [types.ts](../src/lib/google-sheets/types.ts)                            | Mendefinisikan tipe nilai sel dan baris                                   |
| [man-power.schema.ts](../src/features/man-power/api/man-power.schema.ts) | Memvalidasi kolom dan mengubahnya ke bentuk data aplikasi                 |
| [man-power.api.ts](../src/features/man-power/api/man-power.api.ts)       | Menghubungkan konfigurasi, fetch, dan schema                              |
| [man-power.query.ts](../src/features/man-power/api/man-power.query.ts)   | Menyediakan hook TanStack Query untuk halaman                             |

## Sebelum Mulai

Tambahkan API key ke `.env.local` di root proyek:

```dotenv
VITE_SHEETS_API_KEY=isi_api_key_untuk_environment_kamu
```

Restart development server setelah mengubah environment. File `*.local` sudah masuk `.gitignore`; jangan menyalin key asli ke dokumentasi atau commit.

## Menentukan Spreadsheet, Tab, dan Range

Konfigurasi saat ini ada di `src/config/sheet-config.ts`. Feature Man Power memakai `SHEETS.manPower.spreadsheetId` dan `SHEETS.manPower.mp`, dengan tab `DATA MP (UPDATED)` serta range `D1:V`.

- `spreadsheetId`: ID dokumen, yaitu bagian setelah `/d/` pada URL spreadsheet; bukan angka `gid` tab.
- `sheetName`: nama tab di dalam dokumen, ditulis sesuai sumbernya.
- `range`: area yang dibaca dengan notasi A1. `D1:V` berarti kolom D sampai V mulai baris 1, tanpa batas akhir baris yang eksplisit.

Baris pertama **di dalam range** selalu dianggap sebagai header. Jika header ada di baris 3, mulai range dari baris 3, misalnya `A3:F`. Baris judul atau catatan di atas header tidak perlu ikut dibaca.

`buildRange()` menggabungkan nama tab dan range. Nama tab yang mengandung spasi atau karakter di luar `\w` diberi tanda petik, lalu `buildSheetUrl()` melakukan URL encoding. Jangan membuat URL sendiri di feature. Perlu diperhatikan bahwa helper saat ini belum meng-escape apostrof di dalam nama tab.

## Bentuk Data dari `fetchSheet`

Request menggunakan `majorDimension=ROWS` dan `valueRenderOption=UNFORMATTED_VALUE`. Artinya, parser menerima array baris dengan nilai mentah, bukan teks yang mengikuti tampilan format sel.

Contoh input ke `parseValuesToRows()`:

```ts
[
  ["Name", "Jumlah", "Catatan"],
  ["Ayu", 12, ""],
  ["Bima", 0],
]
```

Hasilnya:

```ts
[
  { Name: "Ayu", Jumlah: 12, Catatan: null },
  { Name: "Bima", Jumlah: 0, Catatan: undefined },
]
```

Perilaku parser yang perlu kamu tahu:

| Kondisi                                                                  | Hasil saat ini                                                              |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| Tidak ada data atau hanya ada header                                     | Array kosong `[]`                                                           |
| Header memiliki spasi di awal/akhir                                      | Spasi header dihapus                                                        |
| Header kosong                                                            | Diberi nama `col_0`, `col_1`, dan seterusnya berdasarkan indeks dalam range |
| Header berulang seperti `Name`, `Name`                                   | Menjadi `Name`, `Name_1`                                                    |
| Sel berupa string kosong atau hanya spasi                                | Menjadi `null`                                                              |
| Sel cocok dengan pola error di `cleanCell`, misalnya `#N/A` atau `#REF!` | Menjadi `null`                                                              |
| Sel tidak ada pada array baris                                           | Tetap `undefined`                                                           |
| Teks berisi nilai, misalnya `" Ayu "`                                    | Spasinya tetap dipertahankan                                                |
| Nilai angka `0` atau boolean `false`                                     | Tetap dipertahankan                                                         |

Parser hanya memetakan kolom yang ada pada header dan tidak memfilter baris kosong. Penamaan header sebaiknya unik sejak di Sheets: kombinasi seperti `Name`, `Name`, `Name_1` masih bisa menghasilkan benturan nama pada algoritma saat ini.

`SheetRow` adalah `Record<string, SheetValue>`, dengan nilai berupa string, number, boolean, null, atau undefined. Tipe ini belum menjamin bentuk data suatu feature. `sheetValueSchema` dipakai untuk mendefinisikan tipe, validasi feature dilakukan sesudah fetch.

## Menentukan Schema di `src/features/`

Jangan menebak tipe hanya dari nama kolom atau tampilan sel. Di sebelah kiri schema, tulis nama header persis setelah spasi tepinya dibersihkan. Di bagian `.transform()`, ubah menjadi nama field yang nyaman dipakai aplikasi.

Contoh dari feature Man Power:

```ts
// Bagian input schema
"Masa Kerja (Bulan)": z.coerce.number().nullable(),

// Bagian transform
monthTenure: row["Masa Kerja (Bulan)"],
```

Komponen kemudian memakai `person.monthTenure`, bukan `person["Masa Kerja (Bulan)"]`.

### Memilih tipe dan aturan sel kosong

| Kebutuhan                              | Schema                  | Catatan                                                                  |
| -------------------------------------- | ----------------------- | ------------------------------------------------------------------------ |
| Teks wajib                             | `z.string()`            | Tidak menerima null/undefined; string kosong masih valid tanpa `.min(1)` |
| Teks atau null                         | `z.string().nullable()` | Tidak menerima undefined                                                 |
| Teks atau nilai yang tidak ada         | `z.string().optional()` | Tidak menerima null                                                      |
| Teks, null, atau undefined             | `z.string().nullish()`  | Cocok jika kedua bentuk kosong memang diizinkan                          |
| Angka asli                             | `z.number()`            | String angka seperti `"12"` ditolak                                      |
| Angka atau string yang bisa dikonversi | `z.coerce.number()`     | Gunakan hanya jika konversi memang diinginkan                            |

Contoh menormalkan teks opsional menjadi `string | null`:

```ts
const optionalText = z.string().nullish().transform((value) => value ?? null)
```

### Tanggal

Feature Man Power mengharapkan `Join Date` berupa angka serial Sheets atau null, lalu memakai `sheetsSerialToDate()` untuk menghasilkan `Date | null`.

```ts
const sheetDateField = () =>
  z.number().nullable().transform((value) =>
    value === null ? null : sheetsSerialToDate(value)
  )
```

Helper menghitung waktu dari epoch UTC 30 Desember 1899. Teks tanggal seperti `"16/09/2026"` tidak diterima oleh schema ini. Sepakati format sumber terlebih dahulu sebelum menambah parser tanggal lain. Saat menampilkan hasil, perhatikan bahwa pemformatan tanggal lokal dapat memakai zona waktu browser.

### Validasi satu daftar

Pola yang digunakan sekarang:

```ts
export const manPowerListSchema = z.array(manPowerSchema)
export type ManPower = z.output<typeof manPowerSchema>
```

`z.output` mengambil tipe setelah transform, sehingga tipe aplikasi mengikuti nama field dan hasil konversi schema. `manPowerListSchema.parse(data)` melempar error jika satu saja baris tidak sesuai. Data tidak otomatis dipotong menjadi hanya baris yang valid.

Field tambahan yang tidak didefinisikan pada `z.object()` biasa tidak ikut menjadi output. Pada feature ini, transform juga secara eksplisit memilih field yang dikembalikan.

## Fetch dan Menampilkan Data Man Power

Fungsi API feature membaca konfigurasi, mengambil data, lalu melakukan validasi:

```ts
const data = await fetchSheet({
  spreadsheetId: SHEETS.manPower.spreadsheetId,
  ...SHEETS.manPower.mp,
})

return manPowerListSchema.parse(data)
```

Implementasi lengkap `fetchManPower()` juga mencatat `ZodError` memakai `z.treeifyError()` lalu melempar error kembali. Ini membuat hook query dapat melaporkan kegagalan, bukan menganggapnya sebagai data kosong.

Di komponen React, gunakan hook yang sudah tersedia:

```tsx
import { useFetchManPower } from "@/features/man-power/api/man-power.query"

export function ManPowerSummary() {
  const { data, isPending, isError } = useFetchManPower()

  if (isPending) return <p>Sedang memuat data…</p>
  if (isError) return <p>Data belum berhasil dimuat. Coba lagi nanti.</p>
  if (data.length === 0) return <p>Belum ada data Man Power.</p>

  return <p>Ada {data.length} baris data Man Power.</p>
}
```

`QueryClientProvider` sudah dipasang di [main.tsx](../src/main.tsx). Konfigurasi [query-client.ts](../src/lib/tanstack-query/query-client.ts) memakai `staleTime` 1 menit dan `gcTime` 5 menit. Data dianggap fresh selama 1 menit; cache query yang tidak aktif dapat dibersihkan setelah 5 menit.

Untuk contoh halaman lengkap, lihat [man-power-dashboard.tsx](../src/pages/man-power-dashboard.tsx).

## Menambah Feature Baru

Ikuti pola tiga file di dalam `src/features/<nama-feature>/api/`: `<nama-feature>.schema.ts`, `<nama-feature>.api.ts`, dan `<nama-feature>.query.ts`.

1. Periksa header, range, nilai kosong, tipe angka, dan format tanggal sumber.
2. Tambahkan konfigurasi sumber ke `SHEETS` tanpa mengganti entri feature lain.
3. Buat schema input sesuai header, transform ke field aplikasi, lalu ekspor schema array dan tipe output.
4. Buat fungsi API yang memanggil `fetchSheet()` dan mengembalikan hasil `.parse()`.
5. Buat hook query dengan key unik. Jika parameter mengubah data yang diminta, sertakan parameter itu pada key dan teruskan ke fungsi fetch.
6. Gunakan hook pada halaman, lengkap dengan tampilan loading, error, dan data kosong.

Contoh berikut adalah template schema untuk sumber baru dengan header `Kode`, `Nama`, dan `Jumlah`; bukan schema yang sudah terpasang:

```ts
import z from "zod"

export const inventorySchema = z.object({
  Kode: z.string().min(1),
  Nama: z.string().min(1),
  Jumlah: z.number().nullish(),
}).transform((row) => ({
  code: row.Kode,
  name: row.Nama,
  quantity: row.Jumlah ?? null,
}))

export const inventoryListSchema = z.array(inventorySchema)
export type Inventory = z.output<typeof inventorySchema>
```

Untuk menghubungkannya, tambahkan entri konfigurasi dengan ID, tab, dan range sumber inventory yang benar. Fungsi API kemudian mengikuti contoh Man Power, memakai konfigurasi tersebut dan `inventoryListSchema.parse(data)`. Hook memakai fungsi itu sebagai `queryFn` dan key seperti `["inventory"]`. Jangan menyalin ID atau range Man Power untuk sumber yang berbeda.

## Jika Data Gagal Dimuat

| Gejala                                  | Yang perlu diperiksa                                                      |
| --------------------------------------- | ------------------------------------------------------------------------- |
| `VITE_SHEETS_API_KEY is not set`        | Isi `.env.local` dan restart development server                           |
| Error HTTP dari Sheets                  | Periksa pesan error, API key, izin sumber, ID, nama tab, dan range        |
| `Schema mismatch` di console            | Cocokkan path error dengan header dan tipe nilai pada schema              |
| Kolom tampak kosong tetapi schema gagal | Periksa apakah nilainya undefined, sedangkan schema hanya `.nullable()`   |
| Tanggal gagal divalidasi                | Periksa apakah sumber mengirim angka serial atau teks                     |
| Hasil kosong tanpa error                | Periksa range; respons tanpa `values` atau hanya header menghasilkan `[]` |
| Angka/kode berubah setelah parsing      | Periksa tipe sumber dan penggunaan coercion                               |

Saat memeriksa data, gunakan contoh yang sudah disamarkan. Hindari menyalin URL request lengkap yang memuat key atau data personal ke issue dan log bersama.

## Panduan untuk AI Agent

- Baca konfigurasi, helper, schema, API, dan query feature terkait sebelum mengedit. Dokumentasi ini menjelaskan implementasi saat ditulis; periksa kembali kode jika ada perbedaan.
- Jika kontrak sumber belum tersedia, minta daftar header dan contoh nilai yang sudah disamarkan. Jangan mengarang ID spreadsheet, nama tab, kolom, atau tipe data.
- Letakkan validasi dan transformasi khusus feature di schema feature. Perubahan parser umum akan memengaruhi semua pemakainya dan perlu alasan yang jelas.
- Gunakan `fetchSheet()` untuk request dan hook query untuk akses dari komponen. Turunkan tipe dari schema output, bukan membuat tipe terpisah yang bisa berbeda dari hasil parse.
- Tentukan dengan sengaja apakah null, undefined, baris kosong, dan nilai tidak valid boleh diterima. Jangan melonggarkan schema atau mengembalikan `[]` hanya untuk menyembunyikan error.
- Jangan mengubah kebijakan akses spreadsheet atau menaruh kredensial privat di frontend sebagai jalan pintas.
- Untuk perubahan implementasi, periksa contoh data normal, kosong, dan tidak valid, lalu jalankan `pnpm lint` dan `pnpm build` (atau `npm run lint` dan `npm run build`). Build menjalankan `tsc -b` serta Vite; laporkan pemeriksaan yang benar-benar dijalankan.
