import { createFileRoute, notFound } from '@tanstack/react-router';
import { m } from 'motion/react';
import { t, extra, formatDate, type Lang } from '../../i18n';
import { getPost } from '../../lib/blog';
import { revealHeading, revealItem, revealFade } from '../../lib/motion';
import Breadcrumbs from '../../components/Breadcrumbs';
import NotFound from '../../components/NotFound';
import {
  OG_IMAGE,
  PERSON_ID,
  SITE_NAME,
  WEBSITE_ID,
  absoluteUrl,
  breadcrumbSchema,
  buildSeo,
  graphSchema,
} from '../../lib/seo';

export const Route = createFileRoute('/$lang/blog/$slug')({
  /* Validate the slug exists in this language; data comes from lib/blog */
  loader: ({ params }) => {
    if (!getPost(params.slug, params.lang as Lang)) throw notFound();
    return { slug: params.slug };
  },
  notFoundComponent: NotFound,
  head: ({ match, params }) => {
    const lang = params.lang as Lang;
    const post = getPost(match.loaderData?.slug ?? params.slug, lang);
    const tr = t(lang);

    if (!post) {
      return {
        meta: [
          { title: `Page not found | ${SITE_NAME}` },
          { name: 'robots', content: 'noindex, nofollow' },
        ],
        links: [],
        scripts: [],
      };
    }

    const path = `/${lang}/blog/${post.slug}/`;
    // Indonesian titles carry the brand name; English titles are already long
    // enough and stay short to fit search-result snippets.
    const title = lang === 'id' ? `${post.title} — ${SITE_NAME}` : post.title;
    const published = post.createdAt.toISOString();

    return buildSeo({
      title,
      description: post.summary,
      path,
      lang,
      type: 'article',
      image: OG_IMAGE,
      imageAlt: post.title,
      publishedTime: published,
      modifiedTime: published,
      jsonLd: graphSchema(
        {
          '@type': 'BlogPosting',
          '@id': `${absoluteUrl(path)}#article`,
          headline: post.title,
          description: post.summary,
          url: absoluteUrl(path),
          mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(path) },
          datePublished: published,
          dateModified: published,
          inLanguage: lang === 'id' ? 'id-ID' : 'en-US',
          author: { '@id': PERSON_ID },
          publisher: { '@id': PERSON_ID },
          image: absoluteUrl(OG_IMAGE),
          isPartOf: { '@id': WEBSITE_ID },
        },
        breadcrumbSchema([
          { name: tr.navigation.home, path: `/${lang}/` },
          { name: tr.navigation.blog, path: `/${lang}/blog/` },
          { name: post.title, path },
        ]),
      ),
    });
  },
  component: BlogPost,
});

function BlogPost() {
  const { lang, slug } = Route.useParams();
  const post = getPost(slug, lang as Lang);
  if (!post) throw notFound();

  const tr = t(lang as Lang);

  return (
    <article className="pt-14" lang={lang}>
      <Breadcrumbs
        items={[
          { label: tr.navigation.home, href: `/${lang}/` },
          { label: tr.navigation.blog, href: `/${lang}/blog/` },
          { label: post.title },
        ]}
      />
      <m.p
        className="mt-8 font-mono text-xs tabular-nums text-muted"
        variants={revealFade}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <time dateTime={post.createdAt.toISOString()}>{formatDate(post.createdAt, lang as Lang)}</time>
        {' · '}
        {post.minutes} {extra[lang as Lang].minRead}
      </m.p>
      <m.h1
        className="font-mono mt-3 text-[clamp(1.75rem,6vw,2.25rem)] font-normal leading-[1.15] text-balance"
        variants={revealHeading}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {post.title}
      </m.h1>
      <m.p
        className="mt-4 text-muted"
        variants={revealFade}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {post.summary}
      </m.p>
      <m.div
        className="prose-post mt-8 border-t border-line pt-4"
        variants={revealItem}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        <post.Component />
      </m.div>
    </article>
  );
}
