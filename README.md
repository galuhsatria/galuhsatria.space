# Galuh Satria — Portfolio

TanStack Start + React 19 + Vite 8 + Tailwind CSS 3 + MDX. Pages are generated for English and Indonesian.

## Run

```bash
npm install
npm run dev      # http://localhost:4321  (redirects to /en/)
npm run build    # static site in dist/client
npm run preview
```

Deploy `dist/client` to a static host. The build also produces `dist/server` for a Node/SSR host. `dist/client/_redirects` and `vercel.json` both send `/` to `/en/` permanently; `dist/client/404.html` is the static fallback for unknown paths.

### Vercel

`vercel.json` already sets the framework preset to "Other", the build command to `npm run build`, and the output directory to `dist/client`, so the repository deploys as a static site without extra dashboard settings. Add `VITE_SITE_URL=https://galuhsatria.space` in Project Settings → Environment Variables (Production and Preview) before the first build, then attach the custom domain. Vercel serves `dist/client/404.html` for unknown routes and applies the `/` → `/en/` 308 redirect before static files.

## Environment

Copy `.env.example` to `.env` and set:

- `VITE_SITE_URL` — canonical origin used by canonical tags, Open Graph, JSON-LD, the sitemap, `robots.txt`, and the root redirect. Defaults to `https://galuhsatria.space`.
- `VITE_GOOGLE_SITE_VERIFICATION` — optional Search Console verification token.

## Structure

- `src/i18n/en.json`, `id.json` — page copy. `src/i18n/index.ts` holds extra strings (read time, footer, copy button).
- `src/data/projects.json` — projects (EN/ID text, image, alt text, `url`, `source`).
- `src/data/site.ts` — handle, résumé, social links, and the tech stack list.
- `src/content/blog/en/*.mdx`, `src/content/blog/id/*.mdx` — blog posts per language. Frontmatter: `title`, `slug`, `summary`, `createdAt`. Keep the same `slug` in both folders so hreflang points at the same article.
- `src/lib/seo.ts` — canonical URLs, hreflang, Open Graph/Twitter metadata, and JSON-LD builders.
- `src/lib/blog.ts` — language-aware MDX discovery, reading time, and post lookup.
- `src/components/` — UI components, including `FadeImage`, `Breadcrumbs`, `NotFound`, and `PostRow`.
- `scripts/postbuild-seo.mjs` — writes `robots.txt`, `_redirects`, the `/` redirect page, `404.html`, and validates the built HTML/sitemap.
- `scripts/generate-og.mjs` — regenerates `public/og-image.png`.
- `public/` — avatar, project screenshots, logos, favicon, and social image.

## SEO checks

```bash
npm run build     # also runs the checks
npm run seo:check # re-run checks on an existing dist/client
npm run og        # regenerate public/og-image.png
```

The checks look for unique titles and canonicals, descriptions, a single H1, indexability, JSON-LD, broken internal links, missing images, and sitemap/hreflang consistency.

## Routing

- `/` is a permanent redirect to `/en/`. Netlify uses `netlify.toml` with `force = true` because a static `index.html` would otherwise shadow the rule. Cloudflare Pages uses the generated `_redirects` rule (301). Vercel uses `vercel.json` (308, which is also permanent and preserves the request method). The generated root `index.html` remains as a meta-refresh fallback for hosts without redirect rules.
- Unknown paths render `src/components/NotFound.tsx` on the client and `dist/client/404.html` when the host serves a static file.

## To do

- Connect the contact form in `src/components/SayHi.tsx` to a real endpoint. It currently only shows a "preview only" note.
