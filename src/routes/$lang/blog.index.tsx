import { createFileRoute } from '@tanstack/react-router';
import { m } from 'motion/react';
import PostRow from '../../components/PostRow';
import FadeBorder from '../../components/FadeBorder';
import Breadcrumbs from '../../components/Breadcrumbs';
import { t, type Lang } from '../../i18n';
import { getPosts } from '../../lib/blog';
import { revealHeading } from '../../lib/motion';
import {
  SITE_NAME,
  WEBSITE_ID,
  absoluteUrl,
  breadcrumbSchema,
  buildSeo,
  graphSchema,
  itemListSchema,
} from '../../lib/seo';

export const Route = createFileRoute('/$lang/blog/')({
  head: ({ params }) => {
    const lang = params.lang as Lang;
    const tr = t(lang);
    const posts = getPosts(lang);
    const path = `/${lang}/blog/`;
    const title = `${SITE_NAME} | Blogs`;
    const description =
      lang === 'id'
        ? 'Tulisan Galuh Satria tentang pengembangan web, React, Next.js, SWR, microservices, dan alat bantu developer.'
        : 'Articles by Galuh Satria on web development, React, Next.js, SWR, microservices, and developer tools.';

    return buildSeo({
      title,
      description,
      path,
      lang,
      imageAlt: lang === 'id' ? `Blog oleh ${SITE_NAME}` : `Blog by ${SITE_NAME}`,
      jsonLd: graphSchema(
        {
          '@type': 'CollectionPage',
          '@id': `${absoluteUrl(path)}#collection`,
          url: absoluteUrl(path),
          name: title,
          description,
          inLanguage: lang,
          isPartOf: { '@id': WEBSITE_ID },
        },
        itemListSchema(
          posts.map((post) => ({
            name: post.title,
            url: absoluteUrl(`/${lang}/blog/${post.slug}/`),
          })),
        ),
        breadcrumbSchema([
          { name: tr.navigation.home, path: `/${lang}/` },
          { name: tr.navigation.blog, path },
        ]),
      ),
    });
  },
  component: BlogIndex,
});

function BlogIndex() {
  const lang = Route.useParams().lang as Lang;
  const tr = t(lang);
  const posts = getPosts(lang);

  return (
    <div className="pt-14">
      <Breadcrumbs
        items={[
          { label: tr.navigation.home, href: `/${lang}/` },
          { label: tr.navigation.blog },
        ]}
      />
      <m.h1
        className="mt-5 font-mono text-[clamp(2rem,8vw,2.75rem)] font-normal leading-none"
        variants={revealHeading}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <span className="font-mono font-normal text-dim" aria-hidden="true"># </span>
        {tr.navigation.blog}
      </m.h1>
      <FadeBorder className="mt-10" />
      <div className="grid gap-8 pt-10">
        {posts.map((post) => (
          <PostRow key={post.slug} post={post} lang={lang} level={2} />
        ))}
      </div>
    </div>
  );
}
