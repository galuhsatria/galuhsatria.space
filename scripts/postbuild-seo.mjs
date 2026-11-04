import fs from 'node:fs';
import path from 'node:path';

import { loadEnv } from 'vite';

const fallbackSiteUrl = 'https://galuhsatria.space';
/*
 * Vite reads .env files, but this plain Node script does not. loadEnv keeps
 * robots.txt and the root redirect in sync with the sitemap when the deploy
 * environment only sets VITE_SITE_URL in an env file.
 */
const env = loadEnv(process.env.NODE_ENV || 'production', process.cwd(), '');
const siteUrl = (process.env.VITE_SITE_URL || env.VITE_SITE_URL || fallbackSiteUrl).replace(/\/+$/, '');
const clientDir = fs.existsSync('dist/client') ? 'dist/client' : 'dist';

function write(file, contents) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents);
}

/* robots.txt is generated so the sitemap URL follows VITE_SITE_URL. */
write(
  path.join(clientDir, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
);

/*
 * Static hosts that understand _redirects (Netlify, Cloudflare Pages).
 * 301 marks the root redirect as permanent so search engines consolidate the
 * root URL with /en/. Vercel needs the same rule in vercel.json.
 */
write(path.join(clientDir, '_redirects'), '/ /en/ 301\n');

/* The root is only a language redirect. Keep it out of the index and point it at /en/. */
const redirectHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Galuh Satria — Fullstack Web Developer</title>
    <meta name="description" content="Redirecting to the English portfolio of Galuh Satria, fullstack web developer in Lombok, Indonesia." />
    <meta name="robots" content="noindex, follow" />
    <link rel="canonical" href="${siteUrl}/en/" />
    <link rel="icon" type="image/png" href="/favicon-avatar.png" sizes="256x256" />
    <meta http-equiv="refresh" content="0; url=/en/" />
    <script>window.location.replace('/en/' + window.location.hash);</script>
  </head>
  <body>
    <p>Redirecting to <a href="/en/">Galuh Satria</a>…</p>
  </body>
</html>
`;

for (const file of [path.join(clientDir, 'index.html')]) {
  if (fs.existsSync(file)) write(file, redirectHtml);
}

/*
 * Hosts serve this file for unknown paths (Netlify, Cloudflare Pages, Vercel).
 * The client-side 404 lives in src/components/NotFound.tsx; this static copy
 * keeps the same look when a route never reaches the app.
 */
const notFoundHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Page not found — Galuh Satria</title>
    <meta name="description" content="The page you are looking for does not exist or has moved." />
    <meta name="robots" content="noindex, follow" />
    <link rel="icon" type="image/png" href="/favicon-avatar.png" sizes="256x256" />
    <style>
      :root { color-scheme: dark; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        background: #242628;
        color: #f4f4f5;
        font: 15px/1.65 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      a { color: #89a4ff; text-decoration: none; }
      a:hover { text-decoration: underline; text-underline-offset: 4px; }
      .shell { width: 100%; max-width: 44rem; margin: 0 auto; padding: 0 16px; }
      .head {
        border-bottom: 1px solid #38393d;
        padding: 22px 0 12px;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 12px;
      }
      .head a { color: #9b9ea4; }
      main { padding: 56px 0 96px; }
      .code {
        margin: 0;
        color: #89a4ff;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 12px;
        letter-spacing: 0.2em;
      }
      h1 {
        margin: 16px 0 0;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: clamp(2rem, 8vw, 2.75rem);
        font-weight: 400;
        line-height: 1;
      }
      p { margin: 16px 0 0; color: #9b9ea4; }
      p[lang='id'] { margin-top: 4px; }
      nav {
        display: flex;
        flex-wrap: wrap;
        gap: 12px 20px;
        margin-top: 32px;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 14px;
      }
      nav a { color: #9b9ea4; }
      nav a:first-child { color: #89a4ff; }
    </style>
  </head>
  <body>
    <div class="shell head"><a href="/en/">~/galuh-satria/README.md</a></div>
    <main class="shell">
      <p class="code">404</p>
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist, or it may have moved.</p>
      <p lang="id">Halaman yang kamu cari tidak ada, atau mungkin sudah dipindahkan.</p>
      <nav>
        <a href="/en/">← Back home</a>
        <a href="/en/blog/">Blog</a>
        <a href="/en/projects/">Projects</a>
        <a href="/id/" lang="id">Bahasa Indonesia</a>
      </nav>
    </main>
  </body>
</html>
`;

write(path.join(clientDir, '404.html'), notFoundHtml);

/* The generated pages.json is a build artifact, not a public page. */
fs.rmSync(path.join(clientDir, 'pages.json'), { force: true });

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const htmlFiles = walk(clientDir).filter(
  (file) => file.endsWith('.html') && path.basename(file) === 'index.html',
);

const errors = [];
const warnings = [];
const titles = new Map();
const canonicals = new Map();

if (!fs.existsSync(path.join(clientDir, '404.html'))) {
  errors.push('404.html: not generated');
}

for (const file of htmlFiles) {
  const relative = path.relative(clientDir, file).replace(/\\/g, '/');
  const html = fs.readFileSync(file, 'utf8');
  const isRootRedirect = relative === 'index.html';

  const title = html.match(/<title>(.*?)<\/title>/s)?.[1]?.trim();
  const description = html.match(/<meta name="description" content="(.*?)"/s)?.[1]?.trim();
  const canonical = html.match(/<link rel="canonical" href="(.*?)"/s)?.[1]?.trim();
  const robots = html.match(/<meta name="robots" content="(.*?)"/s)?.[1]?.trim();
  const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
  const jsonLdCount = (html.match(/type="application\/ld\+json"/g) ?? []).length;
  const jsonLdBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  const alternates = [...html.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/gi)].map(
    (match) => match[1].toLowerCase(),
  );
  const pathname = `/${relative.replace(/index\.html$/, '')}`;

  if (!title) errors.push(`${relative}: missing title`);
  if (!description) errors.push(`${relative}: missing description`);
  if (!canonical) errors.push(`${relative}: missing canonical`);

  for (const block of jsonLdBlocks) {
    try {
      JSON.parse(block[1]);
    } catch {
      errors.push(`${relative}: invalid JSON-LD`);
    }
  }

  if (!isRootRedirect) {
    if (h1Count !== 1) errors.push(`${relative}: expected 1 h1, found ${h1Count}`);
    if (!robots?.includes('index')) errors.push(`${relative}: unexpectedly not indexable (${robots ?? 'no robots'})`);
    if (jsonLdCount === 0) errors.push(`${relative}: missing JSON-LD`);
    if (canonical && canonical !== `${siteUrl}${pathname}`) {
      errors.push(`${relative}: canonical ${canonical} should be ${siteUrl}${pathname}`);
    }
    for (const lang of ['en', 'id', 'x-default']) {
      if (!alternates.includes(lang)) errors.push(`${relative}: missing hreflang ${lang}`);
    }
    if (title) {
      /* EN and ID pages share a title by design; only flag duplicates within one language. */
      const titleKey = `${relative.split('/')[0]}::${title}`;
      if (titles.has(titleKey)) {
        errors.push(`${relative}: duplicate title with ${titles.get(titleKey)}`);
      }
      titles.set(titleKey, relative);
    }
    if (canonical) {
      if (canonicals.has(canonical)) errors.push(`${relative}: duplicate canonical with ${canonicals.get(canonical)}`);
      canonicals.set(canonical, relative);
    }
  } else if (robots !== 'noindex, follow') {
    errors.push('index.html: root redirect should be noindex, follow');
  }

  /* Broken internal links: /path/ -> /path/index.html, /file.ext -> existing file. */
  const hrefs = [...html.matchAll(/href="(\/[^"#?]*)"/g)].map((match) => match[1]);
  for (const href of new Set(hrefs)) {
    if (href.startsWith('/assets/') || /\.(?:png|jpe?g|webp|svg|ico|txt|xml|woff2?|css|js|json)$/i.test(href)) {
      const asset = path.join(clientDir, href.replace(/^\//, ''));
      if (!fs.existsSync(asset)) errors.push(`${relative}: broken asset ${href}`);
      continue;
    }
    const target = path.join(clientDir, href.replace(/^\//, ''), 'index.html');
    if (!fs.existsSync(target)) errors.push(`${relative}: broken internal link ${href}`);
  }

  /* Missing images are reported but do not fail the build (see README to-do list). */
  const srcs = [...html.matchAll(/src="(\/[^"#?]*)"/g)].map((match) => match[1]);
  for (const src of new Set(srcs)) {
    if (/\.(?:png|jpe?g|webp|svg|ico|woff2?|css|js)$/i.test(src)) {
      const asset = path.join(clientDir, src.replace(/^\//, ''));
      if (!fs.existsSync(asset)) warnings.push(`${relative}: missing image ${src}`);
    }
  }
}

const sitemapPath = path.join(clientDir, 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  errors.push('sitemap.xml: not generated');
} else {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  if (locations.length === 0) errors.push('sitemap.xml: no URLs');
  if (!sitemap.includes('hreflang="x-default"')) errors.push('sitemap.xml: missing x-default hreflang');
  if (locations.some((location) => !location.startsWith(`${siteUrl}/`))) {
    errors.push(`sitemap.xml: URL does not use ${siteUrl}`);
  }
  if (locations.some((location) => location.includes('#'))) {
    errors.push('sitemap.xml: hash links must not be listed');
  }
  if (new Set(locations).size !== locations.length) errors.push('sitemap.xml: duplicate URLs');
  for (const location of locations) {
    if (!canonicals.has(location)) errors.push(`sitemap.xml: ${location} has no matching canonical page`);
  }
  for (const canonical of canonicals.keys()) {
    if (!locations.includes(canonical)) errors.push(`sitemap.xml: missing canonical page ${canonical}`);
  }
  console.log(`Sitemap: ${locations.length} URLs`);
}

console.log(`HTML pages checked: ${htmlFiles.length}`);
console.log(`Unique titles per language: ${titles.size}`);
console.log(`Unique canonicals: ${canonicals.size}`);

if (warnings.length > 0) {
  console.warn('\nSEO warnings:');
  for (const warning of new Set(warnings)) console.warn(`- ${warning}`);
}

if (errors.length > 0) {
  console.error('\nSEO checks failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('SEO checks passed.');
