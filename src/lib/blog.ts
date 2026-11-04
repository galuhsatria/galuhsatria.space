import type { ComponentType } from 'react';
import type { Lang } from '../i18n';

interface PostFrontmatter {
  title: string;
  slug: string;
  summary: string;
  createdAt: string;
}

export type Post = {
  title: string;
  slug: string;
  summary: string;
  createdAt: Date;
  /* Approximate read time, injected by the remarkWords remark plugin */
  minutes: number;
  lang: Lang;
  Component: ComponentType;
};

/* Compiled MDX modules: default = component, frontmatter/wc = metadata */
const modules = import.meta.glob('/src/content/blog/*/*.mdx', { eager: true }) as Record<
  string,
  { default: ComponentType; frontmatter: PostFrontmatter; wc: number }
>;

const postsByLang: Record<Lang, Post[]> = { en: [], id: [] };

for (const [file, mod] of Object.entries(modules)) {
  const lang = file.match(/\/content\/blog\/(en|id)\//)?.[1] as Lang | undefined;
  if (!lang) continue;

  postsByLang[lang].push({
    title: mod.frontmatter.title,
    slug: mod.frontmatter.slug,
    summary: mod.frontmatter.summary,
    createdAt: new Date(mod.frontmatter.createdAt),
    minutes: Math.max(1, Math.round((mod.wc ?? 0) / 200)),
    lang,
    Component: mod.default,
  });
}

for (const lang of Object.keys(postsByLang) as Lang[]) {
  postsByLang[lang].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export const getPosts = (lang: Lang) => postsByLang[lang];

export const getPost = (slug: string, lang: Lang) =>
  postsByLang[lang].find((post) => post.slug === slug);
