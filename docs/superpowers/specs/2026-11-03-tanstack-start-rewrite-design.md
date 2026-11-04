# Rewrite Portfolio ke TanStack Start — Design (2026-11-03)

## Intent
Ganti framework Astro → TanStack Start (React) agar bisa pakai library Motion untuk animasi,
tanpa mengubah apa pun yang terlihat oleh user: URL, konten, bahasa, dan tampilan tetap sama.

## Goals
- 13 halaman ter-render identik: `/`, `/en`, `/id`, `/en/projects`, `/id/projects`,
  `/en/blog`, `/id/blog`, dan 6 halaman post blog.
- Animasi reveal pakai `motion` (title drop dari atas, content fade-up), sekali saja (`once: true`),
  dengan fallback `useReducedMotion`.
- Output build statis, hosting bisa di mana saja.
- Bahasa en/id tetap, frontmatter MDX tetap.

## Non-goals / anti-goals
- Tidak ada SSR runtime — murni prerendering.
- Tidak menambah halaman/fitur baru.
- Tidak menyentuh konten blog.

## Constraints & keputusan how
- **Plugin**: `@tanstack/react-start/plugin/vite` (`tanstackStart`), `viteReact()` sesudahnya,
  plus `vite-tsconfig-paths`.
- **Static**: `tanstackStart({ prerender: { enabled: true, crawlLinks: true } })`.
  Root `/` redirect ke `/en/` via `beforeLoad` + `throw redirect()`;
  crawler (default on, `maxRedirects: 5`) mengikuti redirect & semua link internal,
  sehingga rute ber-param `/$lang/...` dan `/blog/$slug` ikut ter-render.
- **Trailing slash**: `trailingSlash: 'always'` di `createRouter` + `autoSubfolderIndex: true`
  (default) agar URL identik dengan Astro (`/en/projects/`).
- **MDX**: `@mdx-js/rollup` + `remark-gfm` + `remark-frontmatter` + `remark-mdx-frontmatter`
  (frontmatter di-export sebagai `frontmatter`). Metadata diambil via `import.meta.glob(..., { eager: true })`,
  body untuk `readMinutes` via glob `?raw`. Dipilih daripada `@tanstack/markdown` karena mempertahankan
  markup semantik yang di-styling oleh `.prose-post` sekarang.
- **Routing**: file-based di `src/routes/`: `__root.tsx` (shell html + CSS/fonts),
  `$lang/route.tsx` (layout Header+Footer), `$lang/index.tsx` (home),
  `$lang/projects.tsx`, `$lang/blog.index.tsx`, `$lang/blog.$slug.tsx`.
- **Animasi**: komponen `<motion.div initial whileInView viewport={{once:true}} transition>` di Section,
  menggantikan IntersectionObserver manual + CSS yang ada sekarang.
- **Styling**: Tailwind v3 + `global.css` + `tailwind.config.mjs` dipindah apa adanya.

## Yang ditulis ulang
Base, Header (dropdown bahasa), Footer, Section/Heading, IconTile/Icon (simple-icons tetap),
SayHi/CopyHandle, ProjectRow/ProjectBlock, PostRow, dan halaman. Data & i18n TS murni dipindah tanpa edit berarti.

## Yang dihapus
`src/pages/**` (Astro), `src/layouts`, `src/components/*.astro`, `src/content.config.ts`,
`astro.config.mjs`, deps Astro.
