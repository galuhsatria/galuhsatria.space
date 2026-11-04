import type { Lang } from '../i18n';
import { t } from '../i18n';
import { socials } from '../data/site';

/*
 * Single source of truth for everything search engines and social networks
 * read. Set VITE_SITE_URL in the deployment environment; the fallback is the
 * production domain used by this portfolio.
 */
const envSiteUrl = import.meta.env.VITE_SITE_URL as string | undefined;

export const SITE_URL = (envSiteUrl || 'https://galuhsatria.space').replace(/\/+$/, '');
export const SITE_NAME = 'Galuh Satria';
export const SITE_EMAIL = 'galuhsatriadev@gmail.com';
export const SITE_ROLE = 'Fullstack Web Developer';
export const OG_IMAGE = '/og-image.png';
export const AVATAR_IMAGE = '/avatar-512.png';

export const ogLocale: Record<Lang, string> = {
  en: 'en_US',
  id: 'id_ID',
};

export const socialLinks = socials.map((social) => social.href);

export function absoluteUrl(path = '/') {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/* /en/blog/x/ -> /id/blog/x/ (and the reverse) */
export function languagePath(path: string, lang: Lang) {
  if (/^\/(en|id)(?=\/|$)/.test(path)) {
    return path.replace(/^\/(en|id)(?=\/|$)/, `/${lang}`);
  }
  return `/${lang}${path.startsWith('/') ? path : `/${path}`}`;
}

export function alternateLinks(path: string) {
  const enPath = languagePath(path, 'en');
  const idPath = languagePath(path, 'id');

  return [
    { rel: 'alternate', hrefLang: 'en', href: absoluteUrl(enPath) },
    { rel: 'alternate', hrefLang: 'id', href: absoluteUrl(idPath) },
    { rel: 'alternate', hrefLang: 'x-default', href: absoluteUrl(enPath) },
  ];
}

/* Mirror of alternateLinks() for TanStack Start's generated sitemap. */
export function alternateRefs(path: string) {
  const enPath = languagePath(path, 'en');
  const idPath = languagePath(path, 'id');

  return [
    { href: absoluteUrl(enPath), hreflang: 'en' },
    { href: absoluteUrl(idPath), hreflang: 'id' },
    { href: absoluteUrl(enPath), hreflang: 'x-default' },
  ];
}

export interface SeoOptions {
  title: string;
  description: string;
  path: string;
  lang: Lang;
  type?: 'website' | 'profile' | 'article';
  image?: string;
  imageAlt?: string;
  preloadImage?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown>;
}

export function buildSeo({
  title,
  description,
  path,
  lang,
  type = 'website',
  image = OG_IMAGE,
  imageAlt,
  preloadImage,
  publishedTime,
  modifiedTime,
  noindex = false,
  jsonLd,
}: SeoOptions) {
  const canonical = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);
  const otherLang: Lang = lang === 'en' ? 'id' : 'en';
  const imageAltText =
    imageAlt ?? `${SITE_NAME} — ${lang === 'id' ? 'Pengembang Web Fullstack' : SITE_ROLE}`;

  return {
    meta: [
      { title },
      { name: 'description', content: description },
      {
        name: 'robots',
        content: noindex
          ? 'noindex, nofollow'
          : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: canonical },
      { property: 'og:image', content: imageUrl },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: imageAltText },
      { property: 'og:locale', content: ogLocale[lang] },
      { property: 'og:locale:alternate', content: ogLocale[otherLang] },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@galuhsatria___' },
      { name: 'twitter:creator', content: '@galuhsatria___' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: imageUrl },
      { name: 'twitter:image:alt', content: imageAltText },
      ...(type === 'article'
        ? [
            { property: 'article:author', content: SITE_NAME },
            ...(publishedTime
              ? [{ property: 'article:published_time', content: publishedTime }]
              : []),
            ...(modifiedTime
              ? [{ property: 'article:modified_time', content: modifiedTime }]
              : []),
          ]
        : []),
    ],
    links: [
      { rel: 'canonical', href: canonical },
      ...alternateLinks(path),
      ...(preloadImage
        ? [{ rel: 'preload', as: 'image', href: preloadImage, fetchPriority: 'high' as const }]
        : []),
    ],
    scripts: jsonLd ? [jsonLdScript(jsonLd)] : [],
  };
}

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export function personSchema() {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    image: absoluteUrl(AVATAR_IMAGE),
    jobTitle: SITE_ROLE,
    email: `mailto:${SITE_EMAIL}`,
    description: t('en').home.subtitle,
    homeLocation: {
      '@type': 'Place',
      name: 'Lombok, Indonesia',
    },
    sameAs: socialLinks,
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    description: t('en').home.subtitle,
    inLanguage: ['en', 'id'],
    publisher: { '@id': PERSON_ID },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function itemListSchema(items: { name: string; url: string }[]) {
  return {
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export function graphSchema(...nodes: Record<string, unknown>[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  };
}

export function jsonLdScript(data: Record<string, unknown>) {
  return {
    type: 'application/ld+json',
    children: JSON.stringify(data),
  };
}
