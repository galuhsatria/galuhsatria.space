# Page Transition Top Loader — Design (2026-11-04)

## Intent
Pindah halaman terasa cepat dan bertema terminal/markdown, tanpa halaman lama sempat hilang
(blank) saat navigasi.

## Goals
- Bar loader tipis di paling atas layar saat navigasi internal berjalan.
- Halaman lama tetap tampil sampai halaman baru siap; tidak ada layar kosong.
- Bar mulai jalan saat navigasi dimulai, mencapai 100% setelah halaman baru ter-render,
  lalu fade out. Durasi minimum ±420ms supaya sempat terbaca.
- Hanya saat `pathChanged`; pindah anchor/hash (`#say-hi`) tidak memicu loader.
- Navigasi internal jadi client-side (tanpa full reload).

## Non-goals / anti-goals
- Tidak menutupi atau mengganti konten halaman dengan overlay/spinner.
- Tidak mengubah animasi reveal konten yang sudah ada.
- Tidak menambah delay selain durasi minimum bar.
- Tidak menyentuh konten, data, atau URL.

## Approaches
- **A (dipilih): top bar + client-side navigation.** Loader global mendengarkan event router;
  konten lama tetap ter-mount sampai route baru commit. Cepat, tidak blank, jelas terlihat.
- **B: overlay tengah "rendering".** Lebih teatrikal, tapi menutupi halaman dan berisiko terasa blank.
- **C: animasi masuk halaman tanpa indikator.** Paling ringan, tapi tidak ada tanda progres navigasi.

## How (keputusan)
- Komponen baru `src/components/TopLoader.tsx`, dipasang sekali di `__root.tsx` (di dalam
  `LazyMotion`), di atas `<Outlet />`.
- `router.subscribe('onBeforeNavigate')` → mulai bar bila `pathChanged`.
  `router.subscribe('onRendered')` → selesaikan bar setelah sisa durasi minimum.
- Bar: fixed `top-0`, tinggi 2px, warna `--accent` dengan glow tipis, `scaleX` dari 10% → 90%
  (naik bertahap) lalu 100%. `pointer-events-none`, `z-index` di atas header.
- Tidak menyentuh `defaultPendingComponent`/Outlet, jadi halaman lama tidak di-unmount
  lebih awal oleh loader.
- Aksesibilitas: `role="status"` + teks sr-only "Memuat halaman".
  `prefers-reduced-motion`: tanpa animasi naik bertahap/blink, langsung tampil dan selesai.
- Link internal yang dikonversi ke TanStack `Link`: Header (nav + logo + pemilih bahasa),
  `Section` link, `PostRow`, link balik di `blog.$slug`. Link eksternal tetap `<a>`.

## Files
- `src/components/TopLoader.tsx` (baru)
- `src/routes/__root.tsx`
- `src/components/Header.tsx`, `Section.tsx`, `PostRow.tsx`
- `src/routes/$lang/blog.$slug.tsx`

## Verification
`npx tsc --noEmit` dan `npm run build`; cek manual: navigasi antar halaman menampilkan bar di atas,
halaman lama tetap terlihat sampai halaman baru muncul, klik `#say-hi` tidak memicu bar,
dan tombol back browser tetap bekerja.
