<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/header/grid.svg?title=IHP%20Dashboard&amp;subtitle=Mengintegrasikan%20semua%20dasbor%20IHP%20dalam%20satu%20platform&amp;logo=react&amp;theme=blue&amp;align=left&amp;mode=dark" />
    <img src="https://shieldcn.dev/header/grid.svg?title=IHP%20Dashboard&amp;subtitle=Mengintegrasikan%20semua%20dasbor%20IHP%20dalam%20satu%20platform&amp;logo=react&amp;theme=blue&amp;align=left&amp;mode=light" alt="IHP Dashboard — Mengintegrasikan semua dasbor IHP dalam satu platform" />
  </picture>
</p>

<div align="center">

[![Vite 8](https://shieldcn.dev/badge/Vite-8-646CFF.svg?variant=default&logo=vite)](https://vite.dev/) [![Tailwind CSS 4](https://shieldcn.dev/badge/Tailwind%20CSS-4-06B6D4.svg?variant=default&logo=tailwindcss)](https://tailwindcss.com/) [![React 19](https://shieldcn.dev/badge/React-19-61DAFB.svg?variant=default&logo=react)](https://react.dev/) [![TypeScript 6](https://shieldcn.dev/badge/TypeScript-6-3178C6.svg?variant=default&logo=typescript)](https://www.typescriptlang.org/) [![shadcn/ui 4.21.0](https://shieldcn.dev/badge/shadcn/ui-4.21.0-18181B.svg?variant=default&logo=shadcnui)](https://ui.shadcn.com/)

</div>

# IHP Dashboard

IHP Dashboard adalah antarmuka dasbor responsif yang dibangun menggunakan React dan TypeScript. Proyek ini menyediakan halaman analitik dan CRM yang tersusun dari komponen shadcn/ui yang reusable, grafik interaktif, tabel, navigasi, serta dukungan tema terang dan gelap.

Sebagian halaman masih menggunakan data demonstrasi statis, sementara fitur Man Power mengambil data dari Google Sheets. Untuk menjalankan integrasi Sheets, siapkan `VITE_SHEETS_API_KEY` di `.env.local` sesuai panduan di bawah.

## Dokumentasi Pengembangan

- [Google Sheets dan schema fitur](docs/google-sheets.md): konfigurasi sumber data, cara fetch, penentuan schema Zod, penggunaan hook query, dan panduan menambah fitur untuk anggota tim maupun AI Agent.

## Fitur

- Dasbor analitik berisi statistik, grafik penjualan dan pendapatan, penjualan berdasarkan negara, serta data produk terlaris
- Dasbor CRM berisi KPI, pipeline penjualan, transaksi terbaru, dan aktivitas mendatang
- Sidebar responsif dan tata letak yang ramah perangkat mobile
- Tema terang dan gelap
- Komponen UI dan grafik yang reusable
- Navigasi antarhalaman menggunakan client-side routing

## Teknologi yang Digunakan

- [React 19](https://react.dev/) untuk membangun antarmuka pengguna
- [TypeScript](https://www.typescriptlang.org/) untuk pemeriksaan tipe data secara statis
- [Vite 8](https://vite.dev/) sebagai development server dan build tool
- [Tailwind CSS 4](https://tailwindcss.com/) untuk styling
- [shadcn/ui](https://ui.shadcn.com/) dan [Base UI](https://base-ui.com/) untuk komponen antarmuka yang reusable
- [React Router](https://reactrouter.com/) untuk client-side routing
- [Tanstack Table](https://tanstack.com/table/latest) untuk manajemen tabel data state
- [Tanstack Query](https://tanstack.com/query/latest) untuk manajemen server state
- [Zustand](https://zustand-demo.pmnd.rs/) untuk manajemen client state
- [Recharts](https://recharts.org/) untuk visualisasi data
- [Lucide React](https://lucide.dev/) dan [Iconify](https://iconify.design/) untuk ikon
- [Motion](https://motion.dev/) untuk animasi
- [pnpm](https://pnpm.io/) atau [npm](https://www.npmjs.com/) sebagai package manager
- ESLint dan Prettier untuk menjaga kualitas dan format kode

## Instalasi

1. Clone repositori dan masuk ke direktori proyek:

   ```bash
   git clone https://github.com/bagusindriyanto/ihp-dashboard.git
   cd ihp-dashboard
   ```

2. Instal seluruh dependency menggunakan salah satu package manager:

   Dengan pnpm:

   ```bash
   pnpm install
   ```

   Atau dengan npm:

   ```bash
   npm install
   ```

3. Jalankan development server menggunakan package manager yang sama:

   Dengan pnpm:

   ```bash
   pnpm dev
   ```

   Atau dengan npm:

   ```bash
   npm run dev
   ```

4. Buka alamat lokal yang ditampilkan oleh Vite, biasanya [http://localhost:5173](http://localhost:5173).

## Halaman yang Tersedia

| Rute   | Halaman    | Deskripsi                                                                 |
| ------ | ---------- | ------------------------------------------------------------------------- |
| `/`    | Analitik   | Statistik penjualan, grafik, performa berdasarkan negara, dan data produk |
| `/crm` | Dasbor CRM | KPI pendapatan dan prospek, pipeline, transaksi, serta aktivitas          |

Beberapa item pada sidebar masih berupa placeholder visual dan belum memiliki halaman khusus.

## Perintah yang Tersedia

| Script      | pnpm             | npm                 | Deskripsi                                                             |
| ----------- | ---------------- | ------------------- | --------------------------------------------------------------------- |
| Development | `pnpm dev`       | `npm run dev`       | Menjalankan development server Vite                                   |
| Build       | `pnpm build`     | `npm run build`     | Memeriksa tipe data dan membuat production build di direktori `dist/` |
| Preview     | `pnpm preview`   | `npm run preview`   | Menampilkan pratinjau production build secara lokal                   |
| Lint        | `pnpm lint`      | `npm run lint`      | Menjalankan ESLint pada seluruh proyek                                |
| Type check  | `pnpm typecheck` | `npm run typecheck` | Menjalankan pemeriksaan TypeScript                                    |
| Format      | `pnpm format`    | `npm run format`    | Memformat file TypeScript dan TSX menggunakan Prettier                |

## Struktur Proyek

```text
ihp-dashboard/
├── public/                         # Aset statis publik
├── src/
│   ├── assets/                     # Aset dan logo proyek
│   ├── components/
│   │   ├── shadcn-space/blocks/    # Kerangka dasbor dan widget fitur
│   │   └── ui/                     # Komponen shadcn/ui yang reusable
│   ├── hooks/                      # React hooks
│   ├── lib/                        # Fungsi utilitas
│   ├── pages/                      # Halaman rute Analitik dan CRM
│   ├── App.tsx                     # Rute aplikasi dan kerangka dasbor
│   ├── index.css                   # Styling global dan pengaturan tema Tailwind
│   └── main.tsx                    # Entry point aplikasi React
├── components.json                 # Konfigurasi shadcn/ui
├── package.json                    # Dependency dan perintah proyek
└── vite.config.ts                  # Konfigurasi Vite, Tailwind, dan path alias
```

Alias impor `@/` mengarah ke direktori `src/`.

## Menambahkan Komponen UI

Proyek ini telah dikonfigurasi untuk menggunakan shadcn/ui. Jalankan perintah berikut untuk menambahkan komponen baru:

Dengan pnpm:

```bash
pnpm dlx shadcn@latest add <nama-komponen>
```

Atau dengan npm:

```bash
npx shadcn@latest add <nama-komponen>
```

Contoh menggunakan pnpm:

```bash
pnpm dlx shadcn@latest add button
```

Komponen yang dihasilkan akan ditempatkan di `src/components/ui/` dan dapat diimpor melalui alias yang telah dikonfigurasi:

```tsx
import { Button } from "@/components/ui/button"
```

## Production Build

Buat dan tampilkan pratinjau build yang telah dioptimalkan untuk production:

Dengan pnpm:

```bash
pnpm build
pnpm preview
```

Atau dengan npm:

```bash
npm run build
npm run preview
```

Hasil build akan disimpan di direktori `dist/`. Karena aplikasi menggunakan routing berbasis browser, konfigurasikan penyedia hosting agar menyajikan `index.html` sebagai fallback untuk rute seperti `/crm`.

## Data dan Aset Eksternal

Sebagian data demonstrasi masih didefinisikan langsung di dalam komponen React. Fitur Man Power sudah membaca Google Sheets melalui API, memvalidasi data dengan schema Zod, lalu menyediakannya ke halaman melalui TanStack Query. Lihat [panduan Google Sheets dan schema fitur](docs/google-sheets.md) untuk mengikuti pola yang sama.

Beberapa avatar, bendera, dan ilustrasi demonstrasi dimuat dari `images.shadcnspace.com`. Oleh karena itu, koneksi internet diperlukan agar gambar-gambar tersebut dapat ditampilkan. Aplikasi tetap dapat dijalankan tanpa aset tersebut.

## Kontribusi dan Pull Request

Ingin menambah fitur, menemukan bug, atau ingin memperbaiki sesuatu? Silakan buat Pull Request. Karena branch `master` dilindungi oleh ruleset, semua perubahan perlu melewati proses review terlebih dahulu dan tidak bisa di-push langsung.

1. Pastikan branch `master` sudah versi terbaru, lalu buat branch baru untuk perubahanmu:

   ```bash
   git switch master
   git pull origin master
   git switch -c feat/nama-perubahan
   ```

   Kamu bisa menggunakan awalan `feat/` untuk fitur baru atau `fix/` untuk perbaikan bug.

2. Setelah selesai mengerjakan perubahan, pastikan semuanya tetap berjalan dengan baik:

   ```bash
   pnpm lint
   pnpm typecheck
   pnpm build
   ```

   Jika kamu menggunakan npm, cukup ganti `pnpm` dengan `npm run`, misalnya `npm run typecheck`.

3. Simpan perubahan dalam commit dengan pesan yang singkat dan jelas, lalu push branch tersebut:

   ```bash
   git add .
   git commit -m "feat: jelaskan perubahan"
   git push -u origin feat/nama-perubahan
   ```

4. Setelah branch berhasil di-push, buka GitHub dan klik **Compare & pull request**. Pastikan tujuan PR adalah branch `master`, lalu tulis secara singkat apa yang diubah dan alasannya.

5. Jika ada masukan dari reviewer, lakukan perbaikan pada branch yang sama dan push kembali. PR dapat digabungkan ke `master` setelah seluruh pemeriksaan ruleset berhasil dan review telah disetujui.

## Catatan Penggunaan Package Manager

Repositori ini menyediakan `pnpm-lock.yaml`, sehingga pnpm merupakan package manager bawaan proyek. Namun, npm tetap dapat digunakan dan akan membuat file `package-lock.json` ketika menjalankan `npm install`.

Gunakan satu package manager secara konsisten pada satu branch atau tim. Hindari mencampur `pnpm install` dan `npm install` pada instalasi yang sama karena keduanya menggunakan lockfile yang berbeda dan dapat menghasilkan versi dependency yang tidak identik. Jika tim memutuskan beralih sepenuhnya ke npm, gunakan dan commit `package-lock.json`, lalu sepakati pengelolaan `pnpm-lock.yaml` bersama tim.
