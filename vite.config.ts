import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import rehypeShiki from '@shikijs/rehype';
import remarkWords from './src/lib/remark-words.mjs';
import rehypeImageAttrs from './src/lib/rehype-image-attrs.mjs';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';

const FALLBACK_SITE_URL = 'https://galuhsatria.space';
const BLOG_DIR = path.resolve('src/content/blog');
const BLOG_LANGS = ['en', 'id'] as const;
type BlogLang = (typeof BLOG_LANGS)[number];

function readBlogPosts() {
  const posts: Record<BlogLang, Array<{ slug: string; lastmod: Date }>> = { en: [], id: [] };

  for (const lang of BLOG_LANGS) {
    const dir = path.join(BLOG_DIR, lang);
    if (!fs.existsSync(dir)) continue;

    posts[lang] = fs
      .readdirSync(dir)
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => {
        const fullPath = path.join(dir, file);
        const source = fs.readFileSync(fullPath, 'utf8');
        const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
        const slug = frontmatter.match(/^slug:\s*['"]?([^'"\r\n]+)['"]?/m)?.[1].trim();
        return {
          slug: slug || file.replace(/\.mdx$/, ''),
          lastmod: fs.statSync(fullPath).mtime,
        };
      });
  }

  return posts;
}

function alternateRefs(siteUrl: string, routePath: string) {
  const enPath = routePath.replace(/^\/(en|id)(?=\/|$)/, '/en');
  const idPath = routePath.replace(/^\/(en|id)(?=\/|$)/, '/id');

  return [
    { href: `${siteUrl}${enPath}`, hreflang: 'en' },
    { href: `${siteUrl}${idPath}`, hreflang: 'id' },
    { href: `${siteUrl}${enPath}`, hreflang: 'x-default' },
  ];
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = (env.VITE_SITE_URL || FALLBACK_SITE_URL).replace(/\/+$/, '');
  const blogPosts = readBlogPosts();

  const pages = [
    { path: '/', sitemap: { exclude: true } },
    ...(['en', 'id'] as const).flatMap((lang) => [
      {
        path: `/${lang}/`,
        sitemap: {
          priority: 1,
          changefreq: 'monthly' as const,
          alternateRefs: alternateRefs(siteUrl, `/${lang}/`),
        },
      },
      {
        path: `/${lang}/projects/`,
        sitemap: {
          priority: 0.8,
          changefreq: 'monthly' as const,
          alternateRefs: alternateRefs(siteUrl, `/${lang}/projects/`),
        },
      },
      {
        path: `/${lang}/blog/`,
        sitemap: {
          priority: 0.8,
          changefreq: 'weekly' as const,
          alternateRefs: alternateRefs(siteUrl, `/${lang}/blog/`),
        },
      },
      ...blogPosts[lang].map((post) => ({
        path: `/${lang}/blog/${post.slug}/`,
        sitemap: {
          priority: 0.6,
          changefreq: 'yearly' as const,
          lastmod: post.lastmod,
          alternateRefs: alternateRefs(siteUrl, `/${lang}/blog/${post.slug}/`),
        },
      })),
    ]),
  ];

  return {
    server: {
      port: 4321,
    },
    plugins: [
      {
        ...mdx({
          // compile straight to JS (jsx() calls) — no JSX left for vite to re-parse
          jsx: false,
          remarkPlugins: [
            remarkGfm,
            remarkFrontmatter,
            [remarkMdxFrontmatter, { name: 'frontmatter' }],
            remarkWords,
          ],
          rehypePlugins: [
            [rehypeShiki, { theme: 'github-dark-default' }],
            rehypeImageAttrs,
          ],
        }),
        enforce: 'pre',
      },
      tanstackStart({
        pages,
        sitemap: {
          enabled: true,
          outputPath: 'sitemap.xml',
          host: siteUrl,
        },
        prerender: {
          enabled: true,
          // Every page is listed above. Crawling would also pick up /en/#say-hi
          // and add hash URLs to the sitemap.
          crawlLinks: false,
          failOnError: true,
        },
      }),
      // react's vite plugin must come after start's vite plugin
      // include .mdx so compiled MDX JSX output gets transformed too
      viteReact({ include: /\.(mdx|js|jsx|mjs|ts|tsx)$/ }),
    ],
  };
});
